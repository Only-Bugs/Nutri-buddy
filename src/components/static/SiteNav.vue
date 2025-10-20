<script setup>
import { ref } from 'vue'

const isOpen = ref(false)

function toggleMenu() {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <header class="border-b border-gray-100 bg-white">
    <nav class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
      <router-link to="/" class="text-xl font-semibold text-green-600"> NutriBuddy </router-link>

      <button
        class="block rounded-md border border-gray-200 p-2 text-gray-600 md:hidden"
        type="button"
        @click="toggleMenu"
        aria-label="Toggle navigation"
      >
        <span class="sr-only">Toggle menu</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24">
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M4 7h16M4 12h16M4 17h16"
          />
        </svg>
      </button>

      <div class="hidden items-center gap-8 text-lg font-medium text-gray-700 md:flex">
        <router-link to="/" class="hover:text-green-600">Home</router-link>
        <router-link to="/features" class="hover:text-green-600">Features</router-link>
        <router-link to="/about" class="hover:text-green-600">About</router-link>
        <router-link to="/contact" class="hover:text-green-600">Contact</router-link>
      </div>

      <div class="hidden gap-3 md:flex">
        <router-link
          to="/auth"
          class="rounded-lg border border-green-600 px-4 py-2 text-lg font-semibold text-green-600 transition hover:bg-green-50"
        >
          Try the Dashboard
        </router-link>
      </div>
    </nav>

    <div v-if="isOpen" class="border-t border-gray-100 bg-white md:hidden">
      <div class="flex flex-col gap-2 px-6 py-4 text-lg font-medium text-gray-700">
        <router-link to="/" class="hover:text-green-600" @click="isOpen = false">Home</router-link>
        <router-link to="/features" class="hover:text-green-600" @click="isOpen = false">
          Features
        </router-link>
        <router-link to="/about" class="hover:text-green-600" @click="isOpen = false">
          About
        </router-link>
        <router-link to="/contact" class="hover:text-green-600" @click="isOpen = false">
          Contact
        </router-link>
        <router-link
          to="/auth"
          class="rounded-lg border border-green-600 px-4 py-2 text-lg font-semibold text-green-600 transition hover:bg-green-50"
          @click="isOpen = false"
        >
          Try the Dashboard
        </router-link>
      </div>
    </div>
  </header>
</template>
