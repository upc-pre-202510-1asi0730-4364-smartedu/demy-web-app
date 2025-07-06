<script>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import ContextualToggleNav from "../../shared/components/contextual-toggle-nav.component.vue";

export default {
  name: 'PaymentsLayout',
  components: {
    ContextualToggleNav
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const { t, locale } = useI18n()

    const selected = ref('')
    const options = ref([])

    const buildOptions = () => {
      options.value = [
        { label: t('payments.nav.list'), value: 'list' },
        { label: t('payments.nav.assign'), value: 'assign' }
      ]
    }

    const onSelect = (value) => {
      selected.value = value
      router.push({ name: value }) // asegúrate de tener rutas nombradas 'list' y 'assign'
    }

    // Actualiza opción seleccionada si cambia la ruta
    watch(
        () => route.path,
        () => {
          selected.value = route.path.split('/').pop() || 'list'
        },
        { immediate: true }
    )

    // Actualiza opciones si cambia el idioma
    watch(locale, buildOptions, { immediate: true })

    return {
      selected,
      options,
      onSelect
    }
  }
}
</script>

<template>
  <div class="payments-layout">
    <h2>{{ $t('payments.section-title') }}</h2>

    <ContextualToggleNav
        :options="options"
        :selected="selected"
        @select="onSelect"
    />

    <router-view />
  </div>
</template>

<style scoped>
.payments-layout {
  padding: 16px;
}

h2 {
  margin-bottom: 16px;
}
</style>