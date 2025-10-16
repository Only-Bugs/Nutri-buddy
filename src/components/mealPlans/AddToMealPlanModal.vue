<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useMealPlanStore } from '@/store/mealplan/mealPlanStore'

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

const selectedPlanId = ref('')
const selectedMealType = ref('')
const showCreateForm = ref(false)
const linkError = ref('')
const creationError = ref('')
const isSubmitting = ref(false)

const createDraft = reactive({
  name: '',
  startDate: '',
  endDate: '',
  notes: '',
})

const plans = computed(() => mealPlanStore.plans || [])
const selectablePlans = computed(() =>
  plans.value.filter((plan) => plan.status !== 'archived'),
)

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
      if (!plans.value.length) {
        showCreateForm.value = true
      } else {
        selectedPlanId.value = mealPlanStore.activePlanId || selectablePlans.value[0]?.id || ''
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

function handlePlanSelect(plan) {
  if (!plan || plan.status === 'archived') return
  selectedPlanId.value = plan.id
  mealPlanStore.selectPlan(plan.id)
  linkError.value = ''
}

async function createPlan() {
  creationError.value = ''
  if (!createDraft.name.trim()) {
    creationError.value = 'Plan name is required.'
    return
  }
  try {
    const plan = await mealPlanStore.savePlan({
      name: createDraft.name.trim(),
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
  if (!selectedPlanId.value) {
    linkError.value = 'Choose a meal plan first.'
    return
  }
  if (!selectedMealType.value) {
    linkError.value = 'Select a meal type before saving.'
    return
  }
  if (!props.item) {
    linkError.value = 'Select something to add.'
    return
  }

  try {
    isSubmitting.value = true
    mealPlanStore.selectPlan(selectedPlanId.value)
    await mealPlanStore.addItemToActivePlan({
      label: selectedMealType.value,
      item: buildMealPayload(),
    })
    emit('added')
    resetState()
  } catch (error) {
    linkError.value = error?.message || 'Unable to add to meal plan.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 z-40 flex items-center justify-center px-4 py-6"
      role="dialog"
      aria-modal="true"
    >
      <div class="absolute inset-0 bg-black/50" @click.self="closeModal" />

      <div class="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6 space-y-6 z-10">
        <div class="flex items-start justify-between">
          <div>
            <h2 class="text-2xl font-semibold text-gray-900">Add to Meal Plan</h2>
            <p class="text-base text-gray-500">
              Link <span class="font-medium text-gray-700">{{ itemName }}</span> to
              your meal planning workspace.
            </p>
          </div>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <!-- Step 1 -->
        <section class="space-y-3">
          <header class="flex items-center justify-between">
            <div>
              <p class="text-sm uppercase font-semibold text-green-600">Step 1</p>
              <h3 class="text-lg font-semibold text-gray-900">Choose a meal plan</h3>
            </div>
            <button
              class="text-sm text-green-600 font-medium hover:underline"
              @click="showCreateForm = !showCreateForm"
            >
              {{ showCreateForm ? 'Back to plans' : '+ Create new plan' }}
            </button>
          </header>

          <div v-if="showCreateForm" class="space-y-4">
            <div class="grid gap-3 md:grid-cols-2">
              <label class="space-y-1">
                <span class="text-sm font-medium text-gray-700">Plan name *</span>
                <input
                  v-model="createDraft.name"
                  type="text"
                  class="w-full border rounded-lg px-3 py-2 text-base"
                  placeholder="e.g., Spring Wellness Reset"
                />
              </label>

              <label class="space-y-1">
                <span class="text-sm font-medium text-gray-700">Start date</span>
                <input v-model="createDraft.startDate" type="date" class="w-full border rounded-lg px-3 py-2 text-base" />
              </label>

              <label class="space-y-1">
                <span class="text-sm font-medium text-gray-700">End date</span>
                <input v-model="createDraft.endDate" type="date" class="w-full border rounded-lg px-3 py-2 text-base" />
              </label>

              <label class="space-y-1 md:col-span-2">
                <span class="text-sm font-medium text-gray-700">Notes</span>
                <textarea
                  v-model="createDraft.notes"
                  rows="3"
                  class="w-full border rounded-lg px-3 py-2 text-base"
                  placeholder="Optional context for this plan"
                />
              </label>
            </div>

            <div class="flex items-center justify-between">
              <p v-if="creationError" class="text-sm text-red-600">{{ creationError }}</p>
              <div class="flex-1" />
              <button
                @click="createPlan"
                class="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700"
              >
                Save plan
              </button>
            </div>
          </div>

          <div v-else class="grid gap-3 sm:grid-cols-2">
            <button
              v-for="plan in plans"
              :key="plan.id"
              @click="handlePlanSelect(plan)"
              class="border rounded-xl px-4 py-3 text-left transition"
              :class="[
                plan.status === 'archived'
                  ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                  : selectedPlanId === plan.id
                  ? 'border-green-600 bg-green-50'
                  : 'hover:border-green-500 hover:bg-green-50',
              ]"
            >
              <p class="text-lg font-semibold text-gray-900">{{ plan.name }}</p>
              <p class="text-sm text-gray-500">
                {{ plan.startDate || 'No start date' }} → {{ plan.endDate || 'Open-ended' }}
              </p>
              <span
                class="inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full"
                :class="{
                  'bg-green-100 text-green-700': plan.status === 'active',
                  'bg-sky-100 text-sky-700': plan.status === 'draft',
                  'bg-gray-200 text-gray-600': plan.status === 'archived',
                }"
              >
                {{ plan.status }}
              </span>
            </button>

            <p v-if="!plans.length" class="text-base text-gray-500 col-span-full">
              No meal plans yet — create one to get started.
            </p>
          </div>
        </section>

        <!-- Step 2 -->
        <section class="space-y-3" :class="{ 'opacity-40 pointer-events-none': !selectedPlanId }">
          <header>
            <p class="text-sm uppercase font-semibold text-green-600">Step 2</p>
            <h3 class="text-lg font-semibold text-gray-900">Select meal type</h3>
          </header>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="type in mealTypes"
              :key="type"
              class="px-4 py-2 rounded-full border text-sm font-medium transition"
              :class="
                selectedMealType === type
                  ? 'bg-green-600 text-white border-green-600'
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
        <section class="space-y-3">
          <header>
            <p class="text-sm uppercase font-semibold text-green-600">Step 3</p>
            <h3 class="text-lg font-semibold text-gray-900">Confirm selection</h3>
          </header>

          <div class="flex flex-wrap gap-3">
            <span
              v-if="selectedPlan"
              class="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium"
            >
              Plan: {{ selectedPlan.name }}
            </span>
            <span
              v-if="selectedMealType"
              class="px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-sm font-medium"
            >
              Meal: {{ selectedMealType }}
            </span>
            <span
              class="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium"
            >
              Item: {{ item?.food || item?.name || item?.recipe_name || 'Unknown item' }}
            </span>
          </div>

          <div class="flex items-center justify-between">
            <p v-if="linkError" class="text-sm text-red-600">{{ linkError }}</p>
            <div class="flex-1" />
            <button
              @click="linkToPlan"
              :disabled="isSubmitting"
              class="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span v-if="isSubmitting" class="animate-spin">⏳</span>
              <span>{{ isSubmitting ? 'Saving…' : 'Save to meal plan' }}</span>
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
</style>
