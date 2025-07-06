<!-- <template>
  <div class="field">
    <label for="date-range" style="margin-right: 5px;">{{ $t('attendance-date-range') }}</label>
    <Calendar
      v-model="selectedRange"
      selectionMode="range"
      dateFormat="dd/mm/yy"
      showIcon
      :manualInput="false"
      placeholder="Selecciona un rango de fechas"
    />
  </div>
</template>

<script>
import Calendar from 'primevue/calendar'

export default {
  name: 'DateRangePicker',
  components: { Calendar },
  props: {
    modelValue: Array // [startDate, endDate]
  },
  emits: ['update:modelValue'],
  computed: {
    selectedRange: {
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
</style> -->
<template>
  <div class="field">
    <label for="date-range" style="margin-right: 5px;">{{ $t('attendance-date-range') }}</label>
    <Calendar
      v-model="selectedRange"
      selectionMode="range"
      dateFormat="dd/mm/yy"
      showIcon
      :manualInput="false"
      placeholder="Selecciona un rango de fechas"
    />
  </div>
</template>

<script>
import Calendar from 'primevue/calendar'

export default {
  name: 'DateRangePicker',
  components: { Calendar },
  props: {
    modelValue: Array // [startDate, endDate]
  },
  emits: ['update:modelValue'],
  computed: {
    selectedRange: {
      get() {
        return this.modelValue
      },
      set(value) {
        if (value instanceof Date) {
          this.$emit('update:modelValue', [value])
        } else if (Array.isArray(value)) {
          this.$emit('update:modelValue', value)
        } else {
          this.$emit('update:modelValue', [])
        }
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

