<script setup>
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { useMealPlanStore } from '@/store/mealplan/mealPlanStore'
import { useToast } from '@/composables/useToast'

const props = defineProps({
  show: { type: Boolean, default: false },
  item: { type: Object, default: null },
  totals: {
    type: Object,
    default: () => ({
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
    }),
  },
})

const emit = defineEmits(['close', 'added'])

const mealPlanStore = useMealPlanStore()
const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Beverage']
const { showToast } = useToast()

const selectedPlanId = ref('')
const selectedMealType = ref('')
const showCreateForm = ref(false)
const linkError = ref('')
const creationError = ref('')
const isSubmitting = ref(false)
const confirmationMessage = ref('')
const isShaking = ref(false)
const planNameInput = ref(null)

const createDraft = reactive({
  name: '',
  startDate: '',
  endDate: '',
  notes: '',
})

const plans = computed(() => mealPlanStore.plans || [])
const sortedPlans = computed(() => {
  const list = [...plans.value]
  return list.sort((a, b) => {
    if (a.status === 'active' && b.status !== 'active') return -1
    if (b.status === 'active' && a.status !== 'active') return 1
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  })
})

const selectedPlan = computed(() =>
  plans.value.find((plan) => plan.id === selectedPlanId.value) || null,
)

function resetState() {
  selectedPlanId.value = ''
  selectedMealType.value = ''
  showCreateForm.value = false
  linkError.value = ''
  creationError.value = ''
  isSubmitting.value = false
  confirmationMessage.value = ''
  createDraft.name = ''
  createDraft.startDate = ''
  createDraft.endDate = ''
  createDraft.notes = ''
}

watch(
  () => props.show,
  (visible) => {
    if (visible) {
      linkError.value = ''
      creationError.value = ''
      confirmationMessage.value = ''
      if (!plans.value.length) {
        showCreateForm.value = true
        prefillCreateDates()
        focusPlanName()
      } else {
        selectedPlanId.value =
          mealPlanStore.activePlanId || sortedPlans.value[0]?.id || ''
        if (selectedPlanId.value) {
          mealPlanStore.selectPlan(selectedPlanId.value)
        }
      }
      if (props.item?.primaryMealType) {
        selectedMealType.value = props.item.primaryMealType
      } else if (!selectedMealType.value) {
        selectedMealType.value = ''
      }
    } else {
      resetState()
    }
  },
)

function closeModal() {
  resetState()
  emit('close')
}

function prefillCreateDates() {
  const today = new Date().toISOString().split('T')[0]
  createDraft.startDate = today
}

function focusPlanName() {
  nextTick(() => {
    planNameInput.value?.focus()
  })
}

function handlePlanSelect(plan) {
  if (!plan || plan.status === 'archived') return
  selectedPlanId.value = plan.id
  mealPlanStore.selectPlan(plan.id)
  linkError.value = ''
}

async function createPlan() {
  creationError.value = ''
  const trimmed = createDraft.name.trim()
  if (!trimmed.length) {
    creationError.value = 'Plan name is required.'
    focusPlanName()
    return
  }
  if (trimmed.length < 3) {
    creationError.value = 'Name must be at least 3 characters.'
    focusPlanName()
    return
  }
  try {
    const plan = await mealPlanStore.savePlan({
      name: trimmed,
      status: 'active',
      startDate: createDraft.startDate || '',
      endDate: createDraft.endDate || '',
      notes: createDraft.notes || '',
      meals: [],
    })

    if (!plan) {
      creationError.value = mealPlanStore.error || 'Unable to create meal plan.'
      return
    }

    selectedPlanId.value = plan.id
    mealPlanStore.selectPlan(plan.id)
    showCreateForm.value = false
    creationError.value = ''
  } catch (error) {
    creationError.value = error?.message || 'Unable to create meal plan.'
  }
}

const itemName = computed(() => {
  if (!props.item) return 'this item'
  return props.item.food || props.item.name || props.item.recipe_name || 'this item'
})

