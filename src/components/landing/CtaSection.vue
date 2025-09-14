<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goToAuth() {
  router.push('/auth')
}

function scrollToAbout() {
  const el = document.getElementById('about')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <section class="bg-green-600 text-white py-16 px-6 text-center">
    <div class="max-w-2xl mx-auto">
      <!-- Heading -->
      <h2 class="text-3xl font-bold mb-4">Ready to Transform Your Nutrition?</h2>

      <!-- Subtext -->
      <p class="text-lg text-green-50 mb-8">
        Join thousands of users who have already improved their health with NutriBuddy. Get started
        today and experience the difference.
      </p>

      <!-- Buttons -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
        <!-- Primary CTA -->
        <button
          @click="goToAuth"
          class="bg-white text-green-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-green-50 transition flex items-center gap-2"
        >
          Get Started
          <span aria-hidden="true">→</span>
        </button>

        <!-- Secondary CTA -->
        <button
          @click="scrollToAbout"
          class="border border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-700 transition"
        >
          Learn More
        </button>
      </div>

      <!-- Footnote -->
      <p class="text-sm text-green-100">
        No credit card required • 14-day free trial • Cancel anytime
      </p>
    </div>
  </section>
</template>
