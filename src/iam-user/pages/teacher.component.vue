<template>
  <div class="teacher-container">
    <h1>{{ $t('teacher.title') }}</h1>

    <div class="table-wrapper">
      <table class="teacher-table">
        <thead>
        <tr>
          <th @click="sort('fullName')">{{ $t('teacher.table.fullName') }}</th>
          <th @click="sort('email')">{{ $t('teacher.table.email') }}</th>
          <th>{{ $t('teacher.table.actions') }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="teacher in paginatedTeachers" :key="teacher.id">
          <td>{{ teacher.fullName }}</td>
          <td>{{ teacher.email }}</td>
          <td class="actions-cell">
            <button @click="onEditItem(teacher)" class="btn-icon" :title="$t('teacher.buttons.edit')">
              <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
            </button>
            <button @click="onDeleteItem(teacher)" class="btn-icon" :title="$t('teacher.buttons.delete')">
              <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
            </button>
          </td>
        </tr>
        </tbody>
      </table>

      <div class="pagination-controls">
        <button @click="prevPage" :disabled="currentPage === 1">{{ $t('teacher.buttons.previous') }}</button>
        <span>{{ $t('teacher.pagination.pageInfo', { current: currentPage, total: totalPages }) }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">{{ $t('teacher.buttons.next') }}</button>
        <select v-model="pageSize" @change="resetPagination">
          <option value="5">{{ $t('teacher.buttons.itemsPerPage', { count: 5 }) }}</option>
          <option value="10">{{ $t('teacher.buttons.itemsPerPage', { count: 10 }) }}</option>
          <option value="15">{{ $t('teacher.buttons.itemsPerPage', { count: 15 }) }}</option>
        </select>
      </div>
    </div>

    <div class="action-buttons">
      <button @click="onNewTeacher" class="btn-add">
        <i class="fas fa-plus-circle"></i> {{ $t('teacher.buttons.newTeacher') }}
      </button>
    </div>

    <TeacherModal
        :visible="modalVisible"
        :mode="modalMode"
        :teacherData="selectedTeacher"
        @update:visible="modalVisible = $event"
        @submit="handleModalSubmit"
        @cancel="handleModalCancel"
        @confirm-delete="handleConfirmDelete"
    />
  </div>
</template>

<script>
import TeacherModal from '../components/teacher-modal.component.vue';
import { useTeacherService } from '../services/teacher.service.js';

export default {
  components: {
    TeacherModal
  },
  data() {
    return {
      isSubmitting: false,
      teachers: [],
      filteredTeachers: [],
      currentPage: 1,
      pageSize: 5,
      sortField: 'fullName',
      sortDirection: 'asc',
      modalVisible: false,
      modalMode: 'add',
      selectedTeacher: null,
      teacherService: useTeacherService()
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredTeachers.length / this.pageSize);
    },
    paginatedTeachers() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredTeachers.slice(start, end);
    }
  },
  async created() {
    await this.loadTeachers();
  },
  methods: {
    async loadTeachers() {
      try {
        const response = await this.teacherService.getTeachers();
        this.teachers = response.filter(teacher =>
            teacher.role === 1 || teacher.role === 'TEACHER'
        );
        this.filteredTeachers = [...this.teachers];
        this.sortTeachers();
      } catch (error) {
        console.error('Error loading teachers:', error);
      }
    },
    sort(field) {
      if (this.sortField === field) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortField = field;
        this.sortDirection = 'asc';
      }
      this.sortTeachers();
    },
    sortTeachers() {
      this.filteredTeachers.sort((a, b) => {
        const valueA = a[this.sortField] || '';
        const valueB = b[this.sortField] || '';

        if (valueA < valueB) {
          return this.sortDirection === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
          return this.sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
      });
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    resetPagination() {
      this.currentPage = 1;
    },
    onNewTeacher() {
      this.modalMode = 'add';
      this.selectedTeacher = {
        fullName: '',
        email: '',
        passwordHash: '',
        role: 'TEACHER',
        status: 'INACTIVE'
      };
      this.modalVisible = true;
    },
    onEditItem(teacher) {
      this.modalMode = 'edit';
      this.selectedTeacher = { ...teacher };
      this.modalVisible = true;
    },
    onDeleteItem(teacher) {
      this.modalMode = 'delete';
      this.selectedTeacher = { ...teacher };
      this.modalVisible = true;
    },
    async handleModalSubmit(teacherData) {
      if (this.isSubmitting) return;
      this.isSubmitting = true;

      try {
        if (this.modalMode === 'add') {
          const newTeacher = await this.teacherService.createTeacher(teacherData);
          const exists = this.teachers.some(t => t.email === newTeacher.email);
          if (!exists) {
            this.teachers = [newTeacher, ...this.teachers];
            this.filteredTeachers = [newTeacher, ...this.filteredTeachers];
          }
        } else if (this.modalMode === 'edit') {
          if (!teacherData.id) {
            throw new Error('Teacher ID not provided');
          }

          const updatedTeacher = await this.teacherService.updateTeacher(
              teacherData.id,
              teacherData
          );

          this.teachers = this.teachers.map(t =>
              t.id === updatedTeacher.id ? updatedTeacher : t
          );
          this.filteredTeachers = this.filteredTeachers.map(t =>
              t.id === updatedTeacher.id ? updatedTeacher : t
          );
        }

        this.modalVisible = false;
      } catch (error) {
        console.error('Error saving teacher:', error);
        alert(`Error saving: ${error.message}`);
      } finally {
        this.isSubmitting = false;
      }
    },
    async handleConfirmDelete() {
      try {
        await this.teacherService.deleteTeacher(this.selectedTeacher.id);
        this.teachers = this.teachers.filter(t => t.id !== this.selectedTeacher.id);
        this.filteredTeachers = this.filteredTeachers.filter(t => t.id !== this.selectedTeacher.id);
      } catch (error) {
        console.error('Error deleting teacher:', error);
      }
    },
    handleModalCancel() {
      this.modalVisible = false;
    }
  }
};
</script>

<style scoped>
.teacher-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  font-size: 2rem;
  margin-bottom: 20px;
  text-align: center;
}

.table-wrapper {
  width: 100%;
  margin: 30px auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.teacher-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.teacher-table th, .teacher-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.teacher-table th {
  background-color: #fff;
  font-weight: bold;
  cursor: pointer;
}

.teacher-table th:hover {
  background-color: #f0f0f0;
}

.teacher-table tr:hover {
  background-color: #f9f9f9;
}

.actions-cell {
  white-space: nowrap;
}

.icon {
  width: 1em;
  height: 1em;
  fill: currentColor;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 0.5em;
}

.btn-icon:hover {
  color: #333;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px 8px;
  margin-right: 5px;
  color: #555;
}

.btn-icon:hover {
  color: #007bff;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 10px;
}

.pagination-controls button {
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pagination-controls button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.pagination-controls select {
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.btn-add {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

.btn-add:hover {
  background-color: #0069d9;
}

@media (max-width: 768px) {
  .teacher-table {
    display: block;
    overflow-x: auto;
  }

  .table-wrapper {
    padding: 10px;
  }
}
</style>