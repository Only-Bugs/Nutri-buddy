/** * @file DashboardPage.vue * @description Focused dashboard overview — shows user stats, charts,
and recent activity. * Removes API search workflow (moved to MealsPage). * @module
pages/DashboardPage * */

<script setup>
import { useAuthStore } from '@/store/auth'
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue'
import QuickStats from '@/components/dashboard/QuickStats.vue'
import TopRatedChart from '@/components/dashboard/TopRatedChart.vue'
import NutritionHistoryTable from '@/components/dashboard/NutritionHistoryTable.vue'
import CaloriesDistribution from '@/components/dashboard/CaloriesDistribution.vue'
import NutritionDistribution from '@/components/dashboard/NutritionDistribution.vue'
import SearchOverlay from '@/components/dashboard/SearchOverlay.vue'
import AddToMealPlanModal from '@/components/mealPlans/AddToMealPlanModal.vue'
import { computed, ref, watch, onBeforeUnmount } from 'vue'
import { useDashboardStore } from '@/store/dashboard'
import { useMealPlanStore } from '@/store/mealplan/mealPlanStore'

const auth = useAuthStore()
const dashboard = useDashboardStore()
const mealPlans = useMealPlanStore()

const query = ref('')
const searchOverlayOpen = ref(false)
const addModalOpen = ref(false)
const selectedFood = ref(null)
const selectedTotals = ref(null)

const totalSearches = computed(() => dashboard.foods.length)
const averageCalories = computed(() => {
  if (!dashboard.foods.length) return 0
  const total = dashboard.foods.reduce((sum, food) => sum + Number(food.calories || 0), 0)
  return total / dashboard.foods.length
})
const recentFood = computed(() => dashboard.foods[0]?.name || '—')

function handleSearch() {
  dashboard.searchFood(query.value)
}

function updateQuery(val) {
  query.value = val
}

function openSearchOverlay() {
  searchOverlayOpen.value = true
}

function closeSearchOverlay() {
  searchOverlayOpen.value = false
}

function openAddModal(payload = {}) {
  selectedFood.value = payload.food || null
  selectedTotals.value = payload.totals || null
  addModalOpen.value = true
}

function closeAddModal() {
  addModalOpen.value = false
}

function handleItemLinked() {
  addModalOpen.value = false
}

function handleOverlayAddToPlan() {
  if (!dashboard.latestResult) return
  openAddModal({
    food: dashboard.latestResult,
    totals: dashboard.totalNutrition,
  })
  closeSearchOverlay()
}

function handleHistoryAddToPlan(food) {
  if (!food) return
  openAddModal({
    food,
    totals: {
      calories: Number(food.calories || 0),
      protein: Number(food.protein || 0),
      carbs: Number(food.carbs || 0),
      fats: Number(food.fat || 0),
      fiber: Number(food.fiber || 0),
      sugar: Number(food.sugar || 0),
      sodium: Number(food.sodium || 0),
    },
  })
}

watch(
  () => auth.user?.uid,
  (uid) => {
    mealPlans.loadPlans(uid)
  },
  { immediate: true },
)

watch(addModalOpen, (isOpen) => {
  if (!isOpen) {
    selectedFood.value = null
    selectedTotals.value = null
  }
})

watch(searchOverlayOpen, (isOpen) => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = isOpen ? 'hidden' : ''
})

onBeforeUnmount(() => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = ''
})
</script>

<template>
  <section class="dash-section w-full space-y-[var(--dash-gap)]">
    <DashboardHeader :userEmail="auth.user?.email" @open-search="openSearchOverlay" />

    <div
      :class="[
        'grid gap-[var(--dash-gap)] lg:grid-cols-3 transition duration-200',
        searchOverlayOpen ? 'pointer-events-none blur-sm' : '',
      ]"
    >
      <CaloriesDistribution class="lg:col-span-1" :totals="dashboard.totalNutrition" />
      <NutritionDistribution class="lg:col-span-1" :totals="dashboard.totalNutrition" />
      <QuickStats
        :totalSearches="totalSearches"
        :averageCalories="averageCalories"
        :recentFood="recentFood"
      />

      <div class="lg:col-span-2">
        <NutritionHistoryTable :foods="dashboard.foods" @add-to-plan="handleHistoryAddToPlan" />
      </div>

      <TopRatedChart />
    </div>

    <SearchOverlay
      :show="searchOverlayOpen"
      :query="query"
      :loading="dashboard.loading"
      :error="dashboard.error"
      :result="dashboard.latestResult"
      @update:query="updateQuery"
      @search="handleSearch"
      @close="closeSearchOverlay"
      @add-to-plan="handleOverlayAddToPlan"
    />

    <AddToMealPlanModal
      :show="addModalOpen"
      :food="selectedFood"
      :totals="selectedTotals || dashboard.totalNutrition"
      @close="closeAddModal"
      @added="handleItemLinked"
    />
  </section>
</template>
