<script setup>
import FeatureCard from './FeatureCard.vue'

const props = defineProps({
  theme: { type: String, required: true },
  scenario: { type: String, required: true },
  features: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <section class="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
    <div class="flex flex-col gap-2 text-left">
      <p class="text-lg font-semibold uppercase tracking-wide text-green-600">
        {{ props.theme }}
      </p>
      <p class="text-lg text-gray-700">
        {{ props.scenario }}
      </p>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      <FeatureCard
        v-for="feature in props.features"
        :key="feature.title"
        :icon="feature.icon"
        :title="feature.title"
        :copy="feature.copy"
        :action="feature.action"
      />
    </div>
  </section>
</template>
