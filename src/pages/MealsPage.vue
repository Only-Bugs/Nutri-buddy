/** * @file MealsPage.vue * @description Meal workspace — handles food search and nutrition results.
* Incorporates API search flow previously in DashboardPage. * @module pages/MealsPage * # Generated
under NutriBuddy SpecGuard v1.0.0 */

<script setup>
import MealPlanHeader from '@/components/mealPlans/MealPlanHeader.vue'
import MealsList from '@/components/mealPlans/MealsList.vue'

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
    <div class="space-y-[var(--dash-gap)]"></div>

    <!-- Current plan preview -->
    <div class="mt-[var(--dash-gap)]">
      <MealsList :meals="meals" />
    </div>
  </section>
</template>
