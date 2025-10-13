/** * @file CalorieChart.vue * @description Consistent dashboard chart card using shared
DashboardCard wrapper. * Applies unified padding, radius, and header style from dashboard theme. *
@module components/dashboard/CalorieChart * */

<script setup>
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Pie } from 'vue-chartjs'
import DashboardCard from '@/components/dashboard/DashboardCard.vue'

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
  <DashboardCard title="Calorie Distribution">
    <div class="h-64">
      <Pie :data="data" />
    </div>
  </DashboardCard>
</template>
