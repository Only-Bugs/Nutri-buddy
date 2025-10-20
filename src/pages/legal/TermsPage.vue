<script setup>
import BaseLayout from '@/components/static/BaseLayout.vue'
import PageHeader from '@/components/static/PageHeader.vue'

const commitments = [
  'Use NutriBuddy responsibly and follow local nutrition guidance.',
  'Do not misuse the service or attempt to access other users’ data.',
  'Accept that this beta may change quickly as we iterate.',
]
</script>

<template>
  <BaseLayout>
    <section class="bg-gray-50 py-16">
      <PageHeader
        eyebrow="Terms"
        title="NutriBuddy beta terms of use"
        subtitle="Plain-language expectations while the formal legal version is prepared."
      />
    </section>

    <section class="mx-auto max-w-4xl px-6 py-12">
      <h2 class="text-xl font-semibold text-gray-900">Using NutriBuddy</h2>
      <p class="mt-4 text-sm text-gray-600">
        NutriBuddy helps you track meals and insights. It is not medical advice. Always consult
        qualified professionals for personalised guidance.
      </p>

      <h2 class="mt-8 text-xl font-semibold text-gray-900">Your commitments</h2>
      <ul class="mt-4 list-disc space-y-2 pl-6 text-sm text-gray-600">
        <li v-for="item in commitments" :key="item">{{ item }}</li>
      </ul>

      <p class="mt-8 text-sm text-gray-600">
        Contact us at
        <a href="mailto:hello@nutribuddy.app" class="text-green-700 hover:underline"
          >hello@nutribuddy.app</a
        >
        if you have questions about these terms.
      </p>
    </section>
  </BaseLayout>
</template>
