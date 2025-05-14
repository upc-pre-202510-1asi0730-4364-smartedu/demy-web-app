<script>
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { AcademicPeriod } from "../model/academic-period.entity.js";

export default defineComponent({
  name: 'academic-period-create',
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
  emits: ['update:modelValue', 'add-academic-period', 'update-academic-period', 'cancel'],
  setup(_, { emit }) {
    const { t } = useI18n();
    return { t };
  },
  data() {
    return {
      localAcademicPeriod: new AcademicPeriod(this.modelValue)
    };
  },
  watch: {
    modelValue: {
      handler(newVal) {
        this.localAcademicPeriod = new AcademicPeriod(newVal);
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    isValid() {
      return this.$refs.form?.checkValidity();
    },
    submit() {
      if (this.isValid()) {
        const emitter = this.editMode ? 'update-academic-period' : 'add-academic-period';
        this.localAcademicPeriod.startDate = new Date(this.localAcademicPeriod.startDate);
        this.localAcademicPeriod.endDate = new Date(this.localAcademicPeriod.endDate);
        this.$emit(emitter, new AcademicPeriod(this.localAcademicPeriod));
        this.reset();
      }
    },
    cancel() {
      this.$emit('cancel');
      this.reset();
    },
    reset() {
      this.localAcademicPeriod = new AcademicPeriod();
      this.$refs.form.reset();
    }
  }
});
</script>

<template>
  <form ref="form" class="academic-period-form" @submit.prevent="submit">
    <h4>{{ t(editMode ? 'academic-period.regist.title-edit' : 'academic-period.regist.save') }}</h4>

    <div class="form-row">
      <pv-input-text
          v-model="localAcademicPeriod.name"
          :placeholder="t('academic-period.regist.period')"
          required
          class="form-field"
      />
    </div>

    <div class="form-row">
      <pv-input-text
          v-model="localAcademicPeriod.startDate"
          type="date"
          :placeholder="t('academic-period.regist.start-date')"
          required
          class="form-field"
      />
    </div>

    <div class="form-row">
      <pv-input-text
          v-model="localAcademicPeriod.endDate"
          type="date"
          :placeholder="t('academic-period.regist.end-date')"
          required
          class="form-field"
      />
    </div>

    <div class="form-actions">
      <pv-button
          type="submit"
          :label="t(editMode ? 'academic-period.regist.update' : 'academic-period.regist.save')"
          severity="primary"
      />
      <pv-button
          type="button"
          :label="t('academic-period.regist.cancel')"
          severity="secondary"
          @click="cancel"
      />
    </div>
  </form>
</template>

<style scoped>
.academic-period-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 1200px;
  width: 95%;
  margin: 1rem auto;
  padding: 1rem 0.5rem;
  background-color: #fff;
  border-radius: 0.75rem;
}
.academic-period-form h4 {
  text-align: center;
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
  font-weight: 500;
}
.form-row {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 0.75rem;
}
.form-field {
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
}
.form-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1rem;
  padding: 0 1rem;
}
@media (min-width: 768px) {
  .form-actions {
    flex-direction: row;
    justify-content: center;
    gap: 1rem;
  }
}
</style>
