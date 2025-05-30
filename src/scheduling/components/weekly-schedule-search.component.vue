<script>
import { ref, computed, onMounted } from 'vue';
import weeklyScheduleService from '../services/weekly-schedule.service';

export default {
  name: 'weekly-schedule-search',
  props: {
    selectedScheduleId: {
      type: [String, Number],
      default: ''
    }
  },
  emits: ['schedule-selected'],
  setup(props, { emit }) {
    // State variables
    const availableSchedules = ref([]);
    const isLoading = ref(false);
    const errorMessage = ref(null);
    const currentWeeklySchedule = ref(null);
    const localSelectedScheduleId = ref(props.selectedScheduleId);

    // Days of the week for table headers
    const weekDays = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday'
    ];

    // Time slots (from 7:00 AM to 9:00 PM in 30-minute intervals)
    const timeSlots = ref([
      '07:00', '07:30',
      '08:00', '08:30',
      '09:00', '09:30',
      '10:00', '10:30',
      '11:00', '11:30',
      '12:00', '12:30',
      '13:00', '13:30',
      '14:00', '14:30',
      '15:00', '15:30',
      '16:00', '16:30',
      '17:00', '17:30',
      '18:00', '18:30',
      '19:00', '19:30',
      '20:00', '20:30',
      '21:00'
    ]);

    // Lifecycle hooks
    onMounted(() => {
      loadAvailableSchedules();
    });

    // Methods
    const loadAvailableSchedules = async () => {
      isLoading.value = true;
      errorMessage.value = null;

      try {
        availableSchedules.value = await weeklyScheduleService.getAll();

        // If there's a pre-selected schedule, load it
        if (props.selectedScheduleId) {
          searchWeeklySchedule();
        }
      } catch (error) {
        console.error('Error fetching weekly schedules:', error);
        errorMessage.value = 'An error occurred while loading weekly schedules. Please try again.';
      } finally {
        isLoading.value = false;
      }
    };

    const searchWeeklySchedule = () => {
      // Reset previous state
      errorMessage.value = null;
      currentWeeklySchedule.value = null;

      // If a schedule is selected from dropdown
      if (localSelectedScheduleId.value) {
        currentWeeklySchedule.value = availableSchedules.value.find(
            schedule => schedule.id === localSelectedScheduleId.value
        ) || null;

        if (!currentWeeklySchedule.value) {
          errorMessage.value = 'Could not find the selected schedule.';
        } else {
          // Emit the selected schedule to parent
          emit('schedule-selected', currentWeeklySchedule.value);
        }
        return;
      }

      // If no schedule selected
      errorMessage.value = 'Please select a schedule.';
    };

    const onScheduleChange = () => {
      searchWeeklySchedule();
    };

    // Computed properties
    const uniqueTimeSlots = computed(() => {
      // Siempre retornar todos los slots de 30 minutos
      return timeSlots.value;
    });

    const getSchedulesForDayAndTime = (day, timeSlot) => {
      if (!currentWeeklySchedule.value) return [];

      return currentWeeklySchedule.value.weekSchedule.filter(schedule => {
        const scheduleDayOfWeek = schedule.dayOfWeek.toLowerCase();
        const [startHour, startMinute] = schedule.timeRange.start.split(':').map(Number);
        const [endHour, endMinute] = schedule.timeRange.end.split(':').map(Number);
        const [slotHour, slotMinute] = timeSlot.split(':').map(Number);
        
        const startTimeInMinutes = startHour * 60 + startMinute;
        const endTimeInMinutes = endHour * 60 + endMinute;
        const slotTimeInMinutes = slotHour * 60 + slotMinute;
        
        return scheduleDayOfWeek === day.toLowerCase() &&
               slotTimeInMinutes >= startTimeInMinutes &&
               slotTimeInMinutes < endTimeInMinutes;
      });
    };

    const isSearchDisabled = computed(() => {
      return !localSelectedScheduleId.value;
    });

    return {
      availableSchedules,
      isLoading,
      errorMessage,
      currentWeeklySchedule,
      localSelectedScheduleId,
      weekDays,
      timeSlots,
      uniqueTimeSlots,
      searchWeeklySchedule,
      getSchedulesForDayAndTime,
      isSearchDisabled,
      onScheduleChange
    };
  }
};
</script>

