<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../store/auth'
import { useRatingsStore } from '../store/ratings'
import RatingStars from '../components/RatingStars.vue'

const auth = useAuthStore()
const ratings = useRatingsStore()

const foods = ref([])

onMounted(async () => {
  const res = await fetch('/data/foods.json')
  foods.value = await res.json()
})

function rateFood(foodId, score) {
  ratings.addRating(foodId, score)
}
</script>

<template>
  <div class="space-y-6 w-full max-w-3xl mx-auto">
    <div class="text-center">
      <h2 class="text-3xl font-bold">Welcome to NutriBuddy</h2>
      <p class="mt-2">
        Logged in as: <strong>{{ auth.user?.email }}</strong>
      </p>
    </div>

    <div>
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
          <tr v-for="food in foods" :key="food.id" class="odd:bg-white even:bg-gray-50">
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
