<script setup>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({
  data: {
    type: Object,
    required: false,
    default: () => ({
      labels: ['Quinoa Salad', 'Salmon', 'Avocado Toast', 'Chicken', 'Greek Yogurt'],
      datasets: [
        {
          label: 'Average Rating',
          data: [4.8, 4.7, 4.5, 4.3, 3.9],
          backgroundColor: '#16a34a',
        },
      ],
    }),
  },
})
</script>

<template>
  <div class="bg-white shadow-sm rounded-xl p-6">
    <h3 class="text-lg font-semibold mb-4">Top Rated Foods</h3>
    <Bar :data="data" />
  </div>
</template>
