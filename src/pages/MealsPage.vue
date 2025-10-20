<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useMealPlanStore } from '@/store/mealplan/mealPlanStore'
import CaloriesDistribution from '@/components/dashboard/CaloriesDistribution.vue'
import NutritionDistribution from '@/components/dashboard/NutritionDistribution.vue'
import RecipesAccordion from '@/components/mealPlans/RecipesAccordion.vue'

const auth = useAuthStore()
const mealPlans = useMealPlanStore()
const route = useRoute()
const router = useRouter()

const showPlanForm = ref(false)
const planFormError = ref('')
const isSavingPlan = ref(false)
const isEditingActivePlan = ref(false)
const fabOpen = ref(false)

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
]

const newPlan = reactive({
  name: '',
  startDate: '',
  endDate: '',
  notes: '',
})

watch(
  () => auth.user?.uid,
  (uid) => {
    mealPlans.loadPlans(uid)
  },
  { immediate: true },
)

watch(
  () => route.query.planId,
  (planId) => {
    if (typeof planId === 'string' && planId) {
      mealPlans.selectPlan(planId)
    }
  },
  { immediate: true },
)

const activePlan = computed(() => mealPlans.activePlan)
const activeMeals = computed(() => activePlan.value?.meals || [])
const activePlanTotals = computed(() => activePlan.value?.nutritionTotals || null)
const activePlans = computed(() => mealPlans.plans.filter((plan) => plan.status === 'active'))
const draftPlans = computed(() => mealPlans.plans.filter((plan) => plan.status === 'draft'))
const archivedPlans = computed(() => mealPlans.plans.filter((plan) => plan.status === 'archived'))

const activePlanRecipes = computed(() => activePlan.value?.recipes || [])
const planHasItems = computed(() =>
  !!activePlan.value && activePlan.value.meals?.some((meal) => (meal.items || []).length > 0),
)

const editingPlan = reactive({
  id: '',
  name: '',
  startDate: '',
  endDate: '',
  notes: '',
})

function formatMacro(value, unit = 'g') {
  const number = Number(value ?? 0)
  if (Number.isNaN(number)) return `0 ${unit}`
  if (unit === 'kcal') return `${Math.round(number)} kcal`
  return `${number.toFixed(1)} ${unit}`
}

watch(
  activePlans,
  (plans) => {
    if (!mealPlans.activePlanId && plans.length) {
      mealPlans.selectPlan(plans[0].id)
    }
  },
  { immediate: true, deep: true },
)

watch(
  activePlan,
  (plan) => {
    if (!plan) return
    editingPlan.id = plan.id
    editingPlan.name = plan.name || ''
    editingPlan.startDate = plan.startDate || ''
    editingPlan.endDate = plan.endDate || ''
    editingPlan.notes = plan.notes || ''
    isEditingActivePlan.value = false
    fabOpen.value = false
  },
  { immediate: true },
)

async function createPlanFromForm() {
  planFormError.value = ''
  if (!newPlan.name.trim()) {
    planFormError.value = 'Plan name is required.'
    return
  }

  isSavingPlan.value = true
  try {
    const created = await mealPlans.savePlan({
      name: newPlan.name.trim(),
      status: 'draft',
      startDate: newPlan.startDate || '',
      endDate: newPlan.endDate || '',
      notes: newPlan.notes || '',
      meals: [],
    })

    if (!created) {
      planFormError.value = mealPlans.error || 'Unable to create meal plan.'
      return
    }

    newPlan.name = ''
    newPlan.startDate = ''
    newPlan.endDate = ''
    newPlan.notes = ''
    showPlanForm.value = false
  } catch (error) {
    planFormError.value = error?.message || 'Unable to create meal plan.'
  } finally {
    isSavingPlan.value = false
  }
}

async function changeStatus(planId, status) {
  await mealPlans.updatePlanStatus(planId, status)
  if (status === 'active') {
    mealPlans.selectPlan(planId)
  }
}

