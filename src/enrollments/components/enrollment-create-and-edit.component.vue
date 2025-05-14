<script>
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { Enrollment, EnrollmentStatus, PaymentStatus } from "../model/enrollment.entity.js";
import { StudentService } from "../services/student.service.js";
import { AcademicPeriodService } from "../services/academic-period.service.js";

export default defineComponent({
  name: 'enrollment-create-and-edit',
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
  emits: ['update:modelValue', 'add-enrollment', 'update-enrollment', 'cancel'],
  setup(_, { emit }) {
    const { t } = useI18n();
    return { t };
  },
  data() {
    return {
      localEnrollment: new Enrollment(this.modelValue),
      studentOptions: [],
      periodOptions: [],
      enrollmentStatusOptions: [
        { value: EnrollmentStatus.ACTIVE, label: this.$t('enrollment.status.active') },
        { value: EnrollmentStatus.CANCELLED, label: this.$t('enrollment.status.cancelled') },
        { value: EnrollmentStatus.COMPLETED, label: this.$t('enrollment.status.completed') },
        { value: EnrollmentStatus.DELETED, label: this.$t('enrollment.status.deleted') }
      ],
      paymentStatusOptions: [
        { value: PaymentStatus.PENDING, label: this.$t('enrollment.payment.pending') },
        { value: PaymentStatus.PAID, label: this.$t('enrollment.payment.paid') },
        { value: PaymentStatus.REFUNDED, label: this.$t('enrollment.payment.refunded') },
        { value: PaymentStatus.PARTIAL, label: this.$t('enrollment.payment.partial') }
      ]
    };
  },
  watch: {
    modelValue: {
      handler(newVal) {
        this.localEnrollment = new Enrollment(newVal);
      },
      deep: true,
      immediate: true
    }
  },
  async mounted() {
    const studentService = new StudentService();
    const periodService = new AcademicPeriodService();
    this.studentOptions = await studentService.getAll();
    this.periodOptions = await periodService.getAll();
  },
  methods: {
    isValid() {
      return this.$refs.form?.checkValidity();
    },
    submit() {
      if (this.isValid()) {
        const event = this.editMode ? 'update-enrollment' : 'add-enrollment';
        this.localEnrollment.createdAt = new Date(this.localEnrollment.createdAt);
        this.$emit(event, new Enrollment(this.localEnrollment));
        this.reset();
      }
    },
    cancel() {
      this.$emit('cancel');
      this.reset();
    },
    reset() {
      this.localEnrollment = new Enrollment();
      this.$refs.form.reset();
    }
  }
});
</script>

<template>
  <form ref="form" class="enrollment-form" @submit.prevent="submit">
    <h2>{{ t(editMode ? 'enrollment.form.title-edit' : 'enrollment.form.title-new') }}</h2>

    <!-- Estudiante -->
    <div class="form-row">
      <pv-dropdown
          v-model="localEnrollment.studentId"
          :options="studentOptions"
          optionLabel="firstName"
          optionValue="id"
          :placeholder="t('enrollment.form.student')"
          required
          class="form-field"
      />
    </div>

    <!-- Periodo Académico -->
    <div class="form-row">
      <pv-dropdown
          v-model="localEnrollment.periodId"
          :options="periodOptions"
          optionLabel="name"
          optionValue="id"
          :placeholder="t('enrollment.form.period')"
          required
          class="form-field"
      />
    </div>

    <!-- Fecha -->
    <div class="form-row">
      <pv-input-text
          v-model="localEnrollment.createdAt"
          type="date"
          :placeholder="t('enrollment.form.date')"
          required
          class="form-field"
      />
    </div>

    <!-- Monto -->
    <div class="form-row">
      <pv-input-text
          v-model="localEnrollment.amount"
          type="number"
          :placeholder="t('enrollment.form.amount')"
          required
          class="form-field"
      />
    </div>

    <!-- Estado de Matrícula -->
    <div class="form-row">
      <pv-dropdown
          v-model="localEnrollment.enrollmentStatus"
          :options="enrollmentStatusOptions"
          optionLabel="label"
          optionValue="value"
          :placeholder="t('enrollment.form.status')"
          required
          class="form-field"
      />
    </div>

    <!-- Estado de Pago -->
    <div class="form-row">
      <pv-dropdown
          v-model="localEnrollment.paymentStatus"
          :options="paymentStatusOptions"
          optionLabel="label"
          optionValue="value"
          :placeholder="t('enrollment.form.payment-status')"
          required
          class="form-field"
      />
    </div>

    <!-- Botones -->
    <div class="form-actions">
      <pv-button type="submit" :label="t(editMode ? 'enrollment.form.update' : 'enrollment.form.save')" severity="primary" />
      <pv-button type="button" :label="t('enrollment.form.cancel')" severity="secondary" @click="cancel" />
    </div>
  </form>
</template>


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
