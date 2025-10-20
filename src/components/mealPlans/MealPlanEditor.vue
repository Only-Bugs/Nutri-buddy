<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useToast } from '@/composables/useToast'

const props = defineProps({
  show: { type: Boolean, default: false },
  mode: {
    type: String,
    default: 'create',
    validator: (value) => ['create', 'edit'].includes(value),
  },
  initialPlan: {
    type: Object,
    default: () => ({
      name: '',
      startDate: '',
      endDate: '',
      notes: '',
    }),
  },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
})

const emit = defineEmits(['close', 'submit'])

const form = reactive({
  name: '',
  startDate: '',
  endDate: '',
  notes: '',
})

const touched = reactive({
  name: false,
  startDate: false,
  endDate: false,
})

const showSuccessPulse = ref(false)
const { showToast } = useToast()

const errors = computed(() => {
  const messages = {
    name: '',
    startDate: '',
    endDate: '',
  }

  const trimmedName = form.name.trim()
  if (!trimmedName.length) {
    messages.name = 'Plan name is required.'
  } else if (trimmedName.length < 3) {
    messages.name = 'Name must be at least 3 characters.'
  } else if (trimmedName.length > 40) {
    messages.name = 'Name must be under 40 characters.'
  }

  if (form.startDate && form.endDate) {
    const start = new Date(form.startDate)
    const end = new Date(form.endDate)
    if (!Number.isNaN(start.valueOf()) && !Number.isNaN(end.valueOf()) && end < start) {
      messages.endDate = 'End date cannot be before the start date.'
    }
  }

  return messages
})

const isFormValid = computed(
  () =>
    !errors.value.name &&
    !errors.value.startDate &&
    !errors.value.endDate &&
    Boolean(form.name.trim()),
)

function resetState() {
  form.name = ''
  form.startDate = ''
  form.endDate = ''
  form.notes = ''
  touched.name = false
  touched.startDate = false
  touched.endDate = false
}

function populateFromInitial() {
  form.name = props.initialPlan?.name ?? ''
  form.startDate = props.initialPlan?.startDate ?? ''
  form.endDate = props.initialPlan?.endDate ?? ''
  form.notes = props.initialPlan?.notes ?? ''
  touched.name = false
  touched.startDate = Boolean(form.startDate)
  touched.endDate = Boolean(form.endDate)
}

watch(
  () => props.show,
  (visible) => {
    if (visible) {
      populateFromInitial()
    } else {
      resetState()
      showSuccessPulse.value = false
    }
  },
)

watch(
  () => props.initialPlan,
  () => {
    if (props.show) populateFromInitial()
  },
  { deep: true },
)

watch(
  () => ({ loading: props.loading, error: props.error }),
  ({ loading, error }, prev) => {
    if (prev && prev.loading && !loading && !error && props.show) {
      showSuccessPulse.value = true
      window.setTimeout(() => {
        showSuccessPulse.value = false
      }, 650)
    }
  },
)

function fieldStatus(field) {
  if (!touched[field]) return 'border-gray-200 focus:border-green-500 focus:ring-green-500/40'
  if (errors.value[field]) {
    return 'border-red-400 focus:border-red-500 focus:ring-red-500/40'
  }
  return 'border-green-500 focus:border-green-600 focus:ring-green-500/30'
}

function markTouched(field) {
  touched[field] = true
}

function onClose() {
  emit('close')
}

function handleSubmit() {
  touched.name = true
  touched.startDate = Boolean(form.startDate)
  touched.endDate = Boolean(form.endDate)

  if (!isFormValid.value) {
    showToast('Please fix the highlighted fields.', 'error')
    return
  }

  emit('submit', {
    name: form.name.trim(),
    startDate: form.startDate || '',
    endDate: form.endDate || '',
    notes: form.notes?.trim() || '',
  })
}
</script>

