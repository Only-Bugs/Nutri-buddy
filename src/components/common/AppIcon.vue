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
        access: 'user',
        dashboard: 'gauge',
        planning: 'clipboard-list',
        history: 'clock-rotate-left',
        reliability: 'gear',
        search: 'magnifying-glass',
        plan: 'clipboard-list',
        track: 'chart-line',
        quote: 'quote-left',
        insight: 'gauge',
        privacy: 'lock',
        shield: 'shield-halved',
        sustain: 'leaf',
        email: 'envelope',
        linkedin: ['fab', 'linkedin'],
        github: ['fab', 'github'],
      }[name]
    "
  />
</template>
<!--   -->
