<script setup>
/**
 * Summarises key macro + micro totals for the latest nutrition search.
 * Includes quick labels to guide users toward the Save-to-Meal flow.
 */
import { computed } from 'vue'
import DashboardCard from '@/components/dashboard/DashboardCard.vue'

const props = defineProps({
  totals: {
    type: Object,
    default: () => ({
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
    }),
  },
})

const macroMetrics = computed(() => {
  const protein = Number(props.totals?.protein) || 0
  const carbs = Number(props.totals?.carbs) || 0
  const fats = Number(props.totals?.fats ?? props.totals?.fat) || 0
  const fiber = Number(props.totals?.fiber) || 0

  const magnitude = protein + carbs + fats + fiber || 1

  return [
    { key: 'protein', label: 'Protein', grams: protein, color: 'text-emerald-600' },
    { key: 'carbs', label: 'Carbs', grams: carbs, color: 'text-blue-600' },
    { key: 'fats', label: 'Fats', grams: fats, color: 'text-amber-600' },
    { key: 'fiber', label: 'Fiber', grams: fiber, color: 'text-teal-600' },
  ].map((metric) => ({
    ...metric,
    percent: Math.round((metric.grams / magnitude) * 100),
  }))
})

const microMetrics = computed(() => [
  {
    key: 'sugar',
    label: 'Sugar',
    value: Number(props.totals?.sugar || 0),
    suffix: 'g',
    tone: 'text-rose-600',
  },
  {
    key: 'sodium',
    label: 'Sodium',
    value: Number(props.totals?.sodium || 0),
    suffix: 'mg',
    tone: 'text-sky-600',
  },
])

const hasAnyTotals = computed(() =>
  [...macroMetrics.value, ...microMetrics.value].some((metric) => metric.value || metric.grams),
)
</script>

<template>
  <DashboardCard title="Nutrition Distribution">
    <div v-if="hasAnyTotals" class="space-y-6">
      <div>
        <p class="text-lg font-semibold text-gray-800 mb-2">Macros</p>
        <ul class="space-y-3">
          <li
            v-for="metric in macroMetrics"
            :key="metric.key"
            class="flex items-center justify-between"
          >
            <div class="flex items-center gap-3">
              <span class="w-2.5 h-2.5 rounded-full bg-gray-300" />
              <span class="text-base font-medium text-gray-700">{{ metric.label }}</span>
            </div>
            <div class="text-right">
              <p class="text-lg font-semibold" :class="metric.color">
                {{ metric.grams.toFixed(1) }} g
              </p>
              <p class="text-sm text-gray-500">{{ metric.percent }}% of macros</p>
            </div>
          </li>
        </ul>
      </div>

      <div>
        <p class="text-lg font-semibold text-gray-800 mb-2">Highlights</p>
        <div class="grid grid-cols-2 gap-3">
          <div
            v-for="metric in microMetrics"
            :key="metric.key"
            class="bg-gray-50 rounded-lg px-3 py-4 text-center"
          >
            <p class="text-base text-gray-500">{{ metric.label }}</p>
            <p class="text-xl font-semibold" :class="metric.tone">
              {{ metric.value.toFixed(1) }} {{ metric.suffix }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <p v-else class="text-base text-gray-500">Run a nutrition search to view the nutrient split.</p>
  </DashboardCard>
</template>
