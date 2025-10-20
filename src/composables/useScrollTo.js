/**
 * @composable useScrollTo
 * Smoothly scroll to an element by id
 *
 */
export function useScrollTo() {
  function scrollToId(id) {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }
  return { scrollToId }
}
