<script setup>
import AppIcon from '@/components/common/AppIcon.vue'

const props = defineProps({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  copy: { type: String, required: true },
})
</script>

<template>
  <article class="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
    <span class="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
      <AppIcon :name="props.icon" />
    </span>
    <h3 class="text-lg font-semibold text-gray-900">
      {{ props.title }}
    </h3>
    <p class="text-sm text-gray-600">
      {{ props.copy }}
    </p>
  </article>
</template>
