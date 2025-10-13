<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useDashboardStore } from '@/store/dashboard'
import { useRatingsStore } from '@/store/ratings'
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue'
import SearchBar from '@/components/dashboard/SearchBar.vue'
import NutritionResultCard from '@/components/dashboard/NutritionResultCard.vue'
import NutritionHistoryTable from '@/components/dashboard/NutritionHistoryTable.vue'

const auth = useAuthStore()
const dashboard = useDashboardStore()
const ratings = useRatingsStore()

const query = ref('')

function handleSearch() {
  dashboard.searchFood(query.value)
}
function rateFood(foodId, score) {
  ratings.addRating(foodId, score)
}
</script>

<template>
  <div class="space-y-6 w-full max-w-4xl mx-auto">
    <DashboardHeader :userEmail="auth.user?.email" />

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
  </div>
</template>
