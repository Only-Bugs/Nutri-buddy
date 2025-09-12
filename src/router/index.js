import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/auth'

import LoginPage from '../pages/LoginPage.vue'
import RegisterPage from '../pages/RegisterPage.vue'
import DashboardPage from '../pages/DashboardPage.vue'
import AdminPage from '../pages/AdminPage.vue'
import AuthPage from '@/pages/AuthPage.vue'

const routes = [
  { path: '/', redirect: '/auth' },
  { path: '/auth', component: AuthPage },
  // { path: '/login', component: LoginPage },
  // { path: '/register', component: RegisterPage },
  { path: '/dashboard', component: DashboardPage, meta: { requiresAuth: true } },
  { path: '/admin', component: AdminPage, meta: { requiresAuth: true, requiresAdmin: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Route guard
router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.user) {
    return '/auth'
  }

  if (to.meta.requiresAdmin && auth.user?.role !== 'admin') {
    return '/dashboard'
  }
})

export default router
