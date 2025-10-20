/** * @file DashboardHeader.vue * @description Header with greeting left, calorie limit + profile
dropdown right. * Uses userProfile store for consistent identity data. * @module
components/dashboard/DashboardHeader */

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useAuthStore } from '@/store/auth'
import { useUserProfileStore } from '@/store/userProfile'
import { useAuthActions } from '@/composables/useAuthActions'

const auth = useAuthStore()
const userProfile = useUserProfileStore()
const router = useRouter()
const showMenu = ref(false)
const { handleLogout } = useAuthActions()

const firstName = computed(() => userProfile.resolvedFirstName)
const profileEmail = computed(() => userProfile.email || auth.user?.email || 'unknown user')
const avatarUrl = computed(() => userProfile.avatarUrl)

function toggleMenu() {
  showMenu.value = !showMenu.value
}

function goToSettings() {
  showMenu.value = false
  router.push({ name: 'Settings' })
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
    <div class="flex items-center gap-4 relative">
      <button
        @click="toggleMenu"
        class="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-400"
        aria-label="User menu"
      >
        <div class="h-12 w-12 overflow-hidden rounded-full bg-gray-100">
          <template v-if="avatarUrl">
            <img :src="avatarUrl" alt="User avatar" class="h-full w-full object-cover" />
          </template>
          <template v-else>
            <div class="flex h-full w-full items-center justify-center">
              <FontAwesomeIcon icon="user" class="text-gray-500 text-2xl" />
            </div>
          </template>
        </div>
        <FontAwesomeIcon
          icon="chevron-down"
          class="text-gray-600 text-2xl transition-transform"
          :class="{ 'rotate-180': showMenu }"
        />
      </button>

      <!-- Dropdown -->
      <transition name="fade">
        <div
          v-if="showMenu"
          class="absolute right-0 top-12 w-56 bg-white border rounded-lg shadow-lg z-10 py-2"
        >
          <p class="px-4 pb-3 text-lg text-gray-400 border-b">
            Logged in as {{ profileEmail }}
          </p>
          <button
            class="flex items-center gap-3 w-full text-left px-4 py-3 text-lg text-gray-700 transition hover:bg-green-50"
            type="button"
            @click="goToSettings"
          >
            <FontAwesomeIcon icon="gear" /> Settings
          </button>
          <button
            @click="handleLogout"
            class="flex items-center gap-3 w-full text-left px-4 py-3 text-lg font-semibold text-white transition"
            type="button"
            style="background-color: #dc2626;"
            @mouseover="($event.target.style.backgroundColor = '#b91c1c')"
            @mouseleave="($event.target.style.backgroundColor = '#dc2626')"
          >
            <FontAwesomeIcon icon="arrow-right-from-bracket" />
            Logout
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
