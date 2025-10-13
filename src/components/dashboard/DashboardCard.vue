/** * @file DashboardCard.vue * @description Base visual shell for all dashboard widgets. * Applies
unified padding, radius, shadow, and title rhythm. * @module components/dashboard/DashboardCard * #
*/

<script setup>
const props = defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
})
</script>

<template>
  <section class="dash-card">
    <header v-if="title" class="mb-4">
      <h3 class="dash-title text-lg">{{ title }}</h3>
      <p v-if="subtitle" class="dash-subtitle mt-1">{{ subtitle }}</p>
    </header>

    <slot />
  </section>
</template>
