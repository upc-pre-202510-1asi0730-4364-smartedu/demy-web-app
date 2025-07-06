<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAcademyService } from '../services/academy.service'
import { useUserAccountService  } from '../services/user-account.service'
import AppLanguageSwitcher from '../../shared/components/language-switcher.component.vue'
import httpInstance from '../../shared/services/http.instance.js'

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

/**
 * Handles form submission for both user and academy creation.
 * - Validates acceptance of terms
 * - Registers user
 * - Registers academy with the new user ID
 * - Redirects to plant selection page on success
 */
const onSubmit = async () => {
  if (!form.value.terms) {
    alert('You must accept the terms and conditions');
    return;
  }

  try {
    const user = await userAccountService.createUser({
      fullName: form.value.name,
      email: form.value.email,
      password: form.value.password
    });
    localStorage.setItem('user', JSON.stringify(user));

    console.log(" Enviando a /academies:", {
      userId: user.id,
      name: form.value.academy_name,
      ruc: String(form.value.ruc)
    });

    console.log('Datos enviados a academies:', {
      userId: user.id,
      name: form.value.academy_name,
      ruc: String(form.value.ruc)
    });
    await httpInstance.post('/academies', {
      userId: user.id,
      academyName: form.value.academy_name,
      ruc: String(form.value.ruc)
    });

    alert('Usuario y academia registrados correctamente');
    await router.push('/plantSelect');
  } catch (error) {
    console.error("Axios error:", error);
    console.error("Error response:", error.response?.data);
    const msg = error.response?.data?.message || error.message || 'Error desconocido';
    alert('Hubo un error al registrar: ' + msg);
  }
};
</script>

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

<style scoped>

.container {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  position: relative;
}

.right-side {
  flex: 1;
  background-color: #f0f0f0;
  position: relative;
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
  margin: 0 auto 32px auto;
}

.login {
  text-align: left;
  margin-top: 6px;
  font-size: 13px;
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
  font-size: 23px;
  font-weight: 700;
  line-height: 13.5%;
  margin-bottom: 16px;
}

.sub-tittle {
  color: #000000;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 195%;
  margin-top: 0;
  padding-bottom: 14px;
}

.form-box {
  width: 96%;
  max-width: 450px;
  padding: 29px;
  text-align: left;
  background-color: #ffffff;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  border-radius: 19px;
}

.form input {
  width: 100%;
  padding: 11px;
  margin-bottom: 15px;
  font-size: 11px;
  box-sizing: border-box;
  text-align: left;
  border: 2px solid #E8E8EA;
  border-radius: 4px;
}

.terms-me {
  margin-bottom: 27px;
}

.terms-me label {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-size: 13px;
  cursor: pointer;
}

button {
  width: 100%;
  padding: 19px;
  font-size: 15px;
  margin-bottom: 19px;
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
  padding: 7px;
}

.custom-color {
  background-color: var(--color-primary-1);
  border-radius: 32px;
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
    z-index: 0;
  }

  .left-side {
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
    font-size: 13px;
    margin-bottom: 13px;
  }

  .sub-tittle {
    font-size: 9px;
  }

  .form input {
    font-size: 9px;
    padding: 8px;
  }

  .terms-me label {
    font-size: 8px;
  }

  button {
    font-size: 11px;
    padding: 12px;
  }
}
html, body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  height: 100dvh;
}

.container {
  height: 100dvh;
  overflow: hidden;
}

</style>
