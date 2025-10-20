<script setup>
import { computed } from 'vue'

const props = defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  align: { type: String, default: 'center' },
})

const alignClass = computed(() =>
  props.align === 'left' ? 'text-left items-start' : 'text-center items-center',
)
</script>

<template>
  <header :class="['mx-auto flex max-w-3xl flex-col gap-3 px-6', alignClass]">
    <p v-if="eyebrow" class="text-xs font-semibold uppercase tracking-widest text-green-600">
      {{ eyebrow }}
    </p>
    <h1 class="text-3xl font-bold text-gray-900 md:text-4xl">
      {{ title }}
    </h1>
    <p v-if="subtitle" class="text-base text-gray-600 md:text-lg">
      {{ subtitle }}
    </p>
  </header>
</template>
