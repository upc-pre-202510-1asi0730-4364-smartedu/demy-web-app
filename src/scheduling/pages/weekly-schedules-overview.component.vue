<script>
import { ref, computed, onMounted } from 'vue';
import WeeklyScheduleModal from '../components/weekly-schedule-modal.component.vue';
import weeklyScheduleService from '../services/weekly-schedule.service';
import { ScheduleWeekly } from '../model/weekly-schedule.entity';

export default {
  name: 'weekly-schedules-overview',
  components: {
    WeeklyScheduleModal
  },
  setup() {
    // State variables
    const weeklySchedules = ref([]);
    const isLoading = ref(false);
    const error = ref(null);
    const showModal = ref(false);
    const modalMode = ref('add');
    const selectedWeeklySchedule = ref(new ScheduleWeekly({}));

    // Pagination
    const currentPage = ref(1);
    const rowsPerPage = ref(10);
    const totalRecords = computed(() => weeklySchedules.value.length);

    // Computed properties
    const totalPages = computed(() =>
        Math.ceil(weeklySchedules.value.length / rowsPerPage.value) || 1
    );

    const paginatedSchedules = computed(() => {
      const start = (currentPage.value - 1) * rowsPerPage.value;
      const end = start + rowsPerPage.value;
      return weeklySchedules.value.slice(start, end);
    });

    // Lifecycle hooks
    onMounted(() => {
      fetchWeeklySchedules();
    });

    // Methods
    const fetchWeeklySchedules = async () => {
      isLoading.value = true;
      error.value = null;
      try {
        weeklySchedules.value = await weeklyScheduleService.getAll();
      } catch (err) {
        error.value = 'Failed to load weekly schedules';
        console.error(err);
      } finally {
        isLoading.value = false;
      }
    };

    const getSchedulesCount = (schedule) => {
      return schedule.weekSchedule?.length || 0;
    };

    const onNewWeeklySchedule = () => {
      modalMode.value = 'add';
      selectedWeeklySchedule.value = new ScheduleWeekly({ weekSchedule: [] });
      showModal.value = true;
    };

    const onEditItem = (schedule) => {
      modalMode.value = 'edit';
      selectedWeeklySchedule.value = new ScheduleWeekly({ ...schedule });
      showModal.value = true;
    };

    const onDeleteItem = (schedule) => {
      modalMode.value = 'delete';
      selectedWeeklySchedule.value = schedule;
      showModal.value = true;
    };

    const handleModalConfirm = async (weeklySchedule) => {
      try {
        if (modalMode.value === 'add') {
          await weeklyScheduleService.create(weeklySchedule);
        } else if (modalMode.value === 'edit') {
          await weeklyScheduleService.update(weeklySchedule.id, weeklySchedule);
        }
        await fetchWeeklySchedules();
        showModal.value = false;
      } catch (err) {
        console.error('Failed to save weekly schedule:', err);
        // You could add error handling/notification here
      }
    };

    const handleDeleteConfirm = async () => {
      try {
        await weeklyScheduleService.delete(selectedWeeklySchedule.value.id);
        weeklySchedules.value = weeklySchedules.value.filter(
            schedule => schedule.id !== selectedWeeklySchedule.value.id
        );
        showModal.value = false;
      } catch (err) {
        console.error('Failed to delete weekly schedule:', err);
        // You could add error handling/notification here
      }
    };

    const onPageChange = (event) => {
      currentPage.value = event.page + 1;
      rowsPerPage.value = event.rows;
    };

    return {
      weeklySchedules,
      isLoading,
      error,
      currentPage,
      rowsPerPage,
      totalRecords,
      totalPages,
      paginatedSchedules,
      showModal,
      modalMode,
      selectedWeeklySchedule,
      getSchedulesCount,
      onNewWeeklySchedule,
      onEditItem,
      onDeleteItem,
      handleModalConfirm,
      handleDeleteConfirm,
      onPageChange
    };
  }
};
</script>

<template>
  <div class="weekly-schedules-overview">
    <div class="table-wrapper">
      <h1>{{ $t('view-weekly-schedules.title')}}</h1>
      <div class="table-container">
        <table v-if="weeklySchedules.length > 0" class="data-table">
          <thead>
          <tr>
            <th>{{$t('view-weekly-schedules.table.name')}}</th>
            <th>{{$t('view-weekly-schedules.table.number')}}</th>
            <th>{{$t('view-weekly-schedules.table.actions')}}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="schedule in paginatedSchedules" :key="schedule.id">
            <td>{{ schedule.name }}</td>
            <td>{{ getSchedulesCount(schedule) }}</td>
            <td>
              <div class="action-button-group">
                <pv-button
                    icon="pi pi-pencil"
                    class="p-button-rounded p-button-text"
                    @click="onEditItem(schedule)"
                    tooltip="Edit"
                />
                <pv-button
                    icon="pi pi-trash"
                    class="p-button-rounded p-button-text p-button-danger"
                    @click="onDeleteItem(schedule)"
                    tooltip="Delete"
                />
              </div>
            </td>
          </tr>
          </tbody>
        </table>
        <!-- No data message -->
        <div v-else-if="isLoading" class="loading-message">
          Loading schedules...
        </div>
        <div v-else class="no-data-message">
          No weekly schedules available
        </div>
      </div>
      <!-- Pagination -->
      <div v-if="weeklySchedules.length > 0" class="pagination-wrapper">
        <pv-paginator
            :rows="rowsPerPage"
            :total-records="totalRecords"
            :first="(currentPage - 1) * rowsPerPage"
            @page="onPageChange"
            template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            :rows-per-page-options="[5, 10, 20, 50]"
        />
      </div>
      <!-- Add Button -->
      <div class="action-buttons">
        <pv-button
            icon="pi pi-plus"
           :label="$t('view-weekly-schedules.button.new')"
            @click="onNewWeeklySchedule"
            class="p-button-raised"
        />
      </div>
    </div>
    <!-- Modal component -->
    <pv-dialog
        v-model:visible="showModal"
        :style="{ width: '600px' }"
        :modal="true"
        :closable="false"
        class="weekly-schedule-dialog"
    >
      <weekly-schedule-modal
          :mode="modalMode"
          :weekly-schedule-data="selectedWeeklySchedule"
          @confirm="handleModalConfirm"
          @cancel="showModal = false"
          @delete="handleDeleteConfirm"
      />
    </pv-dialog>
  </div>
</template>

<style scoped>
.table-wrapper {
  width: 100%;
  margin: 20px auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  overflow-x: auto;
}
h1 {
  font-size: 2rem;
  margin-bottom: 20px;
}
.data-table {
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
  background-color: #fff;
}
.data-table th,
.data-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}
.data-table th {
  font-weight: bold;
  background-color: #f1f1f1;
}
.data-table tr:hover {
  background-color: #f9f9f9;
}
.action-button-group {
  display: flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
}
.pagination-wrapper {
  margin-top: 20px;
}
.action-buttons {
  margin-top: 20px;
  text-align: left;
}
.no-data-message, .loading-message {
  text-align: center;
  padding: 20px;
  font-style: italic;
  color: #666;
}
.weekly-schedule-dialog {
  max-height: 90vh;
  overflow-y: auto;
}
@media (max-width: 768px) {
  .table-wrapper {
    padding: 10px;
    margin: 10px auto;
  }
  .data-table th,
  .data-table td {
    padding: 8px;
  }
  .action-button-group {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>