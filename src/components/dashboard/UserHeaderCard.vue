<script setup>
const props = defineProps({
  name: { type: String, default: 'User' },
  email: { type: String, default: 'email@email.com' },
  goal: { type: String, default: '0 Kcal' },
})
</script>

<template>
  <div class="bg-white shadow-sm rounded-xl p-6 flex items-center justify-between">
    <div class="flex items-center gap-4">
      <img src="https://i.pravatar.cc/80" alt="User avatar" class="w-14 h-14 rounded-full border" />
      <div>
        <h2 class="text-xl font-semibold text-gray-900">Welcome back, {{ name }}!</h2>
        <p class="text-gray-500 text-sm">{{ email }}</p>
      </div>
    </div>

    <div class="text-right">
      <p class="text-sm text-gray-500">Today's Goal</p>
      <p class="text-2xl font-bold text-green-600">{{ goal }}</p>
    </div>
  </div>
</template>
<!--   -->
