<script setup>
import { computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const props = defineProps({
  recipe: { type: Object, required: true },
  favorite: { type: Boolean, default: false },
})

const emit = defineEmits(['toggle-favorite', 'add-to-plan', 'open-detail'])

const macroSummary = computed(() => {
  const nutrition = props.recipe?.nutrition || {}
  return [
    { label: 'Calories', value: `${nutrition.calories || 0} kcal` },
    { label: 'Protein', value: `${nutrition.protein || 0} g` },
    { label: 'Carbs', value: `${nutrition.carbs || 0} g` },
    { label: 'Fat', value: `${nutrition.fat || 0} g` },
  ]
})
</script>

<template>
  <article
    class="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col cursor-pointer hover:shadow-md transition"
    @click="emit('open-detail', recipe)"
  >
    <div class="relative h-40 bg-gray-100">
      <img
        v-if="recipe.image"
        :src="recipe.image"
        :alt="recipe.name"
        class="h-full w-full object-cover"
        loading="lazy"
      />
      <div class="absolute top-3 right-3 flex items-center gap-2">
        <span
          v-for="mealType in recipe.mealTypes"
          :key="mealType"
          class="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-green-700 shadow"
        >
          {{ mealType }}
        </span>
        <button
          @click.stop="emit('toggle-favorite', recipe)"
          class="rounded-full bg-white/90 p-2 shadow hover:bg-white transition"
          :class="favorite ? 'text-red-500' : 'text-gray-400'"
          :aria-label="favorite ? 'Remove from favorites' : 'Add to favorites'"
        >
          <FontAwesomeIcon icon="heart" />
        </button>
      </div>
    </div>

    <div class="flex flex-1 flex-col gap-4 p-5">
      <header>
        <h3 class="text-lg font-semibold text-gray-900 line-clamp-2">{{ recipe.name }}</h3>
        <p v-if="recipe.description" class="mt-1 text-sm text-gray-600 line-clamp-2">
          {{ recipe.description }}
        </p>
      </header>

      <dl class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
        <div>
          <dt class="font-medium text-gray-500">Prep</dt>
          <dd>{{ recipe.prepTimeMinutes }} min</dd>
        </div>
        <div>
          <dt class="font-medium text-gray-500">Cook</dt>
          <dd>{{ recipe.cookTimeMinutes }} min</dd>
        </div>
        <div>
          <dt class="font-medium text-gray-500">Servings</dt>
          <dd>{{ recipe.servings }}</dd>
        </div>
        <div>
          <dt class="font-medium text-gray-500">Cuisine</dt>
          <dd>{{ recipe.cuisines?.join(', ') || '—' }}</dd>
        </div>
      </dl>

      <div class="grid grid-cols-2 gap-2 text-xs">
        <div
          v-for="macro in macroSummary"
          :key="macro.label"
          class="rounded-lg bg-green-50 px-3 py-2 text-green-700 font-semibold text-center"
        >
          <p class="text-xs uppercase tracking-wide text-green-500">{{ macro.label }}</p>
          <p>{{ macro.value }}</p>
        </div>
      </div>

      <div class="mt-auto flex flex-col gap-2">
        <button
          class="inline-flex items-center justify-center gap-2 rounded-lg border border-green-600 px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-600 hover:text-white transition"
          @click.stop="emit('add-to-plan', recipe)"
        >
          <FontAwesomeIcon icon="plus" /> Add to Meal Plan
        </button>
      </div>
    </div>
  </article>
</template>
