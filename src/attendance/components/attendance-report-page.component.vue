<template>
  <div class="attendance-view-report-page">
    <h2>{{ $t('attendance-report-title') }}</h2>
    <h3>{{ $t('attendance-report-subtitle1') }}</h3>

    <div class="form-row">
      <AttendanceClassSelect v-model="selectedClass" />
      <AttendanceStudentSelect v-model="selectedStudent" />
      <AttendanceDateRangePicker v-model="selectedDateRange" />
      <div class="form-button">
        <Button :label="$t('attendance-search')" icon="pi pi-search" @click="searchReport" />
      </div>
    </div>

    <div v-if="reportResults.length" class="datatable-wrapper">
      <DataTable
          :value="reportResults"
          class="p-datatable-sm custom-datatable"
          scrollable scrollHeight="400px" scrollDirection="horizontal" responsiveLayout="scroll"
          paginator :rows="pageSize" :rowsPerPageOptions="[5, 10, 20]"
          paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink | RowsPerPageDropdown"
          currentPageReportTemplate="{currentPage}"
      >
        <Column field="student" :header="$t('attendance-student')" frozen style="min-width:150px" />
        <Column field="class" :header="$t('attendance-class')" frozen style="min-width:120px" />

        <Column
            v-for="day in dateHeaders"
            :key="day"
            :field="day"
            :header="day"
            style="min-width:90px"
            bodyClass="attendance-column"
            headerClass="attendance-column"
        >
          <template #body="slotProps">
            <i v-if="slotProps.data[day] === 'P'" class="pi pi-check icon-present" />
            <i v-else-if="slotProps.data[day] === 'A'" class="pi pi-times icon-absent" />
            <span v-else class="icon-empty">-</span>
          </template>
        </Column>

        <Column
            :header="$t('attendance-total-report')"
            style="min-width:100px"
            bodyClass="attendance-column"
            headerClass="attendance-column"
        >
          <template #body="slotProps">
            {{ countPresence(slotProps.data) }}
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script>
import httpInstance from "../../shared/services/http.instance.js";
import AttendanceClassSelect from '../components/attendance-class-select.component.vue'
import AttendanceStudentSelect from '../../attendance/components/attendance-student-select.component.vue'
import AttendanceDateRangePicker from '../components/attendance-date-range-picker.component.vue'
import { attendanceReportService } from '../services/attendance-report.service.js'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const STUDENTS_API = `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_STUDENTS_ENDPOINT_PATH}`
const COURSES_API = `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_COURSES_ENDPOINT_PATH}`


