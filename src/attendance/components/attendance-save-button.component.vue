<template>
  <div class="save-button">
    <pv-button
        :label="$t('attendance-save')"
        icon="pi pi-save"
        severity="primary"
        @click="$emit('saveClicked')"
    />
  </div>
</template>

<script>
import Button from 'primevue/button'
import {Button as PvButton} from "primevue";

export default {
  name: 'AttendanceSaveButton',
  emits: ['click'],
  methods: {
    onClick() {
      this.$emit('click')
    }
  }
}
</script>

<style scoped>
.save-button {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}
</style>
