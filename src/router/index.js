import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth'

import LandingPage from '@/pages/LandingPage.vue'
import AuthPage from '@/pages/AuthPage.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import DashboardPage from '@/pages/DashboardPage.vue'
import MealsPage from '@/pages/MealsPage.vue'
import AdminPage from '@/pages/AdminPage.vue'

const routes = [
  { path: '/', component: LandingPage },
  { path: '/auth', component: AuthPage },
  {
    path: '/',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', component: DashboardPage },
      { path: 'meal-plans', component: MealsPage },
      { path: 'admin', component: AdminPage, meta: { requiresAdmin: true } },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.user) return '/auth'
  if (to.meta.requiresAdmin && auth.user?.role !== 'admin') return '/dashboard'
})

export default router
