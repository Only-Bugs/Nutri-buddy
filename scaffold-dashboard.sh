#!/bin/zsh

# Ensure inside project root
cd "$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

# Create meals folder
mkdir -p src/components/dashboard

# MealPlanHeader.vue
cat > src/components/dashboard/MealPlanHeader.vue <<'EOF'
<script setup>
const props = defineProps({
  title: String,
  subtitle: String,
  createdAt: String
})
</script>

<template>
  <div class="flex items-center justify-between bg-white shadow-sm rounded-xl p-6">
    <div>
      <h2 class="text-2xl font-bold">{{ title }}</h2>
      <p class="text-gray-500 text-sm">{{ subtitle }} • Created on {{ createdAt }}</p>
    </div>
    <div class="flex gap-2">
      <button class="border px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50">Share</button>
      <button class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Edit Plan</button>
    </div>
  </div>
</template>
EOF

# MealCard.vue
cat > src/components/dashboard/MealCard.vue <<'EOF'
<script setup>
const props = defineProps({
  icon: String,
  title: String,
  description: String,
  calories: Number,
  protein: Number,
  carbs: Number,
  fats: Number,
  time: String
})
</script>

<template>
  <div class="flex items-center justify-between bg-white rounded-xl shadow-sm p-4">
    <div class="flex items-center gap-3">
      <div class="text-2xl">{{ icon }}</div>
      <div>
        <h3 class="font-semibold">{{ title }}</h3>
        <p class="text-sm text-gray-500">{{ description }}</p>
      </div>
    </div>
    <div class="flex gap-6 text-sm font-medium">
      <div class="text-gray-700">{{ calories }}<br/><span class="text-xs text-gray-500">Calories</span></div>
      <div class="text-blue-600">{{ protein }}g<br/><span class="text-xs text-gray-500">Protein</span></div>
      <div class="text-green-600">{{ carbs }}g<br/><span class="text-xs text-gray-500">Carbs</span></div>
      <div class="text-purple-600">{{ fats }}g<br/><span class="text-xs text-gray-500">Fats</span></div>
    </div>
    <div class="text-xs text-gray-500">{{ time }}</div>
  </div>
</template>
EOF

# MealsList.vue
cat > src/components/dashboard/MealsList.vue <<'EOF'
<script setup>
import MealCard from './MealCard.vue'

const props = defineProps({
  meals: Array
})
</script>

<template>
  <div class="space-y-4">
    <h3 class="font-semibold text-lg mb-2">Today's Meals</h3>
    <MealCard
      v-for="meal in meals"
      :key="meal.title"
      v-bind="meal"
    />
  </div>
</template>
EOF

# NutritionChart.vue
cat > src/components/dashboard/NutritionChart.vue <<'EOF'
<script setup>
/**
 * NutritionChart.vue
 * Use Chart.js or vue-chartjs for donut chart
 */
</script>

<template>
  <div class="bg-white shadow-sm rounded-xl p-6">
    <h3 class="text-lg font-semibold mb-4">Daily Nutrition Distribution</h3>
    <div class="h-48 flex items-center justify-center text-gray-400">
      [Donut Chart Placeholder]
    </div>
    <ul class="mt-4 text-sm text-gray-600 space-y-1">
      <li>Protein: 81g (15%)</li>
      <li>Carbs: 140g (26%)</li>
      <li>Fats: 72g (30%)</li>
    </ul>
  </div>
</template>
EOF

# PreviousMealPlans.vue
cat > src/components/dashboard/PreviousMealPlans.vue <<'EOF'
<script setup>
const props = defineProps({
  plans: Array
})
</script>

<template>
  <div class="bg-white shadow-sm rounded-xl p-6">
    <h3 class="text-lg font-semibold mb-4">Previous Meal Plans</h3>
    <ul class="space-y-2">
      <li
        v-for="plan in plans"
        :key="plan.title"
        class="flex justify-between items-center bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg cursor-pointer"
      >
        <div>
          <p class="font-medium">{{ plan.title }}</p>
          <p class="text-xs text-gray-500">{{ plan.date }}</p>
        </div>
        <span class="text-gray-400">→</span>
      </li>
    </ul>
    <button class="text-green-600 text-sm font-medium mt-3 hover:underline">View All History</button>
  </div>
</template>
EOF

echo "✅ Meal Plan components scaffolded in src/components/dashboard/"
