<script setup>
/**
 * AppIcon.vue
 * Depends on global FontAwesome registration via Icons plugin
 */
const props = defineProps({
  name: { type: String, required: true },
})
</script>

<template>
  <FontAwesomeIcon
    :icon="
      {
        meal: 'utensils',
        star: 'star',
        analytics: 'chart-line',
        check: 'check',
      }[name]
    "
  />
</template>
<!-- # Generated under NutriBuddy SpecGuard v1.0.0 -->
