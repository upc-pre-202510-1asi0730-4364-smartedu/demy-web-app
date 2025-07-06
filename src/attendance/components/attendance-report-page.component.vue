<template>
  <div class="attendance-view-report-page">
    <h2>{{ $t('attendance-report-title') }}</h2>
    <h3>{{ $t('attendance-report-subtitle1') }}</h3>

    <div class="form-row">
      <AttendanceClassSelect v-model="selectedClass" />
      <AttendanceStudentSelect v-model="selectedStudent" />
      <AttendanceDateRangePicker v-model="selectedDateRange" />
      <div class="form-button">
        <Button label="Buscar" icon="pi pi-search" @click="searchReport" />
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
        <Column field="student" header="Alumno" frozen style="min-width:150px" />
        <Column field="class" header="Clase" frozen style="min-width:120px" />

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
          header="Total asistencias"
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
import axios from 'axios'
import AttendanceClassSelect from '../components/attendance-class-select.component.vue'
import AttendanceStudentSelect from '../../attendance/components/attendance-student-select.component.vue'
import AttendanceDateRangePicker from '../components/attendance-date-range-picker.component.vue'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const SESSIONS_API = `${import.meta.env.VITE_API_BASE_URL}/class-sessions`
const STUDENTS_API = `${import.meta.env.VITE_API_BASE_URL}/students2`
const COURSES_API = `${import.meta.env.VITE_API_BASE_URL}/courses`

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
        const res = await axios.get(STUDENTS_API)
        this.studentNameMap = {}
        this.studentOptions = res.data.map(s => {
          const fullName = `${s.firstName} ${s.lastName}`.trim()
          this.studentNameMap[s.id] = fullName
          return { label: fullName, value: s.dni }
        })
      } catch (e) {
        console.error('Error cargando alumnos:', e)
      }
    },

     async loadCourses() {
      try {
        const res = await axios.get(COURSES_API)
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
    const res = await axios.get(SESSIONS_API)
    const sessions = res.data

    if (
      !this.selectedDateRange ||
      this.selectedDateRange.length === 0 ||
      !this.selectedClass
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
    start.setHours(0, 0, 0, 0)
    end.setHours(23, 59, 59, 999)

    const dateHeaders = []
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const key = d.toLocaleDateString('es-PE', { day: 'numeric', month: 'numeric' })
      dateHeaders.push(key)
    }
    this.dateHeaders = dateHeaders

    // Filtrar sesiones por fecha y clase (ahora obligatoria)
    const filteredSessions = sessions.filter(session => {
      const sessionDate = new Date(session.createdAt)
      const matchDate = sessionDate >= start && sessionDate <= end
      const matchClass = session.classId === this.selectedClass
      return matchDate && matchClass
    })

    const map = {}

    filteredSessions.forEach(session => {
      const key = new Date(session.createdAt).toLocaleDateString('es-PE', {
        day: 'numeric',
        month: 'numeric'
      })

      session.attendance.forEach(att => {
        const id = att.studentId?.trim()
        const name = this.studentNameMap[id]

        // Ignorar si el alumno no está en el listado activo
        if (!name) return

        const status = att.status === 'PRESENT' ? 'P' : 'A'

        if (!map[id]) {
          const courseName = this.courseNameMap?.[this.selectedClass] || '—'
          map[id] = { student: name, class: courseName }
          dateHeaders.forEach(d => (map[id][d] = ''))
        }

        map[id][key] = status
      })
    })

    const results = Object.entries(map)
      .filter(([id]) => !this.selectedStudent || id === this.selectedStudent)
      .map(([_, value]) => value)

    this.reportResults = results
  } catch (e) {
    console.error('Error en reporte:', e)
  }
}
,
countPresence(row) {
      return this.dateHeaders.filter(d => row[d] === 'P').length
    }
  },
  watch: {
    selectedStudent(newVal, oldVal) {
      console.log(`Estudiante cambió de ${oldVal} a ${newVal}`)
      this.searchReport()
    },
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
