<script>
import Toolbar from 'primevue/toolbar'
import Button from 'primevue/button'
import LanguageSwitcher from "./language-switcher.component.vue";

export default {
  name: "header-content",
  props: {
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  emits: ['menuToggle'],
  components: {
    Toolbar,
    Button,
    LanguageSwitcher
  }
}
</script>

<template>
  <Toolbar class="header-toolbar">
    <template #start>
      <Button
          v-if="isMobile"
          icon="pi pi-bars"
          @click="$emit('menuToggle')"
          class="p-button-rounded p-button-text"
          aria-label="Menu"
      />
      <span class="logo">Demy</span>
    </template>

    <template #end>
      <LanguageSwitcher />
    </template>
  </Toolbar>
</template>

<style scoped>
.header-toolbar {
  background-color: var(--color-primary-1);
  color: white;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  height: 64px;
  gap: 1rem;
}

.header-toolbar a,
.header-toolbar button,
.header-toolbar i {
  color: white;
}

.header-toolbar button:hover,
.header-toolbar a:hover {
  background-color: rgba(255, 255, 255, 0.12);
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.spacer {
  flex: 1 1 auto;
}
</style>