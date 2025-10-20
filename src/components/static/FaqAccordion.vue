<script setup>
import { ref } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})

const openIndex = ref(0)

function toggle(index) {
  openIndex.value = openIndex.value === index ? -1 : index
}
</script>

<template>
  <section class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
    <h3 class="text-lg font-semibold text-gray-900">Frequently Asked</h3>
    <ul class="mt-4 divide-y divide-gray-100">
      <li v-for="(item, index) in props.items" :key="item.question" class="py-3">
        <button
          type="button"
          class="flex w-full items-center justify-between text-left text-lg font-semibold text-gray-800"
          @click="toggle(index)"
        >
          <span>{{ item.question }}</span>
          <span class="text-green-600">{{ openIndex === index ? '−' : '+' }}</span>
        </button>
        <p v-if="openIndex === index" class="mt-2 text-lg text-gray-600">
          {{ item.answer }}
        </p>
      </li>
    </ul>
  </section>
</template>
