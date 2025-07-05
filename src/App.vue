<script>
import LanguageSwitcher from "./shared/components/language-switcher.component.vue";
import AuthenticationSection from "./iam-user/components/authentication-section.component.vue";

export default {
  name: 'App',
  components: {AuthenticationSection, LanguageSwitcher},
  data() {
    return {
      drawer: false,
      items: [
        {label: 'option.home',       to: '/home'},
        {label: 'option.about',      to: '/about'},
        {label: 'option.categories', to: '/publishing/categories'}
      ]
    }
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer
    }
  }
}
</script>

<template>
  <pv-toast/>
  <pv-confirm-dialog/>
  <header>

  </header>
  <main>
    <router-view/>
  </main>

</template>

<style scoped>

header {
  flex: 0 0 auto;
}

main {
  display: flex;
  flex-direction: column;
  height: 100%;
}

footer {
  position: absolute;
  bottom: 0;
  padding: 10px;
}

</style>