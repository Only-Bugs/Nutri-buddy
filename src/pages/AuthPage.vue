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
  const ok = await auth.loginWithGoogle()
  if (ok) {
    showToast('Signed in with Google!', 'success')
    router.push('/dashboard')
  } else {
    showToast('Google login failed. Please try again.', 'error')
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
          class="w-full flex items-center justify-center gap-2 border rounded-lg py-2 hover:bg-gray-50 text-lg text-gray-700"
        >
          <img src="" alt="Google" class="h-5 w-5" />
          Google
        </button>
        <button
          type="button"
          disabled
          class="w-full flex items-center justify-center gap-2 border rounded-lg py-2 bg-gray-100 text-gray-400 cursor-not-allowed text-lg"
        >
          <img src="" alt="Apple" class="h-5 w-5" />
          Apple
        </button>
      </div>
    </div>
  </div>
</template>
