<script setup>
const props = defineProps({
  title: String,
  subtitle: String,
  createdAt: String,
})
</script>

<template>
  <div class="flex items-center justify-between bg-white shadow-sm rounded-xl p-6">
    <div>
      <h2 class="text-2xl font-bold">{{ title }}</h2>
      <p class="text-gray-500 text-lg">{{ subtitle }} • Created on {{ createdAt }}</p>
    </div>
    <div class="flex gap-2">
      <button class="border px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50">Share</button>
      <button class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
        Edit Plan
      </button>
    </div>
  </div>
</template>
