<script>
import Button from 'primevue/button'
import {Button as PvButton} from "primevue";

export default {
  name: 'AttendanceSaveButton',
  emits: ['saveClicked'],
  methods: {
    onClick() {
      this.$emit('saveClicked')
    }
  }
}
</script>

<template>
  <div class="save-button">
    <pv-button
        :label="$t('attendance-save')"
        icon="pi pi-save"
        severity="primary"
        @click="onClick"
    />
  </div>
</template>

<style scoped>
.save-button {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}
</style>
