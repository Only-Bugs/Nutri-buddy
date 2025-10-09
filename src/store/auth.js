import { defineStore } from 'pinia'
import { registerUser, loginUser, logoutUser, loginWithGoogle } from '@/services/authService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
  }),

  actions: {
    async register(newUser) {
      try {
        const created = await registerUser(newUser)
        this.user = created
        return true
      } catch (err) {
        console.error('Registration failed:', err?.message || err)
        return false
      }
    },

    async login(credentials) {
      try {
        const match = await loginUser(credentials)
        if (match) {
          this.user = match
          return true
        }
        return false
      } catch (err) {
        console.error('Login failed:', err?.message || err)
        return false
      }
    },

    async loginWithGoogle() {
      try {
        const user = await loginWithGoogle()
        this.user = user
        return true
      } catch (err) {
        console.error('Google login failed:', err?.message || err)
        return false
      }
    },

    async logout() {
      try {
        await logoutUser()
        this.user = null
        return true
      } catch (err) {
        console.error('Logout failed:', err?.message || err)
        return false
      }
    },
  },
})
// # Generated under NutriBuddy SpecGuard v1.0.0
