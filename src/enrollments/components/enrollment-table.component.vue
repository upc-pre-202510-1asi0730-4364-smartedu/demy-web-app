<script>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'

export default {
  name: 'enrollment-table-component',
  components: {
    DataTable,
    Column,
    Button
  },
  props: {
    enrollmentsData: {
      type: Array,
      required: true,
      default: () => []
    },
    studentsData: {
      type: Array,
      required: true,
      default: () => []
    },
    periodsData: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  emits: ['requestedEnrollmentStatus'],
  data() {
    return {
      studentMap: new Map(),
      periodMap: new Map()
    }
  },
  watch: {
    studentsData: {
      handler() {
        this.buildStudentMap()
      },
      immediate: true,
      deep: true
    },
    periodsData: {
      handler() {
        this.buildPeriodMap()
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    buildStudentMap() {
      if (this.studentsData && this.studentsData.length > 0) {
        this.studentMap.clear()
        this.studentsData.forEach(student => {
          this.studentMap.set(student.id, student)
        })
      }
    },
    buildPeriodMap() {
      if (this.periodsData && this.periodsData.length > 0) {
        this.periodMap.clear()
        this.periodsData.forEach(period => {
          this.periodMap.set(period.id, period)
        })
      }
    },
    getStudentDni(studentId) {
      const student = this.studentMap.get(studentId)
      return student?.dni || '-'
    },
    getStudentFullName(studentId) {
      const student = this.studentMap.get(studentId)
      if (!student) return '-'
      return `${student.firstName} ${student.lastName}`
    },
    getPeriodName(periodId) {
      const period = this.periodMap.get(periodId)
      return period?.periodName || '-'
    },
    getEnrollmentStatusLabel(status) {
      // Puedes usar el $t() directamente en el template, pero este método
      // es útil si necesitas lógica adicional
      return this.$t(`enrollment.status.${status.toLowerCase()}`)
    },
    onStatusChangeRequested(enrollment) {
      this.$emit('requestedEnrollmentStatus', enrollment)
    }
  }
}
</script>

<template>
  <div class="table-container">
    <DataTable
        :value="enrollmentsData"
        :scrollable="true"
        class="p-datatable-gridlines"
        responsiveLayout="scroll"
        :paginator="true"
        :rows="10"
        :rowsPerPageOptions="[5, 10, 25, 50]"
        dataKey="id"
    >
      <!-- DNI Column -->
      <Column field="studentDni" header="DNI" :sortable="true">
        <template #body="slotProps">
          {{ getStudentDni(slotProps.data.studentId) }}
        </template>
      </Column>

      <!-- Student Name Column -->
      <Column field="studentName" :header="$t('enrollment.form.student')" :sortable="true">
        <template #body="slotProps">
          {{ getStudentFullName(slotProps.data.studentId) }}
        </template>
      </Column>

      <!-- Academic Period Column -->
      <Column field="academicPeriod" :header="$t('enrollment.form.period')" :sortable="true">
        <template #body="slotProps">
          {{ getPeriodName(slotProps.data.academicPeriodId) }}
        </template>
      </Column>

      <!-- Enrollment Status Column -->
      <Column field="enrollmentStatus" :header="$t('enrollment.form.status')" :sortable="true">
        <template #body="slotProps">
          {{ $t(`enrollment.status.${slotProps.data.enrollmentStatus.toLowerCase()}`) }}
        </template>
      </Column>

      <!-- Payment Status Column (opcional) -->
      <Column field="paymentStatus" :header="$t('enrollment.form.payment-status')" :sortable="true">
        <template #body="slotProps">
          {{ $t(`enrollment.payment.${slotProps.data.paymentStatus.toLowerCase()}`) }}
        </template>
      </Column>

      <!-- Amount Column (opcional) -->
      <Column field="amount" :header="$t('enrollment.form.amount')" :sortable="true">
        <template #body="slotProps">
          S/ {{ slotProps.data.amount }}
        </template>
      </Column>

      <!-- Action Column (descomentado para funcionalidad futura) -->
      <!--
      <Column :header="$t('enrollment.table.actions')">
        <template #body="slotProps">
          <Button
              v-if="slotProps.data.enrollmentStatus === 'CANCELLED'"
              :label="$t('enrollment.activate')"
              severity="primary"
              size="small"
              @click="onStatusChangeRequested(slotProps.data)"
          />
        </template>
      </Column>
      -->
    </DataTable>
  </div>
</template>

<style scoped>
.table-container {
  width: 100%;
  overflow-x: auto;
  background-color: #fff;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table-container::-webkit-scrollbar {
  height: 6px;
}

.table-container::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.table-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .table-container {
    padding: 0.5rem;
  }
}
</style>