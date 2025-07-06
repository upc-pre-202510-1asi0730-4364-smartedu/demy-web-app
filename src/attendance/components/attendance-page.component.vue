<template>
  <div class="attendance-page">
    <h2>{{$t('attendance-title')}}</h2>
    <h3>{{$t('attendance-subtitle1')}}</h3>
    <div class="form-row">
      <AttendanceClassSelect
          v-model="selectedClass"

      />
      <AttendanceDate
          v-model="selectedDate"
      />
    </div>


    <AttendanceStudentList ref="studentListComponent"
                           :records="attendanceRecords"
                           @update:records="attendanceRecords = $event"/>
    <div class="container-buttons">

      <div class="save-button-container">
        <AttendanceSaveButton @saveClicked="saveAttendance" />
      </div>

    </div>

  </div>
</template>

<script>
import AttendanceClassSelect from '../components/attendance-class-select.component.vue'
import AttendanceDate from '../components/attendance-date.component.vue'
import AttendanceStudentList from '../components/attendance-student-list.component.vue'
import AttendanceSaveButton from '../components/attendance-save-button.component.vue'
import AttendanceViewReportButton from '../components/attendance-view-report-button.component.vue'
import { AttendanceRecord } from '../model/attendance-record.entity.js'
import { AttendanceStatus } from '../model/attendance-status.js'
import { classSessionService } from '../services/class-sessions.service.js'
import { ClassSession } from '../model/class-session.entity.js'
/* import { AttendanceRecordService } from '../services/attendanc */


export default {
  name: 'AttendancePage',
  components: {
    AttendanceClassSelect,
    AttendanceDate,
    AttendanceStudentList,
    AttendanceSaveButton,
    AttendanceViewReportButton
  },
  data() {
    return {
      selectedClass: null,
      selectedDate: new Date(),
      attendanceRecords: [],
    }
  },

  methods: {
    formatDate(date) {
      if (!date) return null;
      return date.toISOString().split('T')[0];
    },

    async navigateToReport() {
      await this.$router.push({ path: '/attendance-view-report' })
    },

    async saveAttendance() {
      if (!this.selectedClass) {
        alert('Por favor, seleccione un curso antes de guardar la asistencia.')
        return
      }
      try {
        const session = new ClassSession(
            Number(this.selectedClass),
            this.formatDate(this.selectedDate),
            this.attendanceRecords.map(r => new AttendanceRecord(r.dni, r.status))
        )
        console.log('Payload a enviar:', session.toJSON())

        const response = await classSessionService.save(session)
        alert('Asistencia guardada con éxito')
      } catch (err) {
        console.error('Error al guardar asistencia:', err)
        alert('Error al guardar la asistencia')
      }
    }
  }
}
</script>

<style scoped>
.attendance-page {
  /*max-width: 900px; */
  margin: auto;
  padding: 2rem;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.form-row > * {
  flex: 1;
  min-width: 200px;
}
.container-buttons {
  display: flex;
  gap: 50px;
  justify-content: center;
  margin-top: 1rem;
}


</style>
