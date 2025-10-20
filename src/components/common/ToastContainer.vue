<script setup>
import { useToast } from '@/composables/useToast'
const { state } = useToast()
</script>

<template>
  <transition name="fade">
    <div
      v-if="state.visible"
      class="fixed top-6 right-6 px-4 py-2 rounded-lg shadow-lg text-white"
      :class="{
        'bg-green-600': state.type === 'success',
        'bg-red-600': state.type === 'error',
        'bg-gray-700': state.type === 'info',
      }"
    >
      {{ state.message }}
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
