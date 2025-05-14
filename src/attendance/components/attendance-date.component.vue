<template>
  <div class="field">
    <label for="date">{{$t('attendance-date')}}</label>
    <Calendar
        v-model="selectedDate"
        dateFormat="dd/mm/yy"
        showIcon
        :manualInput="false"
        placeholder="Selecciona una fecha"
    />
  </div>
</template>

<script>
import Calendar from 'primevue/calendar'

export default {
  name: 'AttendanceDate',
  components: { Calendar },
  props: {
    modelValue: Date
  },
  emits: ['update:modelValue'],
  computed: {
    selectedDate: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  }
}
</script>

<style scoped>
.field {
  margin-bottom: 1rem;
}
</style>
