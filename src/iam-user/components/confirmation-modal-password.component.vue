<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  visible: Boolean,
  message: String,
  isConfirm: { type: Boolean, default: false }
})

const emits = defineEmits(['accept', 'cancel'])
</script>

<template>
  <div v-if="visible" class="modal-overlay" @click.self="$emit('cancel')">
    <div class="modal-content">
      <p>{{ message }}</p>

      <div v-if="isConfirm" class="button-group">
        <button class="btn confirm" @click="$emit('accept')">{{ $t('reset-password.modal.yes') }}</button>
        <button class="btn cancel" @click="$emit('cancel')">{{ $t('reset-password.modal.no') }}</button>
      </div>

      <div v-else>
        <button class="btn ok" @click="$emit('accept')">{{ $t('reset-password.modal.ok') }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  max-width: 90vw;
  text-align: center;
}
.button-group {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}
.btn {
  min-width: 80px;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: background-color 0.2s ease;
}
.btn.ok,
.btn.confirm {
  background-color: #007bff;
  color: white;
}
.btn.ok:hover,
.btn.confirm:hover {
  background-color: #0056b3;
}
.btn.cancel {
  background-color: #ccc;
  color: #333;
}
.btn.cancel:hover {
  background-color: #999;
}
</style>
