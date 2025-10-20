<script setup>
import BaseLayout from '@/components/static/BaseLayout.vue'
import PageHeader from '@/components/static/PageHeader.vue'
import FeatureSection from '@/components/static/FeatureSection.vue'
import TechStrip from '@/components/static/TechStrip.vue'

const sections = [
  {
    theme: 'Track Smarter',
    scenario: 'Dashboard & Tracking — built for people who want answers right away.',
    features: [
      {
        title: 'Dashboard & Tracking — live nutrition that updates as you do.',
        copy: 'Search thousands of foods, log them in a click, and watch charts respond instantly.',
        icon: 'dashboard',
        action: 'View the dashboard.',
      },
      {
        title: 'History & Settings — yesterday’s wins always within reach.',
        copy: 'Scroll your meal history, edit goals, and keep favorites pinned for quick reuse.',
        icon: 'history',
        action: 'Open your history.',
      },
    ],
  },
  {
    theme: 'Plan Confidently',
    scenario: 'Meal Planning & Recipes — designed for people who remix their week on the fly.',
    features: [
      {
        title: 'Meal Planning & Recipes — drag, drop, swap, repeat.',
        copy: 'Clone weeks, adjust servings, and save go-to meals without breaking your flow.',
        icon: 'planning',
        action: 'Map your meals.',
      },
      {
        title: 'Favorites & Collections — keep inspiration close.',
        copy: 'Star recipes, create collections, and pull them into plans whenever motivation hits.',
        icon: 'star',
        action: 'Curate favorites.',
      },
    ],
  },
  {
    theme: 'Stay Connected',
    scenario: 'Authentication & Access — built for people who hate forgotten passwords.',
    features: [
      {
        title: 'Authentication & Access — secure logins without friction.',
        copy: 'Sign in with Google or email, stay synced across devices, and pick up where you left off.',
        icon: 'access',
        action: 'Sign in easily.',
      },
      {
        title: 'Platform Reliability — cloud-first, always-on.',
        copy: 'Firebase handles auth, AWS keeps data fast, and you get peace of mind.',
        icon: 'reliability',
        action: 'Trust the uptime.',
      },
    ],
  },
]

const techStack = ['Firebase', 'AWS', 'Vue', 'Tailwind']
</script>

<template>
  <BaseLayout>
    <section class="bg-gray-50 py-16">
      <PageHeader
        eyebrow="Features"
        title="See what NutriBuddy actually does"
        subtitle="From search to planning to insight—every feature keeps nutrition tracking friendly."
      />
    </section>

    <section>
      <FeatureSection
        v-for="section in sections"
        :key="section.theme"
        :theme="section.theme"
        :scenario="section.scenario"
        :features="section.features"
      />
    </section>

    <TechStrip
      :items="techStack"
      caption="Powered by trusted, scalable tech — so your data stays safe and fast."
    />
  </BaseLayout>
</template>
