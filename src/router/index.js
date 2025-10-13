/**
 * @file index.js
 * @description Centralized Vue Router configuration for NutriBuddy application.
 * Defines all app routes, including authentication and protected dashboard areas.
 * Integrates Firebase-aware authentication guards to enforce secure navigation.
 * @module router/index
 */

import { createRouter, createWebHistory } from 'vue-router'
import { applyAuthGuards } from '@/router/guards/authGuards'

import LandingPage from '@/pages/LandingPage.vue'
import AuthPage from '@/pages/AuthPage.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import DashboardPage from '@/pages/DashboardPage.vue'
import MealsPage from '@/pages/MealsPage.vue'

/**
 * @constant {import('vue-router').RouteRecordRaw[]} routes
 * @description Application route definitions. Routes under `DashboardLayout`
 * require authentication.
 */
const routes = [
  {
    path: '/',
    name: 'Home',
    component: LandingPage,
  },
  {
    path: '/auth',
    name: 'Auth',
    component: AuthPage,
  },
  {
    path: '/app',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', name: 'Dashboard', component: DashboardPage },
      { path: 'meal-plans', name: 'MealPlans', component: MealsPage },
    ],
  },
  { path: '/dashboard', redirect: '/app/dashboard' },
  { path: '/meal-plans', redirect: '/app/meal-plans' },
]

/**
 * @constant {import('vue-router').Router} router
 * @description Configured Vue Router instance with HTML5 history mode.
 */
const router = createRouter({
  history: createWebHistory(),
  routes,
})

/**
 * Apply global authentication guards.
 * Ensures Firebase session state is respected before route access.
 */
applyAuthGuards(router)

export default router
