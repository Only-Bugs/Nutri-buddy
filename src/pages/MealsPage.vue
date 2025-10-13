/** * @file MealsPage.vue * @description Meal workspace — handles food search and nutrition results.
* Incorporates API search flow previously in DashboardPage. * @module pages/MealsPage * # Generated
under NutriBuddy SpecGuard v1.0.0 */

<script setup>
import { ref } from 'vue'
import { useDashboardStore } from '@/store/dashboard'
import { useRatingsStore } from '@/store/ratings'
import MealPlanHeader from '@/components/mealPlans/MealPlanHeader.vue'
import MealsList from '@/components/mealPlans/MealsList.vue'
import SearchBar from '@/components/dashboard/SearchBar.vue'
import NutritionResultCard from '@/components/dashboard/NutritionResultCard.vue'
import NutritionHistoryTable from '@/components/dashboard/NutritionHistoryTable.vue'

const dashboard = useDashboardStore()
const ratings = useRatingsStore()

const query = ref('')

function handleSearch() {
  dashboard.searchFood(query.value)
}
function rateFood(foodId, score) {
  ratings.addRating(foodId, score)
}

const mealPlan = {
  title: 'Mediterranean Delight Plan',
  subtitle: '7-day balanced meal plan',
  createdAt: 'March 15 2024',
}

const meals = [
  {
    icon: '🍊',
    title: 'Breakfast',
    description: 'Greek Yogurt Bowl with Berries',
    calories: 320,
    protein: 18,
    carbs: 45,
    fats: 12,
    time: '8:00 AM',
  },
  {
    icon: '🍎',
    title: 'Snack',
    description: 'Mixed Nuts & Dried Fruits',
    calories: 180,
    protein: 6,
    carbs: 12,
    fats: 14,
    time: '10:30 AM',
  },
]
</script>

<template>
  <section class="dash-section w-full">
    <!-- Header -->
    <MealPlanHeader
      :title="mealPlan.title"
      :subtitle="mealPlan.subtitle"
      :createdAt="mealPlan.createdAt"
    />

    <!-- Search + Results -->
    <div class="space-y-[var(--dash-gap)]">
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

    <!-- Current plan preview -->
    <div class="mt-[var(--dash-gap)]">
      <MealsList :meals="meals" />
    </div>
  </section>
</template>
