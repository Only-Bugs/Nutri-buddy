<script setup>
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import DOMPurify from 'dompurify'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'

const auth = useAuthStore()
const router = useRouter()
const { showToast } = useToast()

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Min 6 characters').required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
})

const { handleSubmit } = useForm({ validationSchema: schema })

const { value: email, errorMessage: emailError, meta: emailMeta } = useField('email')
const { value: password, errorMessage: passwordError, meta: passwordMeta } = useField('password')
const {
  value: confirmPassword,
  errorMessage: confirmError,
  meta: confirmMeta,
} = useField('confirmPassword')

const onSubmit = handleSubmit(async (formValues) => {
  const sanitized = {
    email: DOMPurify.sanitize(formValues.email.trim()),
    password: DOMPurify.sanitize(formValues.password.trim()),
  }

  try {
    const success = await auth.register(sanitized)
    if (success) {
      showToast('Account created successfully!', 'success')
      router.push('/dashboard')
    } else {
      showToast('Registration failed — please try again.', 'error')
    }
  } catch (err) {
    showToast(err.message || 'Registration failed', 'error')
  }
})
</script>

<template>
  <form @submit.prevent="onSubmit" class="space-y-4">
    <div>
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <div class="min-h-[20px]">
        <span v-if="emailMeta.touched" class="text-red-500 text-sm">{{ emailError }}</span>
      </div>
    </div>

    <div>
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <div class="min-h-[20px]">
        <span v-if="passwordMeta.touched" class="text-red-500 text-sm">{{ passwordError }}</span>
      </div>
    </div>

    <div>
      <input
        v-model="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        class="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <div class="min-h-[20px]">
        <span v-if="confirmMeta.touched" class="text-red-500 text-sm">{{ confirmError }}</span>
      </div>
    </div>

    <button
      type="submit"
      class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
    >
      Register
    </button>
  </form>
</template>
