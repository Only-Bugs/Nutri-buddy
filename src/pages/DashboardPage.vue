/** * @file DashboardPage.vue * @description Focused dashboard overview — shows user stats, charts,
and recent activity. * Removes API search workflow (moved to MealsPage). * @module
pages/DashboardPage * */

<script setup>
import { useAuthStore } from '@/store/auth'
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue'
import NutritionHistoryTable from '@/components/dashboard/NutritionHistoryTable.vue'
import CaloriesDistribution from '@/components/dashboard/CaloriesDistribution.vue'
import NutritionDistribution from '@/components/dashboard/NutritionDistribution.vue'
import SearchOverlay from '@/components/dashboard/SearchOverlay.vue'
import FavoriteRecipesSection from '@/components/dashboard/FavoriteRecipesSection.vue'
import AddToMealPlanModal from '@/components/mealPlans/AddToMealPlanModal.vue'
import { ref, watch, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useDashboardStore } from '@/store/dashboard'
import { useMealPlanStore } from '@/store/mealplan/mealPlanStore'
import { useRecipeStore } from '@/store/recipes'

const auth = useAuthStore()
const dashboard = useDashboardStore()
const mealPlans = useMealPlanStore()
const recipeStore = useRecipeStore()
const router = useRouter()
recipeStore.initialize()

const query = ref('')
const searchOverlayOpen = ref(false)
const addModalOpen = ref(false)
const selectedItem = ref(null)
const selectedTotals = ref(null)

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
  selectedItem.value = payload.item || null
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
    item: { ...dashboard.latestResult, type: 'food' },
    totals: dashboard.latestTotals,
  })
  closeSearchOverlay()
}

function handleHistoryAddToPlan(food) {
  if (!food) return
  openAddModal({
    item: { ...food, type: 'food' },
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

function handleFavoriteRecipeAdd(recipe) {
  if (!recipe) return
  openAddModal({
    item: { ...recipe, type: 'recipe', recipeId: recipe.id },
    totals: {
      calories: Number(recipe.nutrition?.calories || 0),
      protein: Number(recipe.nutrition?.protein || 0),
      carbs: Number(recipe.nutrition?.carbs || 0),
      fats: Number(recipe.nutrition?.fat || 0),
      fiber: 0,
      sugar: Number(recipe.nutrition?.sugar || 0),
      sodium: Number(recipe.nutrition?.sodium || 0),
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
    selectedItem.value = null
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
      <FavoriteRecipesSection
        class="lg:col-span-1"
        :pageSize="3"
        @add-to-plan="handleFavoriteRecipeAdd"
        @view-detail="(recipe) => router.push({ name: 'RecipeDetail', params: { id: recipe.id } })"
      />

      <div class="lg:col-span-2">
        <NutritionHistoryTable :foods="dashboard.foods" @add-to-plan="handleHistoryAddToPlan" />
      </div>
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
      :item="selectedItem"
      :totals="selectedTotals || dashboard.latestTotals"
      @close="closeAddModal"
      @added="handleItemLinked"
    />
  </section>
</template>
