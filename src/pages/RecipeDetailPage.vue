<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRecipeStore } from '@/store/recipes'
import AddToMealPlanModal from '@/components/mealPlans/AddToMealPlanModal.vue'

const route = useRoute()
const router = useRouter()
const recipeStore = useRecipeStore()

const addModalOpen = ref(false)
const selectedRecipe = ref(null)
const checkedIngredients = ref([])

const recipeId = computed(() => route.params.id?.toString() || '')
const recipe = computed(() => recipeStore.recipeMap[recipeId.value])
const isFavorite = computed(() => (recipeId.value ? recipeStore.isFavorite(recipeId.value) : false))

const macros = computed(() => {
  if (!recipe.value) return null
  const nutrition = recipe.value.nutrition || {}
  return [
    { label: 'Calories', value: `${nutrition.calories || 0} kcal` },
    { label: 'Protein', value: `${nutrition.protein || 0} g` },
    { label: 'Carbs', value: `${nutrition.carbs || 0} g` },
    { label: 'Fat', value: `${nutrition.fat || 0} g` },
    { label: 'Fiber', value: `${nutrition.fiber || 0} g` },
    { label: 'Sugar', value: `${nutrition.sugar || 0} g` },
    { label: 'Sodium', value: `${nutrition.sodium || 0} mg` },
  ]
})

const mealPlanTotals = computed(() => {
  if (!recipe.value) return null
  const nutrition = recipe.value.nutrition || {}
  return {
    calories: nutrition.calories || 0,
    protein: nutrition.protein || 0,
    carbs: nutrition.carbs || 0,
    fats: nutrition.fat || 0,
    fiber: nutrition.fiber || 0,
    sugar: nutrition.sugar || 0,
    sodium: nutrition.sodium || 0,
  }
})

function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push({ name: 'Recipes' })
  }
}

async function toggleFavorite() {
  if (!recipe.value) return
  await recipeStore.toggleFavorite(recipe.value.id)
}

function openAddModal() {
  if (!recipe.value) return
  selectedRecipe.value = { ...recipe.value, type: 'recipe', recipeId: recipe.value.id }
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

async function ensureRecipeLoaded() {
  await recipeStore.initialize()
}

const checklistStorageKey = computed(() =>
  recipeId.value ? `recipeChecklist:${recipeId.value}` : '',
)

function loadChecklist() {
  if (!checklistStorageKey.value) return
  if (typeof localStorage === 'undefined') return
  try {
    const stored = localStorage.getItem(checklistStorageKey.value)
    if (!stored) {
      checkedIngredients.value = []
      return
    }
    const parsed = JSON.parse(stored)
    checkedIngredients.value = Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.warn('[RecipeDetail] Failed to load ingredient checklist', error)
    checkedIngredients.value = []
  }
}

function persistChecklist() {
  if (!checklistStorageKey.value) return
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(checklistStorageKey.value, JSON.stringify(checkedIngredients.value))
  } catch (error) {
    console.warn('[RecipeDetail] Failed to persist ingredient checklist', error)
  }
}

function ingredientKey(ingredient, index) {
  return `${ingredient.name || 'ingredient'}::${index}`
}

const checkedSet = computed(() => new Set(checkedIngredients.value))

function toggleIngredient(key) {
  const set = new Set(checkedIngredients.value)
  if (set.has(key)) {
    set.delete(key)
  } else {
    set.add(key)
  }
  checkedIngredients.value = Array.from(set)
  persistChecklist()
}

function isIngredientChecked(key) {
  return checkedSet.value.has(key)
}

onMounted(async () => {
  await ensureRecipeLoaded()
  loadChecklist()
})

watch(
  () => route.params.id,
  async () => {
    await ensureRecipeLoaded()
    loadChecklist()
  },
)

watch(
  recipe,
  (value) => {
    if (value) {
      loadChecklist()
    } else {
      checkedIngredients.value = []
    }
  },
)
</script>

