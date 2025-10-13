<script setup>
import ToastContainer from '@/components/common/ToastContainer.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-900">
    <main>
      <router-view />
    </main>
    <ToastContainer />
  </div>
</template>
