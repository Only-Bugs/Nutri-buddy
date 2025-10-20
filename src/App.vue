<script setup>
import { computed, inject } from 'vue'
import ToastContainer from '@/components/common/ToastContainer.vue'

const bootState = inject('bootState', { pending: 0 })
const isBootstrapping = computed(() => (bootState?.pending ?? 0) > 0)
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-900">
    <main class="flex-1">
      <div
        v-if="isBootstrapping"
        class="flex flex-col items-center justify-center gap-6 py-24 text-gray-500"
      >
        <svg
          class="h-12 w-12 animate-spin text-green-600"
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
        <p class="text-lg font-medium">Preparing your Nutri-Buddy experience...</p>
      </div>
      <router-view v-else />
    </main>
    <ToastContainer />
  </div>
</template>
