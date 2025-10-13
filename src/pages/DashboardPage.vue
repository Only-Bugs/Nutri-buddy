/** * @file DashboardPage.vue * @description Focused dashboard overview — shows user stats, charts,
and recent activity. * Removes API search workflow (moved to MealsPage). * @module
pages/DashboardPage * */

<script setup>
import { useAuthStore } from '@/store/auth'
import { useRatingsStore } from '@/store/ratings'
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue'
import QuickStats from '@/components/dashboard/QuickStats.vue'
import CalorieChart from '@/components/dashboard/CalorieChart.vue'
import TopRatedChart from '@/components/dashboard/TopRatedChart.vue'
import NutritionHistoryTable from '@/components/dashboard/NutritionHistoryTable.vue'

const auth = useAuthStore()
const ratings = useRatingsStore()
</script>

<template>
  <section class="dash-section w-full">
    <DashboardHeader :userEmail="auth.user?.email" />

    <!-- Overview grid -->
    <div class="grid md:grid-cols-3 gap-[var(--dash-gap)]">
      <QuickStats
        :foodsRated="Object.keys(ratings.ratings).length"
        :avgRating="ratings.getAverage('all')"
        favoriteCategory="Protein"
      />
      <CalorieChart />
      <TopRatedChart />
    </div>

    <!-- Recent activity -->
    <NutritionHistoryTable :foods="[]" />
  </section>
</template>
