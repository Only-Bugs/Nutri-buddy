/** * @file AuthPage.vue * @description Authentication page for NutriBuddy. * Combines login and
registration forms with tab-based navigation * and supports Google sign-in via Firebase
Authentication. * @module pages/AuthPage */

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import LoginForm from '@/components/auth/LoginForm.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'

/** Reactive state for active tab: 'login' or 'register'. */
const activeTab = ref('login')
const isGoogleLoading = ref(false)

/** Store, router, and toast initialization. */
const auth = useAuthStore()
const router = useRouter()
const { showToast } = useToast()

/**
 * Handles Google sign-in through Firebase Authentication.
 * On success, navigates to the dashboard and displays a success toast.
 * On failure, displays an error toast message.
 * @async
 * @function handleGoogleLogin
 * @returns {Promise<void>}
 */
async function handleGoogleLogin() {
  if (isGoogleLoading.value) return
  isGoogleLoading.value = true
  try {
    const ok = await auth.loginWithGoogle()
    if (ok) {
      showToast('Signed in with Google!', 'success')
      router.push('/dashboard')
    } else {
      showToast('Google login failed. Please try again.', 'error')
    }
  } finally {
    isGoogleLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
      <!-- Header -->
      <div class="text-center mb-6">
        <div
          class="mx-auto h-12 w-12 bg-green-600 text-white flex items-center justify-center rounded-full text-lg font-bold"
        >
          NB
        </div>
        <h2 class="mt-4 text-2xl font-bold text-gray-900">Welcome to Nutri-Buddy</h2>
        <p class="mt-1 text-lg text-gray-500">Please sign in or create a new account</p>
      </div>

      <!-- Tabs -->
      <div class="flex border-b border-gray-200 mb-6">
        <button
          class="flex-1 py-2 text-center text-lg font-medium"
          :class="
            activeTab === 'login' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500'
          "
          @click="activeTab = 'login'"
        >
          Sign In
        </button>
        <button
          class="flex-1 py-2 text-center text-lg font-medium"
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

      <!-- Active Form -->
      <div>
        <LoginForm v-if="activeTab === 'login'" />
        <RegisterForm v-else />
      </div>

      <!-- Divider -->
      <div class="mt-6 flex items-center">
        <div class="flex-grow h-px bg-gray-200"></div>
        <span class="px-3 text-lg text-gray-400">Or continue with</span>
        <div class="flex-grow h-px bg-gray-200"></div>
      </div>

      <!-- Social Login Buttons -->
      <div class="mt-6 grid grid-cols-2 gap-4">
        <button
          type="button"
          @click="handleGoogleLogin"
          :disabled="isGoogleLoading"
          :aria-busy="isGoogleLoading"
          class="w-full flex items-center justify-center gap-3 border rounded-lg py-2 text-lg text-gray-700 transition"
          :class="isGoogleLoading ? 'cursor-wait bg-gray-50 opacity-90' : 'hover:bg-gray-50'"
        >
          <svg
            v-if="!isGoogleLoading"
            class="h-5 w-5 text-green-600"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              d="M12 3a9 9 0 100 18 8.9 8.9 0 005.93-2.2l-2.35-2a5.17 5.17 0 01-3.58 1.37 5.16 5.16 0 110-10.32 5 5 0 013.94 1.86l1.54-1.54A7.9 7.9 0 0012 3z"
            />
            <path d="M21 12.5h-7.5v-3h7.5v3z" />
          </svg>
          <svg
            v-else
            class="h-5 w-5 animate-spin text-green-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <span class="font-medium">
            {{ isGoogleLoading ? 'Connecting...' : 'Google' }}
          </span>
        </button>
        <button
          type="button"
          disabled
          class="w-full flex items-center justify-center gap-3 border rounded-lg py-2 bg-gray-100 text-gray-400 cursor-not-allowed text-lg"
        >
          <FontAwesomeIcon :icon="['fas', 'apple-whole']" class="h-5 w-5 text-gray-400" />
          <span class="font-medium">Apple</span>
        </button>
      </div>
    </div>
  </div>
</template>
