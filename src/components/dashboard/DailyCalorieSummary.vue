<script setup>
import { computed } from 'vue'

const emit = defineEmits(['open-history'])

const props = defineProps({
  limit: { type: Number, default: 2000 },
  consumed: { type: Number, default: 0 },
  lastUpdated: { type: String, default: '' },
})

const safeLimit = computed(() =>
  Number.isFinite(props.limit) && props.limit > 0 ? Math.round(props.limit) : 2000,
)
const safeConsumed = computed(() =>
  Number.isFinite(props.consumed) && props.consumed > 0 ? Math.round(props.consumed) : 0,
)

const remaining = computed(() => Math.max(safeLimit.value - safeConsumed.value, 0))
const percent = computed(() => {
  if (!safeLimit.value) return 0
  return Math.min(100, Math.round((safeConsumed.value / safeLimit.value) * 100))
})

const statusTone = computed(() => {
  if (percent.value >= 95) return 'bg-red-50 text-red-600'
  if (percent.value >= 75) return 'bg-amber-50 text-amber-600'
  return 'bg-green-50 text-green-600'
})

const formattedUpdated = computed(() => {
  if (!props.lastUpdated) return ''
  const date = new Date(props.lastUpdated)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
})

function handleClick() {
  emit('open-history')
}
</script>

<template>
  <section
    class="dash-card flex cursor-pointer flex-col gap-6 border border-gray-100 bg-white/90 p-6 shadow-sm transition hover:border-green-500 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-green-200 lg:flex-row lg:items-center"
    role="button"
    tabindex="0"
    @click="handleClick"
    @keyup.enter.prevent="handleClick"
  >
    <div class="relative flex h-32 w-32 flex-shrink-0 items-center justify-center">
      <svg class="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          class="stroke-gray-200"
          stroke-width="10"
          fill="transparent"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          class="stroke-green-500 transition-all duration-500 ease-out"
          stroke-width="10"
          stroke-linecap="round"
          fill="transparent"
          :stroke-dasharray="`${percent * 2.83} 999`"
        />
      </svg>
      <div class="flex flex-col items-center text-center">
        <span class="text-xs font-semibold uppercase tracking-widest text-gray-400">Used</span>
        <span class="text-2xl font-semibold text-gray-900">{{ percent }}%</span>
      </div>
    </div>

    <div class="flex-1 space-y-4">
      <header class="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p class="text-xs font-semibold uppercase tracking-widest text-gray-500">
            Daily calories
          </p>
          <p class="text-2xl font-semibold text-gray-900">
            {{ safeConsumed }} <span class="text-base font-medium text-gray-500">of</span>
            {{ safeLimit }} kcal
          </p>
        </div>
        <span :class="['rounded-full px-4 py-1 text-lg font-semibold', statusTone]">
          {{ remaining }} kcal left
        </span>
      </header>

      <div class="space-y-3">
        <div class="h-2.5 w-full rounded-full bg-gray-100">
          <div
            class="h-full rounded-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 transition-all duration-500 ease-out"
            :style="{ width: `${Math.max(percent, 4)}%` }"
          ></div>
        </div>
        <div class="flex flex-wrap items-center justify-between gap-3 text-lg text-gray-600">
          <div>Consumed today</div>
          <div class="flex items-center gap-2">
            <span
              class="rounded bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              Target
            </span>
            <span class="font-semibold text-gray-900">{{ safeLimit }} kcal</span>
          </div>
        </div>
        <p v-if="formattedUpdated" class="text-xs text-gray-400">
          Last updated {{ formattedUpdated }}
        </p>
        <p class="text-lg font-semibold text-green-600">Open history →</p>
      </div>
    </div>
  </section>
</template>
