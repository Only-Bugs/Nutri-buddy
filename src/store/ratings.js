import { defineStore } from 'pinia'
import { calcAverageRating } from '@/utils/ratingsUtils'

export const useRatingsStore = defineStore('ratings', {
  state: () => ({
    ratings: {}, // foodId -> number[]
  }),
  actions: {
    addRating(foodId, score) {
      if (!this.ratings[foodId]) this.ratings[foodId] = []
      this.ratings[foodId].push(score)
    },
    getAverage(foodId) {
      return calcAverageRating(this.ratings[foodId] || [])
    },
  },
})
// # Generated under NutriBuddy SpecGuard v1.0.0
