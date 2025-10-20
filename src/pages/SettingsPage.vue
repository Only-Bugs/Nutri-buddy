<script setup>
import { reactive, ref, watch } from 'vue'
import { useUserProfileStore } from '@/store/userProfile'

const userProfile = useUserProfileStore()

const form = reactive({
  customUsername: userProfile.customUsername || '',
  dailyCalorieLimit: userProfile.dailyCalorieLimit || 2000,
})

const saving = ref(false)
const savedAt = ref('')

watch(
  () => userProfile.customUsername,
  (value) => {
    form.customUsername = value || ''
  },
)

watch(
  () => userProfile.dailyCalorieLimit,
  (value) => {
    if (Number(value) && !saving.value) {
      form.dailyCalorieLimit = value
    }
  },
)

async function saveSettings() {
  saving.value = true
  try {
    userProfile.setCustomUsername(form.customUsername)
    userProfile.setDailyCalorieLimit(form.dailyCalorieLimit)
    savedAt.value = new Date().toISOString()
  } finally {
    saving.value = false
  }
}

function formatTimestamp(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <section class="dash-section w-full space-y-8">
    <header class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Account Settings</h1>
        <p class="text-base text-gray-500">Manage how your profile appears across the dashboard.</p>
      </div>
    </header>

    <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <form class="space-y-6" @submit.prevent="saveSettings">
        <section class="dash-card space-y-6">
          <header>
            <h2 class="text-xl font-semibold text-gray-900">Profile</h2>
            <p class="text-lg text-gray-500">
              These details personalise your experience and are stored securely on this device.
            </p>
          </header>

          <div class="flex items-center gap-4">
            <div
              class="h-16 w-16 overflow-hidden rounded-full border border-gray-200 bg-gray-100 flex items-center justify-center"
            >
              <img
                v-if="userProfile.avatarUrl"
                :src="userProfile.avatarUrl"
                :alt="form.customUsername || userProfile.resolvedFirstName"
                class="h-full w-full object-cover"
              />
              <span v-else class="text-lg font-semibold text-gray-500 uppercase">
                {{ userProfile.resolvedFirstName.charAt(0) }}
              </span>
            </div>
            <div>
              <p class="text-lg text-gray-500">Signed in as</p>
              <p class="text-base font-medium text-gray-900">{{ userProfile.email || '—' }}</p>
            </div>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <label class="space-y-1 md:col-span-2">
              <span class="text-lg font-medium text-gray-700">Email</span>
              <input
                :value="userProfile.email"
                type="email"
                class="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-base text-gray-600"
                readonly
              />
            </label>

            <label class="space-y-1 md:col-span-2">
              <span class="text-lg font-medium text-gray-700">Custom Username</span>
              <input
                v-model="form.customUsername"
                type="text"
                class="w-full rounded-lg border border-gray-200 px-3 py-2 text-base focus:border-green-500 focus:ring-green-500"
                placeholder="e.g. Nutri Champion"
                maxlength="40"
              />
              <p class="text-xs text-gray-500">
                This name replaces your email in greetings across the dashboard.
              </p>
            </label>

            <label class="space-y-1 md:col-span-1">
              <span class="text-lg font-medium text-gray-700">Daily Calorie Limit (kcal)</span>
              <input
                v-model.number="form.dailyCalorieLimit"
                type="number"
                min="1000"
                max="5000"
                step="50"
                class="w-full rounded-lg border border-gray-200 px-3 py-2 text-base focus:border-green-500 focus:ring-green-500"
              />
              <p class="text-xs text-gray-500">Used for dashboard targets and reminders.</p>
            </label>
          </div>

          <div class="flex items-center justify-between">
            <p v-if="savedAt" class="text-lg text-gray-500">
              Saved at {{ formatTimestamp(savedAt) }}
            </p>
            <div class="flex-1" />
            <button
              type="submit"
              class="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-base font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
              :disabled="saving"
            >
              <span v-if="saving" class="animate-spin">⏳</span>
              <span>{{ saving ? 'Saving…' : 'Save Changes' }}</span>
            </button>
          </div>
        </section>
      </form>

      <aside class="space-y-4">
        <section class="dash-card space-y-3">
          <h3 class="text-lg font-semibold text-gray-900">Quick reference</h3>
          <ul class="space-y-2 text-lg text-gray-600">
            <li><strong>Email:</strong> {{ userProfile.email || '—' }}</li>
            <li><strong>Display name:</strong> {{ userProfile.resolvedDisplayName }}</li>
            <li><strong>Daily limit:</strong> {{ userProfile.dailyCalorieLimit }} kcal</li>
          </ul>
        </section>
      </aside>
    </div>
  </section>
</template>
