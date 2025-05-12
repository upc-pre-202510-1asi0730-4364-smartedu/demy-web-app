<template>
  <div class="container">
    <div class="left-side">
      <img src="/assets/img/login-image.jpg" alt="Imagen de bienvenida" />
    </div>
    <div class="right-side">
      <div class="form-box">
        <div class="top-bar text-right">
          <LanguageSwitcher class="custom-color" />
        </div>
        <img class="logo" src="/assets/logos/demy-blue-logo.png" alt="logo" />

        <p class="sign-up">
          <RouterLink to="/signup">{{ $t('login.sign-up') }}</RouterLink>
        </p>

        <p class="title">{{ $t('login.title') }}</p>
        <p class="sub-tittle">{{ $t('login.sub-title') }}</p>

        <form @submit.prevent="handleSubmit">
          <LoginInput
              type="email"
              v-model="form.email"
              :placeholder="$t('login.email')"
          />
          <LoginInput
              type="password"
              v-model="form.password"
              :placeholder="$t('login.password')"
          />

          <div class="remember-me">
            <label>
              <input type="checkbox" v-model="form.remember" />
              {{ $t('login.remember-me') }}
            </label>
          </div>

          <button type="submit" class="button-color">
            {{ $t('login.sign-in') }}
          </button>
        </form>

        <p class="register-text">
          <RouterLink to="/forgot-password">{{ $t('login.forgot-password') }}</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import LoginInput from '../components/login-input.component.vue'
import LanguageSwitcher from '../../shared/components/language-switcher.component.vue'
import { useUserAccountService } from '../services/user-account.service.js'

const userService = useUserAccountService()

const form = reactive({
  email: '',
  password: '',
  remember: false
})

async function handleSubmit() {
  try {
    const user = await userService.login(form)
    console.log('Usuario autenticado:', user)
    // Redireccionar a página principal o dashboard
  } catch (error) {
    console.error('Error al iniciar sesión:', error)
  }
}
</script>

<style scoped>
.container {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.left-side {
  flex: 1;
  background-color: #f0f0f0;
}

.left-side img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.right-side {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #D0E3EE;
}

.form-box {
  width: 90%;
  max-width: 440px;
  padding: 32px;
  background-color: white;
  border-radius: 24px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.08);
  text-align: left;
}

.logo {
  width: 160px;
  display: block;
  margin: 0 auto 24px auto;
}

.sign-up {
  text-align: left;
  margin-bottom: 12px;
  font-size: 15px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.sub-tittle {
  font-size: 16px;
  margin-bottom: 20px;
}

.button-color {
  background-color: #1d4ed8;
  color: white;
  padding: 14px;
  width: 100%;
  border-radius: 10px;
  margin-top: 20px;
  font-size: 16px;
}

.remember-me {
  margin-top: 16px;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: left;
}

.register-text {
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
}

.top-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

/* Responsive ajustes */
@media (max-width: 960px) {
  .container {
    flex-direction: column;
  }

  .left-side {
    display: none;
  }

  .right-side {
    flex: none;
    width: 100%;
    padding: 20px;
  }

  .form-box {
    max-width: 95%;
    margin: 0 auto;
    border-radius: 16px;
  }

  .logo {
    width: 140px;
  }
}

</style>