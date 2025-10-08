/**
 * @service dashboardService
 * Single-responsibility: provides dashboard-related data sources.
 * # Generated under NutriBuddy SpecGuard v1.0.0
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
