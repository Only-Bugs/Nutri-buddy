<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useDashboardStore } from '@/store/dashboard'
import NutritionHistoryTable from '@/components/dashboard/NutritionHistoryTable.vue'
import SearchOverlay from '@/components/dashboard/SearchOverlay.vue'
import AddToMealPlanModal from '@/components/mealPlans/AddToMealPlanModal.vue'

const dashboard = useDashboardStore()

const query = ref('')
const searchOverlayOpen = ref(false)
const addModalOpen = ref(false)
const selectedItem = ref(null)
const selectedTotals = ref(null)

const entries = computed(() => dashboard.foods || [])

function normaliseNumber(value) {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : 0
}

function formatTimestamp(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function handleSearch() {
  dashboard.searchFood(query.value)
}

function updateQuery(val) {
  query.value = val
}

function openSearchOverlay() {
  searchOverlayOpen.value = true
}

function closeSearchOverlay() {
  searchOverlayOpen.value = false
}

function openAddModal(payload = {}) {
  if (!payload?.item) return
  selectedItem.value = payload.item
  selectedTotals.value = payload.totals || null
  addModalOpen.value = true
}

function closeAddModal() {
  addModalOpen.value = false
  selectedItem.value = null
  selectedTotals.value = null
}

function buildTotalsFromEntry(entry) {
  return {
    calories: normaliseNumber(entry.calories),
    protein: normaliseNumber(entry.protein),
    carbs: normaliseNumber(entry.carbs),
    fats: normaliseNumber(entry.fat ?? entry.fats),
    fiber: normaliseNumber(entry.fiber),
    sugar: normaliseNumber(entry.sugar),
    sodium: normaliseNumber(entry.sodium),
  }
}

function handleEntryAddToPlan(entry) {
  if (!entry) return
  openAddModal({
    item: { ...entry, type: 'food' },
    totals: buildTotalsFromEntry(entry),
  })
}

function handleOverlayAddToPlan() {
  const result = dashboard.latestResult
  if (!result) return
  openAddModal({
    item: { ...result, type: 'food' },
    totals: dashboard.latestTotals,
  })
}

watch(addModalOpen, (isOpen) => {
  if (!isOpen) {
    selectedItem.value = null
    selectedTotals.value = null
  }
})

watch(searchOverlayOpen, (isOpen) => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = isOpen ? 'hidden' : ''
})

onBeforeUnmount(() => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = ''
})
</script>

<template>
  <section class="relative space-y-6">
    <div :class="searchOverlayOpen ? 'pointer-events-none blur-sm' : ''" class="space-y-6">
      <header class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 class="text-3xl font-semibold text-gray-900">Nutrition History</h1>
          <p class="text-lg text-gray-500">
            Review every nutrition lookup, revisit details, and add entries to meal plans.
          </p>
        </div>
      </header>

      <div v-if="!entries.length" class="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center">
        <p class="text-2xl font-semibold text-gray-700">No entries yet</p>
        <p class="mt-2 text-lg text-gray-500">
          Search for food items from the dashboard to populate your history.
        </p>
      </div>

      <div v-else class="space-y-6">
        <NutritionHistoryTable :foods="entries" @add-to-plan="handleEntryAddToPlan" />

        <div class="space-y-4">
          <details
            v-for="entry in entries"
            :key="entry.id"
            class="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <summary class="flex cursor-pointer items-center justify-between gap-4">
              <div>
                <p class="text-2xl font-semibold text-gray-900">{{ entry.name }}</p>
                <p class="text-lg text-gray-500">
                  {{ entry.calories }} kcal · {{ formatTimestamp(entry.createdAt) }}
                </p>
              </div>
              <button
                class="inline-flex items-center gap-3 rounded-full bg-green-600 px-4 py-2 text-lg font-semibold text-white transition hover:bg-green-700"
                type="button"
                @click.stop="handleEntryAddToPlan(entry)"
              >
                <FontAwesomeIcon icon="plus" />
                Add to meal plan
              </button>
            </summary>

            <div class="mt-4 grid gap-4 lg:grid-cols-3">
              <div class="space-y-3 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <p class="text-lg font-semibold text-gray-800 uppercase tracking-wide">Macros</p>
                <ul class="space-y-2 text-lg text-gray-700">
                  <li>Protein: {{ entry.protein }} g</li>
                  <li>Carbs: {{ entry.carbs }} g</li>
                  <li>Fat: {{ entry.fat }} g</li>
                  <li>Fiber: {{ entry.fiber }} g</li>
                  <li>Sugar: {{ entry.sugar }} g</li>
                  <li>Sodium: {{ entry.sodium }} mg</li>
                </ul>
              </div>

              <div class="lg:col-span-2 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <p class="text-lg font-semibold text-gray-800 uppercase tracking-wide">
                  Nutrient Breakdown
                </p>
                <div class="mt-3 grid gap-3 sm:grid-cols-2">
                  <div
                    v-for="(nutrient, key) in entry.nutrients || {}"
                    :key="key"
                    class="rounded-xl border border-white bg-white px-3 py-2 shadow-sm"
                  >
                    <p class="text-lg font-semibold text-gray-900">{{ nutrient.label || key }}</p>
                    <p class="text-lg text-gray-500">
                      {{ nutrient.quantity?.toFixed?.(1) ?? nutrient.quantity }} {{ nutrient.unit }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>

    <button
      class="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-xl transition hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300"
      :class="searchOverlayOpen ? 'pointer-events-none opacity-0 scale-95' : 'opacity-100 scale-100'"
      type="button"
      aria-label="Open nutrition search"
      @click="openSearchOverlay"
    >
      <FontAwesomeIcon icon="magnifying-glass" class="text-xl" />
    </button>

    <SearchOverlay
      :show="searchOverlayOpen"
      :query="query"
      :loading="dashboard.loading"
      :error="dashboard.error"
      :result="dashboard.latestResult"
      @update:query="updateQuery"
      @search="handleSearch"
      @close="closeSearchOverlay"
      @add-to-plan="handleOverlayAddToPlan"
    />

    <AddToMealPlanModal
      :show="addModalOpen"
      :item="selectedItem"
      :totals="selectedTotals || dashboard.latestTotals"
      @close="closeAddModal"
      @added="closeAddModal"
    />
  </section>
</template>
