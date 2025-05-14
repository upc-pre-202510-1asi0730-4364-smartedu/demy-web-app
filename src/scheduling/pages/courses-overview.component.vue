<template>
  <div>
    <h1>{{ $t('view-courses.title') }}</h1>

    <!-- Button to create a new course -->
    <pv-button :label="$t('view-courses.button.new-course')" icon="pi pi-plus" @click="openNewCourseDialog" class="p-button-primary" />

    <!-- DataTable -->
    <DataTable
        :value="courses"
        :paginator="true"
        :rows="5"
        :rowsPerPageOptions="[5, 10, 15]"
        :globalFilter="globalFilter"
        sortMode="single"
        ref="dt"
        class="mt-3"
    >
      <Column field="name" :header="$t('view-courses.table.name')" sortable="*" />
      <Column field="code" :header="$t('view-courses.table.code')" sortable="*" />
      <Column field="description" :header="$t('view-courses.table.description')" />

      <!-- Actions column -->
      <Column :header="$t('view-courses.table.actions')">
        <template #body="slotProps">
          <div>
            <pv-button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-success p-mr-2"
                @click="onEditCourse(slotProps.data)"
            />
            <pv-button
                icon="pi pi-trash"
                class="p-button-rounded p-button-danger"
                @click="onDeleteCourse(slotProps.data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- Course Modal Component -->
    <course-modal
        v-model:visible="isDialogVisible"
        :mode="dialogMode"
        :courseData="selectedCourse"
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
import { CourseService } from '../services/course.service.js';
import CourseModal from '../components/course-modal.component.vue';

export default {
  name: 'courses-overview',
  components: {
    DataTable,
    Column,
    CourseModal
  },
  setup() {
    // Reactive state
    const courses = ref([]);
    const isDialogVisible = ref(false);
    const selectedCourse = ref({});
    const dialogMode = ref('add');
    const globalFilter = ref('');
    const totalCourses = ref(0);
    const first = ref(0);

    // Inicializar el servicio de cursos
    const courseService = new CourseService();

    // Load courses from API
    const loadCourses = async () => {
      try {
        const response = await courseService.getAll();
        courses.value = response.data;
        totalCourses.value = response.data.length;
      } catch (error) {
        console.error('Error loading courses', error);
        courses.value = [];
        totalCourses.value = 0;
      }
    };

    // Open dialog to add new course
    const openNewCourseDialog = () => {
      selectedCourse.value = {};
      dialogMode.value = 'add';
      isDialogVisible.value = true;
    };

    // Open dialog to edit a course
    const onEditCourse = (courseData) => {
      selectedCourse.value = { ...courseData };
      dialogMode.value = 'edit';
      isDialogVisible.value = true;
    };

    // Open dialog to confirm course deletion
    const onDeleteCourse = (courseData) => {
      selectedCourse.value = { ...courseData };
      dialogMode.value = 'delete';
      isDialogVisible.value = true;
    };

    // Handle form submission (create or update)
    const handleSubmit = async (courseData) => {
      try {
        if (dialogMode.value === 'edit') {
          await courseService.update(courseData.id, courseData);
        } else {
          await courseService.create(courseData);
        }
        await loadCourses();
      } catch (error) {
        console.error('Error saving course', error);
      }
    };

    // Handle cancel action
    const handleCancel = () => {
      isDialogVisible.value = false;
    };

    // Handle delete confirmation
    const handleDelete = async (courseData) => {
      try {
        await courseService.delete(courseData.id);
        await loadCourses();
      } catch (error) {
        console.error('Error deleting course', error);
      }
    };

    // Handle pagination
    const onPage = (event) => {
      first.value = event.first;
      loadCourses();
    };

    // Load courses when component is mounted
    onMounted(() => {
      loadCourses();
    });

    return {
      courses,
      isDialogVisible,
      selectedCourse,
      dialogMode,
      globalFilter,
      totalCourses,
      first,
      loadCourses,
      openNewCourseDialog,
      onEditCourse,
      onDeleteCourse,
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