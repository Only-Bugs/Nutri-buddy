<script setup>
/**
 * AuthPage.vue
 *
 * Combines LoginForm and RegisterForm with a modern UI.
 * Provides tab-based navigation between login and registration.
 */
import { ref } from 'vue'
import LoginForm from '../components/forms/LoginForm.vue'
import RegisterForm from '../components/forms/RegisterForm.vue'

const activeTab = ref('login')
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
      <!-- Logo / Header -->
      <div class="text-center mb-6">
        <div
          class="mx-auto h-12 w-12 bg-green-600 text-white flex items-center justify-center rounded-full text-lg font-bold"
        >
          NB
        </div>
        <h2 class="mt-4 text-2xl font-bold text-gray-900">Welcome to Nutri-Buddy</h2>
        <p class="mt-1 text-sm text-gray-500">Please sign in or create a new account</p>
      </div>

      <!-- Tabs -->
      <div class="flex border-b border-gray-200 mb-6">
        <button
          class="flex-1 py-2 text-center text-sm font-medium"
          :class="
            activeTab === 'login' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500'
          "
          @click="activeTab = 'login'"
        >
          Sign In
        </button>
        <button
          class="flex-1 py-2 text-center text-sm font-medium"
          :class="
            activeTab === 'register'
              ? 'border-b-2 border-green-600 text-green-600'
              : 'text-gray-500'
          "
          @click="activeTab = 'register'"
        >
          Sign Up
        </button>
      </div>

      <!-- Dynamic Form -->
      <div>
        <LoginForm v-if="activeTab === 'login'" />
        <RegisterForm v-else />
      </div>

      <!-- Divider -->
      <div class="mt-6 flex items-center">
        <div class="flex-grow h-px bg-gray-200"></div>
        <span class="px-3 text-sm text-gray-400">Or continue with</span>
        <div class="flex-grow h-px bg-gray-200"></div>
      </div>

      <!-- Social Login Buttons -->
      <div class="mt-6 grid grid-cols-2 gap-4">
        <button
          type="button"
          class="w-full flex items-center justify-center gap-2 border rounded-lg py-2 hover:bg-gray-50 text-sm text-gray-700"
        >
          <img src="" alt="Google" class="h-5 w-5" />
          Google
        </button>
        <button
          type="button"
          class="w-full flex items-center justify-center gap-2 border rounded-lg py-2 hover:bg-gray-50 text-sm text-gray-700"
        >
          <img src="" alt="Apple" class="h-5 w-5" />
          Apple
        </button>
      </div>
    </div>
  </div>
</template>
