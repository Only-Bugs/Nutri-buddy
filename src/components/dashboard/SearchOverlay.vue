<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import NutritionResultCard from '@/components/dashboard/NutritionResultCard.vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  query: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
  result: { type: Object, default: null },
})

const emit = defineEmits(['close', 'update:query', 'search', 'add-to-plan'])

const inputRef = ref(null)
const isClient = typeof window !== 'undefined'

const displayError = computed(() => props.error && !props.loading)

function closeOverlay() {
  emit('close')
}

function handleSearch() {
  emit('search')
}

function handleKeydown(event) {
  if (event.key === 'Escape') {
    event.preventDefault()
    closeOverlay()
  }
}

watch(
  () => props.show,
  async (visible) => {
    if (!isClient) return
    if (visible) {
      window.addEventListener('keydown', handleKeydown)
      await nextTick()
      inputRef.value?.focus()
    } else {
      window.removeEventListener('keydown', handleKeydown)
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (!isClient) return
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 z-40 flex items-center justify-center px-4 py-8"
      role="dialog"
      aria-modal="true"
    >
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click.self="closeOverlay" />

      <div
        class="relative z-10 w-full max-w-4xl space-y-6 rounded-3xl bg-white/95 p-8 shadow-2xl border border-green-100"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 space-y-2">
            <p class="text-lg uppercase font-semibold text-green-600">Search nutrition</p>
            <h2 class="text-3xl font-semibold text-gray-900">Find food insights</h2>
          </div>
          <button
            class="text-gray-400 hover:text-gray-600 transition-colors text-xl font-semibold"
            aria-label="Close search"
            @click="closeOverlay"
          >
            X
          </button>
        </div>

        <div class="space-y-3">
          <div
            class="flex items-center gap-3 rounded-full border-2 border-green-500 px-4 py-2 bg-white"
          >
            <FontAwesomeIcon icon="magnifying-glass" class="text-green-600 text-lg" />
            <input
              ref="inputRef"
              :value="query"
              type="text"
              placeholder='Search food (e.g., "125 g grilled salmon")'
              class="flex-1 bg-transparent text-lg text-gray-800 placeholder:text-gray-400 focus:outline-none"
              @input="emit('update:query', $event.target.value)"
              @keydown.enter.prevent="handleSearch"
            />
            <button
              class="rounded-full bg-green-600 px-5 py-2 text-base font-semibold text-white hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
              :disabled="loading"
              @click="handleSearch"
            >
              {{ loading ? 'Searching…' : 'Search' }}
            </button>
          </div>
          <p v-if="displayError" class="text-base text-red-600">{{ error }}</p>
        </div>

        <div v-if="loading" class="flex items-center gap-3 text-lg text-gray-500">
          <span
            class="inline-block h-5 w-5 rounded-full border-2 border-green-600 border-t-transparent animate-spin"
            aria-hidden="true"
          />
          <span>Crunching the numbers…</span>
        </div>

        <NutritionResultCard
          v-if="!loading"
          :foodData="result"
          :query="query"
          @add-to-plan="emit('add-to-plan')"
        />
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