<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 z-40 flex items-center justify-center px-4 py-6 sm:px-6"
      role="dialog"
      aria-modal="true"
    >
      <div class="absolute inset-0 bg-black/40" @click="onClose"></div>

      <section
        class="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <header class="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-5">
          <div>
            <p class="text-xs font-semibold uppercase tracking-widest text-green-600">
              {{ mode === 'create' ? 'New meal plan' : 'Edit meal plan' }}
            </p>
            <h2 class="text-xl font-semibold text-gray-900">Set up your meal plan</h2>
            <p class="mt-1 text-sm text-gray-600">
              Group essentials, choose key dates, then save. You can adjust everything later.
            </p>
          </div>
          <button
            type="button"
            class="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close editor"
            @click="onClose"
          >
            <span class="sr-only">Close</span>
            ✕
          </button>
        </header>

        <div class="max-h-[70vh] space-y-6 overflow-y-auto bg-gray-50 px-6 py-6">
          <section class="space-y-4 rounded-xl border border-gray-100 bg-white px-4 py-5 shadow-sm">
            <header>
              <p class="text-xs font-semibold uppercase tracking-widest text-green-600">
                Details
              </p>
              <h3 class="text-base font-semibold text-gray-900">Name and notes</h3>
              <p class="text-sm text-gray-600">
                Give this plan a clear title and optional notes to stay focused.
              </p>
            </header>

            <div class="space-y-4">
              <label class="block text-sm font-medium text-gray-700">
                Plan name *
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="e.g., Weekly Reset Plan"
                  class="mt-2 w-full rounded-lg border bg-gray-50 px-4 py-3 text-sm text-gray-900 transition focus:outline-none"
                  :class="fieldStatus('name')"
                  @blur="markTouched('name')"
                />
                <span v-if="touched.name && errors.name" class="mt-2 block text-sm text-red-500">
                  {{ errors.name }}
                </span>
              </label>

              <label class="block text-sm font-medium text-gray-700">
                Notes
                <textarea
                  v-model="form.notes"
                  rows="3"
                  placeholder="What is this plan helping you accomplish?"
                  class="mt-2 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 shadow-sm transition focus:border-green-500 focus:ring-green-500/40 focus:outline-none"
                />
              </label>
            </div>
          </section>

          <section class="space-y-4 rounded-xl border border-gray-100 bg-white px-4 py-5 shadow-sm">
            <header>
              <p class="text-xs font-semibold uppercase tracking-widest text-green-600">
                Dates
              </p>
              <h3 class="text-base font-semibold text-gray-900">Plan window</h3>
              <p class="text-sm text-gray-600">
                Add dates if you want reminders. Leave blank for an ongoing plan.
              </p>
            </header>

            <div class="grid gap-4 md:grid-cols-2">
              <label class="block text-sm font-medium text-gray-700">
                Start date
                <input
                  v-model="form.startDate"
                  type="date"
                  class="mt-2 w-full rounded-lg border bg-gray-50 px-4 py-3 text-sm text-gray-900 transition focus:outline-none"
                  :class="fieldStatus('startDate')"
                  @blur="markTouched('startDate')"
                />
              </label>

              <label class="block text-sm font-medium text-gray-700">
                End date
                <input
                  v-model="form.endDate"
                  type="date"
                  class="mt-2 w-full rounded-lg border bg-gray-50 px-4 py-3 text-sm text-gray-900 transition focus:outline-none"
                  :class="fieldStatus('endDate')"
                  @blur="markTouched('endDate')"
                />
                <span v-if="touched.endDate && errors.endDate" class="mt-2 block text-sm text-red-500">
                  {{ errors.endDate }}
                </span>
              </label>
            </div>
          </section>

          <section class="space-y-4 rounded-xl border border-gray-100 bg-white px-4 py-5 shadow-sm">
            <header>
              <p class="text-xs font-semibold uppercase tracking-widest text-green-600">
                Confirm &amp; Save
              </p>
              <h3 class="text-base font-semibold text-gray-900">Double-check the essentials</h3>
              <p class="text-sm text-gray-600">
                Make sure your dates and name look right. You can update everything later.
              </p>
            </header>

            <dl class="grid gap-3 text-sm text-gray-600 md:grid-cols-2">
              <div>
                <dt class="font-semibold text-gray-900">Plan name</dt>
                <dd>{{ form.name || 'Not set' }}</dd>
              </div>
              <div>
                <dt class="font-semibold text-gray-900">Dates</dt>
                <dd>
                  {{
                    form.startDate
                      ? `${form.startDate}${form.endDate ? ` → ${form.endDate}` : ' onward'}`
                      : 'No start date'
                  }}
                </dd>
              </div>
              <div class="md:col-span-2">
                <dt class="font-semibold text-gray-900">Notes</dt>
                <dd>{{ form.notes || 'No notes added' }}</dd>
              </div>
            </dl>
          </section>
        </div>

        <footer
          class="sticky bottom-0 flex flex-col gap-3 border-t border-gray-100 bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <button
            type="button"
            class="text-sm font-semibold text-gray-500 hover:text-gray-700"
            @click="onClose"
          >
            Cancel
          </button>
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-500 disabled:cursor-not-allowed disabled:opacity-60"
            :class="{ 'animate-success': showSuccessPulse }"
            :disabled="loading"
            @click="handleSubmit"
          >
            <svg
              v-if="loading"
              class="mr-2 h-5 w-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            {{ loading ? 'Saving…' : 'Save Plan' }}
          </button>
        </footer>
      </section>
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
.animate-success {
  animation: pulse-success 0.6s ease;
}
@keyframes pulse-success {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.45);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 0 0 8px rgba(22, 163, 74, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(22, 163, 74, 0);
  }
}
</style>
