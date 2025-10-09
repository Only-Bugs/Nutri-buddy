/**
 * @router-guard applyAuthGuards
 * Auth-only guard. Admin paths removed with Firebase swap.
 * # Generated under NutriBuddy SpecGuard v1.0.0
 */
import { useAuthStore } from '@/store/auth'
export function applyAuthGuards(router) {
  router.beforeEach((to) => {
    const auth = useAuthStore()
    if (to.meta?.requiresAuth && !auth.user) return '/auth'
  })
}
