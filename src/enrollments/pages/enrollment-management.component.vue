<script>
import { ref, onMounted, computed } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Paginator from 'primevue/paginator'
import Button from 'primevue/button'

import EnrollmentsCreateForm from '../components/enrollment-create-and-edit.component.vue'
import { EnrollmentService } from '../services/enrollment.service.js'
import { StudentService } from '../services/student.service.js'
import { AcademicPeriodService } from '../services/academic-period.service.js'
import { Enrollment } from '../model/enrollment.entity.js'

const enrollmentService = new EnrollmentService()
const studentService = new StudentService()
const periodService = new AcademicPeriodService()

export default {
  name: 'enrollment-management-page',
  components: {
    DataTable,
    Column,
    Paginator,
    Button,
    EnrollmentsCreateForm
  },
  setup() {
    const enrollments = ref([])
    const enrollmentData = ref(new Enrollment({}))
    const editMode = ref(false)
    const page = ref(0)
    const rowsPerPage = ref(5)

    const studentMap = ref(new Map())
    const periodMap = ref(new Map())

    const paginatedEnrollments = computed(() => {
      const start = page.value * rowsPerPage.value
      return enrollments.value.slice(start, start + rowsPerPage.value)
    })

    const getAllEnrollments = async () => {
      enrollments.value = await enrollmentService.getAll()
    }

    const loadStudents = async () => {
      const students = await studentService.getAll()
      studentMap.value = new Map(students.map(s => [s.id, `${s.firstName} ${s.lastName}`]))
    }

    const loadPeriods = async () => {
      const periods = await periodService.getAll()
      periodMap.value = new Map(periods.map(p => [p.id, p.name]))
    }

    const onEnrollmentAddRequested = async (enrollment) => {
      const created = await enrollmentService.create(enrollment)
      enrollments.value.push(created)
      resetState()
    }

    const onEnrollmentUpdateRequested = async (enrollment) => {
      const updated = await enrollmentService.update(enrollment.id, enrollment)
      const index = enrollments.value.findIndex(e => e.id === updated.id)
      if (index !== -1) enrollments.value[index] = updated
      resetState()
    }

    const onDeleteItem = async (enrollment) => {
      await enrollmentService.delete(enrollment.id)
      enrollments.value = enrollments.value.filter(e => e.id !== enrollment.id)
    }

    const onEditItem = (enrollment) => {
      enrollmentData.value = { ...enrollment }
      editMode.value = true
    }

    const resetState = () => {
      enrollmentData.value = new Enrollment({})
      editMode.value = false
    }

    onMounted(() => {
      getAllEnrollments()
      loadStudents()
      loadPeriods()
    })

    return {
      enrollments,
      enrollmentData,
      editMode,
      paginatedEnrollments,
      studentMap,
      periodMap,
      page,
      rowsPerPage,
      onEnrollmentAddRequested,
      onEnrollmentUpdateRequested,
      onDeleteItem,
      onEditItem,
      resetState
    }
  }
}
</script>

<template>
  <div class="container">
    <div class="header">
      <h4>{{ $t('enrollment.management.title') }}</h4>
    </div>

    <div class="enrollment-form-container">
      <enrollments-create-form
          :enrollment="enrollmentData"
          :editMode="editMode"
          @cancelRequested="resetState"
          @enrollmentAddRequested="onEnrollmentAddRequested"
          @enrollmentUpdateRequested="onEnrollmentUpdateRequested"
      />
    </div>

    <div class="table-container">
      <DataTable
          :value="paginatedEnrollments"
          :paginator="false"
          class="p-datatable-sm"
      >
        <Column field="id" :header="$t('enrollment.table.id')" />
        <Column :header="$t('enrollment.table.student')">
          <template #body="slotProps">
            {{ studentMap.get(slotProps.data.studentId) || '—' }}
          </template>
        </Column>
        <Column :header="$t('enrollment.table.period')">
          <template #body="slotProps">
            {{ periodMap.get(slotProps.data.periodId) || '—' }}
          </template>
        </Column>
        <Column :header="$t('enrollment.table.date')">
          <template #body="slotProps">
            {{ new Date(slotProps.data.createdAt).toLocaleDateString('es-PE') }}
          </template>
        </Column>
        <Column field="amount" :header="$t('enrollment.table.amount')" />
        <Column :header="$t('enrollment.table.status')">
          <template #body="slotProps">
            {{ $t('enrollment.status.' + slotProps.data.enrollmentStatus) }}
          </template>
        </Column>
        <Column :header="$t('enrollment.table.payment-status')">
          <template #body="slotProps">
            {{ $t('enrollment.payment.' + (slotProps.data.paymentStatus || 'unpaid')) }}
          </template>
        </Column>
        <Column :header="$t('enrollment.table.actions')">
          <template #body="slotProps">
            <Button icon="pi pi-pencil" severity="info" @click="onEditItem(slotProps.data)" />
            <Button icon="pi pi-trash" severity="danger" @click="onDeleteItem(slotProps.data)" />
          </template>
        </Column>
      </DataTable>

      <Paginator
          :rows="rowsPerPage"
          :totalRecords="enrollments.length"
          :rowsPerPageOptions="[5, 10, 25, 100]"
          :page="page"
          @page="e => page = e.page"
          class="custom-paginator"
      />
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 0.5rem;
  max-width: 1200px;
  margin: 0 auto;
}
.header h4 {
  text-align: center;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 500;
}
.table-container {
  width: 100%;
  overflow-x: auto;
  background-color: #fff;
  padding: 1rem;
}
</style>
