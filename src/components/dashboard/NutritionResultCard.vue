/** * @file NutritionResultCard.vue * @description Unified nutrition result card using DashboardCard
wrapper. * Visual consistency: shared padding, shadow, and typography baseline. * @module
components/dashboard/NutritionResultCard * */

<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { groupNutrients } from '@utils/nutrientGroups'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { Chart as ChartJS, Title, Tooltip, ArcElement, Legend } from 'chart.js'
import DashboardCard from '@/components/dashboard/DashboardCard.vue'

ChartJS.register(Title, Tooltip, ArcElement, Legend)

const props = defineProps({
  foodData: { type: Object, default: null },
  query: { type: String, default: '' },
})

const emit = defineEmits(['add-to-plan'])

const { vitamins, minerals, others } = groupNutrients(props.foodData?.nutrients || {})

const macros = computed(() => {
  const n = props.foodData?.nutrients || {}
  return {
    protein: n.PROCNT?.quantity || 0,
    carbs: n.CHOCDF?.quantity || 0,
    fats: n.FAT?.quantity || 0,
    fiber: n.FIBTG?.quantity || 0,
  }
})

const chartData = computed(() => ({
  labels: ['Protein', 'Carbs', 'Fats', 'Fiber'],
  datasets: [
    {
      data: [macros.value.protein, macros.value.carbs, macros.value.fats, macros.value.fiber],
      backgroundColor: ['#ef4444', '#3b82f6', '#eab308', '#22c55e'],
      borderWidth: 0,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
}
</script>

<template>
  <!-- Main content -->
  <DashboardCard v-if="foodData && foodData.nutrients">
    <!-- Header -->
    <div class="flex justify-between items-start mb-5">
      <div>
        <h2 class="dash-title capitalize">{{ foodData.food }}</h2>
        <p class="dash-subtitle">Raw, Fresh</p>
      </div>
      <span class="text-base font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">
        USDA
      </span>
    </div>

    <!-- Quick stats -->
    <div class="flex flex-wrap gap-4 text-lg text-gray-700 mb-6">
      <div class="flex items-center gap-2">
        <FontAwesomeIcon icon="apple-whole" class="dash-accent" />
        <span>{{ foodData.quantity }} {{ foodData.measure }}</span>
      </div>
      <div class="flex items-center gap-2">
        <FontAwesomeIcon icon="vial" class="text-blue-600" />
        <span>{{ foodData.weight.toFixed(1) }} g total weight</span>
      </div>
      <div class="flex items-center gap-2">
        <FontAwesomeIcon icon="chart-line" class="text-red-500" />
        <span> {{ (foodData.calories / foodData.weight).toFixed(1) }} kcal/g density </span>
      </div>
    </div>

    <!-- Overview -->
    <h3 class="text-lg font-semibold mb-3 text-gray-800">Nutritional Overview</h3>

    <div class="grid md:grid-cols-2 gap-6 items-center">
      <!-- Donut chart -->
      <div class="relative w-48 h-48 mx-auto">
        <Doughnut :data="chartData" :options="chartOptions" />
        <div class="absolute inset-0 flex flex-col items-center justify-center text-gray-800">
          <p class="text-3xl font-bold">{{ foodData.calories }}</p>
          <p class="text-base uppercase text-gray-500">kcal</p>
        </div>
      </div>

      <!-- Macro cards -->
      <div class="grid grid-cols-2 gap-3">
        <div class="rounded-lg bg-red-50 p-3 text-center font-semibold text-red-600">
          {{ macros.protein.toFixed(1) }} g
          <p class="text-base text-gray-500">Protein</p>
        </div>
        <div class="rounded-lg bg-blue-50 p-3 text-center font-semibold text-blue-600">
          {{ macros.carbs.toFixed(1) }} g
          <p class="text-base text-gray-500">Carbs</p>
        </div>
        <div class="rounded-lg bg-yellow-50 p-3 text-center font-semibold text-yellow-600">
          {{ macros.fats.toFixed(1) }} g
          <p class="text-base text-gray-500">Fats</p>
        </div>
        <div class="rounded-lg bg-green-50 p-3 text-center font-semibold text-green-600">
          {{ macros.fiber.toFixed(1) }} g
          <p class="text-base text-gray-500">Fiber</p>
        </div>
      </div>
    </div>

    <!-- Grouped nutrients -->
    <div class="mt-6 divide-y divide-gray-200">
      <details open class="py-2">
        <summary class="cursor-pointer font-semibold flex items-center gap-2 text-orange-600">
          <FontAwesomeIcon icon="bolt" /> Vitamins
        </summary>
        <ul class="grid grid-cols-2 gap-y-1 mt-2 text-lg text-gray-600">
          <li v-for="v in vitamins" :key="v.label">
            {{ v.label }} — {{ v.quantity.toFixed(1) }} {{ v.unit }}
          </li>
        </ul>
      </details>

      <details class="py-2">
        <summary class="cursor-pointer font-semibold flex items-center gap-2 text-purple-600">
          <FontAwesomeIcon icon="diamond" /> Minerals
        </summary>
        <ul class="grid grid-cols-2 gap-y-1 mt-2 text-lg text-gray-600">
          <li v-for="m in minerals" :key="m.label">
            {{ m.label }} — {{ m.quantity.toFixed(1) }} {{ m.unit }}
          </li>
        </ul>
      </details>

      <details class="py-2">
        <summary class="cursor-pointer font-semibold flex items-center gap-2 text-teal-600">
          <FontAwesomeIcon icon="vial" /> Other Nutrients
        </summary>
        <ul class="grid grid-cols-2 gap-y-1 mt-2 text-lg text-gray-600">
          <li v-for="n in others" :key="n.label">
            {{ n.label }} — {{ n.quantity.toFixed(1) }} {{ n.unit }}
          </li>
        </ul>
      </details>
    </div>

    <!-- Actions -->
    <div class="flex flex-wrap gap-3 mt-6">
      <button
        class="flex-1 bg-green-600 text-white rounded-lg py-2 hover:bg-green-700 flex items-center justify-center gap-2"
        @click="emit('add-to-plan')"
      >
        <FontAwesomeIcon icon="plus" /> Add to Meal
      </button>
      <button
        class="flex-1 border border-gray-300 rounded-lg py-2 hover:bg-gray-50 flex items-center justify-center gap-2"
      >
        <FontAwesomeIcon icon="bookmark" /> Save to Favorites
      </button>
    </div>
  </DashboardCard>

  <!-- Fallback -->
  <div v-else-if="query" class="text-center text-gray-600 mt-6">
    <p class="font-medium">We’re updating our database. Check again soon.</p>
    <p class="text-lg text-gray-500 mt-1">
      For best results, be specific — e.g., “100 g grilled chicken breast”.
    </p>
  </div>
</template>
