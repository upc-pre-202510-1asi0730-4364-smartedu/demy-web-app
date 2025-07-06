<script setup>
defineProps({
  modelValue: String
})
defineEmits(['update:modelValue'])
</script>

<template>
  <input
      type="email"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="$t('recover.placeholder')"
      class="email-input"
  />
</template>

<style scoped>
.email-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  font-size: 1rem;
}
</style>

