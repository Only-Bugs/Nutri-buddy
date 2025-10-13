/** * @file QuickStats.vue * @description Unified “Quick Stats” card for the dashboard. * Uses
DashboardCard for consistent padding, radius, and header hierarchy. * @module
components/dashboard/QuickStats * */

<script setup>
import DashboardCard from '@/components/dashboard/DashboardCard.vue'

const props = defineProps({
  foodsRated: Number,
  avgRating: Number,
  favoriteCategory: String,
})
</script>

<template>
  <DashboardCard title="Quick Stats">
    <ul class="space-y-2 text-lg text-gray-700">
      <li><strong>Foods Rated:</strong> {{ foodsRated }}</li>
      <li><strong>Avg Rating Given:</strong> {{ avgRating }}</li>
      <li><strong>Favorite Category:</strong> {{ favoriteCategory }}</li>
    </ul>
  </DashboardCard>
</template>
