/**
 * @file dashboard.js
 * @description Pinia store for user dashboard data and actions.
 * Validates queries, syncs with normalized backend output,
 * and updates searchable history with safe defaults.
 * @module store/dashboard
 */

import { defineStore } from 'pinia'
import { getNutritionData } from '@/services/nutritionService'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    foods: [], // search history
    latestResult: null, // latest API result for NutritionResultCard
    loading: false,
    error: null,
  }),

  actions: {
    /** Performs live search against API */
    async searchFood(query) {
      if (!query?.trim()) return

      // Require numeric quantity (helps Edamam parse correctly)
      const hasNumber = /\d/.test(query)
      if (!hasNumber) {
        this.error = 'Please include a quantity — e.g., "100g chicken breast" or "2 apples".'
        return
      }

      this.loading = true
      this.error = null
      console.log('[DashboardStore] Searching for:', query)

      try {
        const result = await getNutritionData(query)
        console.log('[DashboardStore] API payload:', result)

        if (!result || !result.food) {
          this.latestResult = null
          this.error = 'No nutrition data found'
          return
        }

        // Save the latest API response
        this.latestResult = result

        // Extract macro info safely
        const macros = result.nutrients || {}
        const calories = Math.round(macros.ENERC_KCAL?.quantity ?? result.calories ?? 0)
        const protein = Math.round(macros.PROCNT?.quantity ?? 0)
        const carbs = Math.round(macros.CHOCDF?.quantity ?? 0)
        const fat = Math.round(macros.FAT?.quantity ?? 0)

        // Build entry for history table (with safe defaults)
        const entry = {
          id: result.foodId || `${result.food}-${Date.now()}`,
          name: result.food || query,
          quantity: result.quantity ?? '—',
          measure: result.measure ?? '—',
          weight: result.weight ?? 0,
          calories,
          protein,
          carbs,
          fat,
          cautions:
            Array.isArray(result.cautions) && result.cautions.length ? result.cautions : ['None'],
        }

        const existingIndex = this.foods.findIndex((f) => f.name === result.food)
        if (existingIndex >= 0) {
          this.foods[existingIndex] = entry
        } else {
          this.foods.unshift(entry)
        }
      } catch (err) {
        console.error('[DashboardStore] Search failed:', err)
        this.error = err?.message || 'Search failed'
        this.latestResult = null
      } finally {
        this.loading = false
      }
    },
  },
})
