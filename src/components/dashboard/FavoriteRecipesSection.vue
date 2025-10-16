<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRecipeStore } from '@/store/recipes'

const props = defineProps({
  maxVisible: { type: Number, default: 0 },
})

const emit = defineEmits(['add-to-plan', 'view-detail'])

const recipeStore = useRecipeStore()
const activeMealType = ref('')

const mealTypes = computed(() => recipeStore.favoriteMealTypes)

const favoritesForActiveType = computed(() => {
  if (!activeMealType.value) return []
  return recipeStore.getFavoritesByMealType(activeMealType.value)
})

const visibleFavorites = computed(() => {
  if (!activeMealType.value) return []
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
      activeMealType.value = types[0]
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
          class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
        >
          <div class="flex flex-col gap-4 sm:flex-row sm:justify-between">
            <div class="flex flex-1 items-start gap-3">
              <img
                v-if="recipe.image"
                :src="recipe.image"
                :alt="recipe.name"
                class="h-16 w-16 flex-shrink-0 rounded-lg object-cover shadow-sm"
                loading="lazy"
              />
              <div class="min-w-0 space-y-1">
                <p class="text-sm font-semibold text-gray-900 leading-tight">{{ recipe.name }}</p>
                <p class="text-xs text-gray-500">
                  {{ recipe.nutrition.calories }} kcal • {{ recipe.nutrition.protein }} g protein •
                  {{ recipe.cookTimeMinutes + recipe.prepTimeMinutes }} min total
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2 sm:self-start">
              <button
                class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition hover:border-red-300 hover:text-red-500"
                type="button"
                aria-label="Remove favourite"
                @click="toggleFavorite(recipe)"
              >
                <FontAwesomeIcon icon="heart" class="text-red-500" />
                <span class="sr-only">Remove favourite</span>
              </button>
              <button
                class="inline-flex h-9 items-center gap-1 rounded-full border border-gray-300 px-3 text-xs font-semibold text-gray-600 transition hover:border-green-500 hover:text-green-600"
                type="button"
                @click="emit('view-detail', recipe)"
              >
                <span>View</span>
                <FontAwesomeIcon icon="arrow-right" class="text-xs" />
              </button>
              <button
                class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-white transition hover:bg-green-700"
                type="button"
                aria-label="Add to meal plan"
                @click="emit('add-to-plan', recipe)"
              >
                <FontAwesomeIcon icon="plus" />
                <span class="sr-only">Add to plan</span>
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
