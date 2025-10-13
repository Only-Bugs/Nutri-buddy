<script setup>
import RatingStars from '@/components/RatingStars.vue'
import { useRatingsStore } from '@/store/ratings'

const props = defineProps({
  foods: { type: Array, default: () => [] },
})
const ratings = useRatingsStore()
const emit = defineEmits(['rate'])
</script>

<template>
  <div v-if="foods.length">
    <h3 class="text-xl font-semibold mb-2">Recent Nutrition Searches</h3>
    <table class="w-full border-collapse border border-gray-300 text-sm">
      <thead>
        <tr class="bg-gray-100 text-gray-700">
          <th class="border px-3 py-2 text-left">Name</th>
          <th class="border px-3 py-2 text-left">Qty</th>
          <th class="border px-3 py-2 text-left">Measure</th>
          <th class="border px-3 py-2 text-left">Weight (g)</th>
          <th class="border px-3 py-2 text-left">Calories</th>
          <th class="border px-3 py-2 text-left">Protein (g)</th>
          <th class="border px-3 py-2 text-left">Carbs (g)</th>
          <th class="border px-3 py-2 text-left">Fat (g)</th>
          <th class="border px-3 py-2 text-left">Cautions</th>
          <th class="border px-3 py-2 text-left">Rating</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="food in foods"
          :key="food.id"
          class="odd:bg-white even:bg-gray-50 hover:bg-green-50 transition"
        >
          <td class="border px-3 py-2 font-medium">{{ food.name }}</td>
          <td class="border px-3 py-2">{{ food.quantity }}</td>
          <td class="border px-3 py-2">{{ food.measure }}</td>
          <td class="border px-3 py-2">{{ food.weight }}</td>
          <td class="border px-3 py-2">{{ food.calories }}</td>
          <td class="border px-3 py-2 text-blue-600">{{ food.protein }}</td>
          <td class="border px-3 py-2 text-green-600">{{ food.carbs }}</td>
          <td class="border px-3 py-2 text-purple-600">{{ food.fat }}</td>
          <td class="border px-3 py-2">
            <span
              v-if="food.cautions && food.cautions.length"
              class="text-xs bg-red-100 text-red-700 px-2 py-1 rounded"
            >
              {{ food.cautions.join(', ') }}
            </span>
            <span v-else class="text-xs text-gray-400">None</span>
          </td>
          <td class="border px-3 py-2">
            <RatingStars :modelValue="0" @update:modelValue="emit('rate', food.id, $event)" />
            <div class="text-xs text-gray-600 mt-1">Avg: {{ ratings.getAverage(food.id) }}</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
