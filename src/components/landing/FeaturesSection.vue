<script setup>
import FeatureCard from './FeatureCard.vue'

const features = [
  {
    icon: 'access',
    title: 'Authentication & Access',
    description:
      'Smooth sign-up flows, Google OAuth, and secure storage ensure you can get in fast and stay protected.',
    points: ['Google and email login', 'Session-aware navigation', 'Privacy by default'],
  },
  {
    icon: 'dashboard',
    title: 'Dashboard & Tracking',
    description:
      'Live nutrition search, quick logging, and friendly charts make it easy to keep tabs on your day.',
    points: ['Search thousands of foods', 'One-tap add to plans', 'Progress charts at a glance'],
  },
  {
    icon: 'planning',
    title: 'Meal Planning & Recipes',
    description:
      'Create, clone, and manage meal plans with smart recommendations and recipe inspiration.',
    points: ['Drag-and-drop planning', 'Personalized recipe library', 'Instant grocery drafting'],
  },
  {
    icon: 'history',
    title: 'History & Settings',
    description:
      'Recall past meals, tune calorie goals, and keep favorites close without losing your rhythm.',
    points: ['Meal history timeline', 'Flexible goal controls', 'Favorites one tap away'],
  },
  {
    icon: 'reliability',
    title: 'Platform Reliability',
    description:
      'Powered by Firebase authentication and AWS-backed data services for a stable, modular experience.',
    points: ['Realtime sync across devices', 'Resilient cloud infrastructure', 'Modular, future-ready'],
  },
]
</script>

<template>
  <section id="features" class="px-6 py-16 bg-white">
    <div class="text-center max-w-3xl mx-auto mb-12">
      <p class="text-sm font-semibold uppercase tracking-wide text-green-600">Features</p>
      <h2 class="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
        Everything you need to understand what NutriBuddy can do.
      </h2>
      <p class="mt-4 text-lg text-gray-600">
        Explore the core tools inside the dashboard and see how they connect to build confident,
        sustainable habits.
      </p>
    </div>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <FeatureCard
        v-for="(feature, i) in features"
        :key="feature.title"
        :icon="feature.icon"
        :title="feature.title"
        :description="feature.description"
        :points="feature.points"
      />
    </div>
  </section>
</template>
