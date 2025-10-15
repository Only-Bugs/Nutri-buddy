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
import SearchBar from '@/components/dashboard/SearchBar.vue'
import NutritionResultCard from '@/components/dashboard/NutritionResultCard.vue'
import NutritionHistoryTable from '@/components/dashboard/NutritionHistoryTable.vue'

const auth = useAuthStore()
const ratings = useRatingsStore()
import { ref } from 'vue'
import { useDashboardStore } from '@/store/dashboard'
const dashboard = useDashboardStore()

const query = ref('')

function handleSearch() {
  dashboard.searchFood(query.value)
}
function rateFood(foodId, score) {
  ratings.addRating(foodId, score)
}
</script>

<template>
  <section class="dash-section w-full">
    <DashboardHeader :userEmail="auth.user?.email" />

    <!-- Overview grid -->
    <div class="grid md:grid-cols-3 gap-[var(--dash-gap)]">
      <SearchBar
        v-model="query"
        :loading="dashboard.loading"
        :error="dashboard.error"
        @search="handleSearch"
      />

      <NutritionResultCard
        v-if="!dashboard.loading"
        :foodData="dashboard.latestResult"
        :query="query"
      />

      <NutritionHistoryTable :foods="dashboard.foods" @rate="rateFood" />
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
