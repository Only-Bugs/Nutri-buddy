<script setup>
/**
 * RegisterPage.vue
 *
 * Renders the registration page with a responsive card.
 */
import RegisterForm from '../components/forms/RegisterForm.vue'
</script>

<template>
  <div class="w-full sm:max-w-md bg-white shadow-md p-6 rounded-md">
    <h2 class="text-2xl font-bold mb-4 text-center">Register</h2>
    <RegisterForm />
    <p class="mt-4 text-sm text-center">
      Already have an account?
      <router-link to="/login" class="text-blue-600 underline"> Login </router-link>
    </p>
  </div>
</template>