export default {
  name: 'AttendanceViewReportPage',
  components: {
    AttendanceClassSelect,
    AttendanceStudentSelect,
    AttendanceDateRangePicker,
    Button,
    DataTable,
    Column
  },
  data() {
    return {
      selectedClass: null,
      selectedStudent: null,
      selectedDateRange: null,
      dateHeaders: [],
      reportResults: [],
      pageSize: 5,
      studentNameMap: {},
      studentOptions: [],
      courseNameMap: {},
      courseOptions: []
    }
  },
  created() {
    this.loadStudents()
    this.loadCourses()
  },
  methods: {
    async loadStudents() {
      try {
        const res = await httpInstance.get(STUDENTS_API)
        console.log('[Students]', res.data)
        this.studentNameMap = {}
        this.studentOptions = res.data.map(s => {
          const fullName = `${s.firstName} ${s.lastName}`.trim()
          this.studentNameMap[s.dni] = fullName
          return { label: fullName, value: s.dni }
        })
      } catch (e) {
        console.error('Error cargando alumnos:', e)
      }
    },

    async loadCourses() {
      try {
        const res = await httpInstance.get(COURSES_API)
        console.log('[Cursos]', res.data)
        this.courseNameMap = {}
        this.courseOptions = res.data.map(s => {
          this.courseNameMap[s.id] = s.name
          return { label: s.name, value: s.id }
        })
      } catch (e) {
        console.error('Error cargando alumnos:', e)
      }
    },
    async searchReport() {
      try {
        // validations
        if (
            !this.selectedDateRange ||
            this.selectedDateRange.length === 0 ||
            !this.selectedClass ||
            !this.selectedStudent
        ) {
          this.dateHeaders = []
          this.reportResults = []
          return
        }

        const start = new Date(this.selectedDateRange[0])
        const end = new Date(
            this.selectedDateRange.length > 1 && this.selectedDateRange[1]
                ? this.selectedDateRange[1]
                : this.selectedDateRange[0]
        )

        // date headers generator
        const headers = []
        const current = new Date(start)
        while (current <= end) {
          const key = current.toISOString().split('T')[0]
          headers.push(key)
          current.setDate(current.getDate() + 1)
        }
        this.dateHeaders = headers

        // obtain report from the backend
        const attendanceRecords = await attendanceReportService.fetchReport({
          courseId: this.selectedClass,
          dni: this.selectedStudent,
          startDate: start.toISOString().split('T')[0],
          endDate: end.toISOString().split('T')[0]
        })

        // transform results to a table
        const results = []

        const row = {
          student: this.studentNameMap?.[this.selectedStudent] || '(sin nombre)',
          class: this.courseNameMap?.[this.selectedClass] || '—'
        }



        this.dateHeaders.forEach(d => {
          row[d] = '-'
        })


        attendanceRecords.forEach(record => {
          const dateOnly = new Date(record.date).toISOString().split('T')[0]
          if (this.dateHeaders.includes(dateOnly)) {
            row[dateOnly] = record.status === 'Present' ? 'P' : 'A'
          }
        })

        results.push(row)
        this.reportResults = results
      } catch (e) {
        console.error('Error al obtener el reporte:', e)
      }
    }
    ,
    countPresence(row) {
      return this.dateHeaders.filter(d => row[d] === 'P').length
    }
  },
  watch: {
    selectedClass(newVal, oldVal) {
      console.log(`Clase cambió de ${oldVal} a ${newVal}`)
      this.searchReport()
    }
  }
}
</script>

<style scoped>
.attendance-view-report-page {
  margin: auto;
  padding: 2rem;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  align-items: flex-end;
}

.form-row > *:not(.form-button) {
  flex: 1;
  min-width: 200px;
}

.form-button {
  display: flex;
  align-items: flex-end;
  margin-bottom: 1rem;
}

.datatable-wrapper {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  margin-top: 1rem;
}

/* Fila: más padding */
::v-deep(.custom-datatable .p-datatable-tbody > tr > td) {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

/* Encabezados */
::v-deep(.custom-datatable .p-datatable-thead > tr > th) {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  text-align: center;
}

/* Alineación solo para columnas dinámicas */
::v-deep(.attendance-column) {
  text-align: left;
  vertical-align: middle;
}


/* Iconos */
.icon-present {
  color: #0d6efd !important; /* azul sobrio */
  font-size: 1.2rem;
}

.icon-absent {
  color: #6c757d !important; /* gris elegante */
  font-size: 1.2rem;
}

.icon-empty {
  display: inline-block;
  width: 100%;
  text-align: left;
  color: #aaa;
}

/* Centro exacto del contenido de celda */
.icon-present,
.icon-absent,
.icon-empty {
  display: inline-block;
  width: 100%;
  text-align: left;
  line-height: 1.4;
}

/* Estilo de paginación */
::v-deep(.p-paginator-current) {
  background: #b0d3f9;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: normal;
  font-size: 14px;
  padding: 0;
  margin: 0 12px;
}

::v-deep(.p-paginator .p-dropdown) {
  margin-left: auto;

  /* Estilos para encabezados y celdas centradas de columnas dinámicas y totales */
  ::v-deep(.custom-datatable .attendance-column) {
    text-align: left !important;
    vertical-align: middle !important;
  }

}
</style>
