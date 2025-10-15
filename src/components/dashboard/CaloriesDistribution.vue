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

const chartData = computed(() => ({
  labels: macroBreakdown.value.map((item) => item.label),
  datasets: [
    {
      data: macroBreakdown.value.map((item) => item.grams),
      backgroundColor: macroBreakdown.value.map((item) => item.color),
      borderWidth: 0,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { usePointStyle: true, boxWidth: 8 },
    },
  },
}
</script>

<template>
  <DashboardCard title="Calorie Distribution">
    <div v-if="hasData" class="h-64">
      <div class="relative h-full">
        <Doughnut :data="chartData" :options="chartOptions" />
        <div
          class="absolute inset-0 flex flex-col items-center justify-center text-gray-800 pointer-events-none"
        >
          <p class="text-3xl font-bold">
            {{ totals.calories ? totals.calories.toFixed(1) : '0.0' }}
          </p>
          <span class="text-base uppercase text-gray-500">kcal</span>
        </div>
      </div>
    </div>
    <p v-else class="text-base text-gray-500">
      Search for a food to see its calorie distribution.
    </p>
  </DashboardCard>
</template>
