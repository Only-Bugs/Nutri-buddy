/**
 * @router-guard applyAuthGuards
 * Attaches global beforeEach for auth + admin routes
 * # Generated under NutriBuddy SpecGuard v1.0.0
 */
import { useAuthStore } from '@/store/auth'

export function applyAuthGuards(router) {
  router.beforeEach((to) => {
    const auth = useAuthStore()
    if (to.meta?.requiresAuth && !auth.user) return '/auth'
    if (to.meta?.requiresAdmin && auth.user?.role !== 'admin') return '/dashboard'
  })
}
