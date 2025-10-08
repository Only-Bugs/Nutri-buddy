/**
 * @utils ratingsUtils
 * Pure helpers for ratings math
 * # Generated under NutriBuddy SpecGuard v1.0.0
 */

/**
 * @param {number[]} scores
 * @returns {string} average fixed(1)
 */
export function calcAverageRating(scores) {
  if (!scores || scores.length === 0) return '0.0'
  const avg = scores.reduce((a,b)=>a+b,0) / scores.length
  return avg.toFixed(1)
}
