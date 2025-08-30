<script setup>
/**
 * DashboardPage.vue
 *
 * Placeholder dashboard for authenticated users.
 */
import { useAuthStore } from '../store/auth'

const auth = useAuthStore()
</script>

<template>
  <div class="text-center">
    <h2 class="text-3xl font-bold">Welcome to NutriBuddy</h2>
    <p class="mt-4">
      Logged in as: <strong>{{ auth.user?.email }}</strong>
    </p>
  </div>
</template>
