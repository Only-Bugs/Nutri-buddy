<template>
  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-900">
    <!-- Header -->
    <header class="bg-blue-600 text-white px-4 py-3 shadow flex items-center justify-between">
      <h1 class="text-lg sm:text-xl md:text-2xl font-bold">NutriBuddy</h1>
      <nav class="hidden md:flex space-x-4">
        <router-link to="/login" class="hover:underline text-sm md:text-base"> Login </router-link>
        <router-link to="/register" class="hover:underline text-sm md:text-base">
          Register
        </router-link>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="flex-1 flex items-center justify-center w-full px-4">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white text-center px-4 py-3 text-xs sm:text-sm md:text-base">
      <p>&copy; 2025 NutriBuddy – All Rights Reserved</p>
    </footer>
  </div>
</template>
