<script setup>
import { reactive, ref } from 'vue'

const form = reactive({
  name: '',
  email: '',
  message: '',
})

const errors = reactive({
  name: '',
  email: '',
  message: '',
})

const touched = reactive({
  name: false,
  email: false,
  message: false,
})

const submitted = ref(false)

function validateField(field) {
  const value = form[field]?.trim() || ''
  switch (field) {
    case 'name':
      if (!value) return 'Please tell us your name.'
      if (value.length < 2) return 'Name should be at least 2 characters.'
      return ''
    case 'email': {
      if (!value) return 'Email is required.'
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
      if (!emailPattern.test(value)) return 'Enter a valid email address.'
      return ''
    }
    case 'message':
      if (!value) return 'Let us know how we can help.'
      if (value.length < 10) return 'Message should be at least 10 characters.'
      return ''
    default:
      return ''
  }
}

function runValidation(field) {
  errors[field] = validateField(field)
}

function handleBlur(field) {
  touched[field] = true
  runValidation(field)
}

function handleSubmit() {
  ;['name', 'email', 'message'].forEach((field) => {
    touched[field] = true
    runValidation(field)
  })

  const hasErrors = Object.values(errors).some((err) => err)
  if (hasErrors) return

  submitted.value = true
  form.name = ''
  form.email = ''
  form.message = ''
  Object.keys(touched).forEach((field) => (touched[field] = false))
}
</script>

<template>
  <form
    class="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
    @submit.prevent="handleSubmit"
  >
    <div>
      <h3 class="text-xl font-semibold text-gray-900">Send a message</h3>
      <p class="text-lg text-gray-600">
        Share feedback, request access, or ask for help. We read every note.
      </p>
    </div>
    <label class="text-lg font-medium text-gray-700">
      Name
      <input
        v-model="form.name"
        type="text"
        required
        placeholder="Jamie Rivera"
        class="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none"
        :class="[
          errors.name && touched.name
            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
            : 'border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200',
        ]"
        @blur="handleBlur('name')"
      />
      <p v-if="errors.name && touched.name" class="mt-1 text-sm text-red-600">
        {{ errors.name }}
      </p>
    </label>
    <label class="text-lg font-medium text-gray-700">
      Email
      <input
        v-model="form.email"
        type="email"
        required
        placeholder="you@example.com"
        class="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none"
        :class="[
          errors.email && touched.email
            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
            : 'border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200',
        ]"
        @blur="handleBlur('email')"
      />
      <p v-if="errors.email && touched.email" class="mt-1 text-sm text-red-600">
        {{ errors.email }}
      </p>
    </label>
    <label class="text-lg font-medium text-gray-700">
      Message
      <textarea
        v-model="form.message"
        required
        rows="4"
        placeholder="Tell us how NutriBuddy can help…"
        class="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none"
        :class="[
          errors.message && touched.message
            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
            : 'border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200',
        ]"
        @blur="handleBlur('message')"
      />
      <p v-if="errors.message && touched.message" class="mt-1 text-sm text-red-600">
        {{ errors.message }}
      </p>
    </label>
    <button
      type="submit"
      class="rounded-lg bg-green-600 px-4 py-3 text-lg font-semibold text-white transition hover:bg-green-700"
    >
      Send message
    </button>
    <p class="text-xs text-gray-500">We reply within 48 hours — promise.</p>
    <p v-if="submitted" class="text-lg text-green-600">Thanks! We will be in touch soon.</p>
  </form>
</template>
