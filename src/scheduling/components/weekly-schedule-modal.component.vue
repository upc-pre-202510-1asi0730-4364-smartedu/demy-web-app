<script>
import { ref, computed, reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { ScheduleWeekly } from '../model/weekly-schedule.entity';
import { Schedule } from '../model/schedule.entity';
import { CourseService } from '../services/course.service';
import { ClassroomService } from '../services/classroom.service';
import { TeacherService } from '../../iam-user/services/teacher.service.js';

export default {
  name: 'weekly-schedule-modal',
  props: {
    mode: {
      type: String,
      required: true,
      validator: (value) => ['add', 'edit', 'delete'].includes(value)
    },
    weeklyScheduleData: {
      type: Object,
      default: () => ({}),
    }
  },
  setup(props, { emit }) {
    const { t } = useI18n();
    const weeklySchedule = reactive(new ScheduleWeekly(props.weeklyScheduleData));
    const currentSchedule = reactive(new Schedule({
      course: { id: null },
      teacher: { id: null },
      classroom: { id: null },
      timeRange: { start: '', end: '' },
      dayOfWeek: ''
    }));

    const availableCourses = ref([]);
    const availableClassrooms = ref([]);
    const availableTeachers = ref([]);
    const loadingData = ref(false);
    const nameError = ref(false);
    const error = ref('');

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

    const dialogTitle = computed(() => {
      if (props.mode === 'add') return t('weekly-schedule.modal.title');
      if (props.mode === 'edit') return t('weekly-schedule.modal.title');
      return t('weekly-schedule.modal.confirmDelete');
    });

    const isScheduleValid = computed(() => {
      return currentSchedule.dayOfWeek &&
          currentSchedule.timeRange.start &&
          currentSchedule.timeRange.end &&
          currentSchedule.course.id &&
          currentSchedule.teacher.id &&
          currentSchedule.classroom.id;
    });

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
      if (endTimeInMinutes - startTimeInMinutes < 30) {
        return false;
      }
      
      return true;
    };

    // Load data when the component is mounted
    onMounted(() => {
      loadData();
    });

    // Function to load courses, classrooms, and teachers
    const loadData = async () => {
      loadingData.value = true;
      try {
        await Promise.all([loadAvailableCourses(), loadAvailableClassrooms(), loadAvailableTeachers()]);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        loadingData.value = false;
      }
    };

    // Load available courses
    const loadAvailableCourses = async () => {
      try {
        // Intentar primero como singleton, luego como clase
        let courses;
        if (typeof CourseService.getAll === 'function') {
          courses = await CourseService.getAll();
        } else {
          const courseService = new CourseService();
          courses = await courseService.getAll();
        }

        console.log('Loaded courses:', courses);
        console.log('Courses type:', typeof courses, 'Is array:', Array.isArray(courses));

        // Verificar si es un array directamente o está en data
        if (Array.isArray(courses)) {
          availableCourses.value = courses;
        } else if (courses && Array.isArray(courses.data)) {
          availableCourses.value = courses.data;
        } else {
          console.warn('Courses response structure:', courses);
          availableCourses.value = [];
        }
      } catch (error) {
        console.error('Failed to load courses:', error);
        availableCourses.value = [];
      }
    };

    // Load available classrooms
    const loadAvailableClassrooms = async () => {
      try {
        // Intentar primero como singleton, luego como clase
        let classrooms;
        if (typeof ClassroomService.getAll === 'function') {
          classrooms = await ClassroomService.getAll();
        } else {
          const classroomService = new ClassroomService();
          classrooms = await classroomService.getAll();
        }

        console.log('Loaded classrooms:', classrooms);
        console.log('Classrooms type:', typeof classrooms, 'Is array:', Array.isArray(classrooms));

        // Verificar si es un array directamente o está en data
        if (Array.isArray(classrooms)) {
          availableClassrooms.value = classrooms;
        } else if (classrooms && Array.isArray(classrooms.data)) {
          availableClassrooms.value = classrooms.data;
        } else {
          console.warn('Classrooms response structure:', classrooms);
          availableClassrooms.value = [];
        }
      } catch (error) {
        console.error('Failed to load classrooms:', error);
        availableClassrooms.value = [];
      }
    };

    // Load available teachers
    const loadAvailableTeachers = async () => {
      try {
        // Intentar primero como singleton, luego como clase
        let teachers;
        if (typeof TeacherService.getTeachers === 'function') {
          teachers = await TeacherService.getTeachers();
        } else {
          const teacherService = new TeacherService();
          teachers = await teacherService.getTeachers();
        }

        console.log('Loaded teachers:', teachers);
        console.log('Teachers type:', typeof teachers, 'Is array:', Array.isArray(teachers));

        // Verificar si es un array directamente o está en data
        if (Array.isArray(teachers)) {
          availableTeachers.value = teachers;
        } else if (teachers && Array.isArray(teachers.data)) {
          availableTeachers.value = teachers.data;
        } else {
          console.warn('Teachers response structure:', teachers);
          availableTeachers.value = [];
        }
      } catch (error) {
        console.error('Failed to load teachers:', error);
        availableTeachers.value = [];
      }
    };

    // Add a new schedule
    const addSchedule = () => {
      if (isScheduleValid.value) {
        if (!validateTimeRange(currentSchedule.timeRange.start, currentSchedule.timeRange.end)) {
          error.value = 'El horario debe estar entre las 7:00 AM y las 9:00 PM, con una duración mínima de 30 minutos';
          return;
        }

        const course = availableCourses.value.find(c => c.id === currentSchedule.course.id);
        const classroom = availableClassrooms.value.find(c => c.id === currentSchedule.classroom.id);
        const teacher = availableTeachers.value.find(t => t.id === currentSchedule.teacher.id);

        if (course && classroom && teacher) {
          const scheduleToAdd = new Schedule({
            id: Date.now(),
            dayOfWeek: currentSchedule.dayOfWeek,
            timeRange: {
              start: currentSchedule.timeRange.start,
              end: currentSchedule.timeRange.end
            },
            course: {
              id: course.id,
              name: course.name || course.courseName || course.title || 'Unknown Course',
              code: course.code || course.courseCode || 'N/A'
            },
            classroom: {
              id: classroom.id,
              code: classroom.code || classroom.name || classroom.roomCode || classroom.number || 'Unknown Room',
              capacity: classroom.capacity || 0,
              campus: classroom.campus || classroom.location || 'Unknown Campus'
            },
            teacher: {
              id: teacher.id,
              fullName: teacher.fullName || teacher.name || `${teacher.firstName || ''} ${teacher.lastName || ''}`.trim() || 'Unknown Teacher'
            }
          });

          weeklySchedule.weekSchedule.push(scheduleToAdd);

          // Reset current schedule
          Object.assign(currentSchedule, {
            dayOfWeek: '',
            timeRange: { start: '', end: '' },
            course: { id: null },
            teacher: { id: null },
            classroom: { id: null }
          });
        } else {
          console.error('Could not find all required entities:', {
            course: course || 'NOT FOUND',
            classroom: classroom || 'NOT FOUND',
            teacher: teacher || 'NOT FOUND'
          });
        }
      }
    };

    // Remove a schedule
    const removeSchedule = (index) => {
      weeklySchedule.weekSchedule.splice(index, 1);
    };

    // Submit form
    const onSubmit = () => {
      nameError.value = !weeklySchedule.name?.trim();

      if (!nameError.value && weeklySchedule.weekSchedule.length > 0) {
        emit('confirm', weeklySchedule);
      }
    };

    // Cancel the modal
    const onCancel = () => {
      emit('cancel');
    };

    // Confirm deletion
    const onConfirmDelete = () => {
      emit('delete');
    };

    return {
      weeklySchedule,
      currentSchedule,
      availableCourses,
      availableClassrooms,
      availableTeachers,
      dayOptions,
      dialogTitle,
      isScheduleValid,
      loadingData,
      nameError,
      error,
      timeSlots,
      addSchedule,
      removeSchedule,
      onSubmit,
      onCancel,
      onConfirmDelete
    };
  }
};
</script>

