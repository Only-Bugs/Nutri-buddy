<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useMealPlanStore } from '@/store/mealplan/mealPlanStore'
import CaloriesDistribution from '@/components/dashboard/CaloriesDistribution.vue'
import NutritionDistribution from '@/components/dashboard/NutritionDistribution.vue'

const auth = useAuthStore()
const mealPlans = useMealPlanStore()

const showPlanForm = ref(false)
const planFormError = ref('')
const isSavingPlan = ref(false)

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

const activePlan = computed(() => mealPlans.activePlan)
const activeMeals = computed(() => activePlan.value?.meals || [])
const activePlanTotals = computed(() => activePlan.value?.nutritionTotals || null)
const activePlans = computed(() => mealPlans.plans.filter((plan) => plan.status === 'active'))
const draftPlans = computed(() => mealPlans.plans.filter((plan) => plan.status === 'draft'))
const archivedPlans = computed(() => mealPlans.plans.filter((plan) => plan.status === 'archived'))

watch(
  activePlans,
  (plans) => {
    if (!mealPlans.activePlanId && plans.length) {
      mealPlans.selectPlan(plans[0].id)
    }
  },
  { immediate: true, deep: true },
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
        <section class="bg-white border rounded-xl shadow-sm p-6 space-y-4">
          <header class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 class="text-xl font-semibold text-gray-900">Active Plan</h2>
              <p class="text-base text-gray-500">
                <span v-if="activePlan">
                  {{ activePlan.startDate || 'No start date' }} → {{ activePlan.endDate || 'No end date' }}
                </span>
                <span v-else>Activate a plan from the right panel to begin editing.</span>
              </p>
            </div>
            <div v-if="activePlan" class="flex flex-wrap gap-2">
              <button
                v-for="option in statusOptions"
                :key="option.value"
                @click="changeStatus(activePlan.id, option.value)"
                :disabled="activePlan.status === option.value"
                class="px-3 py-1 rounded-full text-sm font-medium border transition"
                :class="
                  activePlan.status === option.value
                    ? 'bg-green-600 text-white border-green-600'
                    : 'border-gray-300 text-gray-600 hover:border-green-500 hover:text-green-600'
                "
              >
                {{ option.label }}
              </button>
            </div>
          </header>

          <div v-if="activePlan" class="space-y-5">
            <div
              class="flex items-center justify-between bg-green-50 border border-green-100 px-4 py-3 rounded-lg"
            >
              <div>
                <p class="text-sm text-gray-500">Plan name</p>
                <p class="text-lg font-semibold text-gray-900">{{ activePlan.name }}</p>
              </div>
              <button class="text-sm text-green-700 font-medium hover:underline" @click="exportPlan(activePlan)">
                Export plan
              </button>
            </div>

            <p v-if="activePlan.notes" class="text-base text-gray-600 whitespace-pre-line">
              {{ activePlan.notes }}
            </p>

            <div class="grid gap-4 lg:grid-cols-2">
              <CaloriesDistribution :totals="activePlanTotals || undefined" />
              <NutritionDistribution :totals="activePlanTotals || undefined" />
            </div>

            <div class="space-y-4">
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
                      <p class="text-sm text-gray-500">{{ meal.scheduledAt || 'Any time' }}</p>
                    </div>
                    <span class="text-sm text-gray-400">{{ meal.items?.length || 0 }} items</span>
                  </header>

                  <div v-if="meal.items?.length" class="flex flex-wrap gap-2">
                    <span
                      v-for="item in meal.items"
                      :key="item.id"
                      class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700"
                    >
                      {{ item.name }}
                      <button
                        class="text-gray-400 hover:text-red-500"
                        @click="removeMealItem(meal.id, item.id)"
                        aria-label="Remove meal item"
                      >
                        ×
                      </button>
                    </span>
                  </div>
                  <p v-else class="text-sm text-gray-500">No items yet.</p>
                </article>
              </div>
              <p v-else class="text-base text-gray-500">
                Add meals from the dashboard search to build your plan.
              </p>
            </div>
          </div>

          <p v-else class="text-base text-gray-500">
            You do not have an active plan. Create one or activate a draft to start planning meals.
          </p>
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
