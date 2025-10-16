<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRecipeStore } from '@/store/recipes'

const props = defineProps({
  pageSize: { type: Number, default: 5 },
})

const emit = defineEmits(['add-to-plan', 'view-detail'])

const recipeStore = useRecipeStore()
const activeMealType = ref('')
const pagination = reactive({})

function ensurePage(type) {
  if (!type) return
  if (!pagination[type]) {
    pagination[type] = 1
  }
}

const rawMealTypes = computed(() => recipeStore.favoriteMealTypes)

watch(
  rawMealTypes,
  (types) => {
    if (!types.length) {
      activeMealType.value = ''
      return
    }
    if (!types.includes(activeMealType.value)) {
      activeMealType.value = types[0]
    }
    ensurePage(activeMealType.value)
  },
  { immediate: true },
)

const mealTypes = computed(() => rawMealTypes.value)

const favoritesForActiveType = computed(() => {
  if (!activeMealType.value) return []
  return recipeStore.getFavoritesByMealType(activeMealType.value)
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(favoritesForActiveType.value.length / props.pageSize))
})

const paginatedFavorites = computed(() => {
  if (!activeMealType.value) return []
  const page = pagination[activeMealType.value] || 1
  const start = (page - 1) * props.pageSize
  return favoritesForActiveType.value.slice(start, start + props.pageSize)
})

function setMealType(type) {
  activeMealType.value = type
  ensurePage(type)
}

function nextPage() {
  const current = pagination[activeMealType.value] || 1
  if (current < totalPages.value) {
    pagination[activeMealType.value] = current + 1
  }
}

function prevPage() {
  const current = pagination[activeMealType.value] || 1
  if (current > 1) {
    pagination[activeMealType.value] = current - 1
  }
}

async function toggleFavorite(recipe) {
  await recipeStore.toggleFavorite(recipe.id)
}

onMounted(async () => {
  await recipeStore.initialize()
})

watch(
  () => activeMealType.value,
  (type) => ensurePage(type),
)

watch(
  [() => favoritesForActiveType.value, () => activeMealType.value],
  ([recipes, type]) => {
    if (!type) return
    const maxPage = Math.max(1, Math.ceil(recipes.length / props.pageSize))
    if ((pagination[type] || 1) > maxPage) {
      pagination[type] = maxPage
    }
  },
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
          v-for="recipe in paginatedFavorites"
          :key="recipe.id"
          class="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between"
        >
          <div class="flex flex-1 items-start gap-3">
            <img
              v-if="recipe.image"
              :src="recipe.image"
              :alt="recipe.name"
              class="h-16 w-16 rounded-lg object-cover"
              loading="lazy"
            />
            <div>
              <p class="text-sm font-semibold text-gray-900">{{ recipe.name }}</p>
              <p class="text-xs text-gray-500">
                {{ recipe.nutrition.calories }} kcal • {{ recipe.nutrition.protein }} g protein •
                {{ recipe.cookTimeMinutes + recipe.prepTimeMinutes }} min total
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              class="rounded-full border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-600 hover:border-green-500 hover:text-green-600 transition"
              @click="toggleFavorite(recipe)"
            >
              <FontAwesomeIcon icon="heart" class="mr-1 text-red-500" /> Remove
            </button>
            <button
              class="inline-flex items-center gap-1 rounded-full border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-600 hover:border-green-500 hover:text-green-600 transition"
              @click="emit('view-detail', recipe)"
            >
              <FontAwesomeIcon icon="arrow-right" /> View
            </button>
            <button
              class="inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-green-700 transition"
              @click="emit('add-to-plan', recipe)"
            >
              <FontAwesomeIcon icon="plus" /> Add to plan
            </button>
          </div>
        </li>
      </ul>

      <div
        v-if="favoritesForActiveType.length > pageSize"
        class="mt-4 flex items-center justify-between text-xs text-gray-500"
      >
        <span>Page {{ pagination[activeMealType] || 1 }} of {{ totalPages }}</span>
        <div class="flex items-center gap-2">
          <button
            class="rounded-full border border-gray-300 px-3 py-1 hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed"
            @click="prevPage"
            :disabled="(pagination[activeMealType] || 1) === 1"
          >
            Prev
          </button>
          <button
            class="rounded-full border border-gray-300 px-3 py-1 hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed"
            @click="nextPage"
            :disabled="(pagination[activeMealType] || 1) >= totalPages"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
