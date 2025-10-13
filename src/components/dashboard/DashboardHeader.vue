<script setup>
const props = defineProps({
  userEmail: { type: String, default: '' },
})
</script>

<template>
  <div class="text-center">
    <h2 class="text-3xl font-bold">Welcome to NutriBuddy</h2>
    <p class="mt-2">
      Logged in as: <strong>{{ userEmail }}</strong>
    </p>
  </div>
</template>
