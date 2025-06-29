<template>
  <h3>{{$t('attendance-subtitle2')}}</h3>
  <div class="table-container">
    <pv-data-table
        class="attendance-table"
        :value="records"
        dataKey="studentId"
        :rows="5"
        :paginator="true"
        :rowsPerPageOptions="[5, 10, 20]"
    >
      <pv-column field="studentId" header="DNI" headerClass="header-style" />
      <pv-column field="studentName" :header="$t('attendance-class')" headerClass="header-style" />
      <pv-column :header="$t('attendance-checkbox')" headerClass="header-style">
        <template #body="slotProps">
          <pv-checkbox
              v-model="slotProps.data.status"
              binary
              :trueValue="AttendanceStatus.PRESENT"
              :falseValue="AttendanceStatus.ABSENT"
              @change="onStatusChange(slotProps.index, slotProps.data.status)"
          />
        </template>
      </pv-column>
    </pv-data-table>
  </div>
</template>


<script>

import { StudentService } from '../../enrollments/services/student.service.js';
import { AttendanceStatus } from '../model/attendance-status.js';
import {Checkbox as PvCheckbox, Column as PvColumn, DataTable as PvDataTable} from "primevue";
const studentService = new StudentService();

export default {
  name: 'StudentListComponent',
  components: {PvCheckbox, PvColumn, PvDataTable},
  data() {
    return {
      records: [], // estructura [{ studentId: '123', studentName: 'Juan Pérez', status: 'PRESENT' }]
      AttendanceStatus
    };
  },
  async mounted() {
    try {
      const students = await studentService.getAll();
      this.records = students.map(student => ({
        studentId: student.id,
        studentName: `${student.firstName} ${student.lastName}`,
        status: AttendanceStatus.ABSENT // valor inicial por defecto
      }));
    } catch (err) {
      console.error('Error al obtener estudiantes:', err);
    }
  },
  methods: {
    onStatusChange(index, newStatus) {
      const updatedRecord = { ...this.records[index], status: newStatus };
      this.records.splice(index, 1, updatedRecord); // reemplaza el objeto en su posición
      this.$emit('update:records', [...this.records]); // comunica al padre
    },
    resetAttendance() {
      this.records.forEach((record,i) => {
        const updatedRecord = { ...this.records[i], status:  'ABSENT' };
        this.records.splice(i, 1, updatedRecord); // reemplaza el objeto en su posición
      })
      this.$emit('update:records', [...this.records]); // también aquí
    }
  }
};
</script>


<style scoped>
.table-container {
  max-width: 2000px;
  margin: auto;
}

.attendance-table ::v-deep(.p-datatable-thead > tr > th.header-style) {
  background-color: #2f76a1;
  color: white;
  font-weight: bold;
  text-align: center;
  vertical-align: middle;
  width: 100px;
}

.attendance-table ::v-deep(.checkbox-cell) {
  vertical-align: middle;
}
</style>
