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
})

const { handleSubmit } = useForm({ validationSchema: schema })

const { value: email, errorMessage: emailError, meta: emailMeta } = useField('email')
const { value: password, errorMessage: passwordError, meta: passwordMeta } = useField('password')

const onSubmit = handleSubmit(async (formValues) => {
  const sanitized = {
    email: DOMPurify.sanitize(formValues.email.trim()),
    password: DOMPurify.sanitize(formValues.password.trim()),
  }

  try {
    const success = await auth.login(sanitized)
    if (success) {
      showToast('Welcome back!', 'success')
      router.push('/dashboard')
    } else {
      showToast('Invalid credentials or user not found', 'error')
    }
  } catch (err) {
    showToast(err.message || 'Login failed', 'error')
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
        class="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        class="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div class="min-h-[20px]">
        <span v-if="passwordMeta.touched" class="text-red-500 text-sm">{{ passwordError }}</span>
      </div>
    </div>

    <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full">
      Login
    </button>
  </form>
</template>
