import { Router } from 'express'
import axios from 'axios'

const router = Router()

/**
 * GET /nutrition
 * Proxies to Edamam nutrition-data
 */
router.get('/nutrition', async (req, res) => {
  try {
    const { query } = req.query
    if (!query) {
      return res.status(400).json({ error: 'Missing query parameter ?query=' })
    }

    const url = `https://api.edamam.com/api/nutrition-data?app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_APP_KEY}&ingr=${encodeURIComponent(query)}`
    const { data } = await axios.get(url, { timeout: 5000 })
    res.json(data)
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({
        error: 'Edamam API error',
        details: error.response.data,
      })
    }
    res.status(500).json({ error: 'Failed to fetch nutrition data' })
  }
})

export default router
