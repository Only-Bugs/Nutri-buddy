/**
 * @service nutritionService
 * Single-responsibility: calls backend nutrition endpoint.
 * # Generated under NutriBuddy SpecGuard v1.0.0
 */
import axios from 'axios'

/**
 * Fetch nutrition data from backend proxy.
 * @param {string} query
 * @returns {Promise<Object|null>}
 */
export async function getNutritionData(query) {
  const q = (query || '').trim()
  if (!q) return null
  const { data } = await axios.get(
    `http://localhost:5000/api/nutrition?query=${encodeURIComponent(q)}`,
    { timeout: 8000 }
  )
  return data
}
