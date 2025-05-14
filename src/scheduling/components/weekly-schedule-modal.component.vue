<script>
import { ref, computed, reactive, onMounted } from 'vue';
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

    const dayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const dialogTitle = computed(() => {
      if (props.mode === 'add') return 'Add New Weekly Schedule';
      if (props.mode === 'edit') return 'Edit Weekly Schedule';
      return 'Confirm Deletion';
    });

    const isScheduleValid = computed(() => {
      return currentSchedule.dayOfWeek &&
          currentSchedule.timeRange.start &&
          currentSchedule.timeRange.end &&
          currentSchedule.course.id &&
          currentSchedule.teacher.id &&
          currentSchedule.classroom.id;
    });

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
        const courses = await CourseService.getAll();
        console.log('Loaded courses:', courses); // Debug: check if courses are loaded
        availableCourses.value = courses;
      } catch (error) {
        console.error('Failed to load courses:', error);
      }
    };

    // Load available classrooms
    const loadAvailableClassrooms = async () => {
      try {
        const classrooms = await ClassroomService.getAll();
        console.log('Loaded classrooms:', classrooms); // Debug: check if classrooms are loaded
        availableClassrooms.value = classrooms;
      } catch (error) {
        console.error('Failed to load classrooms:', error);
      }
    };

    // Load available teachers
    const loadAvailableTeachers = async () => {
      try {
        const teachers = await TeacherService.getTeachers();
        console.log('Loaded teachers:', teachers); // Debug: check if teachers are loaded
        availableTeachers.value = teachers;
      } catch (error) {
        console.error('Failed to load teachers:', error);
      }
    };

    // Add a new schedule
    const addSchedule = () => {
      if (isScheduleValid.value) {
        const course = availableCourses.value.find(c => c.id === currentSchedule.course.id);
        const classroom = availableClassrooms.value.find(c => c.id === currentSchedule.classroom.id);
        const teacher = availableTeachers.value.find(t => t.id === currentSchedule.teacher.id);

        if (course && classroom && teacher) {
          const scheduleToAdd = new Schedule({
            id: Date.now(),
            dayOfWeek: currentSchedule.dayOfWeek,
            timeRange: { ...currentSchedule.timeRange },
            course,
            classroom,
            teacher
          });

          weeklySchedule.weekSchedule.push(scheduleToAdd);
          Object.assign(currentSchedule, new Schedule());  // Reset current schedule
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
            <label for="name">Name</label>
            <pv-input-text
                v-model="weeklySchedule.name"
                id="name"
                class="w-full"
                placeholder="Enter weekly schedule name"
                :class="{ 'p-invalid': nameError }"
            />
            <small v-if="nameError" class="p-error">
              Name is required
            </small>
          </div>

          <!-- Section for adding schedules -->
          <div class="schedule-section">
            <h3>Add Schedule</h3>

            <div v-if="loadingData" class="loading-indicator">
              Loading data...
            </div>

            <div v-else>
              <!-- Day of Week -->
              <div class="form-group">
                <label for="dayOfWeek">Day of Week</label>
                <select
                    v-model="currentSchedule.dayOfWeek"
                    id="dayOfWeek"
                    class="form-control"
                >
                  <option value="" disabled selected>Select Day</option>
                  <option v-for="day in dayOptions" :key="day" :value="day">
                    {{ day }}
                  </option>
                </select>
              </div>

              <!-- Time Range -->
              <div class="form-row-inline">
                <!-- Time Range - Start -->
                <div class="form-group w-half">
                  <label for="startTime">Start Time</label>
                  <input
                      v-model="currentSchedule.timeRange.start"
                      id="startTime"
                      type="time"
                      class="form-control"
                  />
                </div>

                <!-- Time Range - End -->
                <div class="form-group w-half">
                  <label for="endTime">End Time</label>
                  <input
                      v-model="currentSchedule.timeRange.end"
                      id="endTime"
                      type="time"
                      class="form-control"
                  />
                </div>
              </div>

              <!-- Course Selection -->
              <div class="form-group">
                <label for="course">Course</label>
                <pv-dropdown
                    v-model="currentSchedule.course.id"
                    id="course"
                    :options="availableCourses"
                    option-label="name"
                    option-value="id"
                    placeholder="Select Course"
                />
              </div>

              <!-- Teacher Selection -->
              <div class="form-group">
                <label for="teacher">Teacher</label>
                <pv-dropdown
                    v-model="currentSchedule.teacher.id"
                    id="teacher"
                    :options="availableTeachers"
                    option-label="fullName"
                    option-value="id"
                    placeholder="Select Teacher"
                />
              </div>

              <!-- Classroom Selection -->
              <div class="form-group">
                <label for="classroom">Classroom</label>
                <pv-dropdown
                    v-model="currentSchedule.classroom.id"
                    id="classroom"
                    :options="availableClassrooms"
                    option-label="code"
                    option-value="id"
                    placeholder="Select Classroom"
                />
              </div>

              <pv-button
                  label="Add Schedule"
                  icon="pi pi-plus"
                  @click="addSchedule"
                  :disabled="!isScheduleValid"
                  class="mt-3"
              />
            </div>
          </div>

          <!-- Display created schedules -->
          <div v-if="weeklySchedule.weekSchedule.length > 0" class="schedules-list">
            <h3>Current Schedules</h3>
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
              />
            </div>
          </div>
        </form>
      </template>

      <!-- Confirmation for delete -->
      <template v-if="mode === 'delete'">
        <div class="confirm-delete">
          <i class="pi pi-exclamation-triangle" style="font-size: 2rem; color: var(--color-error)"></i>
          <p>Are you sure you want to delete this weekly schedule "{{ weeklySchedule.name }}"?</p>
          <p class="warning-text">This action cannot be undone.</p>
        </div>
      </template>
    </div>

    <div class="dialog-actions">
      <pv-button
          label="Cancel"
          icon="pi pi-times"
          class="p-button-text"
          @click="onCancel"
      />

      <template v-if="mode === 'add' || mode === 'edit'">
        <pv-button
            label="Save"
            icon="pi pi-check"
            class="p-button-success"
            @click="onSubmit"
            :disabled="weeklySchedule.weekSchedule.length === 0"
        />
      </template>

      <template v-if="mode === 'delete'">
        <pv-button
            label="Delete"
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

.form-control {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
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
</style>