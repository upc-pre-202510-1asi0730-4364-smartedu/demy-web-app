<template>
  <input
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="w-full p-3 mb-5 text-sm border-2 border-gray-300 rounded-md"
  />
</template>

<script setup>
defineProps({
  type: String,
  placeholder: String,
  modelValue: String
})
defineEmits(['update:modelValue'])
</script>