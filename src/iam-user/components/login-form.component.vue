<script setup>
import { reactive } from 'vue'
import LoginInput from '../components/login-input.component.vue'
import LanguageSwitcher from '../../shared/components/language-switcher.component.vue'
import { useUserAccountService } from '../services/user-account.service.js'
import { useRouter } from 'vue-router'

const userService = useUserAccountService()

const router = useRouter()

const form = reactive({
  email: '',
  password: '',
  remember: false
})

async function handleSubmit() {
  try {
    const user = await userService.login(form)
    console.log('Authenticated user:', user)
    await router.push('/organization')
  } catch (error) {
    console.error('Login failed:', error)
  }
}
</script>

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

<style scoped>
:root {
  --color-primary-1: #1d4ed8;
  --color-primary-3: #153ec1;
}

.container {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;

}

.left-side {
  flex: 1;
  background-color: #f0f0f0;
  position: relative;
}

.left-side img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
}

.right-side {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #D0E3EE;
  position: relative;
  z-index: 1;
}

.form-box {
  width: 90%;
  max-width: 440px;
  padding: 32px;
  background-color: white;
  border-radius: 24px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.08);
  text-align: left;
  z-index: 1;
}

.logo {
  width: 400px;
  display: block;
  margin: 0 auto 24px auto;
}

.sign-up {
  text-align: left;
  margin-bottom: 12px;
  font-size: 15px;
}

.sign-up a {
  color: #282828;
  text-decoration: none;
  transition: color 0.3s ease;
}

.sign-up a:hover {
  color: #0056b3;
  text-decoration: underline;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  font-family: 'Inter', sans-serif;
  color: #000000;
}

.sub-tittle {
  font-size: 16px;
  margin-bottom: 20px;
  font-family: 'Inter', sans-serif;
  color: #000000;
  line-height: 1.5;
}

.form input {
  width: 100%;
  padding: 14px;
  margin-bottom: 19px;
  font-size: 14px;
  box-sizing: border-box;
  text-align: left;
  border: 3px solid #E8E8EA;
  border-radius: 6px;
}

.button-color {
  background-color: var(--color-primary-1);
  color: white;
  padding: 14px;
  width: 100%;
  border-radius: 10px;
  margin-top: 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.button-color:hover {
  background-color: var(--color-primary-3);
}

.remember-me {
  margin-top: 16px;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: left;
  padding-top: 12px;
}

.remember-me label {
  display: inline-flex;
  align-items: center;
  gap: 11px;
  font-size: 14px;
  cursor: pointer;
  justify-content: flex-start;
  white-space: nowrap;
}

.remember-me input[type="checkbox"] {
  margin: 0;
  vertical-align: middle;
}

.register-text {
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
}

.register-text a {
  color: #282828;
  text-decoration: none;
  transition: color 0.3s ease;
}

.register-text a:hover {
  color: #0056b3;
  text-decoration: underline;
}

.top-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
  padding: 8px;
}

.custom-color {
  background-color: var(--color-primary-1);
  border-radius: 50px;
}
@media (max-width: 1200px) {
  .container {
    flex-direction: column;
  }

  .left-side {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  .right-side {
    position: relative;
    z-index: 1;
    background-color: transparent;
    padding: 13px;
  }

  .form-box {
    width: 100%;
    max-width: 58%;
    padding: 13px;
    margin-top: 13px;
    border-radius: 10px;
    background-color: white;
    position: relative;
    z-index: 2;
  }

  .logo {
    width: 160px;
    margin-bottom: 19px;
  }
}



@media (max-width: 400px) {
  .title {
    font-size: 16px;
    margin-bottom: 16px;
  }

  .sub-tittle {
    font-size: 11px;
    padding-bottom: 12px;
  }

  .form input {
    font-size: 11px;
    padding: 10px;
  }

  .remember-me label {
    font-size: 10px;
  }

  .button-color {
    font-size: 14px;
    padding: 16px;
  }

  .register-text {
    font-size: 10px;
  }
}
</style>
