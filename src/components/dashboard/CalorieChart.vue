<script setup>
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Pie } from 'vue-chartjs'

// Register chart.js modules
ChartJS.register(Title, Tooltip, Legend, ArcElement)

const props = defineProps({
  data: {
    type: Object,
    required: false,
    default: () => ({
      labels: ['Protein', 'Carbs', 'Fats', 'Others'],
      datasets: [
        {
          data: [35, 30, 25, 10],
          backgroundColor: ['#16a34a', '#3b82f6', '#facc15', '#9ca3af'],
        },
      ],
    }),
  },
})
</script>

<template>
  <div class="bg-white shadow-sm rounded-xl p-6">
    <h3 class="text-lg font-semibold mb-4">Calorie Distribution</h3>
    <Pie :data="data" />
  </div>
</template>
