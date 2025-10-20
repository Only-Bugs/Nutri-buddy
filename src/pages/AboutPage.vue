<script setup>
import BaseLayout from '@/components/static/BaseLayout.vue'
import PageHeader from '@/components/static/PageHeader.vue'
import TeamGrid from '@/components/static/TeamGrid.vue'
import Timeline from '@/components/static/Timeline.vue'
import ValueCard from '@/components/static/ValueCard.vue'
import RoadmapCard from '@/components/static/RoadmapCard.vue'

const teamQuotes = [
  {
    name: 'Maya · Product',
    quote: 'We built NutriBuddy because logging food should feel like a friend cheering you on, not a chore.',
  },
  {
    name: 'Leo · Engineering',
    quote: 'Reliable data unlocks confident choices. We obsess over the backend so you can stay focused on meals.',
  },
]

const members = [
  {
    name: 'Maya Chen',
    role: 'Product Lead',
    story: 'Keeps the journey human, weaving nutrition coaching into every screen.',
  },
  {
    name: 'Leo Torres',
    role: 'Engineering Lead',
    story: 'Builds the realtime engine powering search, sync, and calm performance.',
  },
  {
    name: 'Alana Singh',
    role: 'Nutrition Research',
    story: 'Translates science into everyday wins with meal plans you can trust.',
  },
]

const milestones = [
  {
    title: 'Idea',
    copy: 'We sketched the first flows in a campus library after comparing food journals.',
  },
  {
    title: 'Beta',
    copy: 'Early testers validated the live search and asked for smarter planning tools.',
  },
  {
    title: 'Today',
    copy: 'NutriBuddy keeps growing with community feedback and thoughtful iteration.',
  },
]

const values = [
  {
    icon: 'shield',
    title: 'Transparency',
    copy: 'We show how numbers move, not just totals. You see the full story.',
  },
  {
    icon: 'privacy',
    title: 'Data privacy',
    copy: 'Your data stays yours—encrypted, exportable, and handled with care.',
  },
  {
    icon: 'sustain',
    title: 'Sustainability',
    copy: 'We design for habits that last, not quick fixes you abandon.',
  },
]
</script>

<template>
  <BaseLayout>
    <section class="bg-gray-50 py-16">
      <PageHeader
        eyebrow="About"
        title="NutriBuddy is built by students who care about the long game"
        subtitle="We mix nutrition science with thoughtful engineering so tracking becomes something you enjoy."
      />
    </section>

    <section class="mx-auto max-w-5xl px-6 py-12">
      <h2 class="text-2xl font-semibold text-gray-900">Why we built this</h2>
      <div class="mt-6 grid gap-6 md:grid-cols-2">
        <article
          v-for="voice in teamQuotes"
          :key="voice.name"
          class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <p class="text-base text-gray-700">“{{ voice.quote }}”</p>
          <p class="mt-4 text-sm font-semibold text-green-600">{{ voice.name }}</p>
        </article>
      </div>
    </section>

    <section>
      <TeamGrid :members="members" />
    </section>

    <section class="bg-gray-50">
      <Timeline :events="milestones" />
    </section>

    <section class="mx-auto max-w-6xl px-6 py-12">
      <h2 class="text-2xl font-semibold text-gray-900">Values we will not trade</h2>
      <div class="mt-6 grid gap-6 md:grid-cols-3">
        <ValueCard
          v-for="value in values"
          :key="value.title"
          :icon="value.icon"
          :title="value.title"
          :copy="value.copy"
        />
      </div>
    </section>

    <RoadmapCard />
  </BaseLayout>
</template>
