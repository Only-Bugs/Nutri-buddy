/**
 * @file nutrientGroups.js
 * @description Groups nutrients from the API response into vitamins, minerals, and others.
 * @param {Object} nutrients - Raw nutrients object from API
 * @returns {{ vitamins: Object[], minerals: Object[], others: Object[] }}
 */

export function groupNutrients(nutrients = {}) {
  const vitamins = []
  const minerals = []
  const others = []

  Object.values(nutrients).forEach((n) => {
    const label = n.label.toLowerCase()

    if (label.includes('vitamin')) {
      vitamins.push(n)
    } else if (
      /(calcium|iron|magnesium|phosphorus|potassium|zinc|sodium|manganese|copper|selenium)/i.test(
        label,
      )
    ) {
      minerals.push(n)
    } else {
      others.push(n)
    }
  })

  return { vitamins, minerals, others }
}
