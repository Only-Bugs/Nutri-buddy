/**
 * @file useAuthActions.js
 * @description Composable providing authentication-related UI actions.
 * Acts as a bridge between user interface components and the Pinia auth store.
 * Handles navigation and logout workflow for Firebase Authentication.
 * @module composables/useAuthActions
 */

import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

/**
 * Provides authentication actions for UI components.
 * @returns {{ handleLogout: () => Promise<void> }} Methods for user actions.
 */
export function useAuthActions() {
  const router = useRouter()
  const auth = useAuthStore()

  /**
   * Logs out the current Firebase user and redirects to the home route.
   * @async
   * @function handleLogout
   * @returns {Promise<void>} Resolves after logout and navigation complete.
   */
  async function handleLogout() {
    await auth.logout()
    router.push('/')
  }

  return { handleLogout }
}
