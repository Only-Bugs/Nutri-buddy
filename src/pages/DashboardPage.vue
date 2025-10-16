/** * @file DashboardPage.vue * @description Focused dashboard overview — shows user stats, charts,
and recent activity. * @module pages/DashboardPage * */

<script setup>
import { ref, watch, onBeforeUnmount, computed } from 'vue'
import { useRouter } from 'vue-router'
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue'
import DailyCalorieSummary from '@/components/dashboard/DailyCalorieSummary.vue'
import CaloriesDistribution from '@/components/dashboard/CaloriesDistribution.vue'
import NutritionDistribution from '@/components/dashboard/NutritionDistribution.vue'
import ActiveMealPlansSummary from '@/components/dashboard/ActiveMealPlansSummary.vue'
import FavoriteRecipesSection from '@/components/dashboard/FavoriteRecipesSection.vue'
import NutritionHistoryTable from '@/components/dashboard/NutritionHistoryTable.vue'
import SearchOverlay from '@/components/dashboard/SearchOverlay.vue'
import AddToMealPlanModal from '@/components/mealPlans/AddToMealPlanModal.vue'
import { useAuthStore } from '@/store/auth'
import { useDashboardStore } from '@/store/dashboard'
import { useMealPlanStore } from '@/store/mealplan/mealPlanStore'
import { useRecipeStore } from '@/store/recipes'
import { useUserProfileStore } from '@/store/userProfile'

const auth = useAuthStore()
const dashboard = useDashboardStore()
const mealPlans = useMealPlanStore()
const recipeStore = useRecipeStore()
const userProfile = useUserProfileStore()
const router = useRouter()
recipeStore.initialize()

const query = ref('')
const searchOverlayOpen = ref(false)
const addModalOpen = ref(false)
const selectedItem = ref(null)
const selectedTotals = ref(null)

const activePlans = computed(() =>
  mealPlans.plans.filter((plan) => plan.status === 'active'),
)

function normaliseNumber(value) {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : 0
}

function computeMealTotals(meal) {
  const totals = { calories: 0, protein: 0, carbs: 0, fats: 0 }
  ;(meal.items || []).forEach((item) => {
    totals.calories += normaliseNumber(item.calories ?? item.nutrition?.calories)
    totals.protein += normaliseNumber(item.protein ?? item.nutrition?.protein)
    totals.carbs += normaliseNumber(item.carbs ?? item.nutrition?.carbs)
    totals.fats += normaliseNumber(item.fat ?? item.fats ?? item.nutrition?.fat)
  })
  return totals
}

const activeMealBreakdown = computed(() => {
  const plan = mealPlans.activePlan
  if (!plan || !plan.meals?.length) return []
  return plan.meals.map((meal) => ({
    label: meal.label || 'Meal',
    ...computeMealTotals(meal),
  }))
})

const consumedCalories = computed(() => {
  const planCalories = mealPlans.activePlan?.nutritionTotals?.calories
  if (planCalories) return normaliseNumber(planCalories)
  return normaliseNumber(dashboard.totalNutrition.calories)
})

const calorieLastUpdated = computed(() => dashboard.foods[0]?.createdAt || '')

const latestNutrients = computed(() => dashboard.latestResult?.nutrients || {})

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
      calories: normaliseNumber(food.calories),
      protein: normaliseNumber(food.protein),
      carbs: normaliseNumber(food.carbs),
      fats: normaliseNumber(food.fat),
      fiber: normaliseNumber(food.fiber),
      sugar: normaliseNumber(food.sugar),
      sodium: normaliseNumber(food.sodium),
    },
  })
}

function handleFavoriteRecipeAdd(recipe) {
  if (!recipe) return
  openAddModal({
    item: { ...recipe, type: 'recipe', recipeId: recipe.id },
    totals: {
      calories: normaliseNumber(recipe.nutrition?.calories),
      protein: normaliseNumber(recipe.nutrition?.protein),
      carbs: normaliseNumber(recipe.nutrition?.carbs),
      fats: normaliseNumber(recipe.nutrition?.fat),
      fiber: normaliseNumber(recipe.nutrition?.fiber),
      sugar: normaliseNumber(recipe.nutrition?.sugar),
      sodium: normaliseNumber(recipe.nutrition?.sodium),
    },
  })
}

function handleFavoriteRecipeView(recipe) {
  if (!recipe) return
  router.push({ name: 'RecipeDetail', params: { id: recipe.id } })
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
  <section class="relative space-y-0">
    <div
      :class="[
        'grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]',
        searchOverlayOpen ? 'pointer-events-none blur-sm' : '',
      ]"
    >
      <div class="space-y-6">
        <DashboardHeader />

        <div class="grid gap-6 lg:grid-cols-3">
          <DailyCalorieSummary
            :limit="userProfile.dailyCalorieLimit"
            :consumed="consumedCalories"
            :lastUpdated="calorieLastUpdated"
          />
          <CaloriesDistribution
            :totals="dashboard.totalNutrition"
            :mealBreakdown="activeMealBreakdown"
          />
          <NutritionDistribution
            :totals="dashboard.totalNutrition"
            :nutrients="latestNutrients"
          />
        </div>

        <div class="grid gap-6 lg:grid-cols-2">
          <ActiveMealPlansSummary :plans="activePlans" />
          <FavoriteRecipesSection
            @add-to-plan="handleFavoriteRecipeAdd"
            @view-detail="handleFavoriteRecipeView"
          />
        </div>
      </div>

      <aside class="space-y-4">
        <div class="sticky top-24">
          <NutritionHistoryTable
            class="max-h-[70vh] overflow-hidden"
            :foods="dashboard.foods"
            @add-to-plan="handleHistoryAddToPlan"
          />
        </div>
      </aside>
    </div>

    <button
      class="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-xl transition hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300"
      :class="searchOverlayOpen ? 'pointer-events-none opacity-0 scale-95' : 'opacity-100 scale-100'"
      type="button"
      aria-label="Open nutrition search"
      @click="openSearchOverlay"
    >
      <FontAwesomeIcon icon="magnifying-glass" class="text-xl" />
    </button>

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
