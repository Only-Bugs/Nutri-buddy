<script setup>
import { computed, ref, watch } from 'vue'
import DashboardCard from '@/components/dashboard/DashboardCard.vue'

const props = defineProps({
  foods: { type: Array, default: () => [] },
})

const emit = defineEmits(['add-to-plan'])

const headers = [
  { key: 'name', label: 'Name', sortable: true, align: 'left' },
  { key: 'quantity', label: 'Qty', sortable: false, align: 'left' },
  { key: 'measure', label: 'Measure', sortable: false, align: 'left' },
  { key: 'weight', label: 'Weight (g)', sortable: true, align: 'right' },
  { key: 'calories', label: 'Calories', sortable: true, align: 'right' },
  { key: 'protein', label: 'Protein (g)', sortable: true, align: 'right' },
  { key: 'carbs', label: 'Carbs (g)', sortable: true, align: 'right' },
  { key: 'fat', label: 'Fat (g)', sortable: true, align: 'right' },
  { key: 'cautions', label: 'Cautions', sortable: false, align: 'left' },
  { key: 'actions', label: 'Actions', sortable: false, align: 'center' },
]

const sortableHeaderKeys = headers.filter((header) => header.sortable).map((header) => header.key)

const sortKey = ref('calories')
const sortDirection = ref('desc')
const currentPage = ref(1)
const pageSize = 6

function toNumber(value) {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : 0
}

function getValue(food, key) {
  switch (key) {
    case 'name':
      return food.name || ''
    case 'weight':
      return toNumber(food.weight)
    case 'calories':
      return toNumber(food.calories)
    case 'protein':
      return toNumber(food.protein)
    case 'carbs':
      return toNumber(food.carbs)
    case 'fat':
      return toNumber(food.fat)
    default:
      return food[key] ?? ''
  }
}

const sortedFoods = computed(() => {
  const items = [...props.foods]
  if (!items.length || !sortableHeaderKeys.includes(sortKey.value)) {
    return items
  }

  return items.sort((a, b) => {
    const aVal = getValue(a, sortKey.value)
    const bVal = getValue(b, sortKey.value)

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection.value === 'asc' ? aVal - bVal : bVal - aVal
    }

    const aString = String(aVal).toLowerCase()
    const bString = String(bVal).toLowerCase()
    return sortDirection.value === 'asc'
      ? aString.localeCompare(bString)
      : bString.localeCompare(aString)
  })
})

const totalPages = computed(() =>
  sortedFoods.value.length ? Math.ceil(sortedFoods.value.length / pageSize) : 1,
)

const paginatedFoods = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return sortedFoods.value.slice(start, start + pageSize)
})

function changeSort(key) {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDirection.value = key === 'name' ? 'asc' : 'desc'
  }
}

function headerSortState(key) {
  if (sortKey.value !== key) return 'none'
  return sortDirection.value === 'asc' ? 'ascending' : 'descending'
}

function indicator(key) {
  if (sortKey.value !== key) return ''
  return sortDirection.value === 'asc' ? '^' : 'v'
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value -= 1
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value += 1
}

watch(
  () => props.foods.length,
  () => {
    currentPage.value = 1
  },
)

watch(totalPages, (value) => {
  if (currentPage.value > value) {
    currentPage.value = value
  }
})
</script>

<template>
  <DashboardCard title="Recent Nutrition Searches">
    <template v-if="foods.length">
      <div class="overflow-x-auto">
        <table class="w-full border-collapse text-base text-gray-700">
          <thead>
            <tr class="bg-gray-100 text-gray-700">
              <th
                v-for="header in headers"
                :key="header.key"
                :class="[
                  'px-3 py-2 font-semibold',
                  header.align === 'right'
                    ? 'text-right'
                    : header.align === 'center'
                    ? 'text-center'
                    : 'text-left',
                  header.sortable ? 'cursor-pointer select-none' : '',
                ]"
                :aria-sort="header.sortable ? headerSortState(header.key) : undefined"
                @click="header.sortable && changeSort(header.key)"
              >
                <span class="inline-flex items-center gap-1">
                  {{ header.label }}
                  <span v-if="header.sortable" class="text-xs text-gray-500">{{ indicator(header.key) }}</span>
                </span>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="food in paginatedFoods"
              :key="food.id"
              class="odd:bg-white even:bg-gray-50 hover:bg-green-50 transition-colors"
            >
              <td class="px-3 py-2 font-medium">{{ food.name }}</td>
              <td class="px-3 py-2">{{ food.quantity }}</td>
              <td class="px-3 py-2">{{ food.measure }}</td>
              <td class="px-3 py-2 text-right">{{ food.weight }}</td>
              <td class="px-3 py-2 text-right">{{ food.calories }}</td>
              <td class="px-3 py-2 text-right text-blue-600">{{ food.protein }}</td>
              <td class="px-3 py-2 text-right text-green-600">{{ food.carbs }}</td>
              <td class="px-3 py-2 text-right text-purple-600">{{ food.fat }}</td>
              <td class="px-3 py-2">
                <span
                  v-if="food.cautions && food.cautions.length"
                  class="text-sm bg-red-100 text-red-700 px-2 py-1 rounded"
                >
                  {{ food.cautions.join(', ') }}
                </span>
                <span v-else class="text-sm text-gray-400">None</span>
              </td>
              <td class="px-3 py-2 text-center">
                <button
                  class="inline-flex items-center justify-center rounded-lg border border-green-600 px-3 py-1 text-sm font-semibold text-green-600 hover:bg-green-600 hover:text-white transition"
                  @click="emit('add-to-plan', food)"
                >
                  Add to Meal Plan
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        class="mt-4 flex flex-col gap-3 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between"
      >
        <p>
          Showing
          {{ (currentPage - 1) * pageSize + 1 }}
          -
          {{ Math.min(currentPage * pageSize, sortedFoods.length) }}
          of
          {{ sortedFoods.length }}
        </p>
        <div class="flex items-center gap-2">
          <button
            class="rounded-full border border-gray-300 px-3 py-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
            @click="prevPage"
            :disabled="currentPage === 1"
          >
            Prev
          </button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <button
            class="rounded-full border border-gray-300 px-3 py-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
            @click="nextPage"
            :disabled="currentPage === totalPages"
          >
            Next
          </button>
        </div>
      </div>
    </template>

    <p v-else class="text-base text-gray-500">
      Search for food to populate your nutrition history.
    </p>
  </DashboardCard>
</template>
