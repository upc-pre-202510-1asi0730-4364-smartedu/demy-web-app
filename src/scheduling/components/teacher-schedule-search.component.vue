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
                <strong>{{ getCourseName(getScheduleForSlot(day.key, timeSlot).courseId) }}</strong>
              </div>
              <div class="classroom-info">
                <i class="pi pi-map-marker"></i>
                {{ getClassroomName(getScheduleForSlot(day.key, timeSlot).classroomId) }}
              </div>
              <div class="time-info">
                {{ getScheduleForSlot(day.key, timeSlot).startTime }} -
                {{ getScheduleForSlot(day.key, timeSlot).endTime }}
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
import { WeeklyScheduleService } from '../services/weekly-schedule.service.js';
import httpInstance from '../../shared/services/http.instance.js';
import TeacherScheduleRescheduleModal from './teacher-schedule-reschedule-modal.component.vue';

export default {
  name: 'teacher-schedule-search',
  components: {
    TeacherScheduleRescheduleModal
  },
  setup() {
    // Create service instance
    const weeklyScheduleService = new WeeklyScheduleService();
    
    // Add the method if it doesn't exist
    if (!weeklyScheduleService.getSchedulesByTeacherId) {
      weeklyScheduleService.getSchedulesByTeacherId = async function(teacherId) {
        try {
          const response = await httpInstance.get(`${this.resourceEndpoint}/by-teacher/${teacherId}`);
          if (Array.isArray(response.data)) {
            return response.data;
          }
        } catch (error) {
          console.error(`Error fetching schedules by teacher ID ${teacherId}:`, error);
          throw error;
        }
      };
    }
    
    // State variables
    const teacherSchedules = ref([]);
    const currentTeacher = ref(null);
    const isLoading = ref(false);
    const error = ref(null);
    const showRescheduleModal = ref(false);
    const selectedSchedule = ref(null);

    // Data for entity names
    const availableCourses = ref([]);
    const availableClassrooms = ref([]);
    const availableTeachers = ref([]);

    // Functions to get entity names by ID
    const getCourseName = (courseId) => {
      const course = availableCourses.value.find(c => c.id === courseId);
      return course ? (course.name || course.courseName || course.title || `Course ${courseId}`) : `Course ${courseId}`;
    };

    const getClassroomName = (classroomId) => {
      const classroom = availableClassrooms.value.find(c => c.id === classroomId);
      return classroom ? (classroom.code || classroom.name || classroom.roomCode || classroom.number || `Room ${classroomId}`) : `Room ${classroomId}`;
    };

    const getTeacherName = (teacherId) => {
      const teacher = availableTeachers.value.find(t => t.id === teacherId);
      return teacher ? (teacher.fullName || teacher.name || `${teacher.firstName || ''} ${teacher.lastName || ''}`.trim() || `Teacher ${teacherId}`) : `Teacher ${teacherId}`;
    };

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
      await loadEntityData();
      if (currentTeacher.value) {
        await fetchTeacherSchedules();
        console.log('Initial schedules check:', teacherSchedules.value.map(s => ({
          day: s.dayOfWeek,
          time: s.startTime,
          course: s.courseId
        })));
      }
    });

    // Methods
    const loadCurrentTeacher = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          console.log('Parsed user:', parsedUser); // Debug log
          if (parsedUser.role === 'TEACHER' || parsedUser.role === 1 || parsedUser.role === '1') {
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
        // Get schedules directly by teacher ID
        const teacherId = currentTeacher.value.id;
        console.log('Fetching schedules for teacher ID:', teacherId);
        
        const schedules = await weeklyScheduleService.getSchedulesByTeacherId(teacherId);
        
        console.log('Raw schedules from backend:', schedules);
        
        // The backend returns an array of schedule objects directly
        if (Array.isArray(schedules)) {
          teacherSchedules.value = schedules;
          console.log('Teacher schedules loaded:', teacherSchedules.value.length);
          console.log('Schedules data:', teacherSchedules.value);
        } else {
          console.error('Expected array of schedules, got:', typeof schedules);
          teacherSchedules.value = [];
        }
      } catch (err) {
        console.error('Error fetching teacher schedules:', err);
        error.value = 'Error al cargar horarios del docente';
        teacherSchedules.value = [];
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

      // Debug logs
      console.log(`Looking for schedule on ${mappedDay} at ${timeSlot}`);
      console.log('Available schedules:', teacherSchedules.value);

      const foundSchedule = teacherSchedules.value.find(schedule => {
        // Debug: Log the entire schedule object
        console.log('Schedule object:', schedule);
        console.log('Schedule keys:', Object.keys(schedule));
        
        const scheduleDayOfWeek = schedule.dayOfWeek;
        const scheduleStartTime = schedule.startTime;
        const scheduleEndTime = schedule.endTime;

        // Debug log for each schedule check
        console.log(`Checking schedule: ${scheduleDayOfWeek} ${scheduleStartTime}-${scheduleEndTime} vs ${mappedDay} ${timeSlot}`);

        // Verificar si el día coincide
        if (scheduleDayOfWeek !== mappedDay) {
          console.log(`Day mismatch: ${scheduleDayOfWeek} !== ${mappedDay}`);
          return false;
        }

        // Convertir horarios a minutos para comparación
        const [startHour, startMinute] = scheduleStartTime.split(':').map(Number);
        const [endHour, endMinute] = scheduleEndTime.split(':').map(Number);
        const [slotHour, slotMinute] = timeSlot.split(':').map(Number);

        const startTimeInMinutes = startHour * 60 + startMinute;
        const endTimeInMinutes = endHour * 60 + endMinute;
        const slotTimeInMinutes = slotHour * 60 + slotMinute;

        console.log(`Time comparison: ${slotTimeInMinutes} >= ${startTimeInMinutes} && ${slotTimeInMinutes} < ${endTimeInMinutes}`);

        // Verificar si el slot está dentro del rango de la clase
        const isInRange = slotTimeInMinutes >= startTimeInMinutes && slotTimeInMinutes < endTimeInMinutes;
        console.log(`Is in range: ${isInRange}`);
        
        return isInRange;
      });

      console.log(`Found schedule for ${mappedDay} ${timeSlot}:`, foundSchedule);
      return foundSchedule || null;
    };

    const onCellClick = (day, timeSlot) => {
      const schedule = getScheduleForSlot(day, timeSlot);
      if (schedule) {
        // Edit existing schedule
        selectedSchedule.value = { ...schedule };
        showRescheduleModal.value = true;
      } else {
        // Create new schedule for empty cell
        selectedSchedule.value = {
          id: null,
          dayOfWeek: day.value,
          startTime: timeSlot,
          endTime: getNextTimeSlot(timeSlot),
          classroomId: null,
          courseId: null,
          teacherId: currentTeacher.value?.id
        };
        showRescheduleModal.value = true;
      }
    };

    // Helper function to get next time slot
    const getNextTimeSlot = (currentSlot) => {
      const [hours, minutes] = currentSlot.split(':').map(Number);
      let nextMinutes = minutes + 30;
      let nextHours = hours;
      
      if (nextMinutes >= 60) {
        nextMinutes = 0;
        nextHours += 1;
      }
      
      return `${nextHours.toString().padStart(2, '0')}:${nextMinutes.toString().padStart(2, '0')}`;
    };

    // Load entity data for display names
    const loadEntityData = async () => {
      try {
        console.log('Loading entity data...');
        
        // Import services dynamically to avoid circular dependencies
        const courseServiceModule = await import('../services/course.service.js');
        const classroomServiceModule = await import('../services/classroom.service.js');
        const teacherServiceModule = await import('../../iam-user/services/teacher.service.js');

        // Create instances of the services
        const courseService = new courseServiceModule.CourseService();
        const classroomService = new classroomServiceModule.ClassroomService();
        const teacherService = new teacherServiceModule.TeacherService();

        // Load all entity data in parallel
        const [courses, classrooms, teachers] = await Promise.all([
          courseService.getAll().then(res => res.data || res),
          classroomService.getAll().then(res => res.data || res),
          teacherService.getTeachersSchedule()
        ]);

        availableCourses.value = Array.isArray(courses) ? courses : [];
        availableClassrooms.value = Array.isArray(classrooms) ? classrooms : [];
        availableTeachers.value = Array.isArray(teachers) ? teachers : [];

        console.log('Entity data loaded:', {
          courses: availableCourses.value.length,
          classrooms: availableClassrooms.value.length,
          teachers: availableTeachers.value.length
        });
      } catch (error) {
        console.error('Error loading entity data:', error);
        // Keep empty arrays as fallback
        availableCourses.value = [];
        availableClassrooms.value = [];
        availableTeachers.value = [];
      }
    };

    const handleRescheduleConfirm = async (updatedSchedule) => {
      try {
        if (updatedSchedule.id) {
          // Update existing schedule
          await weeklyScheduleService.updateScheduleById(updatedSchedule.id, {
            dayOfWeek: updatedSchedule.dayOfWeek,
            startTime: updatedSchedule.startTime,
            endTime: updatedSchedule.endTime,
            classroomId: updatedSchedule.classroomId
          });
        } else {
          // Create new schedule
          await weeklyScheduleService.addScheduleToWeekly(1, { // Assuming weekly schedule ID 1 for now
            dayOfWeek: updatedSchedule.dayOfWeek,
            startTime: updatedSchedule.startTime,
            endTime: updatedSchedule.endTime,
            classroomId: updatedSchedule.classroomId,
            courseId: updatedSchedule.courseId,
            teacherId: updatedSchedule.teacherId
          });
        }

        // Refresh the teacher schedules
        await fetchTeacherSchedules();
        showRescheduleModal.value = false;
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
      availableCourses,
      availableClassrooms,
      availableTeachers,
      getCourseName,
      getClassroomName,
      getTeacherName,
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