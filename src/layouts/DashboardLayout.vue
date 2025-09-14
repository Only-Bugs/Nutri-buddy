<script setup>
import Sidebar from '@/components/dashboard/Sidebar.vue'
</script>

<template>
  <div class="flex min-h-screen">
    <!-- Sidebar always present -->
    <Sidebar />

    <!-- Routed page content -->
    <main class="flex-1 bg-gray-50 p-6">
      <router-view />
      <!-- 👈 Only this swaps -->
    </main>
  </div>
</template>
