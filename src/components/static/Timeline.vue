<script setup>
const props = defineProps({
  events: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <section class="mx-auto max-w-4xl px-6 py-12">
    <ol class="relative border-l border-green-200">
      <li
        v-for="event in props.events"
        :key="event.title"
        class="ml-6 flex flex-col gap-2 border-b border-gray-100 pb-6 last:border-b-0 last:pb-0"
      >
        <span
          class="absolute -left-[11px] mt-1 h-5 w-5 rounded-full border-2 border-white bg-green-500"
        ></span>
        <h3 class="text-lg font-semibold text-gray-900">
          {{ event.title }}
        </h3>
        <p class="text-sm text-gray-600">
          {{ event.copy }}
        </p>
      </li>
    </ol>
  </section>
</template>
