<script setup>


const props = defineProps({
  visible: Boolean,
  message: String
})
const emits = defineEmits(['close'])

const emitClose = () => {
  emits('close')
}
</script>

<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-content">
      <p>{{ message }}</p>
      <button class='confirmation' @click="emitClose">{{ $t('recover.modal.accept') }}</button>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
}
.confirmation {
  width: 100%;
  padding: 0.75rem;
  margin-top: 0.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.confirmation {
  background-color: #007bff;
  color: white;
}
.confirmation:hover {
  background-color: #0069d9;
}
</style>