<template>
  <section class="dash-section space-y-6">
    <button
      class="inline-flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-800"
      @click="goBack"
    >
      <FontAwesomeIcon icon="arrow-left" /> Back to recipes
    </button>

    <div v-if="!recipe" class="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
      <p class="text-lg font-semibold text-gray-700">Recipe not found</p>
      <p class="text-sm text-gray-500 mt-2">This recipe might have been removed. Try another one from the recipe list.</p>
    </div>

    <div v-else class="space-y-6">
      <header class="flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm lg:flex-row lg:items-start lg:gap-8">
        <img
          v-if="recipe.image"
          :src="recipe.image"
          :alt="recipe.name"
          class="h-48 w-full rounded-2xl object-cover lg:h-60 lg:w-72"
        />

        <div class="flex-1 space-y-4">
          <div class="flex flex-wrap items-center gap-3">
            <h1 class="text-3xl font-semibold text-gray-900">{{ recipe.name }}</h1>
            <button
              class="rounded-full border border-green-600 px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-600 hover:text-white transition"
              @click="openAddModal"
            >
              <FontAwesomeIcon icon="plus" /> Add to Meal Plan
            </button>
            <button
              class="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 hover:border-green-500 hover:text-green-600 transition"
              @click="toggleFavorite"
            >
              <FontAwesomeIcon icon="heart" :class="isFavorite ? 'text-red-500' : 'text-gray-300'" />
              <span class="ml-2">{{ isFavorite ? 'Remove favourite' : 'Mark favourite' }}</span>
            </button>
          </div>

          <p v-if="recipe.description" class="text-base text-gray-600">
            {{ recipe.description }}
          </p>

          <dl class="grid gap-4 text-sm text-gray-700 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt class="font-semibold uppercase tracking-wide text-gray-500">Prep</dt>
              <dd>{{ recipe.prepTimeMinutes }} min</dd>
            </div>
            <div>
              <dt class="font-semibold uppercase tracking-wide text-gray-500">Cook</dt>
              <dd>{{ recipe.cookTimeMinutes }} min</dd>
            </div>
            <div>
              <dt class="font-semibold uppercase tracking-wide text-gray-500">Servings</dt>
              <dd>{{ recipe.servings }}</dd>
            </div>
            <div>
              <dt class="font-semibold uppercase tracking-wide text-gray-500">Meal types</dt>
              <dd>{{ recipe.mealTypes.join(', ') }}</dd>
            </div>
            <div>
              <dt class="font-semibold uppercase tracking-wide text-gray-500">Cuisines</dt>
              <dd>{{ recipe.cuisines?.join(', ') || '—' }}</dd>
            </div>
            <div>
              <dt class="font-semibold uppercase tracking-wide text-gray-500">Total time</dt>
              <dd>{{ recipe.prepTimeMinutes + recipe.cookTimeMinutes }} min</dd>
            </div>
          </dl>
        </div>
      </header>

      <div class="grid gap-6 lg:grid-cols-[minmax(0,22rem)_1fr]">
        <section class="space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 class="text-lg font-semibold text-gray-900">Ingredients</h2>
          <p class="text-sm text-gray-500">
            Tap the circles to check off ingredients you already have.
          </p>

          <ul class="space-y-2">
            <li
              v-for="(ingredient, index) in recipe.ingredients"
              :key="ingredientKey(ingredient, index)"
              class="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2"
            >
              <button
                type="button"
                class="flex w-full items-center justify-between gap-3 text-left"
                @click="toggleIngredient(ingredientKey(ingredient, index))"
              >
                <div class="flex items-center gap-3">
                  <span
                    class="flex h-6 w-6 items-center justify-center rounded-full border text-xs transition"
                    :class="
                      isIngredientChecked(ingredientKey(ingredient, index))
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-gray-300 bg-white text-transparent'
                    "
                  >
                    <FontAwesomeIcon icon="check" />
                  </span>
                  <div>
                    <p class="text-sm font-semibold text-gray-800">{{ ingredient.name }}</p>
                    <p class="text-xs text-gray-500">
                      {{ ingredient.quantity || '—' }} {{ ingredient.unit || '' }}
                    </p>
                  </div>
                </div>
              </button>
              <p v-if="ingredient.misc" class="mt-2 text-xs text-gray-500">
                {{ ingredient.misc }}
              </p>
            </li>
          </ul>

          <div v-if="macros" class="grid gap-2 text-sm text-gray-700">
            <h3 class="text-sm font-semibold text-gray-800">Nutrition (per recipe)</h3>
            <div class="grid grid-cols-2 gap-2">
              <div
                v-for="macro in macros"
                :key="macro.label"
                class="rounded-lg bg-green-50 px-3 py-2 text-green-700 font-semibold text-center"
              >
                <p class="text-xs uppercase tracking-wide text-green-500">{{ macro.label }}</p>
                <p>{{ macro.value }}</p>
              </div>
            </div>
          </div>
        </section>

        <section class="space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 class="text-lg font-semibold text-gray-900">Instructions</h2>
          <ol
            v-if="recipe.instructions && recipe.instructions.length"
            class="space-y-3 text-sm text-gray-700"
          >
            <li
              v-for="(step, index) in recipe.instructions"
              :key="index"
              class="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 leading-relaxed shadow-sm"
            >
              <span class="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-xs font-semibold text-white">
                {{ index + 1 }}
              </span>
              {{ step }}
            </li>
          </ol>
          <p v-else class="text-sm text-gray-500">Instructions coming soon.</p>
        </section>
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
