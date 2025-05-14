<template>
  <section class="sign-up-page">
    <SignUpComponent />
  </section>
</template>

<script setup>
import SignUpComponent from '../components/sign-up-form.component.vue';
</script>

<style scoped>
.sign-up-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>
