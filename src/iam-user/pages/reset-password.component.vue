<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PasswordInput from '../components/password-input.vue'
import LanguageSwitcher from '../../shared/components/language-switcher.component.vue'
import httpInstance from '../../shared/services/http.instance.js'
import ConfirmationModalPassword from '../components/confirmation-modal-password.component.vue'

const newPassword = ref('')
const confirmPassword = ref('')
const router = useRouter()
const showModal = ref(false)
const modalMessage = ref('')
const isConfirmModal = ref(false)

const email = localStorage.getItem('recoveryEmail')
const userId = localStorage.getItem('recoveryId')

const { t } = useI18n()

const confirmReset = async () => {
  showModal.value = false
  try {
    await httpInstance.put(`${import.meta.env.VITE_USER_ACCOUNT_ENDPOINT_PATH}/${userId}`, {
      passwordHash: newPassword.value
    })
    modalMessage.value = t('reset-password.modal.resetSuccess')
    isConfirmModal.value = false
    showModal.value = true
    localStorage.removeItem('recoveryEmail')
    localStorage.removeItem('recoveryId')
  } catch (error) {
    modalMessage.value = t('reset-password.modal.resetFail')
    isConfirmModal.value = false
    showModal.value = true
    console.error(error)
  }
}

const resetPassword = () => {
  if (!newPassword.value || !confirmPassword.value) {
    modalMessage.value = t('reset-password.errors.emptyFields')
    isConfirmModal.value = false
    showModal.value = true
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    modalMessage.value = t('reset-password.errors.passwordMismatch')
    isConfirmModal.value = false
    showModal.value = true
    return
  }

  modalMessage.value = t('reset-password.modal.confirmReset')
  isConfirmModal.value = true
  showModal.value = true
}

const modalOk = () => {
  showModal.value = false

  if (modalMessage.value === t('reset-password.modal.resetSuccess')) {
    router.push('/login')
  }
}

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

      <p class="email-display">{{ email }}</p>

      <PasswordInput
          v-model="newPassword"
          :placeholder="$t('reset-password.newPassword')"
      />
      <PasswordInput
          v-model="confirmPassword"
          :placeholder="$t('reset-password.confirmPassword')"
      />

      <button class="reset-btn" @click="resetPassword">
        {{ $t('reset-password.button') }}
      </button>
      <button class="back-btn" @click="goBack">
        {{ $t('reset-password.back') }}
      </button>
    </div>

    <ConfirmationModalPassword
        :visible="showModal"
        :message="modalMessage"
        :isConfirm="isConfirmModal"
        @accept="() => isConfirmModal ? confirmReset() : modalOk()"
        @cancel="showModal = false"
    />

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
