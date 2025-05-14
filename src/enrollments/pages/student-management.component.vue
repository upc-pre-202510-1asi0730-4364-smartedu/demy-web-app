<script>
import {ref, onMounted, computed} from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Paginator from 'primevue/paginator'
import Button from 'primevue/button'

import StudentCreateForm from '../components/student-create-and-edit.component.vue'
import { StudentService } from '../services/student.service.js'
import { Student } from '../model/student.entity.js'

const studentService = new StudentService()

export default {
  name: 'student-management-component',
  components: {
    DataTable,
    Column,
    Paginator,
    Button,
    StudentCreateForm
  },
  setup() {
    const students = ref([])
    const studentData = ref(new Student({}))
    const editMode = ref(false)
    const page = ref(0)
    const rowsPerPage = ref(5)

    const paginatedStudents = computed(() => {
      const start = page.value * rowsPerPage.value
      return students.value.slice(start, start + rowsPerPage.value)
    })

    const getAllStudents = async () => {
      students.value = await studentService.getAll()
    }

    const onStudentAddRequested = async (student) => {
      const created = await studentService.create(student)
      students.value.push(created)
      resetState()
    }

    const onStudentUpdateRequested = async (student) => {
      const updated = await studentService.update(student.id, student)
      const index = students.value.findIndex(s => s.id === updated.id)
      if (index !== -1) students.value[index] = updated
      resetState()
    }

    const onDeleteItem = async (student) => {
      await studentService.delete(student.id)
      students.value = students.value.filter(s => s.id !== student.id)
    }

    const onEditItem = (student) => {
      studentData.value = { ...student }
      editMode.value = true
    }

    const resetState = () => {
      studentData.value = new Student({})
      editMode.value = false
    }

    onMounted(() => {
      getAllStudents()
    })

    return {
      students,
      studentData,
      editMode,
      paginatedStudents,
      page,
      rowsPerPage,
      onStudentAddRequested,
      onStudentUpdateRequested,
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
      <h4>{{ $t('student.management.title') }}</h4>
    </div>

    <div class="student-form-container">
      <student-create-form
          :student="studentData"
          :editMode="editMode"
          @cancelRequested="resetState"
          @studentAddRequested="onStudentAddRequested"
          @studentUpdateRequested="onStudentUpdateRequested"
      />
    </div>

    <div class="table-container">
      <DataTable
          :value="paginatedStudents"
          :paginator="false"
          class="p-datatable-sm"
      >
        <Column field="dni" :header="$t('student.table.dni')" />
        <Column field="firstName" :header="$t('student.table.first-name')" />
        <Column field="lastName" :header="$t('student.table.last-name')" />
        <Column
            :header="$t('student.table.sex')"
            bodyClass="nowrap"
            :sortable="false"
        >
          <template #body="slotProps">
            {{ $t('student.sex.' + slotProps.data.sex) }}
          </template>
        </Column>
        <Column
            :header="$t('student.table.birth-date')"
            bodyClass="nowrap"
        >
          <template #body="slotProps">
            {{ new Date(slotProps.data.birthDate).toLocaleDateString('es-PE') }}
          </template>
        </Column>
        <Column :header="$t('student.table.actions')">
          <template #body="slotProps">
            <Button icon="pi pi-pencil" severity="info" @click="onEditItem(slotProps.data)" />
            <Button icon="pi pi-trash" severity="danger" @click="onDeleteItem(slotProps.data)" />
          </template>
        </Column>
      </DataTable>

      <Paginator
          :rows="rowsPerPage"
          :totalRecords="students.length"
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
  overflow-x: auto;
  background-color: #fff;
  padding: 1rem;
}

</style>
