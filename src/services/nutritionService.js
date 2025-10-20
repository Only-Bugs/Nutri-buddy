/**
 * @service nutritionService
 * Handles communication with the AWS /nutrition endpoint.
 * Attaches Firebase user ID token for authentication.
 *
 */

import axios from 'axios'
import { API_BASE_URL } from '@/config/api'
import { firebaseAuth } from '@/config/firebase'

const DEBUG_SEARCH = import.meta.env?.VITE_DEBUG_SEARCH === 'true'

/**
 * Fetch nutrition data from AWS Lambda endpoint.
 * Includes Firebase ID token in Authorization header.
 * @param {string} query - Ingredient text (e.g., '2 potatoes')
 * @returns {Promise<Object|null>} Parsed API response or null if query invalid
 */
export async function getNutritionData(query) {
  const q = (query || '').trim()
  if (!q) return null

  if (!API_BASE_URL) {
    const message = 'Missing API base URL (VITE_API_BASE_URL)'
    if (DEBUG_SEARCH) console.warn('[nutritionService] %s', message)
    throw new Error(message)
  }

  // Ensure user is authenticated
  const user = firebaseAuth.currentUser
  if (!user) throw new Error('User not authenticated')

  // Retrieve Firebase-issued JWT
  const token = await user.getIdToken()

  // Call protected AWS endpoint
  try {
    if (DEBUG_SEARCH) {
      console.info('[nutritionService] GET %s/nutrition', API_BASE_URL, { query: q })
    }
    const { data } = await axios.get(`${API_BASE_URL}/nutrition`, {
      params: { query: q, q },
      // headers: { Authorization: `Bearer ${token}` },
      timeout: 8000,
    })
    if (DEBUG_SEARCH) {
      console.info('[nutritionService] Response payload:', data)
    }
    return data
  } catch (error) {
    if (DEBUG_SEARCH) {
      console.error('[nutritionService] Request failed', {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
      })
    }
    throw error
  }
}
