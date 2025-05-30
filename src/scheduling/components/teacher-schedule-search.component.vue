<template>
  <div class="teacher-schedule-container">
    <div class="schedule-header">
      <div class="header-content">
        <p class="subtitle">{{ $t('teacher-schedule.subtitle') }}</p>
      </div>
      <div class="teacher-info" v-if="currentTeacher">
        <span class="teacher-name">{{ currentTeacher.fullName }}</span>
      </div>
    </div>

    <div v-if="isLoading" class="loading-indicator">
      {{ $t('teacher-schedule.loading') }}
    </div>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else-if="!teacherSchedules.length" class="no-schedules">
      No hay horarios asignados para este profesor
    </div>

    <div v-else class="schedule-grid-container">
      <div class="schedule-grid">
        <!-- Header row with days -->
        <div class="time-header"></div>
        <div
            v-for="day in daysOfWeek"
            :key="day.key"
            class="day-header"
        >
          {{ $t(`teacher-schedule.days.${day.key}`) }}
        </div>

        <!-- Time slots and schedule blocks -->
        <template v-for="timeSlot in timeSlots" :key="timeSlot">
          <div class="time-slot">
            {{ timeSlot }}
          </div>

          <div
              v-for="day in daysOfWeek"
              :key="`${day.key}-${timeSlot}`"
              class="schedule-cell"
              :class="{ 'has-class': getScheduleForSlot(day.key, timeSlot) }"
              @click="onCellClick(day.key, timeSlot)"
          >
            <div
                v-if="getScheduleForSlot(day.key, timeSlot)"
                class="schedule-block"
            >
              <div class="course-info">
                <strong>{{ getScheduleForSlot(day.key, timeSlot).course.name }}</strong>
              </div>
              <div class="classroom-info">
                <i class="pi pi-map-marker"></i>
                {{ getScheduleForSlot(day.key, timeSlot).classroom.code }} - {{ getScheduleForSlot(day.key, timeSlot).classroom.campus }}
              </div>
              <div class="time-info">
                {{ getScheduleForSlot(day.key, timeSlot).timeRange.start }} -
                {{ getScheduleForSlot(day.key, timeSlot).timeRange.end }}
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Modal for rescheduling -->
    <pv-dialog
        v-model:visible="showRescheduleModal"
        :style="{ width: '500px' }"
        :modal="true"
        :closable="false"
    >
      <teacher-schedule-reschedule-modal
          v-if="selectedSchedule"
          :schedule-data="selectedSchedule"
          @confirm="handleRescheduleConfirm"
          @cancel="showRescheduleModal = false"
      />
    </pv-dialog>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import weeklyScheduleService from '../services/weekly-schedule.service.js';
import TeacherScheduleRescheduleModal from './teacher-schedule-reschedule-modal.component.vue';

