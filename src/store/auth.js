import { defineStore } from 'pinia'
import { registerUser, loginUser, logoutUser, loginWithGoogle } from '@/services/authService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
  }),

  actions: {
    /**
     * Register a new user via Firebase.
     * @param {{email:string,password:string}} newUser
     */
    async register(newUser) {
      try {
        const created = await registerUser(newUser)
        this.user = created
        return true
      } catch (err) {
        console.error('Registration failed:', err.message)
        return false
      }
    },

    /**
     * Login an existing user via Firebase.
     * @param {{email:string,password:string}} credentials
     */
    async login(credentials) {
      try {
        const match = await loginUser(credentials)
        if (match) {
          this.user = match
          return true
        }
        return false
      } catch (err) {
        console.error('Login failed:', err.message)
        return false
      }
    },

    /**
     * Login with Google popup.
     */
    async loginWithGoogle() {
      try {
        const user = await loginWithGoogle()
        this.user = user
        return true
      } catch (err) {
        console.error('Google login failed:', err.message)
        return false
      }
    },

    /**
     * Logout current Firebase user.
     */
    async logout() {
      try {
        await logoutUser()
        this.user = null
        return true
      } catch (err) {
        console.error('Logout failed:', err.message)
        return false
      }
    },
  },
})
