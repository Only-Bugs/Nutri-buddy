<script setup>
import RatingStars from '@/components/RatingStars.vue'
import { useRatingsStore } from '@/store/ratings'

const props = defineProps({
  foods: Array,
})

const ratings = useRatingsStore()

function rateFood(foodId, score) {
  ratings.addRating(foodId, score)
}
</script>

<template>
  <div class="bg-white shadow rounded-lg p-6">
    <h3 class="text-lg font-semibold mb-4">Food Database</h3>
    <table class="w-full border-collapse">
      <thead>
        <tr class="bg-gray-100 text-left text-sm font-medium text-gray-600">
          <th class="px-4 py-2">Food Name</th>
          <th class="px-4 py-2">Category</th>
          <th class="px-4 py-2">Calories</th>
          <th class="px-4 py-2">Your Rating</th>
          <th class="px-4 py-2">Avg Rating</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="food in foods" :key="food.id" class="border-t border-gray-200 hover:bg-gray-50">
          <td class="px-4 py-2">{{ food.name }}</td>
          <td class="px-4 py-2">{{ food.category }}</td>
          <td class="px-4 py-2">{{ food.calories }}</td>
          <td class="px-4 py-2 text-center">
            <RatingStars :modelValue="0" @update:modelValue="rateFood(food.id, $event)" />
          </td>
          <td class="px-4 py-2 text-sm text-gray-600 text-center">
            {{ ratings.getAverage(food.id) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
