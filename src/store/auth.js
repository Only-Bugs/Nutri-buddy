import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    users: [
      { email: 'email@email.com', password: '123456', role: 'user' },
      { email: 'admin@admin.com', password: 'admin123', role: 'admin' },
    ],
  }),
  actions: {
    register(newUser) {
      this.users.push({ ...newUser, role: 'user' }) // default role
    },
    login(credentials) {
      const match = this.users.find(
        (u) => u.email === credentials.email && u.password === credentials.password,
      )
      if (match) {
        this.user = match
        return true
      }
      return false
    },
    logout() {
      this.user = null
    },
  },
})