<template>
  <div class="weekly-schedule-search">
    <!-- Search Form -->
    <div class="search-container">
      <div class="search-inputs">
        <!-- Schedule Dropdown -->
        <div class="form-group schedule-select">
          <label for="scheduleSelect">{{ $t('search-schedules.select') }}</label>
          <pv-dropdown
              v-model="localSelectedScheduleId"
              id="scheduleSelect"
              :options="availableSchedules"
              option-label="name"
              option-value="id"
              placeholder="Select a schedule"
              class="w-full"
              @change="onScheduleChange"
          />
        </div>

        <!-- Search Button -->
        <pv-button
            :label="$t('search-schedules.button.search')"
            icon="pi pi-search"
            class="p-button-raised"
            :disabled="isSearchDisabled"
            @click="searchWeeklySchedule"
        />
      </div>
    </div>

    <!-- Loading Indicator -->
    <div v-if="isLoading" class="loading-container">
      <pv-progress-spinner />
      <p>Loading schedules...</p>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="error-container">
      <pv-message severity="error" :closable="false">
        {{ errorMessage }}
      </pv-message>
    </div>

    <!-- Schedule Results -->
    <div v-if="currentWeeklySchedule && !isLoading" class="schedule-results">
      <h3>{{ $t('search-schedules.table.subtitle') }}: "{{ currentWeeklySchedule.name }}"</h3>

      <div class="schedule-grid-container">
        <div class="schedule-grid">
          <!-- Header row with days -->
          <div class="time-header"></div>
          <div
              v-for="day in weekDays"
              :key="day"
              class="day-header"
          >
            {{ $t('search-schedules.table.' + day) }}
          </div>

          <!-- Time slots and schedule blocks -->
          <template v-for="timeSlot in timeSlots" :key="timeSlot">
            <div class="time-slot">
              {{ timeSlot }}
            </div>

            <div
                v-for="day in weekDays"
                :key="`${day}-${timeSlot}`"
                class="schedule-cell"
                :class="{ 'has-class': getSchedulesForDayAndTime(day, timeSlot).length > 0 }"
            >
              <div
                  v-for="schedule in getSchedulesForDayAndTime(day, timeSlot)"
                  :key="schedule.id"
                  class="schedule-block"
              >
                <div class="course-info">
                  <strong>{{ schedule.course.name }}</strong>
                </div>
                <div class="classroom-info">
                  <i class="pi pi-map-marker"></i>
                  {{ schedule.classroom.code }} - {{ schedule.classroom.campus }}
                </div>
                <div class="teacher-info">
                  <i class="pi pi-user"></i>
                  {{ schedule.teacher.fullName }}
                </div>
                <div class="time-info">
                  {{ schedule.timeRange.start }} - {{ schedule.timeRange.end }}
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- No Results Message -->
    <div v-if="!currentWeeklySchedule && !isLoading && !errorMessage && localSelectedScheduleId" class="no-results">
      <pv-message severity="info" :closable="false">
        No schedule found with the selected criteria.
      </pv-message>
    </div>
  </div>
</template>

<style scoped>
.weekly-schedule-search {
  width: 100%;
  padding: 20px;
}

.search-container {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-inputs {
  display: flex;
  align-items: end;
  gap: 20px;
  flex-wrap: wrap;
}

.form-group {
  flex: 1;
  min-width: 250px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
}

.w-full {
  width: 100%;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
}

.error-container,
.no-results {
  margin: 20px 0;
}

.schedule-results {
  margin-top: 30px;
}

.schedule-results h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.3rem;
  font-weight: 600;
}

.schedule-grid-container {
  overflow-x: auto;
}

.schedule-grid {
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr);
  gap: 1px;
  background-color: #dee2e6;
  border: 1px solid #dee2e6;
  min-width: 1000px;
}

.time-header,
.day-header {
  background-color: #f8f9fa;
  padding: 10px;
  text-align: center;
  font-weight: 500;
}

.time-slot {
  background-color: #f8f9fa;
  padding: 10px;
  text-align: center;
  font-size: 0.9em;
}

.schedule-cell {
  background-color: white;
  min-height: 80px;
  padding: 5px;
  transition: background-color 0.2s;
}

.schedule-cell:hover {
  background-color: #f8f9fa;
}

.schedule-block {
  background-color: #e3f2fd;
  border: 1px solid #90caf9;
  border-radius: 4px;
  padding: 8px;
  height: 100%;
}

.course-info {
  margin-bottom: 5px;
}

.classroom-info {
  font-size: 0.9em;
  color: #666;
  margin-bottom: 5px;
}

.teacher-info {
  font-size: 0.9em;
  color: #666;
  margin-bottom: 5px;
}

.time-info {
  font-size: 0.8em;
  color: #666;
}

/* Responsive Design */
@media (max-width: 768px) {
  .weekly-schedule-search {
    padding: 10px;
  }

  .search-inputs {
    flex-direction: column;
    align-items: stretch;
  }

  .form-group {
    min-width: auto;
  }

  .schedule-grid {
    font-size: 0.8rem;
  }

  .schedule-block {
    padding: 6px;
  }
}
</style>