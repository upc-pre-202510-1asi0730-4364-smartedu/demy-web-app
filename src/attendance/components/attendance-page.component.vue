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

    <div class="save-button-container">
      <AttendanceSaveButton @saveClicked="saveAttendance" />
    </div>
  </div>
</template>

<script>
import AttendanceClassSelect from '../components/attendance-class-select.component.vue'
import AttendanceDate from '../components/attendance-date.component.vue'
import AttendanceStudentList from '../components/attendance-student-list.component.vue'
import AttendanceSaveButton from '../components/attendance-save-button.component.vue'
import { AttendanceRecord } from '../model/attendance-record.entity.js'
import { AttendanceStatus } from '../model/attendance-status.js'
import { classSessionService } from '../services/class-sessions.service.js'
import { ClassSession } from '../model/class-session.entity.js'
import { AttendanceRecordService } from '../services/attendance-record.service.js'
const attendanceRecordService = new AttendanceRecordService()
export default {
  name: 'AttendancePage',
  components: {
    AttendanceClassSelect,
    AttendanceDate,
    AttendanceStudentList,
    AttendanceSaveButton
  },
  data() {
    return {
      selectedClass: null,
      selectedDate: new Date(),
      attendanceRecords: [],
    }
  },

  methods: {
    async saveAttendance() {

      if (!this.selectedClass) {
        alert('Por favor, seleccione un curso antes de guardar la asistencia.')
        return
      }
      try {
        const session = new ClassSession(
            this.selectedClass,
            this.attendanceRecords.map(r => new AttendanceRecord(r.studentId, r.status)),
            this.selectedDate
        )
        const response = await classSessionService.save(session)
        alert('Asistencia guardada con éxito')
      } catch (err) {
        console.error('Error al guardar asistencia:', err)
        alert('Error al guardar la asistencia')
      }
    },
    async onSave() {
      const seen = new Set()
      const recordsToSave = []
      for (const record of this.attendanceRecords) {
        if (!seen.has(record.studentId)) {
          seen.add(record.studentId)
          recordsToSave.push({
            studentId: record.studentId,
            status: record.status
          })
        }
      }

      try {
        await attendanceRecordService.saveMany(recordsToSave)
        console.log('Asistencia guardada con éxito')
        this.$refs.studentListComponent.resetAttendance()
      } catch (error) {
        console.error('Error al guardar asistencia:', error)
      }
      this.$refs.studentListComponent.resetAttendance()
    }
  },

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

</style>
