/** * @file DashboardLayout.vue * @description Refined dashboard grid layout with balanced main
padding. * Fixes main content alignment beside sidebar. * @module layouts/DashboardLayout * # */

<script setup>
import Sidebar from '@/components/dashboard/Sidebar.vue'
import '@/assets/dashboard.css'
</script>

<template>
  <div class="min-h-screen grid grid-cols-[16rem_minmax(0,1fr)] bg-gray-50">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main content -->
    <main class="overflow-y-auto bg-white/50">
      <div class="px-10 py-10 max-w-[90rem] mx-auto space-y-[var(--dash-gap)]">
        <router-view />
      </div>
    </main>
  </div>
</template>
