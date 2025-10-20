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

function handleClick() {
  emit('open-history')
}
</script>

<template>
  <section
    class="dash-card flex cursor-pointer flex-col gap-6 border-2 border-transparent transition hover:border-green-500 hover:shadow-lg lg:flex-row lg:items-center"
    role="button"
    tabindex="0"
    @click="handleClick"
    @keyup.enter.prevent="handleClick"
  >
    <div class="flex flex-1 items-center justify-between gap-6">
      <div>
        <p class="text-lg font-semibold uppercase tracking-wide text-gray-500">Daily calories</p>
        <p class="text-3xl font-semibold text-gray-900">
          {{ safeConsumed }} / {{ safeLimit }}
        </p>
      </div>
      <span class="rounded-full bg-green-50 px-4 py-2 text-lg font-semibold text-green-600">
        {{ percent }}% used
      </span>
    </div>

    <div class="flex flex-1 flex-col gap-3">
      <div class="h-3 w-full rounded-full bg-gray-200">
        <div
          class="h-full rounded-full bg-green-500 transition-all duration-300"
          :style="{ width: `${percent}%` }"
        />
      </div>
      <div class="flex items-center justify-between text-lg text-gray-600">
        <span>Remaining</span>
        <span :class="statusTone">{{ remaining }} kcal</span>
      </div>
      <p v-if="formattedUpdated" class="text-lg text-gray-400">Updated {{ formattedUpdated }}</p>
      <p class="text-lg font-medium text-green-600">Tap to review history</p>
    </div>
  </section>
</template>
