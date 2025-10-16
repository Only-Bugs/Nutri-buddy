<script setup>
</script>

<template>
  <aside class="w-64 bg-white border-r min-h-screen p-4 space-y-4">
    <!-- Brand -->
    <h1 class="text-xl font-bold text-green-600">NutriBuddy</h1>

    <!-- Navigation Links -->
    <nav class="space-y-1">
      <p class="px-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Overview</p>
      <RouterLink
        to="/app/dashboard"
        class="block rounded px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
        active-class="bg-green-50 text-green-600 font-semibold"
      >
        Dashboard
      </RouterLink>

      <RouterLink
        to="/app/meal-plans"
        class="block rounded px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
        active-class="bg-green-50 text-green-600 font-semibold"
      >
        Meal Plans
      </RouterLink>

      <p class="mt-4 px-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Discover</p>
      <RouterLink
        to="/app/recipes"
        class="block rounded px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
        active-class="bg-green-50 text-green-600 font-semibold"
      >
        Recipes
      </RouterLink>
    </nav>
  </aside>
</template>
