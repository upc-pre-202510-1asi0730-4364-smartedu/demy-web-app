<template>
  <div>
    <h1>{{ $t('view-classrooms.title') }}</h1>

    <!-- Button to create a new classroom -->
    <pv-button :label="$t('view-classrooms.button.new-classroom')" icon="pi pi-plus" @click="openNewClassroomDialog" class="p-button-primary" />

    <!-- DataTable -->
    <DataTable
        :value="classrooms"
        :paginator="true"
        :rows="5"
        :rowsPerPageOptions="[5, 10, 15]"
        :globalFilter="globalFilter"
        sortMode="single"
        ref="dt"
        class="mt-3"
    >
      <Column field="code" :header="$t('view-classrooms.table.code')" sortable="*" />
      <Column field="capacity" :header="$t('view-classrooms.table.capacity')" sortable="*" />
      <Column field="campus" :header="$t('view-classrooms.table.campus')" sortable="*" />

      <!-- Actions column -->
      <Column :header="$t('view-classrooms.table.actions')">
        <template #body="slotProps">
          <div>
            <pv-button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-success p-mr-2"
                @click="onEditClassroom(slotProps.data)"
            />
            <pv-button
                icon="pi pi-trash"
                class="p-button-rounded p-button-danger"
                @click="onDeleteClassroom(slotProps.data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- Classroom Modal Component -->
    <classroom-modal
        v-model:visible="isDialogVisible"
        :mode="dialogMode"
        :classroomData="selectedClassroom"
        @submit="handleSubmit"
        @cancel="handleCancel"
        @delete="handleDelete"
    />

  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { ClassroomService } from '../services/classroom.service.js';
import ClassroomModal from '../components/classroom-modal.component.vue';

export default {
  name: 'classrooms-overview',
  components: {
    DataTable,
    Column,
    ClassroomModal
  },
  setup() {
    // Reactive state
    const classrooms = ref([]);
    const isDialogVisible = ref(false);
    const selectedClassroom = ref({});
    const dialogMode = ref('add');
    const globalFilter = ref('');
    const totalClassrooms = ref(0);
    const first = ref(0);

    // Inicializar el servicio de aulas
    const classroomService = new ClassroomService();

    // Load classrooms from API
    const loadClassrooms = async () => {
      try {
        const response = await classroomService.getAll();
        classrooms.value = response.data;
        totalClassrooms.value = response.data.length;
      } catch (error) {
        console.error('Error loading classrooms', error);
        classrooms.value = [];
        totalClassrooms.value = 0;
      }
    };

    // Open dialog to add new classroom
    const openNewClassroomDialog = () => {
      selectedClassroom.value = {};
      dialogMode.value = 'add';
      isDialogVisible.value = true;
    };

    // Open dialog to edit a classroom
    const onEditClassroom = (classroomData) => {
      selectedClassroom.value = { ...classroomData };
      dialogMode.value = 'edit';
      isDialogVisible.value = true;
    };

    // Open dialog to confirm classroom deletion
    const onDeleteClassroom = (classroomData) => {
      selectedClassroom.value = { ...classroomData };
      dialogMode.value = 'delete';
      isDialogVisible.value = true;
    };

    // Handle form submission (create or update)
    const handleSubmit = async (classroomData) => {
      try {
        if (dialogMode.value === 'edit') {
          await classroomService.update(classroomData.id, classroomData);
        } else {
          await classroomService.create(classroomData);
        }
        await loadClassrooms();
      } catch (error) {
        console.error('Error saving classroom', error);
      }
    };

    // Handle cancel action
    const handleCancel = () => {
      isDialogVisible.value = false;
    };

    // Handle delete confirmation
    const handleDelete = async (classroomData) => {
      try {
        await classroomService.delete(classroomData.id);
        await loadClassrooms();
      } catch (error) {
        console.error('Error deleting classroom', error);
      }
    };

    // Handle pagination
    const onPage = (event) => {
      first.value = event.first;
      loadClassrooms();
    };

    // Load classrooms when component is mounted
    onMounted(() => {
      loadClassrooms();
    });

    return {
      classrooms,
      isDialogVisible,
      selectedClassroom,
      dialogMode,
      globalFilter,
      totalClassrooms,
      first,
      loadClassrooms,
      openNewClassroomDialog,
      onEditClassroom,
      onDeleteClassroom,
      handleSubmit,
      handleCancel,
      handleDelete,
      onPage
    };
  }
};
</script>

<style scoped>
.table-wrapper {
  width: 100%;
  margin: 50px auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  overflow-x: auto;
}

h1 {
  font-size: 2rem;
  margin-bottom: 20px;
}

.p-button {
  margin-right: 8px;
  background-color: var(--color-primary);
  color: white;
}

.p-button:hover {
  background-color: var(--color-primary-1);
  color: white;
}

.mt-3 {
  margin-top: 1rem;
}
</style>