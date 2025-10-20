<script setup>
const highlights = [
  {
    title: 'Mission',
    copy: 'Awareness, not noise. We build tools that make healthy eating visible, achievable, and kind to your schedule.',
  },
  {
    title: 'Origin Story',
    copy: 'NutriBuddy started as a student side project where nutrition science met modern app design. We kept the late-night testing, but dropped the lab coats.',
  },
  {
    title: 'Vision',
    copy: 'Progress, not perfection. We want meal tracking to feel like encouragement: adaptive plans, gentle reminders, and insights you actually use.',
  },
]
</script>

<template>
  <section id="about" class="bg-gray-50 px-6 py-16">
    <div class="max-w-3xl mx-auto text-center">
      <p class="text-sm font-semibold uppercase tracking-wide text-green-600">About</p>
      <h2 class="mt-2 text-3xl md:text-4xl font-bold text-gray-900">Made by people who care</h2>
      <p class="mt-4 text-lg text-gray-700">
        We are a small team of students blending nutrition science and modern tech to make meal
        tracking feel human. No corporate polish—just honest tools that grow with you.
      </p>
    </div>

    <div class="mt-12 grid gap-6 md:grid-cols-3">
      <article
        v-for="item in highlights"
        :key="item.title"
        class="rounded-xl bg-white p-6 shadow-sm ring-1 ring-green-100"
      >
        <h3 class="text-lg font-semibold text-gray-900">{{ item.title }}</h3>
        <p class="mt-3 text-base text-gray-700 leading-relaxed">{{ item.copy }}</p>
      </article>
    </div>

    <div class="mt-10 max-w-2xl mx-auto text-center text-gray-600 text-base">
      We obsess over the details so you can focus on small wins—one search, one plan, one insight at
      a time.
    </div>
  </section>
</template>
