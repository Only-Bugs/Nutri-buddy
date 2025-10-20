<script setup>
import { computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  getMealTypeVisual,
  getSecondaryMealTypes,
  buildMacroSummary,
  buildInfoItems,
} from '@/utils/recipeVisuals'

const props = defineProps({
  recipe: { type: Object, required: true },
  favorite: { type: Boolean, default: false },
})

const emit = defineEmits(['toggle-favorite', 'add-to-plan', 'open-detail'])

const primaryType = computed(
  () => props.recipe.primaryMealType || props.recipe.mealTypes?.[0] || 'Meal',
)

const heroMeta = computed(() => getMealTypeVisual(primaryType.value))

const secondaryMealTypes = computed(() =>
  getSecondaryMealTypes(props.recipe.mealTypes || [], primaryType.value),
)

const macroSummary = computed(() => buildMacroSummary(props.recipe?.nutrition, false))

const infoItems = computed(() => {
  const items = buildInfoItems(props.recipe)
  return [items[0], items[1], items[2], items[4]].filter(Boolean)
})
</script>

<template>
  <article
    class="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col cursor-pointer transition hover:shadow-lg"
    @click="emit('open-detail', recipe)"
  >
    <div class="relative rounded-t-3xl bg-gradient-to-br p-6" :class="heroMeta.gradient">
      <div class="flex items-start justify-between gap-3">
        <div class="space-y-2">
          <p class="text-xs font-semibold uppercase tracking-widest" :class="heroMeta.accent">
            {{ primaryType }}
          </p>
          <h3 class="text-xl font-semibold text-gray-900 leading-snug line-clamp-2">
            {{ recipe.name }}
          </h3>
        </div>
        <button
          @click.stop="emit('toggle-favorite', recipe)"
          class="rounded-full bg-white/90 p-2 shadow hover:bg-white transition"
          :class="favorite ? 'text-red-500' : 'text-gray-400'"
          :aria-label="favorite ? 'Remove from favorites' : 'Add to favorites'"
        >
          <FontAwesomeIcon icon="heart" />
        </button>
      </div>

      <div class="mt-6 flex items-end justify-between gap-4">
        <FontAwesomeIcon
          :icon="heroMeta.icon"
          :class="['text-5xl drop-shadow-sm', heroMeta.accent]"
        />
        <div class="flex flex-wrap items-center gap-2">
          <span
            v-for="mealType in secondaryMealTypes"
            :key="mealType"
            :class="['rounded-full px-3 py-1 text-xs font-semibold shadow-sm', heroMeta.badge]"
          >
            {{ mealType }}
          </span>
        </div>
      </div>
    </div>

    <div class="flex flex-1 flex-col gap-5 p-5">
      <p v-if="recipe.description" class="text-lg text-gray-600 line-clamp-3">
        {{ recipe.description }}
      </p>

      <dl class="grid grid-cols-2 gap-3 text-lg text-gray-700">
        <div
          v-for="info in infoItems"
          :key="info.label"
          class="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2"
        >
          <FontAwesomeIcon :icon="info.icon" class="text-gray-400" />
          <div>
            <dt class="text-xs font-semibold uppercase tracking-widest text-gray-400">
              {{ info.label }}
            </dt>
            <dd class="font-semibold text-gray-900">{{ info.value }}</dd>
          </div>
        </div>
      </dl>

      <div class="grid grid-cols-2 gap-3">
        <div
          v-for="macro in macroSummary"
          :key="macro.label"
          :class="['flex flex-col items-start gap-1 rounded-xl px-4 py-3 shadow-sm', macro.bg]"
        >
          <span
            class="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-500"
          >
            <FontAwesomeIcon :icon="macro.icon" :class="macro.accent" />
            {{ macro.label }}
          </span>
          <span class="text-lg font-semibold text-gray-900">{{ macro.value }}</span>
        </div>
      </div>

      <div class="mt-auto flex items-center justify-between gap-3">
        <button
          class="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-green-600 px-4 py-2 text-lg font-semibold text-green-700 transition hover:bg-green-600 hover:text-white"
          @click.stop="emit('add-to-plan', recipe)"
        >
          <FontAwesomeIcon icon="plus" />
          Add to Meal Plan
        </button>
      </div>
    </div>
  </article>
</template>
