<template>
  <form class="academic-period-form" @submit.prevent="onSubmit">
    <h4>{{ editMode ? $t('academic-period.regist.title-edit') : $t('academic-period.regist.save') }}</h4>

    <div class="form-row">
      <div class="form-field">
        <label for="name">{{ $t('academic-period.regist.period') }}</label>
        <pv-input-text id="name" v-model="form.name" required class="w-full" />
      </div>
    </div>

    <div class="form-row">
      <div class="form-field">
        <label for="startDate">{{ $t('academic-period.regist.start-date') }}</label>
        <pv-date-picker id="startDate" v-model="form.startDate" dateFormat="yy-mm-dd" showIcon required class="w-full" />
      </div>
    </div>

    <div class="form-row">
      <div class="form-field">
        <label for="endDate">{{ $t('academic-period.regist.end-date') }}</label>
        <pv-date-picker id="endDate" v-model="form.endDate" dateFormat="yy-mm-dd" showIcon required class="w-full" />
      </div>
    </div>

    <div class="form-actions">
      <pv-button type="submit" :disabled="!isValid" label="Save" :label="$t(editMode ? 'academic-period.regist.update' : 'academic-period.regist.save')" />
      <pv-button type="button" class="p-button-secondary" @click="onCancel" :label="$t('academic-period.regist.cancel')" />
    </div>
  </form>
</template>

<script>

export default {
  name: 'AcademicPeriodCreateForm',
  props: {
    academicPeriod: {
      type: Object,
      default: () => ({ name: '', startDate: '', endDate: '' })
    },
    editMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        name: '',
        startDate: '',
        endDate: ''
      }
    }
  },
  computed: {
    isValid() {
      return (
          this.form.name &&
          this.form.startDate &&
          this.form.endDate
      )
    }
  },
  watch: {
    academicPeriod: {
      handler(newVal) {
        this.form = { ...newVal }
      },
      immediate: true
    }
  },
  methods: {
    onSubmit() {
      if (this.isValid) {
        const formToEmit = {
          ...this.form,
          startDate: new Date(this.form.startDate),
          endDate: new Date(this.form.endDate)
        }
        const eventName = this.editMode ? 'academicPeriodUpdateRequested' : 'academicPeriodAddRequested'
        this.$emit(eventName, formToEmit)
        this.resetEditState()
      } else {
        console.error('Formulario inválido.')
      }
    },
    onCancel() {
      this.$emit('cancelRequested')
      this.resetEditState()
    },
    resetEditState() {
      this.form = {
        name: '',
        startDate: '',
        endDate: ''
      }
    }
  }
}
</script>

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