function buildMealPayload() {
  const item = props.item || {}
  const totals = props.totals || {}

  const type = item.type || (item.recipe_name || item.ingredients ? 'recipe' : 'food')
  const name = item.food || item.name || item.recipe_name || 'Meal item'
  const quantity =
    item.quantity ??
    item.servingSize ??
    (type === 'recipe' && item.servings ? `${item.servings} serving(s)` : '')
  const measure = item.measure ?? item.servingUnit ?? (type === 'recipe' ? '' : '')

  const macros = {
    calories:
      Number(totals.calories ?? item.calories ?? item.nutrition?.calories ?? 0) || 0,
    protein:
      Number(totals.protein ?? item.protein ?? item.nutrition?.protein ?? 0) || 0,
    carbs: Number(totals.carbs ?? item.carbs ?? item.nutrition?.carbs ?? 0) || 0,
    fat: Number(totals.fats ?? totals.fat ?? item.fat ?? item.nutrition?.fat ?? 0) || 0,
    fiber: Number(totals.fiber ?? item.fiber ?? item.nutrition?.fiber ?? 0) || 0,
    sugar: Number(totals.sugar ?? item.sugar ?? item.nutrition?.sugar ?? 0) || 0,
    sodium: Number(totals.sodium ?? item.sodium ?? item.nutrition?.sodium ?? 0) || 0,
  }

  const instructions =
    type === 'recipe'
      ? Array.isArray(item.instructions)
        ? item.instructions
        : item.instructions
        ? String(item.instructions)
            .split(/\r?\n+/)
            .map((step) => step.trim())
            .filter(Boolean)
        : []
      : []

  const ingredients =
    type === 'recipe' && Array.isArray(item.ingredients)
      ? item.ingredients.map((ingredient) => ({
          name: ingredient.name || ingredient.ingredient_name || '',
          quantity: ingredient.quantity ?? ingredient.amount ?? '',
          unit: ingredient.unit ?? ingredient.measure ?? '',
          misc: ingredient.misc ?? '',
        }))
      : []

  return {
    name,
    type,
    recipeId: type === 'recipe' ? item.recipeId || item.id || null : null,
    calories: macros.calories,
    protein: macros.protein,
    carbs: macros.carbs,
    fat: macros.fat,
    fiber: macros.fiber,
    sugar: macros.sugar,
    sodium: macros.sodium,
    nutrition: { ...macros },
    quantity: quantity ? `${quantity} ${measure}`.trim() : 'Serving',
    measure: measure || 'serving',
    weight: Number(item.weight ?? 0),
    servings: item.servings ?? item.nutrition?.servings ?? '',
    description: item.description || '',
    image: item.image || '',
    instructions,
    ingredients,
  }
}

async function linkToPlan() {
  linkError.value = ''
  confirmationMessage.value = ''
  if (!selectedPlanId.value || !selectedMealType.value) {
    handleMissingSelection()
    return
  }
  if (!props.item) {
    linkError.value = 'Select something to add.'
    showToast('Please select an item to add.', 'warning')
    triggerShake()
    return
  }

  try {
    isSubmitting.value = true
    mealPlanStore.selectPlan(selectedPlanId.value)
    await mealPlanStore.addItemToActivePlan({
      label: selectedMealType.value,
      item: buildMealPayload(),
    })
    confirmationMessage.value = `Added to ${selectedPlan.value?.name || 'meal plan'}.`
    showToast('Item added to meal plan.', 'success')
    setTimeout(() => {
      emit('added')
      resetState()
    }, 900)
  } catch (error) {
    const message = error?.message || 'Unable to add to meal plan.'
    linkError.value = message
    showToast(message, 'error')
    triggerShake()
  } finally {
    isSubmitting.value = false
  }
}

function triggerShake() {
  isShaking.value = true
  window.setTimeout(() => {
    isShaking.value = false
  }, 400)
}

function handleMissingSelection() {
  showToast('Please select or create a plan first.', 'warning')
  triggerShake()
}
</script>

