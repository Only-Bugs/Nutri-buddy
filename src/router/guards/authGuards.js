/**
 * @file authGuards.js
 * @description Global navigation guard ensuring protected routes are accessible
 * only to authenticated users. Uses Firebase Auth current session to protect routes.
 * @module router/guards/authGuards
 */

import { useAuthStore } from '@/store/auth'
import { firebaseAuth } from '@/config/firebase'

/**
 * Applies route guards for authentication.
 * Redirects to `/auth` if route requires authentication and user is not logged in.
 * @param {import('vue-router').Router} router - Vue Router instance.
 */
export function applyAuthGuards(router) {
  router.beforeEach((to) => {
    const auth = useAuthStore()
    const user = auth.user || firebaseAuth.currentUser

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

    // Redirect authed users away from auth page
    if (to.name === 'Auth' && user) {
      return '/app/dashboard'
    }

    // Allow navigation
    return true
  })
}
