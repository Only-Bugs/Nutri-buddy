/** * @file QuickStats.vue * @description Unified “Quick Stats” card for the dashboard. * Uses
DashboardCard for consistent padding, radius, and header hierarchy. * @module
components/dashboard/QuickStats * */

<script setup>
import DashboardCard from '@/components/dashboard/DashboardCard.vue'

const props = defineProps({
  totalSearches: { type: Number, default: 0 },
  averageCalories: { type: Number, default: 0 },
  recentFood: { type: String, default: '—' },
})
</script>

<template>
  <DashboardCard title="Quick Stats">
    <ul class="space-y-2 text-lg text-gray-700">
      <li><strong>Total Searches:</strong> {{ totalSearches }}</li>
      <li><strong>Avg Calories:</strong> {{ averageCalories.toFixed(1) }}</li>
      <li><strong>Latest Food:</strong> {{ recentFood }}</li>
    </ul>
  </DashboardCard>
</template>
