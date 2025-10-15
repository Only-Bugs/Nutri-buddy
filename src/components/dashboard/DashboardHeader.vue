/** * @file DashboardHeader.vue * @description Header with greeting left, calorie limit + profile
dropdown right. * Uses Firebase photoURL if available, else a default user icon. * @module
components/dashboard/DashboardHeader */

<script setup>
import { ref, computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useAuthStore } from '@/store/auth'
import { useAuthActions } from '@/composables/useAuthActions'

const props = defineProps({
  calorieLimit: { type: Number, default: 2000 },
})

const emit = defineEmits(['open-search'])

const auth = useAuthStore()
const showMenu = ref(false)
const { handleLogout } = useAuthActions()

const user = computed(() => auth.user || {})
const firstName = computed(() =>
  user.value?.displayName
    ? user.value.displayName.split(' ')[0]
    : user.value?.email?.split('@')[0] || 'User',
)

function toggleMenu() {
  showMenu.value = !showMenu.value
}

function openSearchOverlay() {
  emit('open-search')
}
</script>

<template>
  <header class="dash-card flex items-center justify-between relative">
    <!-- Left: Greeting -->
    <div>
      <h2 class="dash-title">Welcome, {{ firstName }}</h2>
      <p class="dash-subtitle">Glad to see you back!</p>
    </div>

    <!-- Right: Profile cluster -->
    <div class="flex items-center gap-5 relative">
      <button
        @click="openSearchOverlay"
        class="w-11 h-11 rounded-full border-2 border-green-600 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
        aria-label="Open search"
      >
        <FontAwesomeIcon icon="magnifying-glass" class="text-lg" />
      </button>

      <!-- Calorie limit -->
      <div class="text-right">
        <p class="text-base text-gray-500 leading-tight">Daily Limit</p>
        <p class="text-lg font-bold text-green-600">{{ calorieLimit }} kcal</p>
      </div>

      <!-- Avatar / default icon -->
      <button
        @click="toggleMenu"
        class="flex items-center gap-2 focus:outline-none"
        aria-label="User menu"
      >
        <div
          class="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-gray-100 overflow-hidden"
        >
          <template v-if="user?.photoURL">
            <img :src="user.photoURL" alt="User avatar" class="w-full h-full object-cover" />
          </template>
          <template v-else>
            <FontAwesomeIcon icon="user" class="text-gray-500 text-base" />
          </template>
        </div>
        <FontAwesomeIcon
          icon="chevron-down"
          class="text-gray-600 text-base transition-transform"
          :class="{ 'rotate-180': showMenu }"
        />
      </button>

      <!-- Dropdown -->
      <transition name="fade">
        <div
          v-if="showMenu"
          class="absolute right-0 top-12 w-56 bg-white border rounded-lg shadow-lg z-10 py-2"
        >
          <p class="px-4 pb-2 text-base text-gray-400 border-b">
            Logged in as {{ user.email || 'unknown user' }}
          </p>
          <button
            class="flex items-center gap-2 w-full text-left px-4 py-2 text-base text-gray-700 hover:bg-gray-50"
          >
            <FontAwesomeIcon icon="gear" /> Settings
          </button>
          <button
            @click="handleLogout"
            class="flex items-center gap-2 w-full text-left px-4 py-2 text-base text-red-600 hover:bg-red-50"
          >
            <FontAwesomeIcon icon="arrow-right-from-bracket" /> Logout
          </button>
        </div>
      </transition>
    </div>
  </header>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
