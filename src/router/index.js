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
import RecipesPage from '@/pages/RecipesPage.vue'
import RecipeDetailPage from '@/pages/RecipeDetailPage.vue'
import SettingsPage from '@/pages/SettingsPage.vue'

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
      { path: 'recipes', name: 'Recipes', component: RecipesPage },
      { path: 'recipes/:id', name: 'RecipeDetail', component: RecipeDetailPage },
      { path: 'settings', name: 'Settings', component: SettingsPage },
    ],
  },
  { path: '/dashboard', redirect: '/app/dashboard' },
  { path: '/meal-plans', redirect: '/app/meal-plans' },
  { path: '/recipes', redirect: '/app/recipes' },
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
