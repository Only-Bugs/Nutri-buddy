<script setup>
import { useRouter } from 'vue-router'
// import StatsCard from './StatsCard.vue'

const router = useRouter()

function goToAuth() {
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
  <section class="bg-gray-50 px-6 py-12 md:py-20 grid md:grid-cols-2 gap-8 items-center">
    <!-- Text -->
    <div>
      <h2 class="text-4xl md:text-5xl font-extrabold leading-tight">
        Track Your Way to <span class="text-green-600">Healthier</span> Eating
      </h2>
      <p class="mt-4 text-gray-700 text-lg">
        Transform your nutrition journey with NutriBuddy. Get personalized meal plans, track your
        progress, and achieve your health goals.
      </p>

      <div class="mt-6 flex space-x-4">
        <!-- Primary CTA -->
        <button
          @click="goToAuth"
          class="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition"
        >
          Start Your Journey
        </button>

        <!-- Secondary CTA -->
        <button
          @click="scrollToFeatures"
          class="border border-green-600 text-green-600 px-6 py-3 rounded-lg font-medium hover:bg-green-50 transition"
        >
          Watch Demo
        </button>
      </div>

      <div class="mt-10 flex space-x-8">
        <!-- <StatsCard value="50K+" label="Active Users" />
        <StatsCard value="4.9★" label="App Rating" />
        <StatsCard value="1M+" label="Meals Tracked" /> -->
      </div>
    </div>

    <!-- Hero image -->
    <div class="relative">
      <img
        src="../../assets/tracking.webp"
        alt="NutriBuddy preview"
        class="w-full rounded-lg shadow"
      />
      <span class="absolute top-4 right-4 bg-white text-green-600 px-3 py-1 text-sm rounded shadow">
        ● Live Tracking
      </span>
    </div>
  </section>
</template>
