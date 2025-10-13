<script setup>
import MealCard from './MealCard.vue'

const props = defineProps({
  meals: Array,
})
</script>

<template>
  <div class="space-y-4">
    <h3 class="font-semibold text-lg mb-2">Today's Meals</h3>
    <MealCard v-for="meal in meals" :key="meal.title" v-bind="meal" />
  </div>
</template>
