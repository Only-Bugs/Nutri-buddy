<script setup>
import AppIcon from '@/components/common/AppIcon.vue'

const props = defineProps({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  copy: { type: String, required: true },
  action: { type: String, default: '' },
})
</script>

<template>
  <article
    class="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
  >
    <span
      class="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600"
    >
      <AppIcon :name="props.icon" />
    </span>
    <h3 class="text-lg font-semibold text-gray-900">
      {{ props.title }}
    </h3>
    <p class="text-lg text-gray-600">
      {{ props.copy }}
    </p>
    <p v-if="props.action" class="text-lg font-semibold text-green-600">
      {{ props.action }}
    </p>
  </article>
</template>
