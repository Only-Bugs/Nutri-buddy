/**
 * @composable useAuthTabs
 * Encapsulates tab switching for auth page
 *
 */
import { ref } from 'vue'

export function useAuthTabs(defaultTab = 'login') {
  const activeTab = ref(defaultTab)
  function setTab(tab) {
    activeTab.value = tab
  }
  return { activeTab, setTab }
}
