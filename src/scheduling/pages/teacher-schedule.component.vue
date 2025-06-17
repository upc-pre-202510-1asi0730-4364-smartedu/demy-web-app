<script>
import { ref, onMounted } from 'vue';
import TeacherScheduleSearch from '../components/teacher-schedule-search.component.vue';
import { UserAccount } from '../../iam-user/model/user-account.js';

export default {
  name: 'teacher-schedule',
  components: {
    TeacherScheduleSearch
  },
  setup() {
    // State variables
    const selectedSchedule = ref(null);
    const currentTeacher = ref(null);
    const error = ref(null);

    // Methods
    const onScheduleSelected = (schedule) => {
      selectedSchedule.value = schedule;
    };

    // Load current teacher on mount
    onMounted(() => {
      try {
        const userData = localStorage.getItem('currentUser');
        console.log('Raw user data from localStorage:', userData); // Debug log

        if (userData) {
          const parsedUser = JSON.parse(userData);
          console.log('Parsed user data:', parsedUser); // Debug log

          // Check for both string and numeric role values
          if (parsedUser.role === 'TEACHER' || parsedUser.role === 1 || parsedUser.role === '1') {
            currentTeacher.value = new UserAccount(parsedUser);
            console.log('Teacher loaded successfully:', currentTeacher.value); // Debug log
          } else {
            console.log('User role is not TEACHER:', parsedUser.role); // Debug log
            error.value = 'El usuario actual no es un profesor';
          }
        } else {
          console.log('No user data found in localStorage'); // Debug log
          error.value = 'No hay usuario autenticado';
        }
      } catch (err) {
        console.error('Error loading current teacher:', err);
        error.value = 'Error al cargar la información del profesor';
      }
    });

    return {
      selectedSchedule,
      currentTeacher,
      error,
      onScheduleSelected
    };
  }
};
</script>

<template>
  <div class="teacher-schedule">
    <div class="page-wrapper">
      <h1>{{ $t('teacher-schedule.title') }}</h1>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div v-else-if="!currentTeacher" class="error-message">
        {{ $t('teacher-schedule.error.no-teacher') }}
      </div>

      <div v-else class="content-layout">
        <!-- Main Search Component -->
        <div class="main-content">
          <teacher-schedule-search
              @schedule-selected="onScheduleSelected"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.teacher-schedule {
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

.main-content {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #ddd;
}

.error-message {
  text-align: center;
  padding: 20px;
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  margin-bottom: 20px;
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