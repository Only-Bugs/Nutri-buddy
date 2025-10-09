<script setup>
import ToastContainer from '@/components/common/ToastContainer.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-900">
    <main class="flex-1 flex items-center justify-center w-full px-4">
      <router-view />
    </main>
    <ToastContainer />
  </div>
</template>
