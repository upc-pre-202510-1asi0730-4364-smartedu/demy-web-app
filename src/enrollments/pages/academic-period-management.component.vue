<script>
import { onMounted, ref, computed } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Paginator from 'primevue/paginator'

import AcademicPeriodCreateForm from '../components/academic-period-create-and-edit.component.vue'
import { AcademicPeriodService } from '../services/academic-period.service.js'
import { AcademicPeriod } from '../model/academic-period.entity.js'

const academicPeriodService = new AcademicPeriodService()

export default {
  name: 'academic-period-management-page',
  components: {
    AcademicPeriodCreateForm,
    DataTable,
    Column,
    Button,
    Paginator
  },
  setup() {
    const academicPeriods = ref([])
    const academicPeriodData = ref(new AcademicPeriod({}))
    const editMode = ref(false)

    const page = ref(0)
    const rowsPerPage = ref(5)

    const paginatedData = computed(() => {
      const start = page.value * rowsPerPage.value
      return academicPeriods.value.slice(start, start + rowsPerPage.value)
    })

    const loadAll = async () => {
      academicPeriods.value = await academicPeriodService.getAll()
    }

    const onEditItem = (period) => {
      academicPeriodData.value = { ...period }
      editMode.value = true
    }

    const onDeleteItem = async (period) => {
      await academicPeriodService.delete(period.id)
      academicPeriods.value = academicPeriods.value.filter(p => p.id !== period.id)
    }

    const onCancelRequested = () => {
      resetState()
      loadAll()
    }

    const onAdd = async (period) => {
      const created = await academicPeriodService.create(period)
      academicPeriods.value.push(created)
      resetState()
    }

    const onUpdate = async (period) => {
      const updated = await academicPeriodService.update(period.id, period)
      const index = academicPeriods.value.findIndex(p => p.id === updated.id)
      if (index !== -1) academicPeriods.value[index] = updated
      resetState()
    }

    const resetState = () => {
      academicPeriodData.value = new AcademicPeriod({})
      editMode.value = false
    }

    onMounted(() => {
      loadAll()
    })

    return {
      academicPeriods,
      academicPeriodData,
      editMode,
      page,
      rowsPerPage,
      paginatedData,
      onEditItem,
      onDeleteItem,
      onCancelRequested,
      onAdd,
      onUpdate
    }
  }
}
</script>

<template>
  <div class="container">
    <div class="header">
      <h4>{{ $t('academic-period.management.title') }}</h4>
    </div>

    <academic-period-create-form
        :academicPeriod="academicPeriodData"
        :editMode="editMode"
        @cancelRequested="onCancelRequested"
        @academicPeriodAddRequested="onAdd"
        @academicPeriodUpdateRequested="onUpdate"
    />

    <div class="table-container">
      <DataTable :value="paginatedData" :paginator="false">
        <Column field="name" :header="$t('academic-period.table.name')" />
        <Column :header="$t('academic-period.table.start-date')">
          <template #body="slotProps">
            {{ new Date(slotProps.data.startDate).toLocaleDateString('es-PE') }}
          </template>
        </Column>
        <Column :header="$t('academic-period.table.end-date')">
          <template #body="slotProps">
            {{ new Date(slotProps.data.endDate).toLocaleDateString('es-PE') }}
          </template>
        </Column>
        <Column :header="$t('academic-period.table.actions')">
          <template #body="slotProps">
            <Button icon="pi pi-pencil" severity="info" @click="onEditItem(slotProps.data)" />
            <Button icon="pi pi-trash" severity="danger" @click="onDeleteItem(slotProps.data)" />
          </template>
        </Column>
      </DataTable>

      <Paginator
          :rows="rowsPerPage"
          :totalRecords="academicPeriods.length"
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
