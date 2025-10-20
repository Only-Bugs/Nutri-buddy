<script setup>
import SiteNav from './SiteNav.vue'
import SiteFooter from './SiteFooter.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col bg-white text-gray-900">
    <SiteNav />
    <main class="flex-1">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>
