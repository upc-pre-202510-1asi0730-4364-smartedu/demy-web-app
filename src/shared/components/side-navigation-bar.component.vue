<script>
import Divider from 'primevue/divider'
import { RouterLink } from 'vue-router'

export default {
  name: 'side-navigation-bar',
  components: {
    Divider,
    RouterLink
  },
  emits: ['logout'],
  data() {
    return {
      navOptions: [
        { icon: 'building', label: 'Mi organización', route: '/organization' },
        { icon: 'file', label: 'Matrícula', route: '/enrollment' },
        { icon: 'users', label: 'Alumnos', route: '/students' },
        { icon: 'credit-card', label: 'Pagos', route: '/payments' },
        //{ icon: 'calendar', label: 'Horarios', route: '/schedules' },
        { icon: 'check-circle', label: 'Asistencia', route: '/attendance' },
        { icon: 'book', label: 'Reporte de Asistencias', route: '/attendance-view-report' },
        { icon: 'wallet', label: 'Finanzas', route: '/finance' }
      ]
    }
  },
  computed: {
    visibleNavOptions() {
      const stored = localStorage.getItem('userData')
      let role = null

      try {
        role = JSON.parse(stored)?.role
      } catch (e) {
        console.warn('Invalid userData format')
      }

      if (['ADMIN', 'TEACHER'].includes(role)) {
        return this.navOptions.filter(option => option.roles.includes(role))
      }

      return this.navOptions;
    }
  }
}
</script>

<template>
  <div class="side-nav">
    <h3 class="side-nav-title">{{ $t('sidebar.categories') }}</h3>

    <ul class="nav-list">
      <li v-for="option in visibleNavOptions" :key="option.label">
        <RouterLink :to="option.route" class="nav-item">
          <i :class="`pi pi-${option.icon}`" class="nav-icon" />
          <span class="nav-label">{{ $t(option.label) }}</span>
        </RouterLink>
      </li>
    </ul>

    <Divider />

    <a class="nav-item" @click="$emit('logout')">
      <i class="pi pi-sign-out nav-icon"></i>
      <span class="nav-label">{{ $t('sidebar.logout') }}</span>
    </a>
  </div>
</template>

<style scoped>
.side-nav {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  box-sizing: border-box;
}

.side-nav-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  padding-bottom: 0.25rem;
  border-bottom: 1px solid var(--color-secondary-dark-3);
  color: var(--color-secondary-dark-2);
  text-align: center;
  display: inline-block;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  color: var(--color-secondary-dark-2);
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  cursor: pointer;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-icon {
  font-size: 1.2rem;
}

.nav-label {
  font-size: 1rem;
}

::v-deep(.p-divider-horizontal:before) {
  border-top: 1px solid var(--color-secondary-dark-3);
}
</style>