<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 z-40 flex items-center justify-center px-4 py-6 sm:px-8"
      role="dialog"
      aria-modal="true"
    >
      <div class="absolute inset-0 bg-black/50" @click.self="closeModal" />

      <div
        class="relative z-10 w-full max-w-3xl space-y-6 rounded-3xl bg-white/95 p-6 shadow-2xl backdrop-blur-md"
      >
        <div class="flex items-start justify-between">
          <div>
            <h2 class="text-2xl font-semibold text-gray-900">Add to Meal Plan</h2>
            <p class="text-sm text-gray-600">
              Link <span class="font-medium text-gray-700">{{ itemName }}</span> to your meal planning workspace.
            </p>
          </div>
          <button
            @click="closeModal"
            class="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <!-- Step 1 -->
        <section class="space-y-4 rounded-2xl border border-gray-100 bg-gray-50/80 p-5">
          <header class="flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-widest text-green-600">
                Step 1
              </p>
              <h3 class="text-base font-semibold text-gray-900">Choose where this meal belongs</h3>
            </div>
            <button
              class="text-sm font-semibold text-green-600 hover:underline"
              @click="showCreateForm = !showCreateForm"
            >
              {{ showCreateForm ? 'Back to plans' : '+ Create new plan' }}
            </button>
          </header>

          <div
            v-if="showCreateForm"
            class="space-y-5 rounded-2xl border border-dashed border-green-200 bg-white p-5 shadow-sm"
          >
            <div class="grid gap-3 md:grid-cols-2">
              <label class="space-y-1">
                <span class="text-sm font-medium text-gray-700">Plan name *</span>
                <input
                  v-model="createDraft.name"
                  type="text"
                  ref="planNameInput"
                  class="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/40"
                  placeholder="e.g., Spring Wellness Reset"
                />
              </label>

              <label class="space-y-1">
                <span class="text-sm font-medium text-gray-700">Start date</span>
                <input
                  v-model="createDraft.startDate"
                  type="date"
                  class="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/40"
                />
              </label>

              <label class="space-y-1">
                <span class="text-sm font-medium text-gray-700">End date</span>
                <input
                  v-model="createDraft.endDate"
                  type="date"
                  class="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/40"
                />
              </label>

              <label class="space-y-1 md:col-span-2">
                <span class="text-sm font-medium text-gray-700">Notes</span>
                <textarea
                  v-model="createDraft.notes"
                  rows="3"
                  class="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/40"
                  placeholder="Optional context for this plan"
                />
              </label>
            </div>

            <div class="flex items-center justify-between">
              <p v-if="creationError" class="text-sm text-red-600">{{ creationError }}</p>
              <div class="flex-1"></div>
              <button
                @click="createPlan"
                class="inline-flex items-center justify-center rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-500"
              >
                Save plan
              </button>
            </div>
          </div>

          <div v-else class="grid gap-3 sm:grid-cols-2">
            <button
              v-for="plan in sortedPlans"
              :key="plan.id"
              @click="handlePlanSelect(plan)"
              class="text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-500"
              :class="[
                'rounded-2xl border px-5 py-4 shadow-sm hover:shadow-md',
                plan.status === 'archived'
                  ? 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-400'
                  : selectedPlanId === plan.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-green-500 hover:bg-green-50/60',
              ]"
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="text-base font-semibold text-gray-900">
                    {{ plan.name }}
                    <span
                      v-if="plan.status === 'active'"
                      class="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-green-700"
                    >
                      Active
                    </span>
                  </p>
                  <p class="text-xs text-gray-500">
                    Created
                    {{
                      plan.createdAt
                        ? new Date(plan.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: '2-digit',
                            year: 'numeric',
                          })
                        : 'unknown'
                    }}
                  </p>
                </div>
                <span
                  class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600"
                >
                  {{ (plan.meals || []).length }}
                </span>
              </div>

              <p class="mt-3 text-xs text-gray-500">
                {{ plan.startDate || 'No start date' }} → {{ plan.endDate || 'Open-ended' }}
              </p>
              <span
                class="mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide"
                :class="{
                  'bg-green-100 text-green-700': plan.status === 'active',
                  'bg-sky-100 text-sky-700': plan.status === 'draft',
                  'bg-gray-200 text-gray-600': plan.status === 'archived',
                }"
              >
                {{ plan.status }}
              </span>
            </button>

            <p v-if="!plans.length" class="col-span-full text-sm text-gray-500">
              No meal plans yet — create one to get started.
            </p>
          </div>
        </section>

        <!-- Step 2 -->
        <section
          class="space-y-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          :class="{ 'pointer-events-none opacity-40': !selectedPlanId }"
        >
          <header>
            <p class="text-xs font-semibold uppercase tracking-widest text-green-600">
              Step 2
            </p>
            <h3 class="text-base font-semibold text-gray-900">Pick a meal slot</h3>
          </header>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="type in mealTypes"
              :key="type"
              class="rounded-full border px-4 py-2 text-sm font-medium transition"
              :class="
                selectedMealType === type
                  ? 'border-green-600 bg-green-600 text-white'
                  : 'border-gray-300 text-gray-600 hover:border-green-500 hover:text-green-600'
              "
              :disabled="!selectedPlanId"
              @click="selectedMealType = selectedMealType === type ? '' : type"
            >
              {{ type }}
            </button>
          </div>
        </section>

        <!-- Step 3 -->
        <section class="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <header>
            <p class="text-xs font-semibold uppercase tracking-widest text-green-600">
              Step 3
            </p>
            <h3 class="text-base font-semibold text-gray-900">Confirm and add</h3>
          </header>

          <div class="flex flex-wrap gap-3">
            <span
              v-if="selectedPlan"
              class="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700"
            >
              Plan: {{ selectedPlan.name }}
            </span>
            <span
              v-if="selectedMealType"
              class="rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-700"
            >
              Meal: {{ selectedMealType }}
            </span>
            <span class="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
              Item: {{ item?.food || item?.name || item?.recipe_name || 'Unknown item' }}
            </span>
          </div>

          <p v-if="confirmationMessage" class="rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">
            {{ confirmationMessage }}
          </p>
          <p v-else-if="linkError" class="text-sm text-red-600">{{ linkError }}</p>

          <div class="flex items-center justify-end">
            <button
              @click="linkToPlan"
              :disabled="isSubmitting"
              class="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-500 disabled:cursor-not-allowed disabled:opacity-60"
              :class="{ 'animate-shake': isShaking }"
            >
              <span
                v-if="isSubmitting"
                class="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white"
              ></span>
              <span v-else>Save to meal plan</span>
            </button>
          </div>
        </section>
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
.animate-shake {
  animation: shake 0.4s ease;
}
@keyframes shake {
  10%,
  90% {
    transform: translateX(-2px);
  }
  20%,
  80% {
    transform: translateX(4px);
  }
  30%,
  50%,
  70% {
    transform: translateX(-6px);
  }
  40%,
  60% {
    transform: translateX(6px);
  }
}
</style>
