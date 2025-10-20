/** * @file LoginForm.vue * @description Login form component using Firebase Authentication. *
Handles email/password login via Pinia store and provides * client-side validation with vee-validate
and yup. * Displays real-time feedback using the global toast system. * @module
components/auth/LoginForm */

<script setup>
import { onMounted, ref } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import DOMPurify from 'dompurify'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'

/** Store and router initialization */
const auth = useAuthStore()
const router = useRouter()
const { showToast } = useToast()

/** Validation schema for login form fields */
const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Min 6 characters').required('Password is required'),
})

/** Form setup and field bindings */
const { handleSubmit } = useForm({ validationSchema: schema })
const { value: email, errorMessage: emailError, meta: emailMeta } = useField('email')
const { value: password, errorMessage: passwordError, meta: passwordMeta } = useField('password')

const isReady = ref(false)
const inputClasses =
  'w-full rounded-xl border border-gray-200 bg-white/80 px-4 py-3 text-lg text-gray-900 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus-visible:ring-2 focus-visible:ring-green-500/50 dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-100'

onMounted(() => {
  requestAnimationFrame(() => {
    isReady.value = true
  })
})

/**
 * Handles form submission and triggers Firebase Authentication login.
 * On success, navigates to the dashboard; on failure, shows a toast message.
 * @async
 * @function onSubmit
 * @param {Object} formValues - User-provided login credentials.
 */
const onSubmit = handleSubmit(async (formValues) => {
  const sanitized = {
    email: DOMPurify.sanitize(formValues.email.trim()),
    password: DOMPurify.sanitize(formValues.password.trim()),
  }

  const ok = await auth.login(sanitized)
  if (ok) {
    showToast('Welcome back!', 'success')
    router.push('/dashboard')
  } else {
    showToast('Invalid credentials or user not found', 'error')
  }
})
</script>

<template>
  <form @submit.prevent="onSubmit" class="space-y-5">
    <div
      class="form-block"
      :class="isReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
      style="transition-delay: 40ms"
    >
      <label class="text-lg font-semibold text-gray-700 dark:text-gray-200">
        Email
        <input v-model="email" type="email" placeholder="you@example.com" :class="inputClasses" />
      </label>
      <p v-if="emailMeta.touched" class="text-lg text-red-500">{{ emailError }}</p>
    </div>

    <div
      class="form-block"
      :class="isReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
      style="transition-delay: 120ms"
    >
      <label class="text-lg font-semibold text-gray-700 dark:text-gray-200">
        Password
        <input v-model="password" type="password" placeholder="••••••••" :class="inputClasses" />
      </label>
      <p v-if="passwordMeta.touched" class="text-lg text-red-500">{{ passwordError }}</p>
    </div>

    <div
      class="form-block"
      :class="isReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
      style="transition-delay: 200ms"
    >
      <button
        type="submit"
        class="w-full rounded-xl bg-green-600 px-4 py-3 text-lg font-semibold text-white transition hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500/50"
      >
        Login
      </button>
    </div>
  </form>
</template>

<style scoped>
.form-block {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transform: translateY(0);
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
}
</style>
