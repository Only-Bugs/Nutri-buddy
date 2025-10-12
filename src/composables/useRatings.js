/**
 * @composable useRatings
 * Wrap ratings store with helper APIs
 *
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