<template>
  <div class="weekly-schedule-modal">
    <h2 class="dialog-title">{{ dialogTitle }}</h2>

    <div class="dialog-content">
      <!-- Form for add/edit -->
      <template v-if="mode === 'add' || mode === 'edit'">
        <form class="form-row" @submit.prevent="onSubmit">
          <!-- Name of the weekly schedule -->
          <div class="form-group">
            <label for="name">{{ $t('weekly-schedule.modal.name') }}</label>
            <pv-input-text
                v-model="weeklySchedule.name"
                id="name"
                class="w-full"
                placeholder="Enter weekly schedule name"
                :class="{ 'p-invalid': nameError }"
            />
            <small v-if="nameError" class="p-error">
              {{ $t('weekly-schedule.modal.nameRequired') }}
            </small>
          </div>

          <!-- Section for adding schedules -->
          <div class="schedule-section">
            <h3>{{ $t('weekly-schedule.modal.addSchedule') }}</h3>

            <div v-if="loadingData" class="loading-indicator">
              {{ $t('weekly-schedule.modal.loadingData') }}
            </div>

            <div v-else>
              <!-- Day of Week -->
              <div class="form-group">
                <label for="dayOfWeek">{{ $t('weekly-schedule.modal.day') }}</label>
                <pv-dropdown
                    v-model="currentSchedule.dayOfWeek"
                    id="dayOfWeek"
                    :options="dayOptions"
                    option-label="label"
                    option-value="value"
                    placeholder="Select Day"
                    class="w-full"
                    :show-clear="true"
                />
              </div>

              <!-- Time Range -->
              <div class="form-row-inline">
                <!-- Time Range - Start -->
                <div class="form-group w-half">
                  <label for="startTime">{{ $t('weekly-schedule.modal.startTime') }}</label>
                  <pv-dropdown
                      v-model="currentSchedule.timeRange.start"
                      id="startTime"
                      :options="timeSlots"
                      placeholder="Start time"
                      class="w-full"
                  />
                </div>

                <!-- Time Range - End -->
                <div class="form-group w-half">
                  <label for="endTime">{{ $t('weekly-schedule.modal.endTime') }}</label>
                  <pv-dropdown
                      v-model="currentSchedule.timeRange.end"
                      id="endTime"
                      :options="timeSlots"
                      placeholder="End time"
                      class="w-full"
                  />
                </div>
              </div>

              <!-- Course Selection -->
              <div class="form-group">
                <label for="course">{{ $t('weekly-schedule.modal.course') }}</label>
                <pv-dropdown
                    v-model="currentSchedule.course.id"
                    id="course"
                    :options="availableCourses"
                    :option-label="(option) => option.name || option.courseName || option.title || `Course ${option.id}`"
                    option-value="id"
                    placeholder="Select Course"
                    class="w-full"
                    :show-clear="true"
                />
              </div>

              <!-- Teacher Selection -->
              <div class="form-group">
                <label for="teacher">{{ $t('weekly-schedule.modal.teacher') }}</label>
                <pv-dropdown
                    v-model="currentSchedule.teacher.id"
                    id="teacher"
                    :options="availableTeachers"
                    :option-label="(option) => option.fullName || option.name || `${option.firstName || ''} ${option.lastName || ''}`.trim() || `Teacher ${option.id}`"
                    option-value="id"
                    placeholder="Select Teacher"
                    class="w-full"
                    :show-clear="true"
                />
              </div>

              <!-- Classroom Selection -->
              <div class="form-group">
                <label for="classroom">{{ $t('weekly-schedule.modal.classroom') }}</label>
                <pv-dropdown
                    v-model="currentSchedule.classroom.id"
                    id="classroom"
                    :options="availableClassrooms"
                    :option-label="(option) => option.code || option.name || option.roomCode || option.number || `Room ${option.id}`"
                    option-value="id"
                    placeholder="Select Classroom"
                    class="w-full"
                    :show-clear="true"
                />
              </div>

              <pv-button
                  :label="$t('weekly-schedule.modal.addClass')"
                  icon="pi pi-plus"
                  @click="addSchedule"
                  :disabled="!isScheduleValid"
                  class="mt-3"
              />
            </div>
          </div>

          <!-- Display created schedules -->
          <div v-if="weeklySchedule.weekSchedule.length > 0" class="schedules-list">
            <h3>{{ $t('weekly-schedule.modal.scheduleList') }}</h3>
            <div
                v-for="(schedule, index) in weeklySchedule.weekSchedule"
                :key="index"
                class="schedule-item"
            >
              <div>
                <strong>{{ schedule.dayOfWeek }}</strong>: {{ schedule.timeRange.start }} - {{ schedule.timeRange.end }}
                <br>
                Course: {{ schedule.course.name }} ({{ schedule.course.code }})
                <br>
                Classroom: {{ schedule.classroom.code }} ({{ schedule.classroom.campus }})
                <br>
                Teacher: {{ schedule.teacher.fullName }}
              </div>
              <pv-button
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-danger p-button-text"
                  @click="removeSchedule(index)"
                  :aria-label="$t('weekly-schedule.modal.deleteClass')"
              />
            </div>
          </div>
        </form>
      </template>

      <!-- Confirmation for delete -->
      <template v-if="mode === 'delete'">
        <div class="confirm-delete">
          <i class="pi pi-exclamation-triangle" style="font-size: 2rem; color: var(--color-error)"></i>
          <p class="warning-text">{{ $t('weekly-schedule.modal.confirmDeleteWarning') }}</p>
        </div>
      </template>
    </div>

    <div class="dialog-actions">
      <pv-button
          :label="$t('weekly-schedule.modal.cancel')"
          icon="pi pi-times"
          class="p-button-text"
          @click="onCancel"
      />

      <template v-if="mode === 'add' || mode === 'edit'">
        <pv-button
            :label="$t('weekly-schedule.modal.save')"
            icon="pi pi-check"
            class="p-button-success"
            @click="onSubmit"
            :disabled="weeklySchedule.weekSchedule.length === 0"
        />
      </template>

      <template v-if="mode === 'delete'">
        <pv-button
            :label="$t('weekly-schedule.modal.delete')"
            icon="pi pi-trash"
            class="p-button-danger"
            @click="onConfirmDelete"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
.form-row {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-row-inline {
  display: flex;
  gap: 15px;
  width: 100%;
}

.w-half {
  width: 50%;
}

.form-group {
  width: 100%;
  margin-top: 10px;
}

.dialog-content {
  min-width: 350px;
  padding: 0 20px;
}

.dialog-title {
  text-align: center;
  font-weight: 500;
  color: #333;
  margin-bottom: 20px;
}

.warning-text {
  color: var(--color-error);
  font-weight: 500;
}

.error-message {
  color: var(--color-error);
  font-size: 12px;
  margin-top: 4px;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  width: 100%;
  padding-top: 20px;
}

.schedule-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.schedule-section {
  border: 1px solid #ddd;
  padding: 15px;
  margin-top: 15px;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.schedules-list {
  margin-top: 20px;
}

.confirm-delete {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px;
}

.loading-indicator {
  text-align: center;
  padding: 20px;
  font-style: italic;
  color: #666;
}

.w-full {
  width: 100%;
}

.mt-3 {
  margin-top: 1rem;
}

.p-error {
  color: #e24c4c;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>