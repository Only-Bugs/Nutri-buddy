<script setup>
/**
 * Summarises key macro + micro totals for the latest nutrition search.
 * Includes quick labels to guide users toward the Save-to-Meal flow.
 */
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import DashboardCard from '@/components/dashboard/DashboardCard.vue'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

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
  nutrients: {
    type: Object,
    default: () => ({}),
  },
})

function readNutrient(nutrients, key) {
  const entry = nutrients?.[key]
  const numeric = Number(entry?.quantity)
  return Number.isFinite(numeric) ? numeric : 0
}

const nutrientPalette = [
  '#16a34a',
  '#3b82f6',
  '#f59e0b',
  '#9333ea',
  '#ec4899',
  '#0ea5e9',
  '#6366f1',
]

const dataPoints = computed(() => {
  const items = [
    { key: 'fiber', label: 'Fiber', value: Number(props.totals?.fiber || 0), unit: 'g' },
    { key: 'sugar', label: 'Sugar', value: Number(props.totals?.sugar || 0), unit: 'g' },
    { key: 'sodium', label: 'Sodium', value: Number(props.totals?.sodium || 0), unit: 'mg' },
    { key: 'vitaminC', label: 'Vitamin C', value: readNutrient(props.nutrients, 'VITC'), unit: 'mg' },
    { key: 'calcium', label: 'Calcium', value: readNutrient(props.nutrients, 'CA'), unit: 'mg' },
    { key: 'iron', label: 'Iron', value: readNutrient(props.nutrients, 'FE'), unit: 'mg' },
    { key: 'potassium', label: 'Potassium', value: readNutrient(props.nutrients, 'K'), unit: 'mg' },
  ]
  return items
})

const hasData = computed(() => dataPoints.value.some((item) => item.value > 0))

const chartData = computed(() => ({
  labels: dataPoints.value.map((item) => item.label),
  datasets: [
    {
      label: 'Quantity',
      data: dataPoints.value.map((item) => Number(item.value.toFixed(2))),
      backgroundColor: dataPoints.value.map(
        (_, index) => nutrientPalette[index % nutrientPalette.length],
      ),
      borderRadius: 6,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label(context) {
          const index = context.dataIndex
          const point = dataPoints.value[index]
          if (!point) return `${context.parsed.y}`
          return `${point.label}: ${point.value.toFixed(1)} ${point.unit}`
        },
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: '#6b7280',
        font: { size: 10 },
      },
      grid: { display: false },
    },
    y: {
      ticks: {
        color: '#9ca3af',
        font: { size: 10 },
      },
      grid: {
        color: '#e5e7eb',
        drawBorder: false,
      },
      beginAtZero: true,
    },
  },
}

const legend = computed(() =>
  dataPoints.value.map((item, index) => ({
    ...item,
    color: nutrientPalette[index % nutrientPalette.length],
  })),
)
</script>

<template>
  <DashboardCard title="Nutrition Distribution">
    <div v-if="hasData" class="space-y-4">
      <div class="h-60">
        <Bar :data="chartData" :options="chartOptions" />
      </div>
      <ul class="grid grid-cols-2 gap-3 text-xs text-gray-500">
        <li
          v-for="item in legend"
          :key="item.key"
          class="flex items-center justify-between gap-3 rounded-lg bg-gray-50 px-3 py-2"
        >
          <div class="flex items-center gap-2">
            <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: item.color }" />
            <span class="font-medium text-gray-700">{{ item.label }}</span>
          </div>
          <span class="font-semibold text-gray-800">{{ item.value.toFixed(1) }} {{ item.unit }}</span>
        </li>
      </ul>
    </div>
    <p v-else class="text-base text-gray-500">Run a nutrition search to view the nutrient split.</p>
  </DashboardCard>
</template>
