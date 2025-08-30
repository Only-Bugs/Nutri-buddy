<script setup>
/**
 * DashboardPage.vue
 *
 * Displays the logged-in user’s email and a dynamic food list
 * loaded from /public/data/foods.json.
 */
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../store/auth'

const auth = useAuthStore()
const foods = ref([])

onMounted(async () => {
  try {
    const res = await fetch('/data/foods.json') // JSON served from public/
    if (res.ok) {
      foods.value = await res.json()
    } else {
      console.error('Failed to load foods.json')
    }
  } catch (err) {
    console.error('Error loading foods.json:', err)
  }
})
</script>

<template>
  <div class="space-y-6 w-full max-w-2xl mx-auto">
    <!-- User info -->
    <div class="text-center">
      <h2 class="text-3xl font-bold">Welcome to NutriBuddy</h2>
      <p class="mt-2">
        Logged in as: <strong>{{ auth.user?.email }}</strong>
      </p>
    </div>

    <!-- Food list -->
    <div>
      <h3 class="text-xl font-semibold mb-2">Nutrition List</h3>
      <table class="w-full border-collapse border border-gray-300">
        <thead>
          <tr class="bg-gray-100">
            <th class="border border-gray-300 px-3 py-2 text-left">Name</th>
            <th class="border border-gray-300 px-3 py-2 text-left">Category</th>
            <th class="border border-gray-300 px-3 py-2 text-left">Calories</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="food in foods" :key="food.id" class="odd:bg-white even:bg-gray-50">
            <td class="border border-gray-300 px-3 py-2">{{ food.name }}</td>
            <td class="border border-gray-300 px-3 py-2">{{ food.category }}</td>
            <td class="border border-gray-300 px-3 py-2">{{ food.calories }}</td>
          </tr>
        </tbody>
      </table>

      <p v-if="foods.length === 0" class="text-gray-500 mt-2">No food data available.</p>
    </div>
  </div>
</template>
