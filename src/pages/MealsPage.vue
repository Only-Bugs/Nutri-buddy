<script setup>
import MealPlanHeader from '@/components/dashboard/MealPlanHeader.vue'
import MealsList from '@/components/dashboard/MealsList.vue'
import NutritionChart from '@/components/dashboard/NutritionChart.vue'
import PreviousMealPlans from '@/components/dashboard/PreviousMealPlans.vue'

const mealPlan = {
  title: 'Mediterranean Delight Plan',
  subtitle: '7-day balanced meal plan',
  createdAt: 'March 15, 2024',
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
  {
    icon: '🥗',
    title: 'Lunch',
    description: 'Mediterranean Quinoa Salad',
    calories: 450,
    protein: 22,
    carbs: 58,
    fats: 18,
    time: '1:00 PM',
  },
  {
    icon: '🍣',
    title: 'Dinner',
    description: 'Grilled Salmon with Vegetables',
    calories: 520,
    protein: 35,
    carbs: 25,
    fats: 28,
    time: '7:30 PM',
  },
]

const previousPlans = [
  { title: 'Keto Power Plan', date: 'March 8–14, 2024' },
  { title: 'Balanced Weekly', date: 'March 1–7, 2024' },
  { title: 'Protein Focus', date: 'Feb 22–28, 2024' },
]
</script>

<template>
  <main class="p-6 bg-gray-50 min-h-screen space-y-6">
    <!-- Header -->
    <MealPlanHeader
      :title="mealPlan.title"
      :subtitle="mealPlan.subtitle"
      :createdAt="mealPlan.createdAt"
    />

    <!-- Layout: Meals on left, charts + history on right -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Meals list -->
      <div class="lg:col-span-2">
        <MealsList :meals="meals" />
      </div>

      <!-- Right column -->
      <div class="space-y-6">
        <NutritionChart />
        <PreviousMealPlans :plans="previousPlans" />
      </div>
    </div>
  </main>
</template>
