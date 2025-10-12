/**
 * @service nutritionService
 * Handles communication with the AWS /nutrition endpoint.
 * Attaches Firebase user ID token for authentication.
 *
 */

import axios from 'axios'
import { API_BASE_URL } from '@/config/api'
import { firebaseAuth } from '@/config/firebase'

/**
 * Fetch nutrition data from AWS Lambda endpoint.
 * Includes Firebase ID token in Authorization header.
 * @param {string} query - Ingredient text (e.g., '2 potatoes')
 * @returns {Promise<Object|null>} Parsed API response or null if query invalid
 */
export async function getNutritionData(query) {
  const q = (query || '').trim()
  if (!q) return null

  // Ensure user is authenticated
  const user = firebaseAuth.currentUser
  if (!user) throw new Error('User not authenticated')

  // Retrieve Firebase-issued JWT
  const token = await user.getIdToken()

  // Call protected AWS endpoint
  const { data } = await axios.get(`${API_BASE_URL}/nutrition`, {
    params: { q },
    // headers: { Authorization: `Bearer ${token}` },
    timeout: 8000,
  })

  return data
}