async function removeMealItem(mealId, itemId) {
  await mealPlans.removeItemFromActivePlan({ mealId, itemId })
}

function exportPlan(plan) {
  console.log('[MealPlans] Export triggered for plan:', plan)
  const message = `Exporting "${plan.name}". A PDF will be emailed to ${auth.user?.email || 'you'}.`
  if (typeof window !== 'undefined' && window?.alert) {
    window.alert(message)
  } else {
    console.info(message)
  }
}

function getVisibleMealItems(meal) {
  return (meal.items || []).filter((item) => (item.type || 'food') !== 'recipe')
}

function toggleEditingActivePlan() {
  if (!activePlan.value) return
  if (isEditingActivePlan.value) {
    editingPlan.name = activePlan.value.name || ''
    editingPlan.startDate = activePlan.value.startDate || ''
    editingPlan.endDate = activePlan.value.endDate || ''
    editingPlan.notes = activePlan.value.notes || ''
    isEditingActivePlan.value = false
    fabOpen.value = false
  } else {
    isEditingActivePlan.value = true
    fabOpen.value = true
  }
}

async function saveActivePlanEdits() {
  if (!activePlan.value) return
  isSavingPlan.value = true
  try {
    await mealPlans.savePlan({
      ...activePlan.value,
      name: editingPlan.name.trim() || 'Untitled plan',
      startDate: editingPlan.startDate,
      endDate: editingPlan.endDate,
      notes: editingPlan.notes,
    })
    isEditingActivePlan.value = false
    fabOpen.value = false
  } finally {
    isSavingPlan.value = false
  }
}

function openDashboardSearch() {
  router.push({ name: 'Dashboard', query: { openSearch: 'true' } })
}

async function changeStatusWithFab(status) {
  if (!activePlan.value) return
  await mealPlans.updatePlanStatus(activePlan.value.id, status)
  if (status === 'active') {
    mealPlans.selectPlan(activePlan.value.id)
  }
  fabOpen.value = false
}
</script>

