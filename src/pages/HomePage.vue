<script setup>
import BaseLayout from '@/components/static/BaseLayout.vue'
import IconStep from '@/components/static/IconStep.vue'
import FeatureCard from '@/components/static/FeatureCard.vue'
import TestimonialQuote from '@/components/static/TestimonialQuote.vue'

const steps = [
  {
    icon: 'search',
    title: 'Search any food',
    copy: 'Type it, scan it, or paste it. NutriBuddy finds the facts without the guesswork.',
  },
  {
    icon: 'plan',
    title: 'Add to your plan',
    copy: 'Drop foods straight into today’s plan or save them for later in one tap.',
  },
  {
    icon: 'track',
    title: 'Track progress',
    copy: 'See calories, macros, and trends that show where you are winning.',
  },
]

const highlights = [
  {
    icon: 'search',
    title: 'Live nutrition search',
    copy: 'Search thousands of foods and compare them instantly with sensible defaults.',
    action: 'Try it today.',
  },
  {
    icon: 'planning',
    title: 'Meal planning that adapts',
    copy: 'Clone weeks, swap meals, and keep favorites close while plans stay flexible.',
    action: 'Build your first plan.',
  },
  {
    icon: 'insight',
    title: 'History and favorites',
    copy: 'Spot patterns in seconds. Favorite meals resurface right when you need them.',
    action: 'See your trends.',
  },
]
</script>

<template>
  <BaseLayout>
    <section class="bg-gray-50">
      <div class="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 md:flex-row md:items-center">
        <div class="flex-1">
          <p class="text-xs font-semibold uppercase tracking-[0.3em] text-green-600">NutriBuddy</p>
          <h1 class="mt-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Smarter nutrition starts with one search.
          </h1>
          <p class="mt-5 text-lg text-gray-700">
            Understand how every meal supports your goals. NutriBuddy keeps the data tidy so you can
            focus on choices.
          </p>
          <div class="mt-8 flex flex-wrap items-center gap-4">
            <router-link
              to="/auth"
              class="rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              Try the Dashboard
            </router-link>
            <router-link
              to="/features"
              class="rounded-lg border border-green-600 px-5 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-50"
            >
              See how it works
            </router-link>
          </div>
        </div>
        <div class="flex-1">
          <div class="relative rounded-3xl border border-green-100 bg-white p-6 shadow-lg">
            <img
              src="@/assets/tracking.webp"
              alt="NutriBuddy dashboard preview"
              class="w-full rounded-2xl"
            />
            <p class="mt-4 text-sm text-gray-600">
              Meal planning, macro tracking, and gentle nudges—all in one calm dashboard.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-white">
      <div class="mx-auto max-w-5xl px-6 py-12">
        <div class="rounded-3xl border border-green-100 bg-green-50 p-8 shadow-sm">
          <p class="text-base font-semibold text-gray-800">
            You search “100g chicken breast.” NutriBuddy shows calories, macros, and how it fits your
            goal — instantly.
          </p>
          <TestimonialQuote
            class="mt-6"
            quote="I finally stopped guessing what I eat — NutriBuddy makes it obvious."
          />
        </div>
      </div>
    </section>

    <section class="bg-gray-50">
      <div class="mx-auto max-w-6xl px-6 py-16">
        <h2 class="text-center text-3xl font-bold text-gray-900 md:text-4xl">How it works</h2>
        <p class="mt-3 text-center text-base text-gray-600">
          Three quick steps get you from search to insight.
        </p>
        <div class="mt-10 grid gap-6 md:grid-cols-3">
          <IconStep
            v-for="step in steps"
            :key="step.title"
            :icon="step.icon"
            :title="step.title"
            :copy="step.copy"
          />
        </div>
      </div>
    </section>

    <section class="bg-white">
      <div class="mx-auto max-w-6xl px-6 py-16">
        <h2 class="text-3xl font-bold text-gray-900 md:text-4xl">Highlights you will feel</h2>
        <p class="mt-3 text-base text-gray-600">
          Discover the small touches that keep nutrition tracking friendly.
        </p>
        <div class="mt-10 grid gap-6 md:grid-cols-3">
          <FeatureCard
            v-for="highlight in highlights"
            :key="highlight.title"
            :icon="highlight.icon"
            :title="highlight.title"
            :copy="highlight.copy"
            :action="highlight.action"
          />
        </div>
      </div>
    </section>

    <section class="bg-green-600">
      <div class="mx-auto flex max-w-4xl flex-col items-center gap-4 px-6 py-14 text-center text-white">
        <h2 class="text-3xl font-semibold md:text-4xl">Join 500+ beta users</h2>
        <p class="text-base text-green-50">
          Create a free account and see your own data come to life in minutes.
        </p>
        <router-link
          to="/auth"
          class="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-100"
        >
          Get started
        </router-link>
      </div>
    </section>
  </BaseLayout>
</template>
