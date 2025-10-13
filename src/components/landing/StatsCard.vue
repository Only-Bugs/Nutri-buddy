<script setup>
/**
 * StatsCard.vue
 *
 * Reusable stat card (value + label).
 */
const props = defineProps({
  value: String,
  label: String,
})
</script>

<template>
  <div class="text-center">
    <p class="text-2xl font-bold text-gray-900">{{ value }}</p>
    <p class="text-lg text-gray-600">{{ label }}</p>
  </div>
</template>
