<script setup>
import { useAuthActions } from '@/composables/useAuthActions'

/**
 * Extracts logout handler from the composable that bridges
 * user interface events with store-based authentication logic.
 */
const { handleLogout } = useAuthActions()
</script>

<template>
  <aside class="w-64 bg-white border-r min-h-screen p-4 space-y-4">
    <!-- Brand -->
    <h1 class="text-xl font-bold text-green-600">NutriBuddy</h1>

    <!-- Navigation Links -->
    <nav class="space-y-2">
      <RouterLink
        to="/dashboard"
        class="block px-3 py-2 rounded hover:bg-gray-100"
        active-class="bg-green-50 text-green-600 font-medium"
      >
        Dashboard
      </RouterLink>

      <RouterLink
        to="/meal-plans"
        class="block px-3 py-2 rounded hover:bg-gray-100"
        active-class="bg-green-50 text-green-600 font-medium"
      >
        Meal Plans
      </RouterLink>

      <RouterLink
        to="/profile"
        class="block px-3 py-2 rounded hover:bg-gray-100"
        active-class="bg-green-50 text-green-600 font-medium"
      >
        Profile
      </RouterLink>
    </nav>

    <!-- Logout Button -->
    <button
      @click="handleLogout"
      class="text-red-500 font-medium mt-4 w-full text-left px-3 py-2 rounded hover:bg-red-50"
    >
      Logout
    </button>
  </aside>
</template>
