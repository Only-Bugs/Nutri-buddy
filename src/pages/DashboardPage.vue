<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/store/auth'

import UserHeaderCard from '@/components/dashboard/UserHeaderCard.vue'
import SearchBar from '@/components/dashboard/SearchBar.vue'
import FoodTable from '@/components/dashboard/FoodTable.vue'
import CalorieChart from '@/components/dashboard/CalorieChart.vue'
import TopRatedChart from '@/components/dashboard/TopRatedChart.vue'
import QuickStats from '@/components/dashboard/QuickStats.vue'

const auth = useAuthStore()
const foods = ref([])

onMounted(async () => {
  const res = await fetch('/data/foods.json')
  foods.value = await res.json()
})
</script>

<template>
  <div class="flex min-h-screen">
    <!-- Sidebar -->

    <!-- Main content -->
    <main class="flex-1 bg-gray-50 p-6">
      <!-- User header -->
      <UserHeaderCard
        :name="auth.user?.email?.split('@')[0] || 'User'"
        :email="auth.user?.email"
        goal="2,000 Kcal"
      />

      <!-- Main grid: table left, charts right -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <!-- Left: Search + Food Table -->
        <div class="lg:col-span-2 space-y-6">
          <SearchBar />
          <!-- 👈 Floating widget above FoodTable -->
          <FoodTable :foods="foods" />
        </div>

        <!-- Right: Charts & Stats -->
        <div class="space-y-6">
          <CalorieChart />
          <TopRatedChart />
          <QuickStats :foodsRated="24" :avgRating="4.1" favoriteCategory="Protein" />
        </div>
      </div>
    </main>
  </div>
</template>
