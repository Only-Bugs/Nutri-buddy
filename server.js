import express from 'express'
import axios from 'axios'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

/**
 * GET /api/nutrition
 * @description Fetch nutrition data for a given ingredient query.
 * @query {string} query - Ingredient string (e.g., "2 pineapples").
 * @returns {object} Nutrition data from Edamam API.
 */
app.get('/api/nutrition', async (req, res) => {
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

app.listen(PORT, () => console.log(`✅ API server running on http://localhost:${PORT}`))
