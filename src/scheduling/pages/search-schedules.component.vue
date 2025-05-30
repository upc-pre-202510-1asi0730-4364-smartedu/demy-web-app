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

.sidebar {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #ddd;
  height: fit-content;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: bold;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.history-item {
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 6px;
  border-left: 3px solid #007ad9;
  transition: background-color 0.2s ease;
}

.history-item:hover {
  background-color: #f1f1f1;
}

.history-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.history-name {
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
}

.history-time {
  color: #666;
  font-size: 0.8rem;
}

.main-content {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #ddd;
}

.stats-section {
  margin-top: 30px;
}

.stats-section h3 {
  margin-bottom: 15px;
  font-size: 1.3rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  border: 1px solid #ddd;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  background-color: #007ad9;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .content-layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    order: 2;
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

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
  }

  .stat-card {
    padding: 15px;
    gap: 10px;
  }

  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }

  .stat-value {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>