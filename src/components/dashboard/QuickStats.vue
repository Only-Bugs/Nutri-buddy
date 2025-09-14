<script setup>
const props = defineProps({
  foodsRated: Number,
  avgRating: Number,
  favoriteCategory: String
})
</script>

<template>
  <div class="bg-white shadow rounded-lg p-4">
    <h3 class="text-lg font-semibold mb-4">Quick Stats</h3>
    <ul class="space-y-2 text-sm">
      <li><strong>Foods Rated:</strong> {{ foodsRated }}</li>
      <li><strong>Avg Rating Given:</strong> {{ avgRating }}</li>
      <li><strong>Favorite Category:</strong> {{ favoriteCategory }}</li>
    </ul>
  </div>
</template>
