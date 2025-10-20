<script setup>
import AppIcon from '@/components/common/AppIcon.vue'

const props = defineProps({
  links: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <section class="bg-gray-50">
    <div class="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-6 px-6 py-8">
      <a
        v-for="link in props.links"
        :key="link.label"
        :href="link.href"
        class="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-5 py-2 text-lg font-semibold text-gray-700 transition hover:border-green-200 hover:text-green-600"
        :target="link.external ? '_blank' : undefined"
        :rel="link.external ? 'noopener' : undefined"
      >
        <AppIcon :name="link.icon" />
        <span>{{ link.label }}</span>
      </a>
    </div>
  </section>
</template>
