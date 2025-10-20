<script setup>
import { computed } from 'vue'

const props = defineProps({
  plan: { type: Object, default: null },
  totals: { type: Object, default: () => ({}) },
  meals: { type: Array, default: () => [] },
  planHasItems: { type: Boolean, default: false },
})

const emit = defineEmits(['add-meal', 'open-menu', 'edit-plan', 'remove-item'])

const caloriesProgress = computed(() => {
  const total = Number(props.totals?.calories || 0)
  const baseline = 2000
  return Math.min(100, Math.round((total / baseline) * 100))
})

const macroBreakdown = computed(() => {
  const protein = Math.max(0, Number(props.totals?.protein || 0))
  const carbs = Math.max(0, Number(props.totals?.carbs || 0))
  const fats = Math.max(0, Number(props.totals?.fats || props.totals?.fat || 0))
  const total = protein + carbs + fats || 1
  return [
    { label: 'Protein', percent: Math.round((protein / total) * 100), color: 'bg-blue-500' },
    { label: 'Carbs', percent: Math.round((carbs / total) * 100), color: 'bg-green-500' },
    { label: 'Fats', percent: Math.round((fats / total) * 100), color: 'bg-amber-500' },
  ]
})

function formatDateRange(plan) {
  if (!plan) return ''
  const start = plan.startDate || 'No start'
  const end = plan.endDate ? `→ ${plan.endDate}` : '· ongoing'
  return `${start} ${end}`
}

function formatMacro(value, unit = 'g') {
  const number = Number(value ?? 0)
  if (Number.isNaN(number)) return `0 ${unit}`
  if (unit === 'kcal') return `${Math.round(number)} kcal`
  return `${number.toFixed(1)} ${unit}`
}
</script>

