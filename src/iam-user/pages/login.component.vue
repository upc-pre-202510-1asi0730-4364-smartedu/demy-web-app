<template>
  <section class="login-page">
    <LoginForm />
  </section>
</template>

<script setup>
import LoginForm from '../components/login-form.component.vue'
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>