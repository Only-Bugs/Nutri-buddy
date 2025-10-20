<script setup>
const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  caption: { type: String, required: true },
})
</script>

<template>
  <section class="bg-gray-900">
    <div class="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-center text-gray-100">
      <div class="flex flex-wrap items-center justify-center gap-6">
        <span
          v-for="item in props.items"
          :key="item"
          class="rounded-full border border-gray-700 px-4 py-2 text-lg font-semibold uppercase tracking-wide text-gray-200"
        >
          {{ item }}
        </span>
      </div>
      <p class="text-lg text-gray-400">
        {{ props.caption }}
      </p>
    </div>
  </section>
</template>
