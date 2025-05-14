<template>
  <form @submit.prevent="onSubmit" class="enrollment-form">
    <h2>{{ editMode ? $t('enrollment.form.title-edit') : $t('enrollment.form.title-new') }}</h2>

    <!-- Estudiante -->
    <div class="form-row">
      <pv-select v-model="enrollment.studentId" :options="studentOptions" option-label="fullName"
                  :placeholder="$t('enrollment.form.student')" filter showClear required
                  :disabled="!studentOptions.length"></pv-select>
    </div>

    <!-- Periodo Académico -->
    <div class="form-row">
      <pv-select v-model="enrollment.periodId" :options="periodOptions" option-label="name"
                  :placeholder="$t('enrollment.form.period')" required :disabled="!periodOptions.length"></pv-select>
    </div>

    <!-- Fecha de matrícula -->
    <div class="form-row">
      <pv-date-picker v-model="enrollment.createdAt" :showTime="false" dateFormat="yy-mm-dd"
                  :placeholder="$t('enrollment.form.date')" required></pv-date-picker>
    </div>

    <!-- Monto -->
    <div class="form-row">
      <pv-input-number v-model="enrollment.amount" :placeholder="$t('enrollment.form.amount')"
                     required mode="decimal" min="0"></pv-input-number>
    </div>

    <!-- Estado de Matrícula -->
    <div class="form-row">
      <pv-select v-model="enrollment.enrollmentStatus" :options="enrollmentStatusOptions"
                  option-label="viewValue" :placeholder="$t('enrollment.form.status')" required></pv-select >
    </div>

    <!-- Estado de Pago -->
    <div class="form-row">
      <pv-select  v-model="enrollment.paymentStatus" :options="paymentStatusOptions"
                  option-label="viewValue" :placeholder="$t('enrollment.form.payment-status')" required></pv-select >
    </div>

    <div class="form-actions">
      <pv-button type="submit" :disabled="!isValid" label="Save" :label="$t(editMode ? 'enrollment.form.update' : 'enrollment.form.save')" />
      <pv-button type="button" class="p-button-secondary" @click="onCancel" label="$t('enrollment.form.cancel')" />
    </div>
  </form>
</template>

<script>

export default {
  name: 'EnrollmentsCreateForm',
  components: {},
  props: {
    enrollment: {
      type: Object,
      default: () => ({
        studentId: null,
        periodId: null,
        createdAt: '',
        amount: 0,
        enrollmentStatus: 'ACTIVE',
        paymentStatus: 'PENDING'
      })
    },
    editMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      studentOptions: [],
      periodOptions: [],
      enrollmentStatusOptions: [
        { value: 'ACTIVE', viewValue: 'Activo' },
        { value: 'CANCELLED', viewValue: 'Cancelado' },
        { value: 'COMPLETED', viewValue: 'Completado' },
        { value: 'DELETED', viewValue: 'Eliminado' }
      ],
      paymentStatusOptions: [
        { value: 'PENDING', viewValue: 'Pendiente' },
        { value: 'PAID', viewValue: 'Pagado' },
        { value: 'REFUNDED', viewValue: 'Reembolsado' },
        { value: 'PARTIAL', viewValue: 'Parcial' }
      ],
      form: {
        studentId: null,
        periodId: null,
        createdAt: '',
        amount: 0,
        enrollmentStatus: 'ACTIVE',
        paymentStatus: 'PENDING'
      }
    }
  },
  computed: {
    isValid() {
      return this.form.studentId && this.form.periodId && this.form.createdAt && this.form.amount
    }
  },
  watch: {
    enrollment: {
      handler(newVal) {
        this.form = { ...newVal }
      },
      immediate: true
    }
  },
  methods: {
    onSubmit() {
      if (this.isValid) {
        const enrollmentToEmit = { ...this.form, createdAt: new Date(this.form.createdAt) }
        const eventName = this.editMode ? 'enrollmentUpdateRequested' : 'enrollmentAddRequested'
        this.$emit(eventName, enrollmentToEmit)
        this.resetForm()
      } else {
        console.error('Formulario inválido. Por favor, verifica los campos.')
      }
    },
    onCancel() {
      this.$emit('cancelRequested')
      this.resetForm()
    },
    resetForm() {
      this.form = {
        studentId: null,
        periodId: null,
        createdAt: '',
        amount: 0,
        enrollmentStatus: 'ACTIVE',
        paymentStatus: 'PENDING'
      }
    },
    loadStudents() {
      // Llamada al servicio para cargar los estudiantes
      this.studentOptions = [
        { id: 1, fullName: 'Juan Pérez' },
        { id: 2, fullName: 'Ana Gómez' }
      ]
    },
    loadPeriods() {
      // Llamada al servicio para cargar los períodos académicos
      this.periodOptions = [
        { id: 1, name: '2023-2024' },
        { id: 2, name: '2024-2025' }
      ]
    }
  },
  mounted() {
    this.loadStudents()
    this.loadPeriods()
  }
}
</script>

<style scoped>
.enrollment-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 1200px;
  width: 95%;
  margin: 1.5rem auto;
  padding: 2rem 1.5rem;
  background-color: #fff;
  border-radius: 0.75rem;
}

.enrollment-form h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 500;
  color: #333;
}

.form-row {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 0.75rem;
}

.form-field {
  width: 100%;
  max-width: 600px;
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1.5rem;
}

.form-actions button {
  width: 100%;
  max-width: 600px;
  padding: 0.75rem 0;
  font-weight: 500;
}

.form-actions button[color="primary"] {
  border-radius: 4px;
}

@media (min-width: 768px) {
  .enrollment-form {
    padding: 2.5rem;
  }

  .enrollment-form {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .enrollment-form h2 {
    grid-column: 1 / -1;
    font-size: 1.75rem;
  }

  @media (min-width: 992px) {
    .enrollment-form {
      grid-template-columns: 1fr 1fr;
      column-gap: 2rem;
    }

    .form-row:nth-child(2), /* Estudiante */
    .form-row:nth-child(3), /* Periodo Académico */
    .form-actions {
      grid-column: 1 / -1;
    }

    .form-actions {
      flex-direction: row;
      justify-content: center;
      gap: 1.5rem;
    }

    .form-actions button {
      width: auto;
      min-width: 200px;
      padding: 0.75rem 2rem;
    }
  }
}
</style>
