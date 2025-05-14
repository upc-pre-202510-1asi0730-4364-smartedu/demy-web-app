<script>
import { defineComponent } from 'vue';
import { Student, Sex } from "../model/student.entity.js";
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'StudentForm',
  props: {
    modelValue: {
      type: Object,
      required: true
    },
    editMode: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'add-student', 'update-student', 'cancel'],
  setup(_, { emit }) {
    const { t } = useI18n();
    return { t };
  },
  data() {
    return {
      localStudent: new Student(this.modelValue),
      sexOptions: [
        { value: Sex.MALE, label: this.$t('student.form.sex-male') },
        { value: Sex.FEMALE, label: this.$t('student.form.sex-female') }
      ]
    };
  },
  watch: {
    modelValue: {
      handler(newVal) {
        this.localStudent = new Student(newVal);
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    isValid() {
      return this.$refs.form.checkValidity();
    },
    submit() {
      if (this.isValid()) {
        const event = this.editMode ? 'update-student' : 'add-student';
        this.$emit(event, new Student(this.localStudent));
        this.reset();
      }
    },
    cancel() {
      this.$emit('cancel');
      this.reset();
    },
    reset() {
      this.localStudent = new Student();
      this.$refs.form.reset();
    }
  }
});
</script>

<template>
  <form ref="form" class="student-form" @submit.prevent="submit">
    <h2>{{ t(editMode ? 'student.form.title-edit' : 'student.form.title-new') }}</h2>

    <!-- DNI -->
    <div class="form-row">
      <pv-input-text
          v-model="localStudent.dni"
          :placeholder="t('student.form.dni')"
          :maxlength="8"
          pattern="[0-9]{8}"
          required
          class="form-field"
      />
    </div>

    <!-- First Name -->
    <div class="form-row">
      <pv-input-text
          v-model="localStudent.firstName"
          :placeholder="t('student.form.first-name')"
          required
          class="form-field"
      />
    </div>

    <!-- Last Name -->
    <div class="form-row">
      <pv-input-text
          v-model="localStudent.lastName"
          :placeholder="t('student.form.last-name')"
          required
          class="form-field"
      />
    </div>

    <!-- Sex -->
    <div class="form-row">
      <pv-dropdown
          v-model="localStudent.sex"
          :options="sexOptions"
          optionValue="value"
          optionLabel="label"
          class="form-field"
      />
    </div>

    <!-- Birth Date -->
    <div class="form-row">
      <pv-input-text
          v-model="localStudent.birthDate"
          type="date"
          :placeholder="t('student.form.birth-date')"
          required
          class="form-field"
      />
    </div>

    <!-- Address -->
    <div class="form-row">
      <pv-input-text
          v-model="localStudent.address"
          :placeholder="t('student.form.address')"
          required
          class="form-field"
      />
    </div>

    <!-- Phone Number -->
    <div class="form-row">
      <pv-input-text
          v-model="localStudent.phoneNumber"
          :placeholder="t('student.form.phone')"
          pattern="[0-9]{9}"
          required
          class="form-field"
      />
    </div>

    <!-- Buttons -->
    <div class="form-actions">
      <pv-button type="submit" :label="t(editMode ? 'student.form.update' : 'student.form.save')" severity="primary" />
      <pv-button type="button" :label="t('student.form.cancel')" severity="secondary" @click="cancel" />
    </div>
  </form>
</template>

<style scoped>
.student-form {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  max-width: 1200px;
  width: 95%;
  margin: 1.5rem auto;
  padding: 2rem 1.5rem;
  background-color: #fff;
  border-radius: 0.75rem;
}

.student-form h2 {
  grid-column: 1 / -1;
  text-align: center;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 500;
  color: #333;
}

/* Cada fila ocupa 100% en móviles */
.form-row {
  width: 100%;
}

.form-row .p-float-label {
  width: 100%;
  display: block;
}

.form-row :deep(.pv-input-text),
.form-row :deep(.pv-calendar),
.form-row :deep(.pv-dropdown) {
  width: 100%;
}

/* Botones de acción */
.form-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1.5rem;
  grid-column: 1 / -1;
}

.form-actions :deep(button) {
  width: 100%;
  max-width: 600px;
  padding: 0.75rem 0;
  font-weight: 500;
}

.p-error {
  color: #f44336;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: block;
}

/* Estilos responsive */
@media (min-width: 768px) {
  .student-form {
    grid-template-columns: repeat(2, 1fr);
    column-gap: 2rem;
    row-gap: 1.25rem;
  }

  .student-form h2 {
    font-size: 1.75rem;
  }

  /* Campos que ocupan ambas columnas */
  .form-row.full-width {
    grid-column: 1 / -1;
  }

  /* Botones horizontalmente en pantallas grandes */
  .form-actions {
    flex-direction: row;
    justify-content: center;
    gap: 1.5rem;
  }

  .form-actions :deep(button) {
    width: auto;
    min-width: 200px;
    padding: 0.75rem 2rem;
  }
}

/* Validación visual */
.form-row :deep(.p-invalid) {
  border-color: #f44336;
}

/* Hover animaciones */
.form-actions :deep(button) {
  transition: transform 0.2s, box-shadow 0.2s;
}
.form-actions :deep(button:hover:not(:disabled)) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>