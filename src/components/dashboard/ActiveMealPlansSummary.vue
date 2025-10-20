<script setup>
import { computed } from 'vue'

const props = defineProps({
  plans: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['open-plan'])

function toMeals(plan) {
  if (!Array.isArray(plan.meals)) return []
  return plan.meals.map((meal) => ({
    id: meal.id,
    label: meal.label || 'Meal',
    scheduled: meal.scheduledAt || '',
    items: (meal.items || []).map((item) => ({
      id: item.id,
      name: item.name || 'Item',
      calories: Math.round(Number(item.calories ?? item.nutrition?.calories ?? 0)),
    })),
  }))
}

const normalizedPlans = computed(() =>
  props.plans.map((plan) => {
    const totals = plan.nutritionTotals || {}
    const meals = toMeals(plan)
    return {
      id: plan.id,
      name: plan.name || 'Untitled plan',
      calories: Math.round(Number(totals.calories || 0)),
      expires: plan.endDate || '',
      meals,
      status: plan.status || 'draft',
      notes: plan.notes || '',
    }
  }),
)

function formatDate(value) {
  if (!value) return 'No end date'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString(undefined, { day: '2-digit', month: 'short' })
}

function statusTone(status) {
  if (status === 'archived') return 'bg-gray-100 text-gray-600'
  if (status === 'draft') return 'bg-sky-100 text-sky-700'
  return 'bg-green-100 text-green-700'
}
</script>

<template>
  <section class="dash-card space-y-4">
    <header class="flex items-center justify-between gap-3">
      <div>
        <h2 class="text-xl font-semibold text-gray-900">Active Meal Plans</h2>
        <p class="text-lg text-gray-500">
          Your current plans and where calories are trending today.
        </p>
      </div>
      <span class="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
        {{ normalizedPlans.length }}
      </span>
    </header>

    <div
      v-if="!normalizedPlans.length"
      class="rounded-2xl border border-dashed border-gray-200 bg-white/80 p-6 text-center text-lg text-gray-500"
    >
      No meal plans to show yet — create or activate one to see it here.
    </div>

    <ul v-else class="space-y-4">
      <li
        v-for="plan in normalizedPlans"
        :key="plan.id"
        class="group cursor-pointer rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-green-500 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-green-200"
        @click="emit('open-plan', plan.id)"
      >
        <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div class="space-y-2">
            <div class="flex flex-wrap items-center gap-2">
              <p class="text-2xl font-semibold text-gray-900 group-hover:text-green-600">
                {{ plan.name }}
              </p>
              <span
                :class="[
                  'rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest',
                  statusTone(plan.status),
                ]"
              >
                {{ plan.status }}
              </span>
            </div>
            <p class="text-lg text-gray-500">
              {{ plan.meals.length }} meals · Ends {{ formatDate(plan.expires) }}
            </p>
            <p v-if="plan.notes" class="text-lg text-gray-600 line-clamp-2">
              {{ plan.notes }}
            </p>
          </div>
          <div class="flex flex-col items-end gap-2 text-right">
            <span class="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Total calories
            </span>
            <span class="text-2xl font-semibold text-green-600">{{ plan.calories }} kcal</span>
          </div>
        </div>

        <div class="mt-4 space-y-3">
          <div
            v-for="meal in plan.meals"
            :key="meal.id"
            class="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 transition group-hover:border-green-200"
          >
            <div class="flex items-center justify-between">
              <p class="text-lg font-semibold text-gray-900">{{ meal.label }}</p>
              <span class="text-lg text-gray-500">
                {{ meal.scheduled || 'Any time' }}
              </span>
            </div>
            <ul class="mt-2 space-y-1 text-lg text-gray-600">
              <li
                v-for="item in meal.items"
                :key="item.id"
                class="flex items-center justify-between"
              >
                <span>{{ item.name }}</span>
                <span class="text-lg text-gray-500">{{ item.calories }} kcal</span>
              </li>
              <li v-if="!meal.items.length" class="text-lg text-gray-400 italic">No items yet.</li>
            </ul>
          </div>
        </div>
      </li>
    </ul>
  </section>
</template>
