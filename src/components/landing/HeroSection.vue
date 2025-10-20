<script setup>
import { useRouter } from 'vue-router'
import AppIcon from '@/components/common/AppIcon.vue'

const router = useRouter()

function goToDashboard() {
  router.push('/auth')
}

function scrollToFeatures() {
  const el = document.getElementById('features')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <section class="bg-gray-50 px-6 py-12 md:py-20 grid md:grid-cols-2 gap-10 items-center">
    <!-- Text -->
    <div class="max-w-xl">
      <p class="text-sm font-semibold tracking-wide text-green-600 uppercase">NutriBuddy</p>
      <h2 class="mt-3 text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">
        Smarter nutrition starts with one search.
      </h2>
      <p class="mt-5 text-lg text-gray-700">
        NutriBuddy makes meal tracking feel effortless with live nutrition search, adaptive meal
        planning, and insights that keep progress visible.
      </p>

      <div class="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
        <!-- Primary CTA -->
        <button
          @click="goToDashboard"
          class="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Try the Dashboard
        </button>

        <!-- Secondary CTA -->
        <button
          @click="scrollToFeatures"
          class="border border-green-600 text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition"
        >
          See How It Works
        </button>
      </div>

      <ul class="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <li
          v-for="highlight in [
            'Live nutrition search',
            'Meal planning that adapts',
            'History and favorites',
            'Sync across devices',
          ]"
          :key="highlight"
          class="flex items-start gap-3 rounded-lg bg-white/70 px-4 py-3 shadow-sm"
        >
          <span class="mt-1 text-green-600">
            <AppIcon name="check" />
          </span>
          <span class="text-base font-medium text-gray-800">{{ highlight }}</span>
        </li>
      </ul>
    </div>

    <!-- Hero image -->
    <div class="relative">
      <img
        src="../../assets/tracking.webp"
        alt="Preview of NutriBuddy nutrition dashboard"
        class="w-full rounded-2xl shadow-lg ring-1 ring-black/5"
      />
      <span
        class="absolute top-4 right-4 bg-white text-green-600 px-3 py-1 text-sm font-semibold rounded-full shadow"
      >
        Live insights, zero clutter
      </span>
    </div>
  </section>
</template>
