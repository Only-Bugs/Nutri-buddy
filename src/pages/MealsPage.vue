<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useMealPlanStore } from '@/store/mealplan/mealPlanStore'
import { useToast } from '@/composables/useToast'
import MealPlanCard from '@/components/mealPlans/MealPlanCard.vue'
import MealPlanEditor from '@/components/mealPlans/MealPlanEditor.vue'
import MealPlanMenu from '@/components/mealPlans/MealPlanMenu.vue'
import AddToMealPlanModal from '@/components/mealPlans/AddToMealPlanModal.vue'
import RecipesAccordion from '@/components/mealPlans/RecipesAccordion.vue'
import { sendPlanExport } from '@/services/exportPlanService.js'

const auth = useAuthStore()
const mealPlans = useMealPlanStore()
const route = useRoute()
const router = useRouter()
const { showToast } = useToast()

const isEditorOpen = ref(false)
const editorMode = ref('create')
const editorLoading = ref(false)
const editorError = ref('')
const isMenuOpen = ref(false)
const isAddModalOpen = ref(false)
const isExporting = ref(false)

const editorDraft = reactive({
  id: '',
  name: '',
  startDate: '',
  endDate: '',
  notes: '',
})

const addModalItem = reactive({
  name: 'Custom dish',
  food: 'Custom dish',
  quantity: '1 serving',
  type: 'food',
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
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
const activePlanRecipes = computed(() => activePlan.value?.recipes || [])
const planHasItems = computed(() =>
  !!activePlan.value && activePlan.value.meals?.some((meal) => (meal.items || []).length > 0),
)

const activePlans = computed(() =>
  mealPlans.plans.filter((plan) => plan.status === 'active'),
)
const draftPlans = computed(() =>
  mealPlans.plans.filter((plan) => plan.status === 'draft'),
)
const archivedPlans = computed(() =>
  mealPlans.plans.filter((plan) => plan.status === 'archived'),
)

const otherActivePlans = computed(() =>
  activePlans.value.filter((plan) => !activePlan.value || plan.id !== activePlan.value.id),
)

watch(
  activePlans,
  (plans) => {
    if (!mealPlans.activePlanId && plans.length) {
      mealPlans.selectPlan(plans[0].id)
    }
  },
  { immediate: true, deep: true },
)

watch(activePlan, () => {
  isMenuOpen.value = false
})

function selectActivePlan(planId) {
  mealPlans.selectPlan(planId)
}

function describePlanRange(plan) {
  if (!plan) return ''
  const start = plan.startDate || 'No start'
  const end = plan.endDate ? ` → ${plan.endDate}` : ' → Open-ended'
  return `${start}${end}`
}

function openCreateEditor() {
  editorMode.value = 'create'
  editorDraft.id = ''
  editorDraft.name = ''
  editorDraft.startDate = ''
  editorDraft.endDate = ''
  editorDraft.notes = ''
  editorError.value = ''
  isEditorOpen.value = true
}

function openEditEditor() {
  if (!activePlan.value) return
  editorMode.value = 'edit'
  editorDraft.id = activePlan.value.id
  editorDraft.name = activePlan.value.name || ''
  editorDraft.startDate = activePlan.value.startDate || ''
  editorDraft.endDate = activePlan.value.endDate || ''
  editorDraft.notes = activePlan.value.notes || ''
  editorError.value = ''
  isEditorOpen.value = true
}

async function handleEditorSubmit(payload) {
  editorError.value = ''
  editorLoading.value = true
  try {
    if (editorMode.value === 'create') {
      const created = await mealPlans.savePlan({
        name: payload.name,
        status: 'draft',
        startDate: payload.startDate,
        endDate: payload.endDate,
        notes: payload.notes,
        meals: [],
      })
      if (!created) {
        throw new Error(mealPlans.error || 'Unable to create meal plan.')
      }
      showToast('Plan created successfully.', 'success')
    } else if (activePlan.value) {
      await mealPlans.savePlan({
        ...activePlan.value,
        name: payload.name,
        startDate: payload.startDate,
        endDate: payload.endDate,
        notes: payload.notes,
      })
      showToast('Plan updated successfully.', 'success')
    }
    isEditorOpen.value = false
  } catch (error) {
    editorError.value = error?.message || 'Unable to save meal plan.'
    showToast(editorError.value, 'error')
  } finally {
    editorLoading.value = false
  }
}

async function changeStatus(planId, status) {
  await mealPlans.updatePlanStatus(planId, status)
  if (status === 'active') {
    mealPlans.selectPlan(planId)
  }
  showToast(`Plan marked as ${status}.`, 'success')
}

async function changeStatusFromMenu(status) {
  if (!activePlan.value) return
  await changeStatus(activePlan.value.id, status)
  isMenuOpen.value = false
}

async function archivePlan() {
  if (!activePlan.value) return
  await changeStatus(activePlan.value.id, 'archived')
  isMenuOpen.value = false
}

function toggleMenu() {
  if (!activePlan.value) return
  isMenuOpen.value = !isMenuOpen.value
}

function handleMenuEdit() {
  isMenuOpen.value = false
  openEditEditor()
}

function handleMenuSearch() {
  isMenuOpen.value = false
  openDashboardSearch()
}

async function triggerPlanExport(plan) {
  if (!plan) return
  if (!auth.user?.email) {
    showToast('Add an email to your profile before exporting.', 'warning')
    return
  }
  try {
    isExporting.value = true
    await sendPlanExport(plan, auth.user.email)
    showToast(`Meal plan "${plan.name}" sent to your inbox.`, 'success')
  } catch (error) {
    console.error('[MealsPage] export failed', error)
    showToast('Unable to export this plan right now.', 'error')
  } finally {
    isExporting.value = false
  }
}

async function handleMenuExport() {
  if (!activePlan.value) return
  await triggerPlanExport(activePlan.value)
  isMenuOpen.value = false
}

function openAddModal() {
  if (!activePlan.value) {
    showToast('Activate a meal plan first.', 'warning')
    return
  }
  addModalItem.name = 'Custom dish'
  addModalItem.food = 'Custom dish'
  addModalItem.quantity = '1 serving'
  isAddModalOpen.value = true
}

function handleAddModalClose() {
  isAddModalOpen.value = false
}

function handleAddModalAdded() {
  isAddModalOpen.value = false
}

async function removeMealItem(mealId, itemId) {
  await mealPlans.removeItemFromActivePlan({ mealId, itemId })
}

function openDashboardSearch() {
  router.push({ name: 'Dashboard', query: { openSearch: 'true' } })
}

const hasPlans = computed(() => mealPlans.plans.length > 0)
</script>

<template>
  <section class="dash-section w-full space-y-6">
    <header class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Meal Plans</h1>
        <p class="text-sm text-gray-500">
          Create, track, and adjust plans without losing clarity.
        </p>
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-500"
        @click="openCreateEditor"
      >
        <FontAwesomeIcon icon="plus" />
        New meal plan
      </button>
    </header>

    <MealPlanEditor
      :show="isEditorOpen"
      :mode="editorMode"
      :initial-plan="editorDraft"
      :loading="editorLoading"
      :error="editorError"
      @close="isEditorOpen = false"
      @submit="handleEditorSubmit"
    />

    <AddToMealPlanModal
      :show="isAddModalOpen"
      :item="addModalItem"
      :totals="activePlanTotals || undefined"
      @close="handleAddModalClose"
      @added="handleAddModalAdded"
    />

    <div
      v-if="!hasPlans"
      class="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-gray-200 bg-white/80 px-6 py-16 text-center shadow-sm"
    >
      <FontAwesomeIcon icon="utensils" class="text-4xl text-gray-200" />
      <h2 class="text-xl font-semibold text-gray-800">No plans yet — create your first one to get started.</h2>
      <p class="max-w-md text-sm text-gray-500">
        Meal plans keep your nutrition visible and organised. Start with a simple weekly focus and iterate.
      </p>
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-lg border border-green-500 px-5 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-50"
        @click="openCreateEditor"
      >
        <FontAwesomeIcon icon="plus" />
        New plan
      </button>
    </div>

    <div v-else class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_21rem]">
      <div class="space-y-6">
        <section
          v-if="activePlans.length"
          class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
        >
          <div class="flex items-center justify-between">
            <h2 class="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Active plans
            </h2>
            <span class="text-xs font-semibold text-gray-400">{{ activePlans.length }}</span>
          </div>
          <div class="mt-3 flex flex-wrap gap-2">
            <button
              v-for="plan in activePlans"
              :key="plan.id"
              type="button"
              class="rounded-full px-4 py-2 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-500"
              :class="
                plan.id === activePlan?.id
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600'
              "
              @click="selectActivePlan(plan.id)"
            >
              {{ plan.name }}
            </button>
          </div>
          <div
            v-if="otherActivePlans.length"
            class="mt-4 grid gap-3 sm:grid-cols-2"
          >
            <article
              v-for="plan in otherActivePlans"
              :key="plan.id"
              class="cursor-pointer rounded-2xl border border-gray-100 bg-gray-50 p-4 text-xs text-gray-600 shadow-sm transition hover:border-green-500 hover:bg-green-50 hover:text-green-700"
              @click="selectActivePlan(plan.id)"
            >
              <h3 class="text-sm font-semibold text-gray-900">{{ plan.name }}</h3>
              <p class="mt-1 text-xs text-gray-500">{{ describePlanRange(plan) }}</p>
            </article>
          </div>
        </section>

        <MealPlanCard
          :plan="activePlan"
          :totals="activePlanTotals || undefined"
          :meals="activeMeals"
          :plan-has-items="planHasItems"
          @add-meal="openAddModal"
          @open-menu="toggleMenu"
          @remove-item="removeMealItem"
          @edit-plan="openEditEditor"
        >
          <template v-if="activePlan" #menu>
            <MealPlanMenu
              :show="isMenuOpen"
              :current-status="activePlan.status"
              :exporting="isExporting"
              @close="isMenuOpen = false"
              @edit="handleMenuEdit"
              @search="handleMenuSearch"
              @export="handleMenuExport"
              @status="changeStatusFromMenu"
              @archive="archivePlan"
            />
          </template>
        </MealPlanCard>

        <transition name="fade">
          <div
            v-if="mealPlans.error"
            class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 shadow-sm"
          >
            Something went wrong. Please retry.
          </div>
        </transition>

        <RecipesAccordion :recipes="activePlanRecipes" />
      </div>

      <aside class="space-y-6">
        <section class="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <header class="flex items-center justify-between">
            <div>
              <h3 class="text-base font-semibold text-gray-900">Draft plans</h3>
              <p class="text-xs text-gray-500">Ideas in progress before activating.</p>
            </div>
            <span class="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600">
              {{ draftPlans.length }}
            </span>
          </header>

          <div v-if="draftPlans.length" class="space-y-3">
            <details
              v-for="plan in draftPlans"
              :key="plan.id"
              class="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
            >
              <summary class="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-gray-700">
                <span>{{ plan.name }}</span>
                <FontAwesomeIcon
                  icon="chevron-down"
                  class="text-xs text-gray-400 transition duration-200 group-open:rotate-180"
                />
              </summary>
              <div class="border-t border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-600 space-y-3">
                <p>{{ plan.startDate || 'No start date' }} → {{ plan.endDate || 'Open-ended' }}</p>
                <p v-if="plan.notes" class="whitespace-pre-line">{{ plan.notes }}</p>
                <div class="flex flex-wrap gap-3 text-xs font-semibold">
                  <button
                    type="button"
                    class="rounded-full bg-green-100 px-3 py-1 text-green-700 hover:bg-green-200"
                    @click="changeStatus(plan.id, 'active')"
                  >
                    Activate
                  </button>
                  <button
                    type="button"
                    class="rounded-full bg-gray-100 px-3 py-1 text-gray-600 hover:bg-gray-200"
                    @click="changeStatus(plan.id, 'archived')"
                  >
                    Archive
                  </button>
                  <button
                    type="button"
                    class="rounded-full bg-sky-100 px-3 py-1 text-sky-700 hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="isExporting"
                    @click="triggerPlanExport(plan)"
                  >
                    Export
                  </button>
                </div>
              </div>
            </details>
          </div>
          <p v-else class="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
            Draft plans will appear here.
          </p>
        </section>

        <section class="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <header class="flex items-center justify-between">
            <div>
              <h3 class="text-base font-semibold text-gray-900">Archived plans</h3>
              <p class="text-xs text-gray-500">Keep history handy for later review.</p>
            </div>
            <span class="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600">
              {{ archivedPlans.length }}
            </span>
          </header>

          <div v-if="archivedPlans.length" class="space-y-3">
            <details
              v-for="plan in archivedPlans"
              :key="plan.id"
              class="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
            >
              <summary class="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-gray-700">
                <span>{{ plan.name }}</span>
                <FontAwesomeIcon
                  icon="chevron-down"
                  class="text-xs text-gray-400 transition duration-200 group-open:rotate-180"
                />
              </summary>
              <div class="border-t border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-600 space-y-3">
                <p>{{ plan.startDate || 'No start date' }} → {{ plan.endDate || 'Open-ended' }}</p>
                <p v-if="plan.notes" class="whitespace-pre-line">{{ plan.notes }}</p>
                <div class="flex flex-wrap gap-3 text-xs font-semibold">
                  <button
                    type="button"
                    class="rounded-full bg-sky-100 px-3 py-1 text-sky-700 hover:bg-sky-200"
                    @click="changeStatus(plan.id, 'draft')"
                  >
                    Move to Draft
                  </button>
                  <button
                    type="button"
                    class="rounded-full bg-green-100 px-3 py-1 text-green-700 hover:bg-green-200"
                    @click="changeStatus(plan.id, 'active')"
                  >
                    Activate
                  </button>
                  <button
                    type="button"
                    class="rounded-full bg-gray-100 px-3 py-1 text-gray-600 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="isExporting"
                    @click="triggerPlanExport(plan)"
                  >
                    Export
                  </button>
                </div>
              </div>
            </details>
          </div>
          <p v-else class="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
            Archived plans will appear here.
          </p>
        </section>
      </aside>
    </div>
  </section>
</template>
