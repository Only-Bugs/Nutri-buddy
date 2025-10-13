/** * @file TopRatedChart.vue * @description Consistent “Top Rated Foods” chart card using
DashboardCard wrapper. * Aligns with unified padding, shadow, and typography from dashboard theme. *
@module components/dashboard/TopRatedChart * */

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
import DashboardCard from '@/components/dashboard/DashboardCard.vue'

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
  <DashboardCard title="Top Rated Foods">
    <div class="h-64">
      <Bar :data="data" />
    </div>
  </DashboardCard>
</template>
