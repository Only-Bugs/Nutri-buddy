<script setup>
import { ref } from 'vue'
import { getNutritionData } from '../../services/nutritionService'

const query = ref('')
const results = ref(null)
const loading = ref(false)
const error = ref(null)

async function search() {
  if (!query.value.trim()) return
  loading.value = true
  error.value = null
  results.value = null

  try {
    results.value = await getNutritionData(query.value)
  } catch (err) {
    error.value = err?.message || 'Failed to fetch'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="bg-white shadow-sm rounded-xl p-4 mb-6">
    <div class="flex gap-2">
      <input
        v-model="query"
        type="text"
        placeholder="Search food (e.g., 2 pineapples)"
        class="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <button
        @click="search"
        class="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
      >
        Search
      </button>
    </div>

    <div v-if="loading" class="text-gray-500 mt-3">Loading...</div>
    <div v-if="error" class="text-red-500 mt-3">{{ error }}</div>

    <div v-if="results" class="mt-4 text-sm">
      <p><strong>Query:</strong> {{ results.query }}</p>
      <p><strong>Calories:</strong> {{ results.calories }}</p>
      <p><strong>Total Weight:</strong> {{ results.totalWeight }} g</p>
      <div class="mt-2">
        <h4 class="font-semibold">Nutrients:</h4>
        <ul class="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
          <li v-for="(nutrient, key) in results.totalNutrients" :key="key" class="text-gray-600">
            {{ nutrient.label }}: {{ nutrient.quantity.toFixed(1) }} {{ nutrient.unit }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<!--   -->
