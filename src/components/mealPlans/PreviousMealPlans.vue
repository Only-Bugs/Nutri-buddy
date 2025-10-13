<script setup>
const props = defineProps({
  plans: Array,
})
</script>

<template>
  <div class="bg-white shadow-sm rounded-xl p-6">
    <h3 class="text-lg font-semibold mb-4">Previous Meal Plans</h3>
    <ul class="space-y-2">
      <li
        v-for="plan in plans"
        :key="plan.title"
        class="flex justify-between items-center bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg cursor-pointer"
      >
        <div>
          <p class="font-medium">{{ plan.title }}</p>
          <p class="text-base text-gray-500">{{ plan.date }}</p>
        </div>
        <span class="text-gray-400">→</span>
      </li>
    </ul>
    <button class="text-green-600 text-lg font-medium mt-3 hover:underline">
      View All History
    </button>
  </div>
</template>
