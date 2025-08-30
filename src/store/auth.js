import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    users: [{ email: 'test@example.com', password: '123456' }], // mock user
  }),
  actions: {
    register(newUser) {
      this.users.push(newUser)
      console.log('✅ Registered users:', this.users)
    },
    login(credentials) {
      const match = this.users.find(
        (u) => u.email === credentials.email && u.password === credentials.password,
      )
      if (match) {
        this.user = match
        console.log('✅ Logged in:', this.user)
        return true
      }
      return false
    },
    logout() {
      this.user = null
    },
  },
})