<template>
  <section class="dash-section w-full space-y-6">
    <header class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Meal Plans</h1>
        <p class="text-base text-gray-500">Organize active, draft, and archived plans.</p>
      </div>
      <button
        @click="showPlanForm = !showPlanForm"
        class="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-base font-semibold hover:bg-green-700"
      >
        <span v-if="showPlanForm">Close</span>
        <span v-else>+ Create Meal Plan</span>
      </button>
    </header>

    <div v-if="showPlanForm" class="bg-white border rounded-xl shadow-sm p-6 space-y-4">
      <div class="grid gap-4 md:grid-cols-2">
        <label class="space-y-1">
          <span class="text-sm font-medium text-gray-700">Plan name *</span>
          <input
            v-model="newPlan.name"
            type="text"
            class="w-full border rounded-lg px-3 py-2 text-base"
            placeholder="e.g., Weekly Wellness Reset"
          />
        </label>

        <label class="space-y-1">
          <span class="text-sm font-medium text-gray-700">Start date</span>
          <input v-model="newPlan.startDate" type="date" class="w-full border rounded-lg px-3 py-2 text-base" />
        </label>

        <label class="space-y-1">
          <span class="text-sm font-medium text-gray-700">End date</span>
          <input v-model="newPlan.endDate" type="date" class="w-full border rounded-lg px-3 py-2 text-base" />
        </label>

        <label class="space-y-1 md:col-span-2">
          <span class="text-sm font-medium text-gray-700">Notes</span>
          <textarea
            v-model="newPlan.notes"
            rows="3"
            class="w-full border rounded-lg px-3 py-2 text-base"
            placeholder="Optional details or objectives for this plan."
          />
        </label>
      </div>

      <div class="flex items-center justify-between">
        <p v-if="planFormError" class="text-sm text-red-600">{{ planFormError }}</p>
        <div class="flex-1" />
        <button
          @click="createPlanFromForm"
          :disabled="isSavingPlan"
          class="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-base font-semibold hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span v-if="isSavingPlan" class="animate-spin">⏳</span>
          <span>{{ isSavingPlan ? 'Saving…' : 'Save Plan' }}</span>
        </button>
      </div>
    </div>

    <div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <div class="space-y-6">
        <section class="relative bg-white border rounded-xl shadow-sm p-6 space-y-4">
          <header class="space-y-4">
            <div class="flex flex-col gap-2">
              <h2 class="text-xl font-semibold text-gray-900">Active Plan</h2>
              <p class="text-lg text-gray-500" v-if="!activePlan">
                Activate a plan from the right panel to begin editing.
              </p>
            </div>

            <div v-if="activePlan" class="space-y-4">
              <div v-if="isEditingActivePlan" class="space-y-3">
                <label class="block">
                  <span class="text-lg font-medium text-gray-700">Plan name</span>
                  <input
                    v-model="editingPlan.name"
                    type="text"
                    class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-lg focus:border-green-500 focus:ring-green-500"
                    placeholder="Plan name"
                  />
                </label>
                <div class="flex flex-col gap-3 sm:flex-row">
                  <label class="flex-1">
                    <span class="text-lg font-medium text-gray-700">Start date</span>
                    <input
                      v-model="editingPlan.startDate"
                      type="date"
                      class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-lg focus:border-green-500 focus:ring-green-500"
                    />
                  </label>
                  <label class="flex-1">
                    <span class="text-lg font-medium text-gray-700">End date</span>
                    <input
                      v-model="editingPlan.endDate"
                      type="date"
                      class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-lg focus:border-green-500 focus:ring-green-500"
                    />
                  </label>
                </div>
                <label class="block">
                  <span class="text-lg font-medium text-gray-700">Notes</span>
                  <textarea
                    v-model="editingPlan.notes"
                    rows="3"
                    class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-lg focus:border-green-500 focus:ring-green-500"
                    placeholder="Objectives, reminders, or context"
                  />
                </label>
              </div>
              <div v-else class="space-y-2">
                <div class="flex flex-wrap items-center gap-3 text-lg text-gray-600">
                  <span class="font-semibold text-gray-900">{{ activePlan.name }}</span>
                  <span>·</span>
                  <span>{{ activePlan.startDate || 'No start' }}</span>
                  <span>→</span>
                  <span>{{ activePlan.endDate || 'No end' }}</span>
                </div>
                <p v-if="activePlan.notes" class="text-lg text-gray-600 whitespace-pre-line">
                  {{ activePlan.notes }}
                </p>
              </div>
            </div>
          </header>

          <div v-if="activePlan" class="space-y-5">
            <div class="grid gap-4 lg:grid-cols-2">
              <CaloriesDistribution :totals="activePlanTotals || undefined" />
              <NutritionDistribution :totals="activePlanTotals || undefined" />
            </div>

            <div class="relative">
              <div :class="['space-y-4', !planHasItems ? 'pointer-events-none blur-sm' : '']">
                <h3 class="text-lg font-semibold text-gray-900">Meals</h3>
                <div v-if="activeMeals.length" class="space-y-3">
                  <article
                    v-for="meal in activeMeals"
                    :key="meal.id"
                    class="border border-gray-200 rounded-xl p-4 space-y-3"
                  >
                    <header class="flex items-center justify-between">
                      <div>
                        <h4 class="text-lg font-semibold text-gray-900">{{ meal.label }}</h4>
                        <p class="text-lg text-gray-500">{{ meal.scheduledAt || 'Any time' }}</p>
                      </div>
                      <span class="text-lg text-gray-400">{{ meal.items?.length || 0 }} items</span>
                    </header>

                    <div v-if="getVisibleMealItems(meal).length" class="space-y-2">
                      <article
                        v-for="item in getVisibleMealItems(meal)"
                        :key="item.id"
                        class="flex flex-col gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-lg text-gray-700 md:flex-row md:items-center md:justify-between"
                      >
                        <div>
                          <p class="font-semibold text-gray-900">{{ item.name }}</p>
                          <p class="text-lg text-gray-500">{{ item.quantity || '1 serving' }}</p>
                        </div>
                        <div class="flex flex-wrap gap-2 text-lg text-gray-600">
                          <span class="rounded bg-white px-2 py-1">{{ formatMacro(item.calories, 'kcal') }}</span>
                          <span class="rounded bg-white px-2 py-1">Protein {{ formatMacro(item.protein) }}</span>
                          <span class="rounded bg-white px-2 py-1">Carbs {{ formatMacro(item.carbs) }}</span>
                          <span class="rounded bg-white px-2 py-1">Fat {{ formatMacro(item.fat) }}</span>
                        </div>
                        <button
                          class="self-start text-gray-400 hover:text-red-500 md:self-center"
                          @click="removeMealItem(meal.id, item.id)"
                          aria-label="Remove meal item"
                        >
                          ×
                        </button>
                      </article>
                    </div>
                    <p v-else class="text-lg text-gray-500">No items yet.</p>
                  </article>
                </div>
              </div>

              <div
                v-if="!planHasItems"
                class="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl bg-white/70 text-center"
              >
                <div class="space-y-2">
                  <p class="text-2xl font-semibold text-gray-600">
                    Nothing in here yet — add a tracked dish or a recipe to get started.
                  </p>
                </div>
              </div>
            </div>

            <RecipesAccordion :recipes="activePlanRecipes" />
          </div>

          <p v-else class="text-lg text-gray-500">
            You do not have an active plan. Create one or activate a draft to start planning meals.
          </p>

          <div v-if="activePlan" class="absolute bottom-6 right-6">
            <div class="relative">
              <button
                class="flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-lg transition hover:bg-green-700"
                type="button"
                aria-label="Toggle plan actions"
                @click="fabOpen = !fabOpen"
              >
                <span v-if="fabOpen">×</span>
                <FontAwesomeIcon v-else icon="plus" class="text-xl" />
              </button>
              <transition name="fade">
                <ul
                  v-if="fabOpen"
                  class="absolute bottom-16 right-0 flex w-52 flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl"
                >
                  <li>
                    <button
                      class="flex w-full items-center justify-between rounded-lg bg-green-50 px-3 py-2 text-lg font-semibold text-green-700 hover:bg-green-100"
                      type="button"
                      @click="toggleEditingActivePlan"
                    >
                      <span>{{ isEditingActivePlan ? 'Cancel edit' : 'Edit plan' }}</span>
                      <FontAwesomeIcon icon="gear" />
                    </button>
                  </li>
                  <li v-if="isEditingActivePlan">
                    <button
                      class="flex w-full items-center justify-between rounded-lg bg-green-600 px-3 py-2 text-lg font-semibold text-white hover:bg-green-700 disabled:opacity-60"
                      type="button"
                      :disabled="isSavingPlan"
                      @click="saveActivePlanEdits"
                    >
                      <span>{{ isSavingPlan ? 'Saving…' : 'Save changes' }}</span>
                      <FontAwesomeIcon icon="check" />
                    </button>
                  </li>
                  <li>
                    <button
                      class="flex w-full items-center justify-between rounded-lg bg-white px-3 py-2 text-lg text-gray-600 hover:bg-gray-100"
                      type="button"
                      @click="exportPlan(activePlan)"
                    >
                      <span>Export plan</span>
                      <FontAwesomeIcon icon="arrow-right" />
                    </button>
                  </li>
                  <li>
                    <button
                      class="flex w-full items-center justify-between rounded-lg bg-white px-3 py-2 text-lg text-gray-600 hover:bg-gray-100"
                      type="button"
                      @click="openDashboardSearch"
                    >
                      <span>Search dishes</span>
                      <FontAwesomeIcon icon="magnifying-glass" />
                    </button>
                  </li>
                  <li class="flex flex-col gap-2 border-t border-gray-200 pt-2">
                    <p class="text-lg font-semibold text-gray-700">Status</p>
                    <button
                      v-for="option in statusOptions"
                      :key="option.value"
                      class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-lg"
                      :class="
                        activePlan.status === option.value
                          ? 'bg-green-600 text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-100'
                      "
                      type="button"
                      @click="changeStatusWithFab(option.value)"
                    >
                      <span>{{ option.label }}</span>
                      <FontAwesomeIcon icon="check" v-if="activePlan.status === option.value" />
                    </button>
                  </li>
                </ul>
              </transition>
            </div>
          </div>
        </section>
      </div>

      <aside class="space-y-6">
        <section class="bg-white border rounded-xl shadow-sm p-5">
          <header class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Draft Plans</h3>
            <span class="text-sm text-gray-500">{{ draftPlans.length }}</span>
          </header>
          <div v-if="draftPlans.length" class="space-y-3">
            <details
              v-for="plan in draftPlans"
              :key="plan.id"
              class="group border border-gray-200 rounded-lg px-3 py-2"
            >
              <summary class="flex items-center justify-between cursor-pointer text-base text-gray-700">
                <span class="font-medium">{{ plan.name }}</span>
                <span class="text-sm text-gray-400 transition-transform group-open:rotate-90">›</span>
              </summary>
              <div class="mt-3 space-y-3 text-sm text-gray-600">
                <p>{{ plan.startDate || 'No start date' }} → {{ plan.endDate || 'No end date' }}</p>
                <p v-if="plan.notes" class="whitespace-pre-line">{{ plan.notes }}</p>
                <div class="flex flex-wrap gap-2">
                  <button
                    class="text-sm text-green-600 font-medium hover:underline"
                    @click="changeStatus(plan.id, 'active')"
                  >
                    Activate
                  </button>
                  <button class="text-sm text-gray-500 hover:underline" @click="changeStatus(plan.id, 'archived')">
                    Archive
                  </button>
                  <button class="text-sm text-sky-600 hover:underline" @click="exportPlan(plan)">
                    Export
                  </button>
                </div>
              </div>
            </details>
          </div>
          <p v-else class="text-base text-gray-500">Draft plans will appear here.</p>
        </section>

        <section class="bg-white border rounded-xl shadow-sm p-5">
          <header class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Archived Plans</h3>
            <span class="text-sm text-gray-500">{{ archivedPlans.length }}</span>
          </header>
          <div v-if="archivedPlans.length" class="space-y-3">
            <details
              v-for="plan in archivedPlans"
              :key="plan.id"
              class="group border border-gray-200 rounded-lg px-3 py-2"
            >
              <summary class="flex items-center justify-between cursor-pointer text-base text-gray-700">
                <span class="font-medium">{{ plan.name }}</span>
                <span class="text-sm text-gray-400 transition-transform group-open:rotate-90">›</span>
              </summary>
              <div class="mt-3 space-y-3 text-sm text-gray-600">
                <p>{{ plan.startDate || 'No start date' }} → {{ plan.endDate || 'No end date' }}</p>
                <p v-if="plan.notes" class="whitespace-pre-line">{{ plan.notes }}</p>
                <div class="flex flex-wrap gap-2">
                  <button class="text-sm text-green-600 hover:underline" @click="changeStatus(plan.id, 'draft')">
                    Move to Draft
                  </button>
                  <button class="text-sm text-sky-600 hover:underline" @click="exportPlan(plan)">
                    Export
                  </button>
                </div>
              </div>
            </details>
          </div>
          <p v-else class="text-base text-gray-500">Archived plans will appear here.</p>
        </section>
      </aside>
    </div>
  </section>
</template>
