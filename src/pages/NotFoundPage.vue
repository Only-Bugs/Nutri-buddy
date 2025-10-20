<script setup>
import BaseLayout from '@/components/static/BaseLayout.vue'
</script>

<template>
  <BaseLayout>
    <section class="flex flex-1 items-center justify-center px-6 py-24">
      <div class="max-w-md text-center">
        <p class="text-sm font-semibold uppercase tracking-wide text-green-600">404</p>
        <h1 class="mt-4 text-3xl font-bold text-gray-900">Looks like you tracked the wrong meal.</h1>
        <p class="mt-3 text-base text-gray-600">
          The page you’re after has gone missing. Head back home and keep the streak alive.
        </p>
        <router-link
          to="/"
          class="mt-6 inline-flex items-center justify-center rounded-lg border border-green-600 px-5 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-50"
        >
          Return home
        </router-link>
      </div>
    </section>
  </BaseLayout>
</template>
