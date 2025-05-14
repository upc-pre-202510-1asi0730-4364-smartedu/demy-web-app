<template>
  <form class="student-form" @submit.prevent="onSubmit" ref="studentForm">
    <h2>{{ editMode ? $t('student.form.title-edit') : $t('student.form.title-new') }}</h2>

    <!-- DNI -->
    <div class="form-row">
      <span class="p-float-label">
        <pv-input-text
            id="dni"
            v-model="formData.dni"
            :class="{ 'p-invalid': errors.dni }"
            maxlength="8"
            required />
        <label for="dni">{{ $t('student.form.dni') }}</label>
      </span>
      <small v-if="errors.dni" class="p-error">{{ $t('student.form.dni-error') }}</small>
    </div>

    <!-- First Name -->
    <div class="form-row">
      <span class="p-float-label">
        <pv-input-text
            id="firstName"
            v-model="formData.firstName"
            :class="{ 'p-invalid': errors.firstName }"
            required />
        <label for="firstName">{{ $t('student.form.first-name') }}</label>
      </span>
      <small v-if="errors.firstName" class="p-error">{{ $t('student.form.first-name-required') }}</small>
    </div>

    <!-- Last Name -->
    <div class="form-row">
      <span class="p-float-label">
        <pv-input-text
            id="lastName"
            v-model="formData.lastName"
            :class="{ 'p-invalid': errors.lastName }"
            required />
        <label for="lastName">{{ $t('student.form.last-name') }}</label>
      </span>
      <small v-if="errors.lastName" class="p-error">{{ $t('student.form.last-name-required') }}</small>
    </div>

    <!-- Sex -->
    <div class="form-row">
      <span class="p-float-label">
        <Dropdown
            id="sex"
            v-model="formData.sex"
            :options="sexOptions"
            optionLabel="viewValue"
            optionValue="value"
            :class="{ 'p-invalid': errors.sex }"
            required />
        <label for="sex">{{ $t('student.form.sex') }}</label>
      </span>
      <small v-if="errors.sex" class="p-error">{{ $t('student.form.sex-required') }}</small>
    </div>

    <!-- Birth Date -->
    <div class="form-row">
      <span class="p-float-label">
        <Calendar
            id="birthDate"
            v-model="formData.birthDate"
            dateFormat="yy-mm-dd"
            :class="{ 'p-invalid': errors.birthDate }"
            required />
        <label for="birthDate">{{ $t('student.form.birth-date') }}</label>
      </span>
      <small v-if="errors.birthDate" class="p-error">{{ $t('student.form.birth-date-required') }}</small>
    </div>

    <!-- Address -->
    <div class="form-row">
      <span class="p-float-label">
        <InputText
            id="address"
            v-model="formData.address"
            :class="{ 'p-invalid': errors.address }"
            required />
        <label for="address">{{ $t('student.form.address') }}</label>
      </span>
      <small v-if="errors.address" class="p-error">{{ $t('student.form.address-required') }}</small>
    </div>

    <!-- Phone -->
    <div class="form-row">
      <span class="p-float-label">
        <InputText
            id="phoneNumber"
            v-model="formData.phoneNumber"
            :class="{ 'p-invalid': errors.phoneNumber }"
            maxlength="9"
            required />
        <label for="phoneNumber">{{ $t('student.form.phone') }}</label>
      </span>
      <small v-if="errors.phoneNumber" class="p-error">{{ $t('student.form.phone-error') }}</small>
    </div>

    <!-- Actions -->
    <div class="form-actions">
      <Button
          type="submit"
          :label="editMode ? $t('student.form.update') : $t('student.form.save')"
          class="p-button-primary" />
      <Button
          type="button"
          :label="$t('student.form.cancel')"
          class="p-button-outlined p-button-secondary"
          @click="onCancel" />
    </div>
  </form>
</template>

<script>
import { InputText as PvInputText } from "primevue";

export default {
  name: 'StudentCreateAndEditForm',
  components: { PvInputText },
  props: {
    studentData: Object,
    editMode: Boolean
  },
  emits: ['student-add-requested', 'student-update-requested', 'cancel-requested'],
  data() {
    return {
      formData: {
        dni: '',
        firstName: '',
        lastName: '',
        sex: '',
        birthDate: null,
        address: '',
        phoneNumber: ''
      },
      errors: {},
      sexOptions: [
        { value: 'MALE', viewValue: 'Masculino' },
        { value: 'FEMALE', viewValue: 'Femenino' }
      ]
    };
  },
  watch: {
    studentData: {
      handler(newStudent) {
        if (newStudent) {
          this.formData = {
            dni: newStudent.dni || '',
            firstName: newStudent.firstName || '',
            lastName: newStudent.lastName || '',
            sex: newStudent.sex || '',
            birthDate: newStudent.birthDate ? new Date(newStudent.birthDate) : null,
            address: newStudent.address || '',
            phoneNumber: newStudent.phoneNumber || ''
          };
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    validateForm() {
      this.errors = {};

      if (!/^\d{8}$/.test(this.formData.dni)) {
        this.errors.dni = true;
      }
      if (!this.formData.firstName) {
        this.errors.firstName = true;
      }
      if (!this.formData.lastName) {
        this.errors.lastName = true;
      }
      if (!this.formData.sex) {
        this.errors.sex = true;
      }
      if (!this.formData.birthDate) {
        this.errors.birthDate = true;
      }
      if (!this.formData.address) {
        this.errors.address = true;
      }
      if (!/^\d{9}$/.test(this.formData.phoneNumber)) {
        this.errors.phoneNumber = true;
      }

      return Object.keys(this.errors).length === 0;
    },
    async onSubmit() {
      if (this.validateForm()) {
        const studentData = { ...this.formData };
        if (studentData.birthDate instanceof Date) {
          studentData.birthDate = studentData.birthDate.toISOString().split('T')[0];
        }

        if (this.editMode) {
          this.$emit('student-update-requested', studentData);
        } else {
          this.$emit('student-add-requested', studentData);
        }

        this.resetEditState();
      } else {
        console.error('Formulario inválido.');
      }
    },
    resetEditState() {
      this.formData = {
        dni: '',
        firstName: '',
        lastName: '',
        sex: '',
        birthDate: null,
        address: '',
        phoneNumber: ''
      };
      this.errors = {};
    },
    onCancel() {
      this.$emit('cancel-requested');
      this.resetEditState();
    }
  }
};
</script>

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