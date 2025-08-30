import { defineStore } from 'pinia'

export const useRatingsStore = defineStore('ratings', {
  state: () => ({
    ratings: {}, // foodId -> [ratings]
  }),
  actions: {
    addRating(foodId, score) {
      if (!this.ratings[foodId]) {
        this.ratings[foodId] = []
      }
      this.ratings[foodId].push(score)
    },
    getAverage(foodId) {
      const scores = this.ratings[foodId] || []
      if (scores.length === 0) return 0
      return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
    },
  },
})
