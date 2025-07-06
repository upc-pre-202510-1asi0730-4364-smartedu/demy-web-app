<script>
import ContentToogleNav from "../../shared/components/content-toogle-nav.vue";
import EnrollmentSearchPage from "./enrollment-search-page.component.vue"
import EnrollmentManagement from "./enrollment-management.component.vue"
import ContentToggleNav from "../../shared/components/content-toogle-nav.vue";

export default {
  name: "enrollment-page-component",
  components: {
    ContentToggleNav,
    ContentToogleNav,
    EnrollmentSearchPage,
    EnrollmentManagement
  },
  data() {
    return {
      options: [
        { label: 'Gestionar Matrícula', value: 'manage' },
        { label: 'Buscar Matrícula', value: 'search' }
      ],
      selectedPage: 'manage'
    }
  },
  methods: {
    onPageSelected(page) {
      this.selectedPage = page
    }
  }
}
</script>

<template>
  <div class="enrollment-page">

    <div class="toggle-wrapper">
      <content-toggle-nav
          :options="options"
          :selected="selectedPage"
          variant="primary"
          @select="onPageSelected"
      />
    </div>

    <!-- Page Content -->
    <div class="page-content">
      <enrollment-search-page v-if="selectedPage === 'search'" />
      <enrollment-management v-else-if="selectedPage === 'manage'" />
    </div>
  </div>
</template>

<style scoped>
.enrollment-page {
  padding: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
}


.page-header h2 {
  color: var(--color-secondary-dark-1, #2c3e50);
  margin-bottom: 0.5rem;
  font-size: 2rem;
  font-weight: 600;
}

.toggle-wrapper {
  display: flex;
  justify-content: left;
}

.page-content {
  animation: fadeIn 0.3s ease-in-out;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .enrollment-page {
    padding: 1rem;
  }

  .page-header h2 {
    font-size: 1.75rem;
  }
}

@media (max-width: 480px) {
  .enrollment-page {
    padding: 0.5rem;
  }

  .toggle-wrapper {
    margin-bottom: 1rem;
  }
}
</style>