<script setup>
import AppIcon from '../common/AppIcon.vue'

const props = defineProps({
  icon: String, // "meal" | "star" | "analytics"
  title: String,
  description: String,
  points: Array,
})
</script>

<template>
  <div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
    <!-- Icon in green box -->
    <div
      class="w-12 h-12 flex items-center justify-center rounded-lg bg-green-100 text-green-600 text-2xl mb-4"
    >
      <AppIcon :name="icon" />
    </div>

    <!-- Title -->
    <h3 class="text-lg font-extrabold text-gray-900 mb-2">
      {{ title }}
    </h3>

    <!-- Description -->
    <p class="text-gray-600 text-lg mb-4">
      {{ description }}
    </p>

    <!-- Checklist -->
    <ul class="space-y-2">
      <li v-for="(point, i) in points" :key="i" class="flex items-start text-lg text-gray-700">
        <AppIcon name="check" class="text-green-600 mr-2" />
        <span>{{ point }}</span>
      </li>
    </ul>
  </div>
</template>
