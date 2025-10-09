/**
 * @file authGuards.js
 * @description Global navigation guard ensuring protected routes are accessible
 * only to authenticated users. Waits for Firebase Auth to resolve session state
 * before evaluating access.
 * @module router/guards/authGuards
 */

import { useAuthStore } from '@/store/auth'
import { firebaseAuth } from '@/config/firebase'
import { onAuthStateChanged } from 'firebase/auth'

/**
 * Waits for Firebase Auth to emit the initial authentication state.
 * Ensures router guards execute only after Firebase has resolved session persistence.
 * @returns {Promise<import('firebase/auth').User | null>} Current user or null.
 */
function waitForAuthReady() {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      unsubscribe()
      resolve(user)
    })
  })
}

/**
 * Applies route guards for authentication.
 * Redirects to `/auth` if route requires authentication and user is not logged in.
 * @param {import('vue-router').Router} router - Vue Router instance.
 */
export function applyAuthGuards(router) {
  router.beforeEach(async (to) => {
    const auth = useAuthStore()
    const user = auth.user || (await waitForAuthReady())

    // Update store if Firebase restored a user but Pinia is empty
    if (user && !auth.user) {
      auth.user = {
        email: user.email,
        uid: user.uid,
        provider: user.providerData?.[0]?.providerId || 'password',
      }
    }

    // Redirect unauthenticated access to protected routes
    if (to.meta?.requiresAuth && !user) {
      return '/auth'
    }

    // Allow navigation
    return true
  })
}
