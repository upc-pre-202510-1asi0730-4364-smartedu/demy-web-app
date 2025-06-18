<script>
import { ref, computed } from 'vue';
import WeeklyScheduleSearch from '../components/weekly-schedule-search.component.vue';

export default {
  name: 'search-schedules',
  components: {
    WeeklyScheduleSearch
  },
  setup() {
    // State variables
    const selectedSchedule = ref(null);

    // Computed properties
    const getUniqueTimesCount = computed(() => {
      if (!selectedSchedule.value) return 0;
      const times = new Set();
      selectedSchedule.value.weekSchedule.forEach(schedule => {
        times.add(schedule.timeRange.start);
      });
      return times.size;
    });

    const getUniqueClassroomsCount = computed(() => {
      if (!selectedSchedule.value) return 0;
      const classrooms = new Set();
      selectedSchedule.value.weekSchedule.forEach(schedule => {
        classrooms.add(schedule.classroom.id);
      });
      return classrooms.size;
    });

    const getUniqueTeachersCount = computed(() => {
      if (!selectedSchedule.value) return 0;
      const teachers = new Set();
      selectedSchedule.value.weekSchedule.forEach(schedule => {
        teachers.add(schedule.teacher.id);
      });
      return teachers.size;
    });

    // Methods
    const onScheduleSelected = (schedule) => {
      selectedSchedule.value = schedule;
    };

    return {
      selectedSchedule,
      getUniqueTimesCount,
      getUniqueClassroomsCount,
      getUniqueTeachersCount,
      onScheduleSelected
    };
  }
};
</script>

<template>
  <div class="search-schedules">
    <div class="page-wrapper">
      <h1>{{ $t('search-schedules.title') }}</h1>

      <div class="content-layout">
        <!-- Main Search Component -->
        <div class="main-content">
          <weekly-schedule-search
              @schedule-selected="onScheduleSelected"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-schedules {
  width: 100%;
}

.page-wrapper {
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

.content-layout {
  margin-top: 20px;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: bold;
}


.main-content {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #ddd;
}


.stats-section h3 {
  margin-bottom: 15px;
  font-size: 1.3rem;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .content-layout {
    grid-template-columns: 1fr;
  }

  .main-content {
    order: 1;
  }
}

@media (max-width: 768px) {
  .page-wrapper {
    padding: 10px;
    margin: 10px auto;
  }

  h1 {
    font-size: 1.5rem;
  }

}


</style>