<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRecipeStore } from '@/store/recipes'
import { getMealTypeVisual } from '@/utils/recipeVisuals'

const props = defineProps({
  maxVisible: { type: Number, default: 0 },
})

const emit = defineEmits(['add-to-plan', 'view-detail'])

const recipeStore = useRecipeStore()
const activeMealType = ref('')

const mealTypes = computed(() => {
  const baseTypes = recipeStore.favoriteMealTypes || []
  if (!recipeStore.favoriteRecipes.length) return []
  return ['All', ...baseTypes]
})

const favoritesForActiveType = computed(() => {
  if (!mealTypes.value.length) return []
  if (!activeMealType.value || activeMealType.value === 'All') {
    return recipeStore.favoriteRecipes
  }
  return recipeStore.getFavoritesByMealType(activeMealType.value)
})

const visibleFavorites = computed(() => {
  if (!mealTypes.value.length) return []
  if (!props.maxVisible || props.maxVisible <= 0) {
    return favoritesForActiveType.value
  }
  return favoritesForActiveType.value.slice(0, props.maxVisible)
})

function setMealType(type) {
  activeMealType.value = type
}

async function toggleFavorite(recipe) {
  await recipeStore.toggleFavorite(recipe.id)
}

function handleCardClick(recipe) {
  emit('view-detail', recipe)
}

function mealVisual(recipe) {
  const primary = recipe?.primaryMealType || recipe?.mealTypes?.[0] || 'Meal'
  return getMealTypeVisual(primary)
}

onMounted(async () => {
  await recipeStore.initialize()
})

watch(
  mealTypes,
  (types) => {
    if (!types.length) {
      activeMealType.value = ''
      return
    }
    if (!types.includes(activeMealType.value)) {
      activeMealType.value = types.includes('All') ? 'All' : types[0]
    }
  },
  { immediate: true },
)
</script>

<template>
  <section class="dash-card space-y-5">
    <header class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 class="dash-title text-xl">Favourite Recipes</h2>
        <p class="dash-subtitle">One tap to drop a saved dish into your meal plan.</p>
      </div>
      <nav v-if="mealTypes.length" class="flex flex-wrap gap-2">
        <button
          v-for="type in mealTypes"
          :key="type"
          @click="setMealType(type)"
          class="rounded-full border px-3 py-1 text-sm font-medium transition"
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

    <div v-if="!mealTypes.length" class="rounded-xl border border-dashed border-gray-300 bg-white/60 p-6 text-center">
      <p class="text-base font-medium text-gray-700">No favourite recipes yet.</p>
      <p class="text-sm text-gray-500">Add recipes to your favourites and they will appear here automatically.</p>
    </div>

    <div v-else>
      <ul class="space-y-3">
        <li
          v-for="recipe in visibleFavorites"
          :key="recipe.id"
          class="group cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-green-500 hover:shadow-md focus-within:border-green-500 focus-within:shadow-md"
          tabindex="0"
          @click="handleCardClick(recipe)"
          @keyup.enter="handleCardClick(recipe)"
        >
          <div class="flex items-start gap-3">
            <div
              class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br shadow-sm"
              :class="mealVisual(recipe).gradient"
            >
              <FontAwesomeIcon :icon="mealVisual(recipe).icon" :class="['text-xl', mealVisual(recipe).accent]" />
            </div>
            <div class="min-w-0 space-y-2">
              <div>
                <p class="text-sm font-semibold text-gray-900 leading-tight group-hover:text-green-600">
                  {{ recipe.name }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ recipe.nutrition.calories }} kcal • {{ recipe.nutrition.protein }} g protein •
                  {{ recipe.cookTimeMinutes + recipe.prepTimeMinutes }} min total
                </p>
              </div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="type in recipe.mealTypes"
                  :key="type"
                  :class="['rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest shadow-sm', mealVisual(recipe).badge]"
                >
                  {{ type }}
                </span>
              </div>
            </div>
          </div>

          <div class="mt-4 flex items-center justify-end gap-2">
            <button
              class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition hover:border-yellow-400 hover:text-yellow-500"
              type="button"
              aria-label="Toggle favourite"
              @click.stop="toggleFavorite(recipe)"
            >
              <FontAwesomeIcon
                icon="star"
                class="text-lg"
                :class="recipeStore.isFavorite(recipe.id) ? 'text-yellow-500' : 'text-gray-300'"
              />
              <span class="sr-only">Toggle favourite</span>
            </button>
            <button
              class="inline-flex h-9 items-center gap-2 rounded-full bg-green-600 px-4 text-xs font-semibold text-white transition hover:bg-green-700"
              type="button"
              aria-label="Add to meal plan"
              @click.stop="emit('add-to-plan', recipe)"
            >
              <FontAwesomeIcon icon="plus" />
              <span>Add</span>
            </button>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
