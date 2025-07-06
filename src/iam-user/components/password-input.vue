<script setup>
const props = defineProps({
  modelValue: String,
  placeholder: String
})

const emit = defineEmits(['update:modelValue'])

const updateValue = (e) => {
  emit('update:modelValue', e.target.value)
}
</script>

<template>
  <input
      type="password"
      :placeholder="placeholder"
      :value="modelValue"
      @input="updateValue"
      class="input"
  />
</template>

<style scoped>
.input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #ccc;
  font-size: 1rem;
}
</style>