<template>
  <section class="relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:shadow-xl">
    <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600"></div>
    <header class="flex flex-col gap-3 border-b border-gray-100 px-6 py-6 md:flex-row md:items-start md:justify-between">
      <div class="space-y-1">
        <p class="text-xs font-semibold uppercase tracking-widest text-green-600">
          {{ plan ? 'Active Plan' : 'Getting Started' }}
        </p>
        <div class="flex flex-wrap items-center gap-2">
          <h2 class="text-2xl font-semibold text-gray-900">
            {{ plan?.name || 'No active plan yet' }}
          </h2>
          <span
            v-if="plan"
            class="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-700"
          >
            {{ plan.status || 'draft' }}
          </span>
        </div>
        <p class="text-sm text-gray-500" v-if="plan">
          {{ formatDateRange(plan) }}
        </p>
      </div>
      <div class="relative flex items-center gap-3">
        <button
          v-if="plan"
          type="button"
          class="group flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition hover:border-green-500 hover:text-green-600"
          title="Add meal or recipe"
          @click="emit('add-meal')"
        >
          <FontAwesomeIcon icon="plus" class="text-lg transition group-hover:scale-105" />
        </button>
        <button
          v-if="plan"
          type="button"
          class="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition hover:border-gray-400"
          aria-label="Open plan menu"
          @click="emit('open-menu')"
        >
          <FontAwesomeIcon icon="ellipsis-vertical" />
        </button>
        <slot name="menu" />
      </div>
    </header>

    <div v-if="!plan" class="px-6 py-12 text-center">
      <FontAwesomeIcon icon="utensils" class="mx-auto h-12 w-12 text-gray-200" />
      <p class="mt-4 text-lg font-semibold text-gray-600">
        No meals tracked yet — start by creating a plan.
      </p>
      <p class="mt-2 text-sm text-gray-500">
        Meal plans keep nutrition visible and organised. Add your first plan to begin tracking progress.
      </p>
    </div>

    <div v-else class="space-y-8 px-6 py-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="max-w-xl space-y-2">
          <p class="text-sm text-gray-600 whitespace-pre-line">
            {{ plan.notes || 'Add notes to keep objectives, reminders, or context together.' }}
          </p>
        </div>
        <button
          type="button"
          class="text-sm font-semibold text-green-600 underline-offset-2 hover:underline"
          @click="emit('edit-plan')"
        >
          Edit details
        </button>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <article class="rounded-2xl border border-green-100 bg-green-50 p-5 shadow-sm">
          <header class="flex items-center justify-between text-sm font-semibold text-green-700">
            <span>Calories</span>
            <span>{{ formatMacro(totals?.calories || 0, 'kcal') }}</span>
          </header>
          <div class="mt-4 h-2 w-full rounded-full bg-green-100">
            <div
              class="h-full rounded-full bg-green-600 transition-all"
              :style="{ width: `${caloriesProgress}%` }"
            ></div>
          </div>
          <p class="mt-3 text-xs text-green-700">
            {{ caloriesProgress }}% of a 2000 kcal guideline
          </p>
        </article>

        <article class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <header class="flex items-center justify-between text-sm font-semibold text-gray-700">
            <span>Macro mix</span>
            <span>{{ formatMacro(totals?.protein || 0) }} · {{ formatMacro(totals?.carbs || 0) }} · {{ formatMacro(totals?.fats || totals?.fat || 0) }}</span>
          </header>
          <div class="mt-4 flex h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              v-for="macro in macroBreakdown"
              :key="macro.label"
              :class="macro.color"
              class="h-full"
              :style="{ width: `${macro.percent}%` }"
            ></div>
          </div>
          <ul class="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
            <li v-for="macro in macroBreakdown" :key="macro.label" class="flex items-center gap-2">
              <span :class="['inline-block h-2 w-2 rounded-full', macro.color]"></span>
              <span>{{ macro.label }} · {{ macro.percent }}%</span>
            </li>
          </ul>
        </article>
      </div>

      <div class="space-y-4">
        <header class="flex items-center justify-between">
          <h3 class="text-base font-semibold text-gray-900">Meals</h3>
          <span class="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600">
            {{ meals.length }} slots
          </span>
        </header>

        <div class="relative">
          <div :class="['space-y-4 transition', !planHasItems ? 'pointer-events-none blur-[1px]' : '']">
            <article
              v-for="meal in meals"
              :key="meal.id"
              class="group rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <header class="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 class="text-sm font-semibold text-gray-900">{{ meal.label }}</h4>
                  <p class="text-xs text-gray-500">{{ meal.scheduledAt || 'Any time' }}</p>
                </div>
                <span class="text-xs font-semibold text-gray-400">
                  {{ meal.items?.length || 0 }} items
                </span>
              </header>

              <div v-if="(meal.items || []).length" class="mt-4 space-y-3">
                <div
                  v-for="item in meal.items"
                  :key="item.id"
                  class="flex flex-col gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3 text-sm text-gray-700 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p class="font-semibold text-gray-900">{{ item.name }}</p>
                    <p class="text-xs text-gray-500">{{ item.quantity || '1 serving' }}</p>
                  </div>
                  <div class="flex flex-wrap gap-2 text-xs text-gray-600">
                    <span class="rounded bg-white px-2 py-1">{{ formatMacro(item.calories, 'kcal') }}</span>
                    <span class="rounded bg-white px-2 py-1">Protein {{ formatMacro(item.protein) }}</span>
                    <span class="rounded bg-white px-2 py-1">Carbs {{ formatMacro(item.carbs) }}</span>
                    <span class="rounded bg-white px-2 py-1">Fat {{ formatMacro(item.fat) }}</span>
                  </div>
                  <button
                    type="button"
                    class="self-start text-xs font-semibold text-red-500 transition hover:text-red-600 md:self-center"
                    @click="emit('remove-item', meal.id, item.id)"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <p v-else class="text-sm text-gray-500">No items yet.</p>
            </article>
          </div>

          <div
            v-if="!planHasItems"
            class="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl bg-white/80 text-center"
          >
            <div class="space-y-2 px-6">
              <p class="text-lg font-semibold text-gray-600">
                No meals tracked yet — start by adding a recipe or searching a dish.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
