/**
 * @file mealPlanTypes.js
 * @description Meal plan type helpers used by stores and components.
 * @module types/mealplan/mealPlanTypes
 * # Generated under NutriBuddy SpecGuard v1.0.0
 */

/**
 * Factory for a fresh meal plan draft skeleton.
 * @param {Object} [overrides]
 * @returns {Object}
 */
export function createMealPlanDraft(overrides = {}) {
  return {
    id: overrides.id ?? '',
    name: overrides.name ?? '',
    status: overrides.status ?? 'draft',
    startDate: overrides.startDate ?? '',
    endDate: overrides.endDate ?? '',
    updatedAt: overrides.updatedAt ?? null,
    notes: overrides.notes ?? '',
    meals: overrides.meals ?? [],
    recipes: overrides.recipes ?? [],
    nutritionTotals: overrides.nutritionTotals ?? {
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      sugar: 0,
      sodium: 0,
      fiber: 0,
    },
  }
}
