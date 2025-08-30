<script setup>
/**
 * AdminPage.vue
 *
 * Accessible only to admin role users.
 */
import { useAuthStore } from '../store/auth'

const auth = useAuthStore()
</script>

<template>
  <div class="text-center">
    <h2 class="text-3xl font-bold text-red-600">Admin Panel</h2>
    <p class="mt-4">
      Welcome, <strong>{{ auth.user?.email }}</strong
      >. You have admin privileges.
    </p>
  </div>
</template>
