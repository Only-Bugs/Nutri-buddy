<script setup></script>

<template>
  <aside class="w-64 bg-white border-r min-h-screen p-6 space-y-6">
    <!-- Brand -->
    <h1 class="text-2xl font-bold text-green-600 flex items-center gap-2">
      <FontAwesomeIcon icon="house" class="text-green-500" />
      NutriBuddy
    </h1>

    <!-- Navigation Links -->
    <nav class="space-y-5">
      <div class="space-y-2">
        <p class="px-3 text-lg font-semibold uppercase tracking-wide text-gray-400">Overview</p>
        <RouterLink
          to="/app/dashboard"
          class="flex items-center gap-3 rounded-xl px-3 py-3 text-lg font-medium text-gray-600 transition hover:bg-green-50 hover:text-green-600"
          active-class="bg-green-100 text-green-700 font-semibold"
        >
          <FontAwesomeIcon icon="gauge" class="text-green-500" />
          Dashboard
        </RouterLink>

        <RouterLink
          to="/app/meal-plans"
          class="flex items-center gap-3 rounded-xl px-3 py-3 text-lg font-medium text-gray-600 transition hover:bg-green-50 hover:text-green-600"
          active-class="bg-green-100 text-green-700 font-semibold"
        >
          <FontAwesomeIcon icon="clipboard-list" class="text-green-500" />
          Meal Plans
        </RouterLink>

        <RouterLink
          to="/app/history"
          class="flex items-center gap-3 rounded-xl px-3 py-3 text-lg font-medium text-gray-600 transition hover:bg-green-50 hover:text-green-600"
          active-class="bg-green-100 text-green-700 font-semibold"
        >
          <FontAwesomeIcon icon="clock-rotate-left" class="text-green-500" />
          History
        </RouterLink>
      </div>

      <div class="space-y-2">
        <p class="px-3 text-lg font-semibold uppercase tracking-wide text-gray-400">Discover</p>
        <RouterLink
          to="/app/recipes"
          class="flex items-center gap-3 rounded-xl px-3 py-3 text-lg font-medium text-gray-600 transition hover:bg-green-50 hover:text-green-600"
          active-class="bg-green-100 text-green-700 font-semibold"
        >
          <FontAwesomeIcon icon="book-open" class="text-green-500" />
          Recipes
        </RouterLink>
      </div>
    </nav>
  </aside>
</template>
