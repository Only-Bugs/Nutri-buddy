<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/store/auth'
import { fetchFoods } from '@/services/dashboardService'

import UserHeaderCard from '@/components/dashboard/UserHeaderCard.vue'
import SearchBar from '@/components/dashboard/SearchBar.vue'
import FoodTable from '@/components/dashboard/FoodTable.vue'
import CalorieChart from '@/components/dashboard/CalorieChart.vue'
import TopRatedChart from '@/components/dashboard/TopRatedChart.vue'
import QuickStats from '@/components/dashboard/QuickStats.vue'

const auth = useAuthStore()
const foods = ref([])

onMounted(async () => {
  foods.value = await fetchFoods()
})
</script>

<template>
  <div class="flex min-h-screen">
    <main class="flex-1 bg-gray-50 p-6">
      <UserHeaderCard
        :name="auth.user?.email?.split('@')[0] || 'User'"
        :email="auth.user?.email"
        goal="2,000 Kcal"
      />

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div class="lg:col-span-2 space-y-6">
          <SearchBar />
          <FoodTable :foods="foods" />
        </div>

        <div class="space-y-6">
          <CalorieChart />
          <TopRatedChart />
          <QuickStats :foodsRated="24" :avgRating="4.1" favoriteCategory="Protein" />
        </div>
      </div>
    </main>
  </div>
</template>
<!-- # Generated under NutriBuddy SpecGuard v1.0.0 -->
