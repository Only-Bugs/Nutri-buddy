import { Router } from 'express'
import axios from 'axios'

const router = Router()
const DEBUG_SEARCH = process.env.DEBUG_SEARCH === 'true'

/**
 * GET /nutrition
 * Proxies to Edamam nutrition-data
 */
router.get('/nutrition', async (req, res) => {
  try {
    const { query } = req.query
    if (!query) {
      if (DEBUG_SEARCH) {
        console.warn('[nutrition-route] Missing query parameter')
      }
      return res.status(400).json({ error: 'Missing query parameter ?query=' })
    }

    if (DEBUG_SEARCH) {
      console.info('[nutrition-route] Forwarding request', { query })
    }

    const url = `https://api.edamam.com/api/nutrition-data?app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_APP_KEY}&ingr=${encodeURIComponent(query)}`
    const { data } = await axios.get(url, { timeout: 5000 })
    if (DEBUG_SEARCH) {
      console.info('[nutrition-route] Response from Edamam', data)
    }
    res.json(data)
  } catch (error) {
    if (error.response) {
      if (DEBUG_SEARCH) {
        console.error('[nutrition-route] Edamam API error', {
          status: error.response.status,
          data: error.response.data,
        })
      }
      return res.status(error.response.status).json({
        error: 'Edamam API error',
        details: error.response.data,
      })
    }
    if (DEBUG_SEARCH) {
      console.error('[nutrition-route] Unexpected failure', error?.message)
    }
    res.status(500).json({ error: 'Failed to fetch nutrition data' })
  }
})

export default router
