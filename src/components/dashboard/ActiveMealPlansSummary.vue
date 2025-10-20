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

    <ul v-else class="space-y-4">
      <li
        v-for="plan in normalizedPlans"
        :key="plan.id"
        class="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-green-500 hover:shadow-md"
        @click="emit('open-plan', plan.id)"
      >
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-2xl font-semibold text-gray-900 group-hover:text-green-600">
              {{ plan.name }}
            </p>
            <p class="text-lg text-gray-500">
              {{ plan.meals.length }} meals · Ends {{ formatDate(plan.expires) }}
            </p>
          </div>
          <span class="text-lg font-semibold text-green-600">{{ plan.calories }} kcal</span>
        </div>

        <div class="mt-4 space-y-3">
          <div
            v-for="meal in plan.meals"
            :key="meal.id"
            class="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
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
              <li v-if="!meal.items.length" class="text-lg text-gray-400 italic">
                No items yet.
              </li>
            </ul>
          </div>
        </div>
      </li>
    </ul>
  </section>
</template>
