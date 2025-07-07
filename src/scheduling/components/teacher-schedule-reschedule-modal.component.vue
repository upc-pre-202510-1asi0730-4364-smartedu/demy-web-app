<script>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

export default {
  name: 'teacher-schedule-reschedule-modal',
  props: {
    scheduleData: {
      type: Object,
      required: true
    }
  },
  emits: ['confirm', 'cancel'],
  setup(props, { emit }) {
    const { t } = useI18n();
    // State variables
    const editedSchedule = ref({
      id: props.scheduleData.id,
      dayOfWeek: props.scheduleData.dayOfWeek,
      timeRange: {
        start: props.scheduleData.startTime,
        end: props.scheduleData.endTime
      },
      classroom: {
        id: props.scheduleData.classroomId
      },
      course: {
        id: props.scheduleData.courseId
      },
      teacher: {
        id: props.scheduleData.teacherId
      }
    });
    const availableClassrooms = ref([]);
    const availableCourses = ref([]);
    const availableTeachers = ref([]);
    const loadingData = ref(false);
    const error = ref(null);

    // Day options
    const dayOptions = [
      { label: t('teacher-schedule.days.monday'), value: 'Monday' },
      { label: t('teacher-schedule.days.tuesday'), value: 'Tuesday' },
      { label: t('teacher-schedule.days.wednesday'), value: 'Wednesday' },
      { label: t('teacher-schedule.days.thursday'), value: 'Thursday' },
      { label: t('teacher-schedule.days.friday'), value: 'Friday' },
      { label: t('teacher-schedule.days.saturday'), value: 'Saturday' },
      { label: t('teacher-schedule.days.sunday'), value: 'Sunday' }
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

    // Computed properties
    const isFormValid = computed(() => {
      const isEditMode = props.scheduleData.id !== null;
      
      if (isEditMode) {
        // For editing existing schedule, only require basic fields
        return editedSchedule.value.dayOfWeek &&
            editedSchedule.value.timeRange.start &&
            editedSchedule.value.timeRange.end &&
            editedSchedule.value.classroom.id;
      } else {
        // For creating new schedule, require all fields
        return editedSchedule.value.dayOfWeek &&
            editedSchedule.value.timeRange.start &&
            editedSchedule.value.timeRange.end &&
            editedSchedule.value.classroom.id &&
            editedSchedule.value.course.id &&
            editedSchedule.value.teacher.id;
      }
    });

    // Lifecycle hooks
    onMounted(() => {
      loadAvailableData();
    });

    // Methods
    const loadAvailableData = async () => {
      loadingData.value = true;
      error.value = null;

      try {
        // Import services dynamically to avoid circular dependencies
        const classroomServiceModule = await import('../services/classroom.service.js');
        const courseServiceModule = await import('../services/course.service.js');
        const teacherServiceModule = await import('../../iam-user/services/teacher.service.js');

        // Create instances of the services
        const classroomService = new classroomServiceModule.ClassroomService();
        const courseService = new courseServiceModule.CourseService();
        const teacherService = new teacherServiceModule.TeacherService();

        // Load all data in parallel
        const [classrooms, courses, teachers] = await Promise.all([
          classroomService.getAll().then(res => res.data || res),
          courseService.getAll().then(res => res.data || res),
          teacherService.getTeachersSchedule()
        ]);

        availableClassrooms.value = Array.isArray(classrooms) ? classrooms : [];
        availableCourses.value = Array.isArray(courses) ? courses : [];
        availableTeachers.value = Array.isArray(teachers) ? teachers : [];
      } catch (err) {
        console.error('Error loading data:', err);
        error.value = 'Error al cargar los datos disponibles';
      } finally {
        loadingData.value = false;
      }
    };

    // Helper functions to get entity names
    const getCourseName = (courseId) => {
      const course = availableCourses.value.find(c => c.id === courseId);
      return course ? (course.name || course.courseName || course.title || `Course ${courseId}`) : `Course ${courseId}`;
    };

    const getTeacherName = (teacherId) => {
      const teacher = availableTeachers.value.find(t => t.id === teacherId);
      return teacher ? (teacher.fullName || teacher.name || `${teacher.firstName || ''} ${teacher.lastName || ''}`.trim() || `Teacher ${teacherId}`) : `Teacher ${teacherId}`;
    };

    const validateTimeRange = (start, end) => {
      const [startHour, startMinute] = start.split(':').map(Number);
      const [endHour, endMinute] = end.split(':').map(Number);
      
      const startTimeInMinutes = startHour * 60 + startMinute;
      const endTimeInMinutes = endHour * 60 + endMinute;
      
      // Verificar que la hora de inicio sea después de las 7:00 AM
      if (startTimeInMinutes < 7 * 60) {
        return false;
      }
      
      // Verificar que la hora de fin sea antes de las 9:00 PM
      if (endTimeInMinutes > 21 * 60) {
        return false;
      }
      
      // Verificar que la duración sea de al menos 30 minutos
      return endTimeInMinutes - startTimeInMinutes >= 30;
      

    };

    const handleConfirm = () => {
      if (!validateTimeRange(editedSchedule.value.timeRange.start, editedSchedule.value.timeRange.end)) {
        error.value = 'El horario debe estar entre las 7:00 AM y las 9:00 PM, con una duración mínima de 30 minutos';
        return;
      }
      
      // Convert back to backend format
      const updatedSchedule = {
        id: editedSchedule.value.id,
        dayOfWeek: editedSchedule.value.dayOfWeek,
        startTime: editedSchedule.value.timeRange.start,
        endTime: editedSchedule.value.timeRange.end,
        classroomId: editedSchedule.value.classroom.id,
        courseId: editedSchedule.value.course.id,
        teacherId: editedSchedule.value.teacher.id
      };
      
      emit('confirm', updatedSchedule);
    };

    const handleCancel = () => {
      emit('cancel');
    };

    return {
      editedSchedule,
      availableClassrooms,
      availableCourses,
      availableTeachers,
      loadingData,
      error,
      dayOptions,
      timeSlots,
      isFormValid,
      getCourseName,
      getTeacherName,
      handleConfirm,
      handleCancel
    };
  }
};
</script>

<template>
  <div class="reschedule-modal">
    <h2 class="modal-title">
      {{ scheduleData.id ? $t('teacher-schedule.modal.title') : 'Crear Nuevo Horario' }}
    </h2>
    
    <div v-if="loadingData" class="loading-indicator">
      {{ $t('teacher-schedule.loading') }}
    </div>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <form v-else @submit.prevent="handleConfirm" class="reschedule-form">
      <!-- Day Selection -->
      <div class="form-group">
        <label for="dayOfWeek">{{ $t('teacher-schedule.form.day') }}</label>
        <pv-dropdown
            v-model="editedSchedule.dayOfWeek"
            id="dayOfWeek"
            :options="dayOptions"
            option-label="label"
            option-value="value"
            placeholder="Seleccionar día"
            class="w-full"
        />
      </div>

      <!-- Time Range -->
      <div class="form-row">
        <div class="form-group">
          <label for="startTime">{{ $t('teacher-schedule.form.start-time') }}</label>
          <pv-dropdown
              v-model="editedSchedule.timeRange.start"
              id="startTime"
              :options="timeSlots"
              placeholder="Hora de inicio"
              class="w-full"
          />
        </div>

        <div class="form-group">
          <label for="endTime">{{ $t('teacher-schedule.form.end-time') }}</label>
          <pv-dropdown
              v-model="editedSchedule.timeRange.end"
              id="endTime"
              :options="timeSlots"
              placeholder="Hora de fin"
              class="w-full"
          />
        </div>
      </div>

      <!-- Classroom Selection -->
      <div class="form-group">
        <label for="classroom">{{ $t('teacher-schedule.form.classroom') }}</label>
        <pv-dropdown
            v-model="editedSchedule.classroom.id"
            id="classroom"
            :options="availableClassrooms"
            option-label="code"
            option-value="id"
            placeholder="Seleccionar aula"
            class="w-full"
        />
      </div>

      <!-- Course Selection (only for new schedules) -->
      <div v-if="!scheduleData.id" class="form-group">
        <label for="course">{{ $t('teacher-schedule.form.course') }}</label>
        <pv-dropdown
            v-model="editedSchedule.course.id"
            id="course"
            :options="availableCourses"
            option-label="name"
            option-value="id"
            placeholder="Seleccionar curso"
            class="w-full"
        />
      </div>

      <!-- Teacher Selection (only for new schedules) -->
      <div v-if="!scheduleData.id" class="form-group">
        <label for="teacher">{{ $t('teacher-schedule.form.teacher') }}</label>
        <pv-dropdown
            v-model="editedSchedule.teacher.id"
            id="teacher"
            :options="availableTeachers"
            option-label="fullName"
            option-value="id"
            placeholder="Seleccionar profesor"
            class="w-full"
        />
      </div>

      <!-- Course Info (Read-only for existing schedules) -->
      <div v-if="scheduleData.id" class="form-group">
        <label>{{ $t('teacher-schedule.form.course') }}</label>
        <div class="read-only-field">
          {{ getCourseName(scheduleData.courseId) }}
        </div>
      </div>

      <!-- Teacher Info (Read-only for existing schedules) -->
      <div v-if="scheduleData.id" class="form-group">
        <label>{{ $t('teacher-schedule.form.teacher') }}</label>
        <div class="read-only-field">
          {{ getTeacherName(scheduleData.teacherId) }}
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="form-actions">
        <pv-button
            type="button"
            :label="$t('teacher-schedule.form.cancel')"
            icon="pi pi-times"
            class="p-button-text"
            @click="handleCancel"
        />
        <pv-button
            type="submit"
            :label="scheduleData.id ? $t('teacher-schedule.form.save') : 'Crear Horario'"
            icon="pi pi-check"
            :disabled="!isFormValid"
        />
      </div>
    </form>
  </div>
</template>

<style scoped>
.reschedule-modal {
  padding: 20px;
}

.modal-title {
  text-align: center;
  font-weight: 500;
  color: #333;
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.loading-indicator {
  text-align: center;
  padding: 20px;
  color: #666;
}

.error-message {
  text-align: center;
  padding: 15px;
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  margin-bottom: 20px;
}

.reschedule-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: #333;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.w-full {
  width: 100%;
}

.read-only-field {
  padding: 8px 12px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  color: #495057;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .reschedule-modal {
    padding: 15px;
  }
}
</style> 