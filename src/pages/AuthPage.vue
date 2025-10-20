/** * @file AuthPage.vue * @description Warm, tactile authentication experience with animated tabbed
forms. */

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import AuthTabs from '@/components/auth/AuthTabs.vue'
import AppIcon from '@/components/common/AppIcon.vue'
import heroImage from '@/assets/tracking.webp'

const activeTab = ref('login')
const isGoogleLoading = ref(false)
const showCard = ref(false)

const auth = useAuthStore()
const router = useRouter()
const { showToast } = useToast()

const tabSubcopy = computed(() =>
  activeTab.value === 'login'
    ? 'Welcome back. Pick up where you left off and keep your streak going.'
    : 'Create your NutriBuddy account and make food tracking feel calm and clear.',
)

onMounted(() => {
  requestAnimationFrame(() => {
    showCard.value = true
  })
})

async function handleGoogleLogin() {
  if (isGoogleLoading.value) return
  isGoogleLoading.value = true
  try {
    const ok = await auth.loginWithGoogle()
    if (ok) {
      showToast('Signed in with Google!', 'success')
      router.push('/dashboard')
    } else {
      showToast('Google login failed. Please try again.', 'error')
    }
  } finally {
    isGoogleLoading.value = false
  }
}
</script>

<template>
  <div class="relative min-h-screen overflow-hidden bg-gray-900 text-gray-900 dark:bg-black">
    <img
      :src="heroImage"
      alt="Fresh ingredients background"
      class="absolute inset-0 h-full w-full object-cover"
    />
    <div class="absolute inset-0 bg-white/10 backdrop-blur-lg"></div>
    <div class="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-transparent"></div>

    <div class="relative flex min-h-screen items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <Transition name="fade-card" appear>
        <div
          v-if="showCard"
          class="w-full max-w-4xl rounded-2xl bg-white/90 p-6 shadow-2xl backdrop-blur-sm transition dark:bg-gray-900/90 md:p-10"
        >
          <div class="grid gap-10 md:grid-cols-[1.2fr,1fr] md:gap-16">
            <div class="flex flex-col justify-between gap-10">
              <header>
                <div
                  class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white shadow-lg md:mx-0"
                >
                  <AppIcon name="meal" class="text-lg" />
                </div>
                <h1
                  class="mt-6 text-center text-2xl font-semibold text-gray-900 md:text-left dark:text-gray-100"
                >
                  Welcome to NutriBuddy
                </h1>
                <p class="mt-2 text-center text-lg text-gray-600 md:text-left dark:text-gray-300">
                  {{ tabSubcopy }}
                </p>
              </header>

              <section class="hidden text-lg text-gray-600 md:block dark:text-gray-300">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  You are signing up for
                </h2>
                <ul class="mt-4 space-y-2">
                  <li class="flex items-start gap-2">
                    <AppIcon name="check" class="mt-1 text-green-600" />
                    <span>Live nutrition search that answers in seconds.</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <AppIcon name="check" class="mt-1 text-green-600" />
                    <span>Meal plans that adapt when your day does.</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <AppIcon name="check" class="mt-1 text-green-600" />
                    <span>History that makes trends obvious, not stressful.</span>
                  </li>
                </ul>
              </section>
            </div>

            <div class="flex flex-col gap-8">
              <AuthTabs v-model="activeTab" />

              <div class="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-gray-400">
                <span class="h-px flex-1 bg-gray-200"></span>
                <span>or continue with</span>
                <span class="h-px flex-1 bg-gray-200"></span>
              </div>

              <div class="grid gap-3">
                <button
                  type="button"
                  :disabled="isGoogleLoading"
                  :aria-busy="isGoogleLoading"
                  class="oauth-button border-gray-200 bg-white text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                  :class="isGoogleLoading ? 'cursor-wait opacity-90' : ''"
                  @click="handleGoogleLogin"
                >
                  <template v-if="!isGoogleLoading">
                    <AppIcon name="google" class="text-lg text-[#4285F4]" />
                    <span>Continue with Google</span>
                  </template>
                  <template v-else>
                    <svg
                      class="h-5 w-5 animate-spin text-green-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      />
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    <span>Connecting…</span>
                  </template>
                </button>

                <button
                  type="button"
                  class="oauth-button border-gray-900 bg-gray-900 text-white hover:bg-gray-800 dark:border-gray-100 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
                >
                  <AppIcon name="apple" class="text-xl" />
                  <span>Continue with Apple</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.fade-card-enter-active {
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
}
.fade-card-enter-from {
  opacity: 0;
  transform: translateY(24px);
}
.oauth-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  border-width: 1px;
  border-radius: 0.75rem;
  padding: 0.65rem 1rem;
  font-size: 0.95rem;
  font-weight: 600;
  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}
.oauth-button:focus-visible {
  outline: 2px solid rgba(34, 197, 94, 0.4);
  outline-offset: 2px;
}
</style>
