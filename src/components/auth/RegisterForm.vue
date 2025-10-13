/** * @file RegisterForm.vue * @description User registration form for NutriBuddy using Firebase
Authentication. * Handles email and password registration through the Pinia auth store and *
provides client-side validation via vee-validate and yup. * Displays feedback using the global toast
notification system. * @module components/auth/RegisterForm */

<script setup>
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import DOMPurify from 'dompurify'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'

/** Store, router, and toast initialization */
const auth = useAuthStore()
const router = useRouter()
const { showToast } = useToast()

/** Validation schema for registration form fields */
const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Min 6 characters').required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
})

/** Form setup and field bindings */
const { handleSubmit } = useForm({ validationSchema: schema })
const { value: email, errorMessage: emailError, meta: emailMeta } = useField('email')
const { value: password, errorMessage: passwordError, meta: passwordMeta } = useField('password')
const {
  value: confirmPassword,
  errorMessage: confirmError,
  meta: confirmMeta,
} = useField('confirmPassword')

/**
 * Handles registration form submission and triggers Firebase Authentication sign-up.
 * On success, redirects to the dashboard and displays a success toast.
 * On failure, displays an error toast message.
 * @async
 * @function onSubmit
 * @param {Object} formValues - User-provided registration details.
 */
const onSubmit = handleSubmit(async (formValues) => {
  const sanitized = {
    email: DOMPurify.sanitize(formValues.email.trim()),
    password: DOMPurify.sanitize(formValues.password.trim()),
  }

  const ok = await auth.register(sanitized)
  if (ok) {
    showToast('Account created successfully!', 'success')
    router.push('/dashboard')
  } else {
    showToast('Registration failed — please try again.', 'error')
  }
})
</script>

<template>
  <form @submit.prevent="onSubmit" class="space-y-4">
    <!-- Email Field -->
    <div>
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <div class="min-h-[20px]">
        <span v-if="emailMeta.touched" class="text-red-500 text-lg">
          {{ emailError }}
        </span>
      </div>
    </div>

    <!-- Password Field -->
    <div>
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <div class="min-h-[20px]">
        <span v-if="passwordMeta.touched" class="text-red-500 text-lg">
          {{ passwordError }}
        </span>
      </div>
    </div>

    <!-- Confirm Password Field -->
    <div>
      <input
        v-model="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        class="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <div class="min-h-[20px]">
        <span v-if="confirmMeta.touched" class="text-red-500 text-lg">
          {{ confirmError }}
        </span>
      </div>
    </div>

    <!-- Submit Button -->
    <button
      type="submit"
      class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
    >
      Register
    </button>
  </form>
</template>
