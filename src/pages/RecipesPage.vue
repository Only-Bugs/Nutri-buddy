<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRecipeStore } from '@/store/recipes'
import { useMealPlanStore } from '@/store/mealplan/mealPlanStore'
import RecipeCard from '@/components/recipes/RecipeCard.vue'
import AddToMealPlanModal from '@/components/mealPlans/AddToMealPlanModal.vue'
import { useRouter } from 'vue-router'

const recipeStore = useRecipeStore()
const mealPlanStore = useMealPlanStore()
const router = useRouter()

const MEAL_TYPES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Beverage']
const paginationState = reactive({})
const pageSize = 6

const addModalOpen = ref(false)
const selectedRecipe = ref(null)

function ensurePagination(mealType) {
  if (!paginationState[mealType]) {
    paginationState[mealType] = 1
  }
}

const activeMealType = ref('All')

const recipesForActiveMealType = computed(() => {
  ensurePagination(activeMealType.value)
  return recipeStore.getRecipesByMealType(
    activeMealType.value === 'All' ? null : activeMealType.value,
  )
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(recipesForActiveMealType.value.length / pageSize))
})

const paginatedRecipes = computed(() => {
  const page = paginationState[activeMealType.value] || 1
  const start = (page - 1) * pageSize
  return recipesForActiveMealType.value.slice(start, start + pageSize)
})

function setMealType(type) {
  activeMealType.value = type
  ensurePagination(type)
}

function nextPage() {
  const current = paginationState[activeMealType.value] || 1
  if (current < totalPages.value) {
    paginationState[activeMealType.value] = current + 1
  }
}

function prevPage() {
  const current = paginationState[activeMealType.value] || 1
  if (current > 1) {
    paginationState[activeMealType.value] = current - 1
  }
}

async function toggleFavorite(recipe) {
  await recipeStore.toggleFavorite(recipe.id)
}

function openAddModal(recipe) {
  selectedRecipe.value = { ...recipe, type: 'recipe', recipeId: recipe.id }
  addModalOpen.value = true
}

function closeAddModal() {
  addModalOpen.value = false
  selectedRecipe.value = null
}

function handleAdded() {
  addModalOpen.value = false
  selectedRecipe.value = null
}

const mealPlanTotals = computed(() => {
  const recipe = selectedRecipe.value
  if (!recipe) return null
  return {
    calories: recipe.nutrition.calories,
    protein: recipe.nutrition.protein,
    carbs: recipe.nutrition.carbs,
    fats: recipe.nutrition.fat,
    fiber: recipe.nutrition.fiber ?? 0,
    sugar: recipe.nutrition.sugar,
    sodium: recipe.nutrition.sodium,
  }
})

watch(
  () => activeMealType.value,
  (type) => ensurePagination(type),
  { immediate: true },
)

onMounted(async () => {
  await recipeStore.initialize()
  ensurePagination(activeMealType.value)
  if (!mealPlanStore.userId && mealPlanStore.setUser) {
    // No-op: meal plan store expects user to be set elsewhere via auth flow
  }
})
</script>

<template>
  <section class="dash-section space-y-6">
    <header class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-3xl font-semibold text-gray-900">Recipes</h1>
        <p class="text-base text-gray-500">
          Bookmark favourite dishes and link them to any meal plan.
        </p>
      </div>
      <nav class="flex flex-wrap gap-2">
        <button
          v-for="type in MEAL_TYPES"
          :key="type"
          @click="setMealType(type)"
          class="rounded-full border px-4 py-2 text-lg font-medium transition"
          :class="
            activeMealType === type
              ? 'border-green-600 bg-green-600 text-white'
              : 'border-gray-300 text-gray-600 hover:border-green-500 hover:text-green-600'
          "
        >
          {{ type }}
        </button>
      </nav>
    </header>

    <div
      v-if="!paginatedRecipes.length"
      class="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center"
    >
      <p class="text-lg font-medium text-gray-700">No recipes found for this filter.</p>
      <p class="text-lg text-gray-500">
        Try another meal type or favourite some recipes to view them here.
      </p>
    </div>

    <div v-else class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <RecipeCard
        v-for="recipe in paginatedRecipes"
        :key="recipe.id"
        :recipe="recipe"
        :favorite="recipeStore.isFavorite(recipe.id)"
        @toggle-favorite="toggleFavorite"
        @add-to-plan="openAddModal"
        @open-detail="(recipe) => router.push({ name: 'RecipeDetail', params: { id: recipe.id } })"
      />
    </div>

    <div
      v-if="paginatedRecipes.length"
      class="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-3 text-lg text-gray-600"
    >
      <span> Page {{ paginationState[activeMealType] || 1 }} of {{ totalPages }} </span>
      <div class="flex items-center gap-2">
        <button
          class="rounded-full border border-gray-300 px-3 py-1 hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed"
          @click="prevPage"
          :disabled="(paginationState[activeMealType] || 1) === 1"
        >
          Prev
        </button>
        <button
          class="rounded-full border border-gray-300 px-3 py-1 hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed"
          @click="nextPage"
          :disabled="(paginationState[activeMealType] || 1) >= totalPages"
        >
          Next
        </button>
      </div>
    </div>

    <AddToMealPlanModal
      :show="addModalOpen"
      :item="selectedRecipe"
      :totals="mealPlanTotals"
      @close="closeAddModal"
      @added="handleAdded"
    />
  </section>
</template>
