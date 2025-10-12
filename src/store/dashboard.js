/**
 * @file dashboard.js
 * @description Pinia store for user dashboard data and actions.
 * Updated to call protected AWS Lambda endpoint and log responses.
 * @module store/dashboard
 */

import { defineStore } from 'pinia'
import { fetchFoods } from '@/services/dashboardService'
import { getNutritionData } from '@/services/nutritionService'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    foods: [],
    loading: false,
    error: null,
  }),

  actions: {
    /** Loads local foods for fallback or offline testing */
    async fetchLocalFoods() {
      this.loading = true
      this.error = null
      try {
        const data = await fetchFoods()
        console.log('[DashboardStore] Local foods loaded:', data)
        this.foods = data
      } catch (err) {
        console.error('[DashboardStore] Local foods error:', err)
        this.error = err?.message || 'Failed to load foods'
      } finally {
        this.loading = false
      }
    },

    /** Performs live search against AWS-protected API */
    async searchFood(query) {
      if (!query?.trim()) return
      this.loading = true
      this.error = null
      console.log('[DashboardStore] Searching for:', query)
      try {
        const result = await getNutritionData(query)
        console.log('[DashboardStore] API payload:', result.ingredients[0].parsed[0])

        // Simplify response into one food entry for table
        const foodName = result?.ingredients?.[0]?.parsed?.[0]?.food || query
        const calories = Math.round(result?.calories ?? 0)
        this.foods = [
          {
            id: `${foodName}-${calories}`.toLowerCase().replace(/\s+/g, '-'),
            name: foodName,
            category: '—',
            calories,
          },
        ]
      } catch (err) {
        console.error('[DashboardStore] Search failed:', err)
        this.error = err?.message || 'Search failed'
      } finally {
        this.loading = false
      }
    },
  },
})
