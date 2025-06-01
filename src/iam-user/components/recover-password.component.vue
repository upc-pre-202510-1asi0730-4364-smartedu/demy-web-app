<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import EmailInput from './email-input.component.vue'
import LanguageSwitcher from '../../shared/components/language-switcher.component.vue'

const email = ref('')
const router = useRouter()

const goToNext = () => {
  if (email.value) {
    router.push('/reset-password')
  } else {
    alert('Please enter your email.')
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="recover-box">
    <div class="language-container">
      <LanguageSwitcher />
    </div>

    <h1 class="title">{{ $t('recover.title') }}</h1>
    <p class="subtitle">{{ $t('recover.subtitle') }}</p>

    <EmailInput v-model="email" />

    <button class="send-btn" @click="goToNext">{{ $t('recover.send') }}</button>
    <button class="back-btn" @click="goToLogin">{{ $t('recover.back') }}</button>
  </div>
</template>

<style scoped>
.recover-box {
  background-color: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 90%;
  text-align: center;

}

.language-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}

.title {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1rem;
  margin-bottom: 1rem;
}

.send-btn,
.back-btn {
  width: 100%;
  padding: 0.75rem;
  margin-top: 0.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.send-btn {
  background-color: #007bff;
  color: white;
}

.send-btn:hover {
  background-color: #0069d9;
}

.back-btn {
  background-color: #ccc;
  color: #333;
}

.back-btn:hover {
  background-color: #bbb;
}

@media (max-width: 480px) {
  .recover-box {
    padding: 1.5rem;
  }

  .title {
    font-size: 1.25rem;
  }

  .subtitle {
    font-size: 0.95rem;
  }
}
</style>
