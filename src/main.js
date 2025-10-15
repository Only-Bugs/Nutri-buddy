/**
 * @file main.js
 * @description Application entry point. Initializes Vue app, Pinia store,
 * router, and global plugins. Ensures Firebase Auth state is resolved before mount.
 * @module main
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import Icons from '@/plugins/icons'
import { firebaseAuth } from '@/config/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useAuthStore } from '@/store/auth'

/**
 * Creates and configures Vue application instance.
 */
const app = createApp(App)

/** Create and register Pinia before using stores. */
const pinia = createPinia()
app.use(pinia)

/** Register global plugins. */
app.use(Icons)

if (import.meta.env?.VITE_DEBUG_SEARCH === 'true') {
  app.config.errorHandler = (err, instance, info) => {
    console.error('[Vue error handler]', { err, instance, info, stack: err?.stack })
  }
}

/**
 * Initializes Firebase Authentication listener.
 * Syncs the authenticated user into Pinia store before mounting the app.
 */
onAuthStateChanged(firebaseAuth, (user) => {
  const authStore = useAuthStore()

  if (user) {
    authStore.user = {
      email: user.email,
      uid: user.uid,
      provider: user.providerData?.[0]?.providerId || 'password',
    }
  } else {
    authStore.user = null
  }

  app.use(router)
  app.mount('#app')
})
