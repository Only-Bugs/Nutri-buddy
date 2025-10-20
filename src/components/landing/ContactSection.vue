<script setup>
import { reactive, ref } from 'vue'

const contactDetails = [
  {
    label: 'Email',
    value: 'hello@nutribuddy.app',
    href: 'mailto:hello@nutribuddy.app',
  },
  {
    label: 'Community',
    value: 'Coming soon — join our beta testers.',
    href: '#',
    disabled: true,
  },
  {
    label: 'GitHub',
    value: 'github.com/nutribuddy-app',
    href: 'https://github.com/nutribuddy-app',
  },
]

const form = reactive({
  name: '',
  email: '',
  message: '',
})

const submitted = ref(false)

function handleSubmit() {
  submitted.value = true
  form.name = ''
  form.email = ''
  form.message = ''
}
</script>

<template>
  <section id="contact" class="px-6 py-16 bg-white">
    <div class="max-w-4xl mx-auto">
      <div class="text-center">
        <p class="text-sm font-semibold uppercase tracking-wide text-green-600">Contact</p>
        <h2 class="mt-2 text-3xl md:text-4xl font-bold text-gray-900">We read every message</h2>
        <p class="mt-4 text-lg text-gray-600">
          Got questions, feedback, or a partnership idea? Reach out—NutriBuddy is built in the open,
          and we love collaborating with people chasing healthier habits.
        </p>
      </div>

      <div class="mt-12 grid gap-10 md:grid-cols-2">
        <div class="space-y-6">
          <div
            v-for="detail in contactDetails"
            :key="detail.label"
            class="rounded-xl border border-green-100 bg-gray-50 p-6"
          >
            <p class="text-sm font-semibold uppercase tracking-wide text-green-600">
              {{ detail.label }}
            </p>
            <p class="mt-2 text-lg text-gray-900 font-medium">
              <template v-if="detail.disabled">{{ detail.value }}</template>
              <a v-else :href="detail.href" class="hover:text-green-600">{{ detail.value }}</a>
            </p>
          </div>
        </div>

        <form
          class="rounded-xl border border-green-100 bg-white p-6 shadow-sm"
          @submit.prevent="handleSubmit"
        >
          <h3 class="text-xl font-semibold text-gray-900">Send us a note</h3>
          <p class="mt-2 text-sm text-gray-600">
            Tell us what you are working on or where we can help. We reply within a couple of days.
          </p>

          <label class="mt-6 block text-sm font-medium text-gray-700">
            Name
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="Jamie Rivera"
              class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
            />
          </label>

          <label class="mt-4 block text-sm font-medium text-gray-700">
            Email
            <input
              v-model="form.email"
              type="email"
              required
              placeholder="you@example.com"
              class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
            />
          </label>

          <label class="mt-4 block text-sm font-medium text-gray-700">
            Message
            <textarea
              v-model="form.message"
              required
              rows="4"
              placeholder="Share feedback, ideas, or collaboration notes…"
              class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
            />
          </label>

          <button
            type="submit"
            class="mt-6 w-full rounded-lg bg-green-600 px-4 py-3 text-center font-semibold text-white transition hover:bg-green-700"
          >
            Send message
          </button>

          <p v-if="submitted" class="mt-4 text-sm text-green-600">
            Thanks! We’ll be in touch soon.
          </p>
        </form>
      </div>
    </div>
  </section>
</template>
