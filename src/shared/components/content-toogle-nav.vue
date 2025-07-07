<script>
import SelectButton from 'primevue/selectbutton'

export default {
  name: "content-toggle-nav",
  components: {
    SelectButton
  },
  props: {
    /**
     * List of toggle options to display.
     * Each option should have a `label` and a `value`.
     */
    options: {
      type: Array,
      required: true,
      default: () => []
    },
    /**
     * Currently selected value.
     */
    selected: {
      type: String,
      default: ''
    },
    /**
     * Whether to allow multiple selections
     */
    multiple: {
      type: Boolean,
      default: false
    },
    /**
     * Custom styling variant
     */
    variant: {
      type: String,
      default: 'default', // 'default', 'primary', 'secondary'
      validator: (value) => ['default', 'primary', 'secondary'].includes(value)
    }
  },
  emits: ['select', 'update:selected'],
  data() {
    return {
      currentSelected: this.selected
    }
  },
  watch: {
    selected: {
      handler(newVal) {
        this.currentSelected = newVal
      },
      immediate: true
    }
  },
  methods: {
    /**
     * Handles selection changes and emits the selected value.
     * @param {Event} event - Selection event
     */
    onSelectionChange(event) {
      const value = event.value
      this.currentSelected = value

      // Emit both events for flexibility
      this.$emit('select', value)
      this.$emit('update:selected', value)
    }
  }
}
</script>

<template>
  <div class="toggle-scroll-wrapper">
    <SelectButton
        v-model="currentSelected"
        :options="options"
        :multiple="multiple"
        optionLabel="label"
        optionValue="value"
        @change="onSelectionChange"
        :class="['content-toggle-nav', `variant-${variant}`]"
        :aria-label="$t('navigation.select-option')"
    />
  </div>
</template>

<style scoped>
.toggle-scroll-wrapper {
  display: flex;
  justify-content: center;
  padding: 0.5rem 0;
  overflow-x: auto;
  scrollbar-width: thin;
}

.toggle-scroll-wrapper::-webkit-scrollbar {
  height: 4px;
}

.toggle-scroll-wrapper::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}

/* Responsive design */
@media (max-width: 768px) {
  .toggle-scroll-wrapper {
    justify-content: flex-start;
    padding: 0.25rem 0.5rem;
  }

  .content-toggle-nav :deep(.p-button) {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    white-space: nowrap;
  }
}

/* Animation for selection */
.content-toggle-nav :deep(.p-button) {
  position: relative;
  overflow: hidden;
}

.content-toggle-nav :deep(.p-button::before) {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.content-toggle-nav :deep(.p-button:hover::before) {
  left: 100%;
}
</style>

.language-toggle {
border: 1px solid white;
}

.language-toggle :deep(.p-button) {
color: white;
}

.language-toggle :deep(.p-highlight) {
background-color: white;
color: var(--color-primary);
}
