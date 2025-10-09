/**
 * @composable useToast
 * Lightweight global toast handler (no dependencies)
 * # Generated under NutriBuddy SpecGuard v1.0.0
 */
import { reactive } from 'vue'
const state = reactive({ message: '', type: 'info', visible: false })
export function useToast() {
  function showToast(message, type = 'info', duration = 3000) {
    state.message = message
    state.type = type
    state.visible = true
    setTimeout(() => (state.visible = false), duration)
  }
  return { state, showToast }
}
