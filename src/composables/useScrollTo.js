/**
 * @composable useScrollTo
 * Smoothly scroll to an element by id
 * # Generated under NutriBuddy SpecGuard v1.0.0
 */
export function useScrollTo() {
  function scrollToId(id) {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }
  return { scrollToId }
}
