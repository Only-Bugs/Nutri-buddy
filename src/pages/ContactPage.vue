<script setup>
import BaseLayout from '@/components/static/BaseLayout.vue'
import PageHeader from '@/components/static/PageHeader.vue'
import ContactForm from '@/components/static/ContactForm.vue'
import FaqAccordion from '@/components/static/FaqAccordion.vue'
import SocialStrip from '@/components/static/SocialStrip.vue'

const faqItems = [
  {
    question: 'Is NutriBuddy free?',
    answer:
      'Yes. The beta is free while we gather feedback. Paid plans will arrive later with notice.',
  },
  {
    question: 'Can I export my data?',
    answer: 'Absolutely. Export meals and history anytime as CSV from the dashboard settings.',
  },
  {
    question: 'Will there be a mobile app?',
    answer: 'A companion app is in progress. Until launch, the web experience is fully responsive.',
  },
]

const socials = [
  {
    icon: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/nutribuddy-app',
    external: true,
  },
  {
    icon: 'github',
    label: 'GitHub',
    href: 'https://github.com/nutribuddy-app',
    external: true,
  },
  {
    icon: 'email',
    label: 'hello@nutribuddy.app',
    href: 'mailto:hello@nutribuddy.app',
    external: false,
  },
]
</script>

<template>
  <BaseLayout>
    <section class="bg-gray-50 py-16">
      <PageHeader
        eyebrow="Contact"
        title="Reach the NutriBuddy team"
        subtitle="Questions, feedback, or partnership ideas—we reply quickly and welcome collaboration."
      />
    </section>

    <section class="mx-auto max-w-5xl px-6 py-12">
      <div class="grid gap-8 lg:grid-cols-2">
        <ContactForm />
        <FaqAccordion :items="faqItems" />
      </div>
    </section>

    <SocialStrip :links="socials" />

    <section class="bg-white">
      <div class="mx-auto flex max-w-4xl flex-col items-center gap-4 px-6 py-12 text-center">
        <p class="text-lg font-semibold text-gray-900">Prefer to explore first?</p>
        <router-link
          to="/"
          class="rounded-lg border border-green-600 px-5 py-3 text-lg font-semibold text-green-700 transition hover:bg-green-50"
        >
          Try the Dashboard →
        </router-link>
      </div>
    </section>
  </BaseLayout>
</template>
