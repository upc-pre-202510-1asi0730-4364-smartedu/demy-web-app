<script>
import SelectButton from 'primevue/selectbutton'

export default {
  name: 'contextual-toggle-nav',
  components: { SelectButton },
  props: {
    options: {
      type: Array,
      required: true
    },
    selected: {
      type: String,
      required: true
    }
  },
  emits: ['select'],
  data() {
    return {
      internalSelected: this.selected
    }
  },
  watch: {
    selected(newVal) {
      this.internalSelected = newVal
    }
  },
  methods: {
    onSelectionChange(e) {
      this.$emit('select', this.internalSelected)
    }
  }
}
</script>

<template>
  <div class="toggle-scroll-wrapper">
    <SelectButton
        v-model="internalSelected"
        :options="options"
        optionLabel="label"
        optionValue="value"
        @change="onSelectionChange"
        class="select-toggle"
    />
  </div>
</template>

<style scoped>
.toggle-scroll-wrapper {
  overflow-x: auto;
  padding-bottom: 0.5rem;
  -webkit-overflow-scrolling: touch;
}

.toggle-scroll-wrapper::-webkit-scrollbar {
  height: 6px;
}

.toggle-scroll-wrapper::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}
</style>