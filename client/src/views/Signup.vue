<script setup>
import { ref } from 'vue'
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter()

const username = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const errorMessage = ref('')

const handleSignup = async () => {
  try {
    errorMessage.value = ''

    const response = await axios.post('http://localhost:5000/api/auth/signup', {
      username: username.value,
      email: email.value,
      password: password.value
    })

    console.log('Registrazione avvenuta con successo')

    await router.push('/login');
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
  <div class="signup-container">
    <h1>Crea Account</h1>

    <form @submit.prevent="handleSignup">

      <div class="form-group">
        <label for="username">Username</label>
        <input
          id="username"
          type="text"
          v-model="username"
          required
          placeholder="Il tuo nome utente"
        />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          type="email"
          v-model="email"
          required
          placeholder="tua@email.com"
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
            placeholder="Min 8 caratteri"
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

      <button type="submit" class="btn-signup">Registrati</button>
    </form>

    <p class="login-link">
      Hai già un account? <router-link to="/login">Accedi qui</router-link>
    </p>
  </div>
</template>

<style scoped>
.signup-container {
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
  border-color: #42b983;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.2);
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

.btn-signup {
  width: 100%;
  padding: 12px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-signup:hover {
  background-color: #3aa876;
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

.login-link {
  text-align: center;
  margin-top: 20px;
  font-size: 0.9em;
}

.login-link a {
  color: #42b983;
  text-decoration: none;
  font-weight: bold;
}
</style>
