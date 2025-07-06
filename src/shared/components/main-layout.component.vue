<script>
import Drawer from 'primevue/drawer'
import HeaderContent from './header-content.component.vue'
import SideNavigationBar from './side-navigation-bar.component.vue'
import ContentWrapper from './content-wrapper.component.vue'

export default {
  name: 'main-layout',
  components: {
    Drawer,
    HeaderContent,
    SideNavigationBar,
    ContentWrapper
  },
  data() {
    return {
      drawerVisible: false,
      isMobile: false
    }
  },
  mounted() {
    this.updateLayout()
    window.addEventListener('resize', this.updateLayout)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateLayout)
  },
  methods: {
    updateLayout() {
      this.isMobile = window.innerWidth <= 768
    },
    toggleDrawer() {
      this.drawerVisible = !this.drawerVisible
    },
    logout() {
      localStorage.removeItem('userData')
      localStorage.removeItem('currentUser')
      this.$router.push('/login')
    }
  }
}
</script>

<template>
  <div class="main-layout">
    <Drawer
        v-if="isMobile"
        v-model:visible="drawerVisible"
        :modal="true"
        class="drawer"
        :show-close-icon="false"
    >
      <side-navigation-bar @logout="logout" />
    </Drawer>

    <header-content
        :is-mobile="isMobile"
        @menuToggle="toggleDrawer"
    />

    <div
        v-if="isMobile"
        class="main-content"
    >
      <content-wrapper>
        <router-view />
      </content-wrapper>
    </div>

    <div
        v-else
        class="layout-with-sidebar"
    >
      <side-navigation-bar @logout="logout" />

      <div class="main-content">
        <content-wrapper>
          <router-view />
        </content-wrapper>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-layout {
  display: block;
  height: 100vh;
}

header-content {
  height: 64px;
  display: block;
  flex-shrink: 0;
}

/* ----- MOBILE ----- */

.drawer {
  width: 260px;
  background-color: var(--color-accent-4);
  border-radius: 0 12px 12px 0;
  height: 100%;
}

/* ----- DESKTOP ----- */

.layout-with-sidebar {
  display: flex;
  height: calc(100vh - 64px);
  background-color: var(--color-accent-4);
}

.main-content {
  flex-grow: 1;
  overflow-y: auto;
  background-color: var(--color-accent-4);
}
</style>