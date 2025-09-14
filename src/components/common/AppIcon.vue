<script setup>
/**
 * AppIcon.vue
 *
 * Centralized icon renderer.
 * Usage: <AppIcon name="meal" class="w-6 h-6" />
 */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'

// Pick only the icons you want to use
import { faUtensils, faStar, faChartLine, faCheck } from '@fortawesome/free-solid-svg-icons'

library.add(faUtensils, faStar, faChartLine, faCheck)

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
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
