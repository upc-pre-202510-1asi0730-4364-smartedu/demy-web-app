<template>
  <div class="container">
    <div class="left-side">
      <div class="form-box">
        <div class="top-bar">
          <app-language-switcher class="custom-color"></app-language-switcher>
        </div>
        <img class="logo" src="/assets/logos/demy-blue-logo.png" alt="Imagen de bienvenida" />
        <p class="login">
          <router-link to="/login">{{ $t('sign-up.login') }}</router-link>
        </p>
        <p class="title">{{ $t('sign-up.title') }}</p>
        <p class="sub-tittle">{{ $t('sign-up.sub-title') }}</p>

        <form @submit.prevent="onSubmit" class="form">
          <input type="text" v-model="form.name" :placeholder="$t('sign-up.name')" required />
          <input type="text" v-model="form.academy_name" :placeholder="$t('sign-up.academy-name')" required />
          <input type="number" v-model="form.ruc" :placeholder="$t('sign-up.ruc')" required />
          <input type="email" v-model="form.email" :placeholder="$t('sign-up.email')" required />
          <input type="password" v-model="form.password" :placeholder="$t('sign-up.password')" required />

          <div class="terms-me">
            <label class="terms-label">
              <input type="checkbox" v-model="form.terms" />
              <span>{{ $t('sign-up.terms-me') }}</span>
            </label>
          </div>
          <button class="button-color" type="submit">{{ $t('sign-up.register') }}</button>
        </form>
      </div>
    </div>

    <div class="right-side">
      <img src="/assets/img/sign-up-image.jpg" alt="Imagen de bienvenida" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAcademyService } from '../services/academy.service'
import { useUserAccountService  } from '../services/user-account.service'
import AppLanguageSwitcher from '../../shared/components/language-switcher.component.vue'

const form = ref({
  name: '',
  academy_name: '',
  ruc: '',
  email: '',
  password: '',
  terms: false
})

const router = useRouter()
const academyService = useAcademyService()
const userAccountService = useUserAccountService()


const onSubmit = async () => {
  if (!form.value.terms) {
    alert('You must accept the terms and conditions')
    return
  }

  try {
    const newAcademy = {
      name: form.value.name,
      academy_name: form.value.academy_name,
      ruc: form.value.ruc,
      email: form.value.email,
      password: form.value.password
    }

    await academyService.createAcademy(newAcademy)
    alert('Successfully created academy')

    await userAccountService.createUser({
      name: form.value.name,
      email: form.value.email,
      password: form.value.password
    })
    alert('User created successfully')

    router.push('/login')
  } catch (error) {
    alert('There was an error registering the academy or user')
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

.right-side {
  flex: 1;
  background-color: #f0f0f0;
}

.right-side img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
}

.left-side {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #D0E3EE;
  position: relative;
  z-index: 1;
}

.logo {
  display: block;
  width: 400px;
  margin: 0 auto 40px auto;
}

.login {
  text-align: left;
  margin-top: 8px;
  font-size: 16px;
}

.login a {
  color: #282828;
  text-decoration: none;
  transition: color 0.3s ease;
}

.login a:hover {
  color: #0056b3;
  text-decoration: underline;
}

.title {
  color: #000000;
  font-family: 'Inter', sans-serif;
  font-size: 29px;
  font-weight: 700;
  line-height: 13.5%;
  margin-bottom: 20px;
}

.sub-tittle {
  color: #000000;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 195%;
  margin-top: 0;
  padding-bottom: 18px;
}

.form-box {
  width: 96%;
  max-width: 480px;
  padding: 36px;
  text-align: left;
  background-color: #ffffff;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  border-radius: 24px;
}

.form input {
  width: 100%;
  padding: 14px;
  margin-bottom: 19px;
  font-size: 14px;
  box-sizing: border-box;
  text-align: left;
  border: 3px solid #E8E8EA;
  border-radius: 5px;
}

.terms-me {
  margin-bottom: 32px;
}

.terms-me label {
  display: inline-flex;
  align-items: center;
  gap: 11px;
  font-size: 16px;
  cursor: pointer;
}

button {
  width: 100%;
  padding: 24px;
  font-size: 19px;
  margin-bottom: 24px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
  color: #ffffff;
}

button:hover {
  background-color: var(--color-primary-3);
}

.button-color {
  background-color: var(--color-primary-1);
}

.top-bar {
  display: flex;
  justify-content: flex-end;
  padding: 8px;
}

.custom-color {
  background-color: var(--color-primary-1);
  border-radius: 40px;
}

@media (max-width: 1200px) {
  .container {
    flex-direction: column;
  }

  .right-side {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }

  .left-side {
    background-color: transparent;
    padding: 16px;
  }

  .form-box {
    width: 100%;
    max-width: 72%;
    padding: 16px;
    margin-top: 16px;
    border-radius: 12px;
  }

  .logo {
    width: 200px;
    margin-bottom: 24px;
  }
}

@media (max-width: 400px) {
  .title {
    font-size: 16px;
    margin-bottom: 16px;
  }

  .sub-tittle {
    font-size: 11px;
  }

  .form input {
    font-size: 11px;
    padding: 10px;
  }

  .terms-me label {
    font-size: 10px;
  }

  button {
    font-size: 14px;
    padding: 16px;
  }
}
</style>
