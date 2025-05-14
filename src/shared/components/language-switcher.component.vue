<script>
import SelectButton from 'primevue/selectbutton'

export default {
  name: 'language-switcher',
  components: {
    SelectButton
  },
  data() {
    return {
      currentLang: 'en',
      languages: [
        { label: 'EN', value: 'en' },
        { label: 'ES', value: 'es' }
      ]
    }
  },
  mounted() {
    const savedLang = localStorage.getItem('app-lang') || this.$i18n.locale
    this.currentLang = savedLang
    this.$i18n.locale = savedLang
  },
  methods: {
    useLanguage(language) {
      this.$i18n.locale = language.value
      this.currentLang = language.value
      localStorage.setItem('app-lang', language.value)
    }
  }
}
</script>

<template>
  <SelectButton
      v-model="currentLang"
      :options="languages"
      aria-label="Preferred language"
      @change="useLanguage"
      option-label="label"
      option-value="value"
      class="language-toggle"
  />
</template>

<style scoped>
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

</style>