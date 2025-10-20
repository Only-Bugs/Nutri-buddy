<script setup>
import { reactive, ref } from 'vue'

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
  <form
    class="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
    @submit.prevent="handleSubmit"
  >
    <div>
      <h3 class="text-xl font-semibold text-gray-900">Send a message</h3>
      <p class="text-sm text-gray-600">
        Share feedback, request access, or ask for help. We read every note.
      </p>
    </div>
    <label class="text-sm font-medium text-gray-700">
      Name
      <input
        v-model="form.name"
        type="text"
        required
        placeholder="Jamie Rivera"
        class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
      />
    </label>
    <label class="text-sm font-medium text-gray-700">
      Email
      <input
        v-model="form.email"
        type="email"
        required
        placeholder="you@example.com"
        class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
      />
    </label>
    <label class="text-sm font-medium text-gray-700">
      Message
      <textarea
        v-model="form.message"
        required
        rows="4"
        placeholder="Tell us how NutriBuddy can help…"
        class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
      />
    </label>
    <button
      type="submit"
      class="rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
    >
      Send message
    </button>
    <p class="text-xs text-gray-500">
      We reply within 48 hours — promise.
    </p>
    <p v-if="submitted" class="text-sm text-green-600">
      Thanks! We will be in touch soon.
    </p>
  </form>
</template>
