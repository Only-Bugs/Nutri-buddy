/**
 * @service dashboardService
 * Single-responsibility: provides dashboard-related data sources.
 *
 */

/**
 * Fetch the local foods dataset (dev stub).
 * @returns {Promise<Array>}
 */
export async function fetchFoods() {
  const res = await fetch('/data/foods.json')
  if (!res.ok) throw new Error('Failed to load foods.json')
  return res.json()
}

/**
 * @function searchFoods
 * Temporary local search stub before Cloud Function integration.
 * Filters foods.json client-side to mimic API behaviour.
 */
export async function searchFoods(query) {
  const res = await fetch('/data/foods.json')
  if (!res.ok) throw new Error('Failed to load foods.json')
  const all = await res.json()
  return all.filter((f) => f.name.toLowerCase().includes(query.toLowerCase()))
}
