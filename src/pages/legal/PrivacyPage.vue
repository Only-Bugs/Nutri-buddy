<script setup>
import BaseLayout from '@/components/static/BaseLayout.vue'
import PageHeader from '@/components/static/PageHeader.vue'

const principles = [
  'We only store data needed to deliver your nutrition insights.',
  'You can export or delete your account anytime from settings.',
  'We never sell personal data or share it without explicit consent.',
]
</script>

<template>
  <BaseLayout>
    <section class="bg-gray-50 py-16">
      <PageHeader
        eyebrow="Privacy"
        title="Privacy that respects your plate"
        subtitle="This beta policy keeps it clear while we finalise the full legal copy."
      />
    </section>

    <section class="mx-auto max-w-4xl px-6 py-12">
      <h2 class="text-xl font-semibold text-gray-900">What we collect</h2>
      <p class="mt-4 text-lg text-gray-600">
        NutriBuddy stores account details, saved foods, and meal plans. We track usage analytics to
        keep core experiences sharp. We do not collect unnecessary personal identifiers.
      </p>

      <h2 class="mt-8 text-xl font-semibold text-gray-900">How we protect it</h2>
      <ul class="mt-4 list-disc space-y-2 pl-6 text-lg text-gray-600">
        <li v-for="item in principles" :key="item">{{ item }}</li>
      </ul>

      <p class="mt-8 text-lg text-gray-600">
        Questions? Reach us at
        <a href="mailto:hello@nutribuddy.app" class="text-green-700 hover:underline"
          >hello@nutribuddy.app</a
        >.
      </p>
    </section>
  </BaseLayout>
</template>
