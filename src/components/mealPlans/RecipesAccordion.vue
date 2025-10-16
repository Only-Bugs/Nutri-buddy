<script setup>
import { computed } from 'vue'

const props = defineProps({
  recipes: {
    type: Array,
    default: () => [],
  },
})

function formatCalories(value) {
  const numeric = Number(value)
  if (!Number.isFinite(numeric) || numeric <= 0) return '—'
  return `${Math.round(numeric)} kcal`
}

function formatIngredient(ingredient) {
  const parts = []
  if (ingredient.quantity) parts.push(String(ingredient.quantity).trim())
  if (ingredient.unit) parts.push(String(ingredient.unit).trim())
  const joined = parts.join(' ')
  const name = ingredient.name ? String(ingredient.name).trim() : ''
  if (joined && name) return `${joined} ${name}`
  return name || joined || ''
}

const normalizedRecipes = computed(() =>
  props.recipes.map((recipe) => ({
    ...recipe,
    instructions: Array.isArray(recipe.instructions)
      ? recipe.instructions.map((step) => String(step || '').trim()).filter(Boolean)
      : [],
    ingredients: Array.isArray(recipe.ingredients)
      ? recipe.ingredients.map((ingredient) => ({
          name: ingredient.name || '',
          quantity: ingredient.quantity ?? '',
          unit: ingredient.unit ?? '',
          misc: ingredient.misc ?? '',
        }))
      : [],
  })),
)

const hasRecipes = computed(() => normalizedRecipes.value.length > 0)
</script>

<template>
  <section class="rounded-xl border border-gray-200 bg-white px-4 py-4 shadow-sm">
    <header class="flex items-center justify-between gap-3">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">Recipes</h3>
        <p class="text-sm text-gray-500">Accordion view of every recipe linked to this plan.</p>
      </div>
      <span class="text-sm font-medium text-gray-500">{{ normalizedRecipes.length }}</span>
    </header>

    <p v-if="!hasRecipes" class="mt-3 text-sm text-gray-500">
      No recipes added yet. Save a favourite recipe from the dashboard to see it here.
    </p>

    <ul v-else class="mt-4 space-y-3">
      <li v-for="recipe in normalizedRecipes" :key="recipe.planItemId">
        <details class="group rounded-lg border border-gray-200 bg-gray-50 p-4">
          <summary
            class="flex cursor-pointer items-start justify-between gap-3 text-base font-semibold text-gray-800"
          >
            <div>
              <p class="text-base font-semibold text-gray-900">{{ recipe.name }}</p>
              <p class="text-xs text-gray-500">
                <span v-if="recipe.mealLabel">{{ recipe.mealLabel }}</span>
                <span v-if="recipe.servings" class="ml-2">Servings: {{ recipe.servings }}</span>
              </p>
            </div>
            <span class="text-sm font-semibold text-green-600">{{ formatCalories(recipe.nutrition?.calories) }}</span>
          </summary>

          <div class="mt-4 space-y-4 text-sm text-gray-700">
            <div>
              <h4 class="text-xs font-semibold uppercase tracking-wide text-gray-500">Ingredients</h4>
              <ul v-if="recipe.ingredients.length" class="mt-2 list-disc space-y-1 pl-5">
                <li v-for="(ingredient, index) in recipe.ingredients" :key="`${recipe.planItemId}-ing-${index}`">
                  {{ formatIngredient(ingredient) }}
                  <span v-if="ingredient.misc" class="text-gray-500">({{ ingredient.misc }})</span>
                </li>
              </ul>
              <p v-else class="mt-2 text-xs text-gray-500">No ingredient list provided.</p>
            </div>

            <div>
              <h4 class="text-xs font-semibold uppercase tracking-wide text-gray-500">Instructions</h4>
              <ol v-if="recipe.instructions.length" class="mt-2 list-decimal space-y-2 pl-5">
                <li v-for="(step, index) in recipe.instructions" :key="`${recipe.planItemId}-step-${index}`">
                  {{ step }}
                </li>
              </ol>
              <p v-else class="mt-2 text-xs text-gray-500">No instructions provided.</p>
            </div>

            <div class="flex justify-end">
              <RouterLink
                v-if="recipe.id"
                class="text-xs font-semibold text-green-700 hover:underline"
                :to="{ name: 'RecipeDetail', params: { id: recipe.id } }"
              >
                View full recipe
              </RouterLink>
            </div>
          </div>
        </details>
      </li>
    </ul>
  </section>
</template>
