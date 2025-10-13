/** * @file NutritionHistoryTable.vue * @description Consistent “Recent Nutrition Searches” card for
the dashboard. * Uses DashboardCard wrapper to standardize padding, radius, and title hierarchy. *
@module components/dashboard/NutritionHistoryTable * */

<script setup>
import RatingStars from '@/components/shared/RatingStars.vue'
import { useRatingsStore } from '@/store/ratings'
import DashboardCard from '@/components/dashboard/DashboardCard.vue'

const props = defineProps({
  foods: { type: Array, default: () => [] },
})
const ratings = useRatingsStore()
const emit = defineEmits(['rate'])
</script>

<template>
  <DashboardCard v-if="foods.length" title="Recent Nutrition Searches">
    <div class="overflow-x-auto">
      <table class="w-full border-collapse text-lg text-gray-700">
        <thead>
          <tr class="bg-gray-100 text-gray-700">
            <th class="px-3 py-2 text-left font-semibold">Name</th>
            <th class="px-3 py-2 text-left font-semibold">Qty</th>
            <th class="px-3 py-2 text-left font-semibold">Measure</th>
            <th class="px-3 py-2 text-left font-semibold">Weight (g)</th>
            <th class="px-3 py-2 text-left font-semibold">Calories</th>
            <th class="px-3 py-2 text-left font-semibold">Protein (g)</th>
            <th class="px-3 py-2 text-left font-semibold">Carbs (g)</th>
            <th class="px-3 py-2 text-left font-semibold">Fat (g)</th>
            <th class="px-3 py-2 text-left font-semibold">Cautions</th>
            <th class="px-3 py-2 text-left font-semibold">Rating</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="food in foods"
            :key="food.id"
            class="odd:bg-white even:bg-gray-50 hover:bg-green-50 transition-colors"
          >
            <td class="px-3 py-2 font-medium">{{ food.name }}</td>
            <td class="px-3 py-2">{{ food.quantity }}</td>
            <td class="px-3 py-2">{{ food.measure }}</td>
            <td class="px-3 py-2">{{ food.weight }}</td>
            <td class="px-3 py-2">{{ food.calories }}</td>
            <td class="px-3 py-2 text-blue-600">{{ food.protein }}</td>
            <td class="px-3 py-2 text-green-600">{{ food.carbs }}</td>
            <td class="px-3 py-2 text-purple-600">{{ food.fat }}</td>

            <td class="px-3 py-2">
              <span
                v-if="food.cautions && food.cautions.length"
                class="text-base bg-red-100 text-red-700 px-2 py-1 rounded"
              >
                {{ food.cautions.join(', ') }}
              </span>
              <span v-else class="text-base text-gray-400">None</span>
            </td>

            <td class="px-3 py-2 text-center">
              <RatingStars :modelValue="0" @update:modelValue="emit('rate', food.id, $event)" />
              <div class="text-base text-gray-600 mt-1">Avg: {{ ratings.getAverage(food.id) }}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </DashboardCard>
</template>
