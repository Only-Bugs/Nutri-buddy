/**
 * @file dashboard.js
 * @description Pinia store for user dashboard data and actions.
 * Validates queries, syncs with normalized backend output,
 * and updates searchable history with safe defaults.
 * @module store/dashboard
 */

import { defineStore } from 'pinia'
import { getNutritionData } from '@/services/nutritionService'

const DEBUG_SEARCH = import.meta.env?.VITE_DEBUG_SEARCH === 'true'

const EMPTY_TOTALS = Object.freeze({
  calories: 0,
  protein: 0,
  carbs: 0,
  fats: 0,
  fiber: 0,
  sugar: 0,
  sodium: 0,
})

function round(value) {
  const number = Number(value) || 0
  return Math.round(number * 10) / 10
}

function extractTotalsFromResult(result) {
  if (!result) return { ...EMPTY_TOTALS }
  const nutrients = result.nutrients || {}

  return {
    calories: round(result.calories),
    protein: round(nutrients.PROCNT?.quantity),
    carbs: round(nutrients.CHOCDF?.quantity),
    fats: round(nutrients.FAT?.quantity),
    fiber: round(nutrients.FIBTG?.quantity),
    sugar: round(nutrients.SUGAR?.quantity),
    sodium: round(nutrients.NA?.quantity),
  }
}

function normalizeNutritionData(raw, query) {
  if (!raw) return null

  if (DEBUG_SEARCH) {
    console.info('[DashboardStore] Normalizing payload', raw)
  }

  const totalWeight = round(raw.totalWeight)
  const calories = round(raw.calories)
  const totalNutrients = raw.totalNutrients || raw.nutrients || {}

  const ingredient = raw.ingredients?.[0]?.parsed?.[0] || raw.ingredients?.[0] || {}
  const foodName = ingredient.foodMatch || ingredient.food || raw.food || query
  const quantity = ingredient.quantity ?? ingredient.parsedQuantity ?? ingredient.qty
  const measure =
    ingredient.measure ||
    (ingredient.measureURI && ingredient.measureURI.split('#').pop()) ||
    ingredient.parsedMeasure ||
    raw.measure ||
    'serving'

  const nutrients = Object.keys(totalNutrients).reduce((acc, key) => {
    const nutrient = totalNutrients[key]
    if (!nutrient) return acc
    acc[key] = {
      label: nutrient.label || key,
      quantity: nutrient.quantity ?? 0,
      unit: nutrient.unit || '',
    }
    return acc
  }, {})

  return {
    id: raw.uri || `${foodName}-${Date.now()}`,
    food: foodName || query,
    quantity: quantity ?? '—',
    measure,
    weight: totalWeight || round(ingredient.weight),
    calories,
    nutrients,
    cautions: Array.isArray(raw.cautions) ? raw.cautions : [],
  }
}


export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    foods: [], // search history
    latestResult: null, // latest API result for NutritionResultCard
    loading: false,
    error: null,
    totalNutrition: { ...EMPTY_TOTALS },
  }),

  actions: {
    /** Performs live search against API */
    async searchFood(query) {
      if (!query?.trim()) return

      this.loading = true
      this.error = null
      if (DEBUG_SEARCH) {
        console.info('[DashboardStore] Searching for:', query)
      }

      try {
        const rawResult = await getNutritionData(query)
        if (DEBUG_SEARCH) {
          console.info('[DashboardStore] API raw payload', rawResult)
        }

        const result = normalizeNutritionData(rawResult, query)

        if (!result) {
          this.latestResult = null
          this.error = 'No nutrition data found'
          if (DEBUG_SEARCH) {
            console.warn('[DashboardStore] Normalized result empty')
          }
          return
        }

        // Save the latest normalized response
        this.latestResult = result

        // Extract macro info safely
        const macros = result.nutrients || {}
        const calories = round(macros.ENERC_KCAL?.quantity ?? result.calories)
        const protein = round(macros.PROCNT?.quantity)
        const carbs = round(macros.CHOCDF?.quantity)
        const fat = round(macros.FAT?.quantity)
        const fiber = round(macros.FIBTG?.quantity)
        const sugar = round(macros.SUGAR?.quantity)
        const sodium = round(macros.NA?.quantity)

        // Build entry for history table (with safe defaults)
        const entry = {
          id: result.id,
          name: result.food || query,
          quantity: result.quantity ?? '—',
          measure: result.measure ?? '—',
          weight: result.weight ?? 0,
          calories,
          protein,
          carbs,
          fat,
          fiber,
          sugar,
          sodium,
          cautions: result.cautions && result.cautions.length ? result.cautions : ['None'],
        }

        const existingIndex = this.foods.findIndex((f) => f.name === entry.name)
        if (existingIndex >= 0) {
          this.foods[existingIndex] = entry
        } else {
          this.foods.unshift(entry)
        }

        const latestTotals = extractTotalsFromResult(result)
        this.totalNutrition = { ...latestTotals }
      } catch (err) {
        console.error('[DashboardStore] Search failed:', err)
        if (DEBUG_SEARCH) {
          console.error('[DashboardStore] Error detail', {
            message: err?.message,
            status: err?.response?.status,
            data: err?.response?.data,
          })
        }
        this.error = err?.message || 'Search failed'
        this.latestResult = null
        this.totalNutrition = { ...EMPTY_TOTALS }
      } finally {
        this.loading = false
      }
    },
  },
})
