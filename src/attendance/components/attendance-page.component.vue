<template>
  <div class="attendance-page">
    <h2>{{$t('attendance-title')}}</h2>
    <h3>{{$t('attendance-subtitle1')}}</h3>
    <div class="form-row">
      <AttendanceClassSelect
          v-model="selectedClass"
          :classOptions="classOptions"
      />
      <AttendanceDate
          v-model="selectedDate"
      />
    </div>


    <AttendanceStudentList ref="studentListComponent"
        :records="attendanceRecords"
        @update:records="attendanceRecords = $event"/>

    <div class="save-button-container">
      <AttendanceSaveButton @saveClicked="onSave" />
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
      classOptions: [
        { name: '1A', id: '1A' },
        { name: '2B', id: '2B' },
        { name: '3C', id: '3C' }
      ]
    }
  },
  methods: {
    async saveAttendance() {
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
    onSave() {

      this.$refs.studentListComponent.resetAttendance()
    }
  },
  mounted() {
    // Carga simulada de estudiantes
    this.attendanceRecords = [
      { studentId: '001', studentName: 'Ana López', status: AttendanceStatus.PRESENT },
      { studentId: '002', studentName: 'Luis García', status: AttendanceStatus.PRESENT },
      { studentId: '003', studentName: 'Valeria Torres', status: AttendanceStatus.PRESENT }
    ]
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
