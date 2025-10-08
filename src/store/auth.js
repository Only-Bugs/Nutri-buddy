import { defineStore } from 'pinia'
import { registerUser, loginUser, logoutUser } from '@/services/authService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
  }),
  actions: {
    register(newUser) {
      const created = registerUser(newUser)
      this.user = created
      return true
    },
    login(credentials) {
      const match = loginUser(credentials)
      if (match) {
        this.user = match
        return true
      }
      return false
    },
    logout() {
      logoutUser()
      this.user = null
      return true
    },
  },
})
// # Generated under NutriBuddy SpecGuard v1.0.0
