<script setup>
import { computed } from 'vue'

const props = defineProps({
  limit: { type: Number, default: 2000 },
  consumed: { type: Number, default: 0 },
  lastUpdated: { type: String, default: '' },
})

const safeLimit = computed(() => (Number.isFinite(props.limit) && props.limit > 0 ? Math.round(props.limit) : 2000))
const safeConsumed = computed(() => (Number.isFinite(props.consumed) && props.consumed > 0 ? Math.round(props.consumed) : 0))

const remaining = computed(() => Math.max(safeLimit.value - safeConsumed.value, 0))
const percent = computed(() => {
  if (!safeLimit.value) return 0
  return Math.min(100, Math.round((safeConsumed.value / safeLimit.value) * 100))
})

const statusTone = computed(() => {
  if (percent.value >= 95) return 'text-red-600'
  if (percent.value >= 75) return 'text-amber-600'
  return 'text-green-600'
})

const formattedUpdated = computed(() => {
  if (!props.lastUpdated) return ''
  const date = new Date(props.lastUpdated)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
})
</script>

<template>
  <section class="dash-card space-y-4">
    <header class="flex items-start justify-between gap-3">
      <div>
        <p class="text-sm font-medium text-gray-500 uppercase tracking-wide">Daily calorie summary</p>
        <h3 class="text-2xl font-semibold text-gray-900">
          {{ safeConsumed }} / {{ safeLimit }} kcal
        </h3>
      </div>
      <span class="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
        {{ percent }}% used
      </span>
    </header>

    <div class="space-y-2">
      <div class="h-2 w-full rounded-full bg-gray-200">
        <div
          class="h-full rounded-full bg-green-500 transition-all duration-300"
          :style="{ width: `${percent}%` }"
        />
      </div>
      <div class="flex justify-between text-sm text-gray-600">
        <span>Remaining</span>
        <span :class="statusTone">{{ remaining }} kcal</span>
      </div>
    </div>

    <footer class="flex items-center justify-between text-xs text-gray-500">
      <span>Adjust in Settings</span>
      <span v-if="formattedUpdated">Updated {{ formattedUpdated }}</span>
    </footer>
  </section>
</template>
