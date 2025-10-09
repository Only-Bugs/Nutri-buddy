import { createRouter, createWebHistory } from 'vue-router'
import { applyAuthGuards } from '@/router/guards/authGuards'

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
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

applyAuthGuards(router)

export default router
// # Generated under NutriBuddy SpecGuard v1.0.0
