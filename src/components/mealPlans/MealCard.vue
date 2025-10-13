<script setup>
const props = defineProps({
  icon: String,
  title: String,
  description: String,
  calories: Number,
  protein: Number,
  carbs: Number,
  fats: Number,
  time: String,
})
</script>

<template>
  <div class="flex items-center justify-between bg-white rounded-xl shadow-sm p-4">
    <div class="flex items-center gap-3">
      <div class="text-2xl">{{ icon }}</div>
      <div>
        <h3 class="font-semibold">{{ title }}</h3>
        <p class="text-lg text-gray-500">{{ description }}</p>
      </div>
    </div>
    <div class="flex gap-6 text-lg font-medium">
      <div class="text-gray-700">
        {{ calories }}<br /><span class="text-base text-gray-500">Calories</span>
      </div>
      <div class="text-blue-600">
        {{ protein }}g<br /><span class="text-base text-gray-500">Protein</span>
      </div>
      <div class="text-green-600">
        {{ carbs }}g<br /><span class="text-base text-gray-500">Carbs</span>
      </div>
      <div class="text-purple-600">
        {{ fats }}g<br /><span class="text-base text-gray-500">Fats</span>
      </div>
    </div>
    <div class="text-base text-gray-500">{{ time }}</div>
  </div>
</template>
