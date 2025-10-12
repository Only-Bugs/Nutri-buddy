/**
 * @file auth.js
 * @description Pinia store managing user authentication state and actions.
 * Integrates Firebase Authentication for registration, login, Google sign-in,
 * logout, and session persistence across page reloads.
 * @module store/auth
 */

import { defineStore } from 'pinia'
import { registerUser, loginUser, logoutUser, loginWithGoogle } from '../services/authService'

/**
 * @typedef {Object} User
 * @property {string} email - The user's email address.
 * @property {string} uid - The user's unique Firebase Auth identifier.
 * @property {string} [provider] - The authentication provider (e.g., 'google').
 */

/**
 * Defines the authentication store.
 * Provides actions for Firebase-based auth workflows.
 */
export const useAuthStore = defineStore('auth', {
  /**
   * @returns {{user: User|null}} Initial store state.
   */
  state: () => ({
    user: null,
  }),

  actions: {
    /**
     * Registers a new user via Firebase Authentication.
     * @async
     * @param {{email:string,password:string}} newUser - User registration data.
     * @returns {Promise<boolean>} True if registration succeeds, otherwise false.
     */
    async register(newUser) {
      try {
        const created = await registerUser(newUser)
        this.user = created
        return true
      } catch (error) {
        console.error('Registration failed:', error?.message || error)
        return false
      }
    },

    /**
     * Logs in an existing user with email/password via Firebase Authentication.
     * @async
     * @param {{email:string,password:string}} credentials - Login credentials.
     * @returns {Promise<boolean>} True if login succeeds, otherwise false.
     */
    async login(credentials) {
      try {
        const match = await loginUser(credentials)
        if (match) {
          this.user = match
          return true
        }
        return false
      } catch (error) {
        console.error('Login failed:', error?.message || error)
        return false
      }
    },

    /**
     * Logs in user with Google Authentication popup.
     * @async
     * @returns {Promise<boolean>} True if Google login succeeds, otherwise false.
     */
    async loginWithGoogle() {
      try {
        const user = await loginWithGoogle()
        this.user = user
        return true
      } catch (error) {
        console.error('Google login failed:', error?.message || error)
        return false
      }
    },

    /**
     * Logs out the current user from Firebase Authentication.
     * @async
     * @returns {Promise<boolean>} True if logout succeeds, otherwise false.
     */
    async logout() {
      try {
        await logoutUser()
        this.user = null
        return true
      } catch (error) {
        console.error('Logout failed:', error?.message || error)
        return false
      }
    },
  },
})
