<script setup>
/**
 * LoginPage.vue
 *
 * Renders the login page with a responsive card.
 */
import LoginForm from '../components/forms/LoginForm.vue'
</script>

<template>
  <div class="w-full sm:max-w-md bg-white shadow-md p-6 rounded-md">
    <h2 class="text-2xl font-bold mb-4 text-center">Login</h2>
    <LoginForm />
    <p class="mt-4 text-sm text-center">
      Don’t have an account?
      <router-link to="/register" class="text-blue-600 underline"> Register </router-link>
    </p>
  </div>
</template>
