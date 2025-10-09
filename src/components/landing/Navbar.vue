<script setup>
/**
 * Navbar.vue
 *
 * Common top navigation with brand, links, and auth buttons.
 */
</script>

<template>
  <header class="bg-white shadow px-6 py-4 flex items-center justify-between">
    <!-- Brand -->
    <h1 class="text-xl font-bold text-green-600">NutriBuddy</h1>

    <!-- Nav links -->
    <nav class="hidden md:flex space-x-6 text-gray-700">
      <router-link to="/" class="hover:text-green-600">Home</router-link>
      <a href="#features" class="hover:text-green-600">Features</a>
      <a href="#about" class="hover:text-green-600">About</a>
      <a href="#contact" class="hover:text-green-600">Contact</a>
    </nav>

    <!-- Auth buttons -->
    <div class="space-x-2">
      <router-link to="/auth" class="px-4 py-2 text-gray-700 hover:text-green-600">Login</router-link>
      <router-link
        to="/auth"
        class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Register
      </router-link>
    </div>
  </header>
</template>
