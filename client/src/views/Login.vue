<script setup>
import { ref } from 'vue'
import { useAuthStore } from "@/stores/auth.js";
import { useRouter } from "vue-router";
import axios from "axios";

const authStore = useAuthStore()
const router = useRouter()

// Dati del form
const email = ref('')
const password = ref('')

// Variabile per gestire l'occhio della password
const showPassword = ref(false)

const errorMessage = ref('')

const handleLogin = async () => {
  try {
    errorMessage.value = ''

    // Chiamata al backend
    const response = await axios.post('http://localhost:5000/api/auth/signin', {
      email: email.value,
      password: password.value
    })

    // Estrazione e salvataggio del token
    const { token } = response.data
    authStore.setToken(token)

    console.log('User logged in')

    // Reindirizzamento
    await router.push('/home');
  }
  catch (err) {
    console.log(err)
    if (err.response && err.response.data) {
      errorMessage.value = err.response.data.message;
    } else {
      errorMessage.value = "Impossibile connettersi al server.";
    }
  }
}
</script>

<template>
  <div class="login-container">
    <h1>Accedi</h1>

    <form @submit.prevent="handleLogin">

      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          type="email"
          v-model="email"
          required
          placeholder="La tua email"
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>

        <div class="password-wrapper">
          <input
            id="password"
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            required
            placeholder="La tua password"
          />

          <span class="toggle-icon" @click="showPassword = !showPassword">
            <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
          </span>
        </div>
      </div>

      <p v-if="errorMessage" class="error-text">
        {{ errorMessage }}
      </p>

      <button type="submit" class="btn-login">Entra</button>
    </form>

    <p class="signup-link">
      Non hai un account? <router-link to="/signup">Registrati qui</router-link>
    </p>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 25px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 25px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  color: #555;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
  font-size: 16px;
}

input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

.password-wrapper {
  position: relative;
  width: 100%;
}

.password-wrapper input {
  padding-right: 40px;
}

.toggle-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #888;
  display: flex;
}

.toggle-icon:hover {
  color: #333;
}

.btn-login {
  width: 100%;
  padding: 12px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-login:hover {
  background-color: #2980b9;
}

.error-text {
  background-color: #fee2e2;
  color: #dc2626;
  padding: 10px;
  border-radius: 6px;
  text-align: center;
  font-size: 0.9em;
  margin-bottom: 15px;
}

.signup-link {
  text-align: center;
  margin-top: 20px;
  font-size: 0.9em;
}

.signup-link a {
  /* Link in BLU per coerenza */
  color: #3498db;
  text-decoration: none;
  font-weight: bold;
}
</style>
