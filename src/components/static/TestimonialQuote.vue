<script setup>
import AppIcon from '@/components/common/AppIcon.vue'

const props = defineProps({
  quote: { type: String, required: true },
  author: { type: String, default: '' },
})
</script>

<template>
  <figure class="rounded-2xl border border-green-100 bg-green-50 p-6 shadow-sm">
    <div class="flex items-start gap-3">
      <span class="text-green-500">
        <AppIcon name="quote" />
      </span>
      <blockquote class="text-base font-medium text-gray-800">
        “{{ props.quote }}”
      </blockquote>
    </div>
    <figcaption v-if="props.author" class="mt-4 text-sm text-gray-600">
      {{ props.author }}
    </figcaption>
  </figure>
</template>
