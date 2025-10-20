/**
 * @file main.js
 * @description Application entry point. Initializes Vue app, Pinia store,
 * router, and global plugins. Ensures Firebase Auth state is resolved before mount.
 * @module main
 */

import { createApp, reactive } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import Icons from '@/plugins/icons'
import { firebaseAuth } from '@/config/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useAuthStore } from '@/store/auth'
import { useUserProfileStore } from '@/store/userProfile'
import { useDashboardStore } from '@/store/dashboard'
import { useMealPlanStore } from '@/store/mealplan/mealPlanStore'
import { useToast } from '@/composables/useToast'

/**
 * Creates and configures Vue application instance.
 */
const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
setActivePinia(pinia)
app.use(Icons)
app.use(router)

if (import.meta.env.DEV && typeof window !== 'undefined' && !window.__PINIA_LOG_FILTER__) {
  const originalLog = console.log.bind(console)
  window.__PINIA_LOG_FILTER__ = true
  console.log = (...args) => {
    if (typeof args[0] === 'string' && args[0].startsWith('🍍 ')) return
    originalLog(...args)
  }
}

const bootState = reactive({
  pending: 0,
  lastError: null,
})

function beginBootstrap() {
  bootState.pending += 1
}

function endBootstrap() {
  bootState.pending = Math.max(0, bootState.pending - 1)
}

function setBootstrapError(error) {
  bootState.lastError = error instanceof Error ? error : new Error(String(error))
}

function reportBootstrapError(context, error) {
  setBootstrapError(error)
  if (import.meta.env.DEV) {
    console.error(`[bootstrap] ${context}`, error)
  }
}

app.provide('bootState', bootState)

const { showToast } = useToast()

if (import.meta.env?.VITE_DEBUG_SEARCH === 'true') {
  app.config.errorHandler = (err, instance, info) => {
    console.error('[Vue error handler]', { err, instance, info, stack: err?.stack })
  }
}

const authStore = useAuthStore(pinia)
const userProfileStore = useUserProfileStore(pinia)
const dashboardStore = useDashboardStore(pinia)
const mealPlanStore = useMealPlanStore(pinia)

function applyAuthSnapshot(user) {
  if (user) {
    authStore.user = {
      email: user.email,
      uid: user.uid,
      provider: user.providerData?.[0]?.providerId || 'password',
    }
  } else {
    authStore.user = null
  }
}

function scheduleStoreTasks(tasks, eager, context) {
  if (eager) {
    return Promise.allSettled(tasks).then((results) => {
      results.forEach((result) => {
        if (result.status === 'rejected') {
          reportBootstrapError(context, result.reason)
        }
      })
    })
  }
  tasks.forEach((task) => {
    Promise.resolve(task).catch((error) => reportBootstrapError(context, error))
  })
  return Promise.resolve()
}

function syncForAuthenticatedUser(user, eager) {
  return scheduleStoreTasks(
    [
      userProfileStore.initializeFromAuth(user),
      dashboardStore.initializeForUser(user.uid),
      mealPlanStore.loadPlans(user.uid),
    ],
    eager,
    'hydrate authenticated user',
  )
}

function syncForSignedOutUser(eager) {
  const tasks = [
    userProfileStore.initializeFromAuth(null),
    Promise.resolve().then(() => dashboardStore.reset()),
    Promise.resolve().then(() => mealPlanStore.setUser(null)),
  ]
  return scheduleStoreTasks(tasks, eager, 'hydrate signed-out state')
}

function handleAuthChange(user, options = {}) {
  const { eager = true } = options
  applyAuthSnapshot(user)
  if (user) {
    return syncForAuthenticatedUser(user, eager)
  }
  return syncForSignedOutUser(eager)
}

function waitForInitialAuthUser() {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      firebaseAuth,
      (user) => {
        unsubscribe()
        resolve(user)
      },
      (error) => {
        unsubscribe()
        reject(error)
      },
    )
  })
}

async function bootstrap() {
  beginBootstrap()
  app.mount('#app')
  try {
    const initialUser = await waitForInitialAuthUser()
    await handleAuthChange(initialUser, { eager: false })
    await router.isReady()
    const redirectHandled = await authStore.applyGoogleRedirectResult()
    if (redirectHandled) {
      await handleAuthChange(firebaseAuth.currentUser, { eager: false })
      if (router.currentRoute.value?.name !== 'Dashboard') {
        await router.push('/dashboard')
      }
      showToast('Signed in with Google!', 'success')
    }
  } catch (error) {
    reportBootstrapError('startup', error)
  } finally {
    endBootstrap()
  }

  onAuthStateChanged(firebaseAuth, async (user) => {
    if (user?.uid === authStore.user?.uid) return
    beginBootstrap()
    try {
      await handleAuthChange(user, { eager: true })
    } catch (error) {
      reportBootstrapError('auth change', error)
    } finally {
      endBootstrap()
    }
  })
}

bootstrap().catch((error) => {
  reportBootstrapError('unhandled bootstrap rejection', error)
})
