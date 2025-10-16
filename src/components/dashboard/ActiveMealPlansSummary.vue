<script setup>
import { computed } from 'vue'

const props = defineProps({
  plans: {
    type: Array,
    default: () => [],
  },
})

const normalizedPlans = computed(() =>
  props.plans.map((plan) => {
    const totals = plan.nutritionTotals || {}
    const meals = Array.isArray(plan.meals) ? plan.meals.length : 0
    return {
      id: plan.id,
      name: plan.name || 'Untitled plan',
      calories: Math.round(Number(totals.calories || 0)),
      expires: plan.endDate || '',
      meals,
      status: plan.status || 'active',
    }
  }),
)

function formatDate(value) {
  if (!value) return 'No end date'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString(undefined, { day: '2-digit', month: 'short' })
}
</script>

<template>
  <section class="dash-card space-y-4">
    <header class="flex items-center justify-between gap-3">
      <div>
        <h2 class="text-xl font-semibold text-gray-900">Active Meal Plans</h2>
        <p class="text-sm text-gray-500">
          Quick glance at your current plans and their calorie totals.
        </p>
      </div>
      <span class="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
        {{ normalizedPlans.length }}
      </span>
    </header>

    <div v-if="!normalizedPlans.length" class="rounded-xl border border-dashed border-gray-300 bg-white/70 p-6 text-center text-sm text-gray-500">
      No active plans. Create or activate one to see it here.
    </div>

    <ul v-else class="space-y-3">
      <li
        v-for="plan in normalizedPlans"
        :key="plan.id"
        class="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm"
      >
        <div class="min-w-0">
          <p class="text-sm font-semibold text-gray-900 leading-tight">{{ plan.name }}</p>
          <p class="text-xs text-gray-500">
            {{ plan.meals }} meals • Ends {{ formatDate(plan.expires) }}
          </p>
        </div>
        <span class="text-sm font-semibold text-green-600">{{ plan.calories }} kcal</span>
      </li>
    </ul>
  </section>
</template>
