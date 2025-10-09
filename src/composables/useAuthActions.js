/**
 * @composable useAuthActions
 * Bridges UI → store/service for auth actions
 * # Generated under NutriBuddy SpecGuard v1.0.0
 */
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

export function useAuthActions() {
  const router = useRouter()
  const auth = useAuthStore()

  async function handleLogout() {
    await auth.logout()
    router.push('/')
  }

  return { handleLogout }
}
