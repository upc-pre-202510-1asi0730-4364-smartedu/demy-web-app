<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PasswordInput from '../components/password-input.vue'
import LanguageSwitcher from '../../shared/components/language-switcher.component.vue'
import httpInstance from '../../shared/services/http.instance.js'

const newPassword = ref('')

const email = ref('')
const router = useRouter()
const showModal = ref(false)
const modalMessage = ref('')
const isConfirmModal = ref(false)


const { t } = useI18n()

/**
 * Confirms the password reset request using `passwordHash` (legacy version).
 * Displays a success/failure modal based on the result.
 */
const confirmReset = async () => {
  showModal.value = false
  try {
    await httpInstance.put(`${import.meta.env.VITE_USER_ACCOUNT_ENDPOINT_PATH}/reset-password`, {
      email: email.value,
      passwordHash: newPassword.value
    })
    modalMessage.value = t('reset-password.modal.resetSuccess')
    isConfirmModal.value = false
    showModal.value = true
  } catch (error) {
    modalMessage.value = t('reset-password.modal.resetFail')
    isConfirmModal.value = false
    showModal.value = true
    console.error(error)
  }
}

/**
 * Resets the password by sending the email and new password to the backend.
 * Validates that both fields are filled before submitting.
 * On success, redirects the user to the login page.
 */
const resetPassword = async () => {
  if (!email.value || !newPassword.value) {
    modalMessage.value = t('reset-password.errors.emptyFields')
    showModal.value = true
    return
  }

  try {
    await httpInstance.put(`${import.meta.env.VITE_USER_ACCOUNT_ENDPOINT_PATH}/reset-password`, {
      email: email.value,
      newPassword: newPassword.value
    })
    modalMessage.value = t('reset-password.modal.resetSuccess')
    await router.push('/login')
  } catch (error) {
    modalMessage.value = t('reset-password.modal.resetFail')

    console.error(error)
  }

  showModal.value = true
}


/**
 * Navigates back to the login page.
 */
const goBack = () => {
  router.push('/login')
}
</script>


<template>
  <div class="reset-page">
    <div class="reset-box">

      <div class="language-container">
        <LanguageSwitcher />
      </div>

      <h1 class="title">{{ $t('reset-password.title') }}</h1>

      <PasswordInput
          v-model="email"
          type="email"
          :placeholder="$t('reset-password.email')"
      />
      <PasswordInput
          v-model="newPassword"
          :placeholder="$t('reset-password.newPassword')"
      />

      <button class="reset-btn" @click="resetPassword">
        {{ $t('reset-password.button') }}
      </button>
      <button class="back-btn" @click="goBack">
        {{ $t('reset-password.back') }}
      </button>
    </div>


  </div>
</template>


<style scoped>
.reset-page {
  background-color: #D0E3EE;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.reset-box {
  background-color: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.language-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}

.title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.reset-btn,
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

.reset-btn {
  background-color: #007bff;
  color: white;
}

.reset-btn:hover {
  background-color: #0069d9;
}

.back-btn {
  background-color: #ccc;
  color: #333;
}

.back-btn:hover {
  background-color: #bbb;
}

.email-display {
  font-size: 0.95rem;
  color: #444;
  margin-bottom: 1rem;
}
@media (max-width: 480px) {
  .reset-box {
    padding: 1.5rem;
  }

  .title {
    font-size: 1.25rem;
  }
}
</style>
