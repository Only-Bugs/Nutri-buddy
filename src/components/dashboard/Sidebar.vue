<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const auth = useAuthStore()

async function handleLogout() {
  await auth.logout()
  router.push('/')
}
</script>

<template>
  <aside class="w-64 bg-white border-r min-h-screen p-4 space-y-4">
    <h1 class="text-xl font-bold text-green-600">NutriBuddy</h1>
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
    <button
      @click="handleLogout"
      class="text-red-500 font-medium mt-4 w-full text-left px-3 py-2 rounded hover:bg-red-50"
    >
      Logout
    </button>
  </aside>
</template>
