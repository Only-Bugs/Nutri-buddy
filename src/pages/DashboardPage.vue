/** * @file DashboardPage.vue * @description Dashboard view that displays user info, food search, *
and nutrition data sourced via the dashboard store. * @module pages/DashboardPage */

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useRatingsStore } from '@/store/ratings'
import { useDashboardStore } from '@/store/dashboard'
import RatingStars from '@/components/RatingStars.vue'

const auth = useAuthStore()
const ratings = useRatingsStore()
const dashboard = useDashboardStore()

const query = ref('')

/** Load initial foods from local dataset */
onMounted(() => {
  dashboard.fetchLocalFoods()
})

/** Trigger live or local search */
function handleSearch() {
  dashboard.searchFood(query.value)
}

/** Handle rating updates */
function rateFood(foodId, score) {
  ratings.addRating(foodId, score)
}
</script>

<template>
  <div class="space-y-6 w-full max-w-4xl mx-auto">
    <!-- Header -->
    <div class="text-center">
      <h2 class="text-3xl font-bold">Welcome to NutriBuddy</h2>
      <p class="mt-2">
        Logged in as: <strong>{{ auth.user?.email }}</strong>
      </p>
    </div>

    <!-- Search Bar -->
    <div class="flex items-center gap-3">
      <input
        v-model="query"
        type="text"
        placeholder="Search food..."
        class="border rounded-lg px-3 py-2 flex-1"
      />
      <button
        @click="handleSearch"
        class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Search
      </button>
    </div>

    <!-- Loading & Error States -->
    <div v-if="dashboard.loading" class="text-gray-500">Loading…</div>
    <div v-if="dashboard.error" class="text-red-500">{{ dashboard.error }}</div>

    <!-- Foods Table -->
    <div v-if="dashboard.foods.length">
      <h3 class="text-xl font-semibold mb-2">Nutrition List</h3>
      <table class="w-full border-collapse border border-gray-300">
        <thead>
          <tr class="bg-gray-100">
            <th class="border px-3 py-2 text-left">Name</th>
            <th class="border px-3 py-2 text-left">Category</th>
            <th class="border px-3 py-2 text-left">Calories</th>
            <th class="border px-3 py-2 text-left">Rating</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="food in dashboard.foods" :key="food.id" class="odd:bg-white even:bg-gray-50">
            <td class="border px-3 py-2">{{ food.name }}</td>
            <td class="border px-3 py-2">{{ food.category }}</td>
            <td class="border px-3 py-2">{{ food.calories }}</td>
            <td class="border px-3 py-2">
              <RatingStars :modelValue="0" @update:modelValue="rateFood(food.id, $event)" />
              <div class="text-sm text-gray-600 mt-1">Avg: {{ ratings.getAverage(food.id) }}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<!--   -->
