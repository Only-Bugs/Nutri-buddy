/** * @file DashboardLayout.vue * @description Main authenticated layout for NutriBuddy. * Displays
a persistent sidebar and a dynamic content area that * renders nested routes (e.g., dashboard,
meals, profile pages). * @module layouts/DashboardLayout */

<script setup>
import Sidebar from '@/components/dashboard/Sidebar.vue'
</script>

<template>
  <div class="flex min-h-screen">
    <!-- Persistent sidebar for navigation and logout -->
    <Sidebar />

    <!-- Dynamic routed page content -->
    <main class="flex-1 bg-gray-50 p-6">
      <router-view />
    </main>
  </div>
</template>
