<script>
import Button from 'primevue/button'
import {Button as PvButton} from "primevue";

export default {
  name: 'AttendanceViewReportButton',
  emits: ['viewReportClicked'],
  methods: {
    onClick() {
      this.$emit('viewReportClicked')
    }
  }
}
</script>

<template>
  <div class="view-report-button">
    <pv-button
        :label="$t('attendance-view-report')"
        icon="pi pi-file"
        severity="primary"
        @click="onClick"
    />
  </div>
</template>

<style scoped>
.view-report-button {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}
</style>
