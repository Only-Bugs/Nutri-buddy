<template>
  <footer class="border-t border-gray-100 bg-gray-900 text-gray-100">
    <div
      class="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-sm md:flex-row md:items-center md:justify-between"
    >
      <div>
        <p class="font-semibold text-green-200">NutriBuddy</p>
      </div>
      <div class="flex flex-wrap items-center gap-4 text-gray-300">
        <router-link to="/privacy" class="hover:text-white">Privacy</router-link>
        <span class="hidden h-2 w-0.5 bg-gray-700 md:block" aria-hidden="true"></span>
        <router-link to="/terms" class="hover:text-white">Terms</router-link>
        <span class="hidden h-2 w-0.5 bg-gray-700 md:block" aria-hidden="true"></span>
        <a
          href="https://github.com/Only-Bugs/Nutri-buddy"
          target="_blank"
          rel="noopener"
          class="hover:text-white"
        >
          GitHub
        </a>
      </div>
      <p class="text-gray-400 md:text-right">See features. Try it. Share what works.</p>
    </div>
  </footer>
</template>
