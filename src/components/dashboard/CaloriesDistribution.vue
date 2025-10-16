<script setup>
/**
 * Visualises macro calorie split for the latest nutrition lookup.
 * Falls back to an empty state if no totals are available yet.
 */
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import DashboardCard from '@/components/dashboard/DashboardCard.vue'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const props = defineProps({
  totals: {
    type: Object,
    default: () => ({
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
    }),
  },
  mealBreakdown: {
    type: Array,
    default: () => [],
  },
})

const macroBreakdown = computed(() => {
  const protein = Number(props.totals?.protein) || 0
  const carbs = Number(props.totals?.carbs) || 0
  const fats = Number(props.totals?.fats ?? props.totals?.fat) || 0
  const fiber = Number(props.totals?.fiber) || 0

  return [
    { label: 'Protein', grams: protein, color: '#16a34a' },
    { label: 'Carbs', grams: carbs, color: '#3b82f6' },
    { label: 'Fats', grams: fats, color: '#f59e0b' },
    { label: 'Fiber', grams: fiber, color: '#22c55e' },
  ]
})

const hasData = computed(() => macroBreakdown.value.some((item) => item.grams > 0))

const mealPalette = ['#16a34a', '#3b82f6', '#f59e0b', '#9333ea', '#ec4899', '#0ea5e9']

const hasMealBreakdown = computed(() => props.mealBreakdown && props.mealBreakdown.length > 0)

const chartData = computed(() => {
  if (hasMealBreakdown.value) {
    return {
      labels: props.mealBreakdown.map((meal) => meal.label),
      datasets: [
        {
          data: props.mealBreakdown.map((meal) => Number(meal.calories) || 0),
          backgroundColor: props.mealBreakdown.map(
            (_, index) => mealPalette[index % mealPalette.length],
          ),
          borderWidth: 0,
        },
      ],
    }
  }

  return {
    labels: macroBreakdown.value.map((item) => item.label),
    datasets: [
      {
        data: macroBreakdown.value.map((item) => item.grams),
        backgroundColor: macroBreakdown.value.map((item) => item.color),
        borderWidth: 0,
      },
    ],
  }
})

const mealTooltipDetails = computed(() => {
  if (!hasMealBreakdown.value) return {}
  return props.mealBreakdown.reduce((acc, meal) => {
    acc[meal.label] = {
      protein: Number(meal.protein) || 0,
      carbs: Number(meal.carbs) || 0,
      fats: Number(meal.fats) || 0,
    }
    return acc
  }, {})
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { usePointStyle: true, boxWidth: 8 },
    },
    tooltip: {
      callbacks: {
        label(context) {
          if (!hasMealBreakdown.value) {
            return `${context.label}: ${context.parsed} g`
          }
          const details = mealTooltipDetails.value[context.label]
          if (!details) return `${context.label}: ${context.parsed} kcal`
          return [
            `${context.label}: ${context.parsed} kcal`,
            `Protein: ${details.protein.toFixed(1)} g`,
            `Carbs: ${details.carbs.toFixed(1)} g`,
            `Fat: ${details.fats.toFixed(1)} g`,
          ]
        },
      },
    },
  },
}

const mealLegend = computed(() => {
  if (!hasMealBreakdown.value) return []
  return props.mealBreakdown.map((meal, index) => ({
    label: meal.label,
    calories: Number(meal.calories) || 0,
    protein: Number(meal.protein) || 0,
    carbs: Number(meal.carbs) || 0,
    fats: Number(meal.fats) || 0,
    color: mealPalette[index % mealPalette.length],
  }))
})
</script>

<template>
  <DashboardCard title="Calorie Distribution">
    <div v-if="hasData || hasMealBreakdown" class="space-y-4">
      <div class="h-64">
        <div class="relative h-full">
          <Doughnut :data="chartData" :options="chartOptions" />
          <div
            class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-gray-800"
          >
            <p class="text-3xl font-bold">
              {{ (totals.calories || 0).toFixed(1) }}
            </p>
            <span class="text-base uppercase text-gray-500">kcal</span>
          </div>
        </div>
      </div>

      <template v-if="hasMealBreakdown">
        <ul class="space-y-2 text-sm">
          <li
            v-for="meal in mealLegend"
            :key="meal.label"
            class="flex items-center justify-between gap-3 rounded-lg bg-gray-50 px-3 py-2"
          >
            <div class="flex items-center gap-2">
              <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: meal.color }" />
              <span class="font-medium text-gray-700">{{ meal.label }}</span>
            </div>
            <div class="flex items-center gap-3 text-xs text-gray-500">
              <span class="font-semibold text-gray-700">{{ meal.calories.toFixed(0) }} kcal</span>
              <span>Protein {{ meal.protein.toFixed(1) }} g</span>
              <span>Carbs {{ meal.carbs.toFixed(1) }} g</span>
              <span>Fat {{ meal.fats.toFixed(1) }} g</span>
            </div>
          </li>
        </ul>
      </template>

      <template v-else>
        <ul class="space-y-2 text-sm">
          <li
            v-for="metric in macroBreakdown"
            :key="metric.label"
            class="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
          >
            <div class="flex items-center gap-2">
              <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: metric.color }" />
              <span class="font-medium text-gray-700">{{ metric.label }}</span>
            </div>
            <span class="text-sm font-semibold text-gray-800">{{ metric.grams.toFixed(1) }} g</span>
          </li>
        </ul>
      </template>
    </div>
    <p v-else class="text-base text-gray-500">
      Search for a food or add meals to a plan to see calorie insights.
    </p>
  </DashboardCard>
</template>
