/**
 * @composable useRatings
 * Wrap ratings store with helper APIs
 * # Generated under NutriBuddy SpecGuard v1.0.0
 */
import { useRatingsStore } from '@/store/ratings'
import { calcAverageRating } from '@/utils/ratingsUtils'

export function useRatings() {
  const ratings = useRatingsStore()
  function rateFood(foodId, score) {
    ratings.addRating(foodId, score)
  }
  function getAverage(foodId) {
    const scores = ratings.ratings[foodId] || []
    return calcAverageRating(scores)
  }
  return { rateFood, getAverage }
}