export default {
  name: 'teacher-schedule-search',
  components: {
    TeacherScheduleRescheduleModal
  },
  setup() {
    // State variables
    const allSchedules = ref([]);
    const teacherSchedules = ref([]);
    const currentTeacher = ref(null);
    const isLoading = ref(false);
    const error = ref(null);
    const showRescheduleModal = ref(false);
    const selectedSchedule = ref(null);

    // Days of the week
    const daysOfWeek = [
      { key: 'monday', value: 'Monday' },
      { key: 'tuesday', value: 'Tuesday' },
      { key: 'wednesday', value: 'Wednesday' },
      { key: 'thursday', value: 'Thursday' },
      { key: 'friday', value: 'Friday' },
      { key: 'saturday', value: 'Saturday' },
      { key: 'sunday', value: 'Sunday' }
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
    onMounted(async () => {
      await loadCurrentTeacher();
      if (currentTeacher.value) {
        await fetchTeacherSchedules();
        console.log('Initial schedules check:', teacherSchedules.value.map(s => ({
          day: s.dayOfWeek,
          time: s.timeRange?.start,
          course: s.course?.name
        })));
      }
    });

    // Methods
    const loadCurrentTeacher = async () => {
      try {
        const userData = localStorage.getItem('currentUser');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          console.log('Parsed user:', parsedUser); // Debug log
          if (parsedUser.role === 'TEACHER' || parsedUser.role === 1) {
            currentTeacher.value = parsedUser;
          } else {
            error.value = 'El usuario actual no es un profesor';
          }
        } else {
          error.value = 'No hay usuario autenticado';
        }
      } catch (err) {
        console.error('Error loading current teacher:', err);
        error.value = 'Error al cargar información del docente';
      }
    };

    const fetchTeacherSchedules = async () => {
      if (!currentTeacher.value) {
        error.value = 'No se encontró información del docente';
        return;
      }

      isLoading.value = true;
      error.value = null;

      try {
        // Get all weekly schedules
        const weeklySchedules = await weeklyScheduleService.getAll();
        allSchedules.value = weeklySchedules;

        // Extract all individual schedules and filter by current teacher
        const allIndividualSchedules = [];
        weeklySchedules.forEach(weeklySchedule => {
          if (weeklySchedule.weekSchedule && Array.isArray(weeklySchedule.weekSchedule)) {
            weeklySchedule.weekSchedule.forEach(schedule => {
              if (schedule.teacher) {
                allIndividualSchedules.push({
                  ...schedule,
                  weeklyScheduleId: weeklySchedule.id,
                  weeklyScheduleName: weeklySchedule.name
                });
              }
            });
          }
        });

        // Filter schedules for current teacher
        const currentTeacherId = String(currentTeacher.value.id);
        teacherSchedules.value = allIndividualSchedules.filter(schedule => {
          const teacherId = String(schedule.teacher?.id);
          return teacherId === currentTeacherId;
        });

        console.log('Teacher schedules found:', teacherSchedules.value.length);
      } catch (err) {
        console.error('Error fetching teacher schedules:', err);
        error.value = 'Error al cargar horarios del docente';
      } finally {
        isLoading.value = false;
      }
    };

    const getScheduleForSlot = (day, timeSlot) => {
      const dayMapping = {
        'monday': 'Monday',
        'tuesday': 'Tuesday',
        'wednesday': 'Wednesday',
        'thursday': 'Thursday',
        'friday': 'Friday',
        'saturday': 'Saturday',
        'sunday': 'Sunday'
      };

      const mappedDay = dayMapping[day];
      
      return teacherSchedules.value.find(schedule => {
        const scheduleDayOfWeek = schedule.dayOfWeek;
        const scheduleStartTime = schedule.timeRange?.start;
        const scheduleEndTime = schedule.timeRange?.end;
        
        // Verificar si el día coincide
        if (scheduleDayOfWeek !== mappedDay) {
          return false;
        }

        // Convertir horarios a minutos para comparación
        const [startHour, startMinute] = scheduleStartTime.split(':').map(Number);
        const [endHour, endMinute] = scheduleEndTime.split(':').map(Number);
        const [slotHour, slotMinute] = timeSlot.split(':').map(Number);
        
        const startTimeInMinutes = startHour * 60 + startMinute;
        const endTimeInMinutes = endHour * 60 + endMinute;
        const slotTimeInMinutes = slotHour * 60 + slotMinute;
        
        // Verificar si el slot está dentro del rango de la clase
        return slotTimeInMinutes >= startTimeInMinutes && slotTimeInMinutes < endTimeInMinutes;
      }) || null;
    };

    const onCellClick = (day, timeSlot) => {
      const schedule = getScheduleForSlot(day, timeSlot);
      if (schedule) {
        selectedSchedule.value = { ...schedule };
        showRescheduleModal.value = true;
      }
    };

    const handleRescheduleConfirm = async (updatedSchedule) => {
      try {
        // Find the weekly schedule that contains this individual schedule
        const weeklySchedule = allSchedules.value.find(ws =>
            ws.id === updatedSchedule.weeklyScheduleId
        );

        if (!weeklySchedule) {
          throw new Error('No se encontró el horario semanal');
        }

        // Update the schedule within the weekly schedule
        const scheduleIndex = weeklySchedule.weekSchedule.findIndex(s => s.id === updatedSchedule.id);
        if (scheduleIndex !== -1) {
          weeklySchedule.weekSchedule[scheduleIndex] = {
            ...weeklySchedule.weekSchedule[scheduleIndex],
            dayOfWeek: updatedSchedule.dayOfWeek,
            timeRange: updatedSchedule.timeRange,
            classroom: updatedSchedule.classroom
          };

          // Update the weekly schedule in the backend
          await weeklyScheduleService.update(weeklySchedule.id, weeklySchedule);

          // Refresh the teacher schedules
          await fetchTeacherSchedules();
          showRescheduleModal.value = false;
        }
      } catch (err) {
        console.error('Error updating schedule:', err);
        error.value = 'Error al actualizar el horario';
      }
    };

    return {
      currentTeacher,
      teacherSchedules,
      isLoading,
      error,
      daysOfWeek,
      timeSlots,
      showRescheduleModal,
      selectedSchedule,
      getScheduleForSlot,
      onCellClick,
      handleRescheduleConfirm
    };
  }
};
</script>

<style scoped>
.teacher-schedule-container {
  width: 100%;
  padding: 20px;
}

.schedule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.subtitle {
  font-size: 1.1rem;
  color: #333;
  margin: 0;
  font-weight: 500;
}

.teacher-info {
  background-color: #f8f9fa;
  padding: 10px 15px;
  border-radius: 4px;
  border: 1px solid #dee2e6;
}

.teacher-name {
  font-weight: 500;
  color: #495057;
}

.loading-indicator,
.error-message,
.no-schedules {
  text-align: center;
  padding: 20px;
  margin: 20px 0;
  border-radius: 4px;
}

.loading-indicator {
  color: #666;
}

.error-message {
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
}

.no-schedules {
  color: #6c757d;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
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
  cursor: pointer;
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

.time-info {
  font-size: 0.8em;
  color: #666;
}

@media (max-width: 768px) {
  .teacher-schedule-container {
    padding: 10px;
  }

  .schedule-header {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
}
</style>