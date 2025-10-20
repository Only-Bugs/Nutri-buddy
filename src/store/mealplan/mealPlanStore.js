/**
 * @file mealPlanStore.js
 * @description Pinia store managing meal plans with Firestore persistence and local cache fallback.
 * @module store/mealplan/mealPlanStore
 * # Generated under NutriBuddy SpecGuard v1.0.0
 */

import { defineStore } from 'pinia'
import { createMealPlanDraft } from '@/types/mealplan/mealPlanTypes.js'
import { fetchMealPlans, saveMealPlan } from '@/services/firestoreService'

function cloneMeals(meals = []) {
  return meals.map((meal) => ({
    ...meal,
    items: Array.isArray(meal.items)
      ? meal.items.map((item) => ({
          ...item,
          instructions: Array.isArray(item.instructions)
            ? [...item.instructions]
            : item.instructions
            ? [item.instructions].flat().map((step) => String(step || '').trim()).filter(Boolean)
            : [],
          ingredients: Array.isArray(item.ingredients)
            ? item.ingredients.map((ingredient) => ({ ...ingredient }))
            : [],
        }))
      : [],
  }))
}

function aggregateNutritionTotals(meals = []) {
  const totals = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    sugar: 0,
    sodium: 0,
    fiber: 0,
  }

  meals.forEach((meal) => {
    (meal.items || []).forEach((item) => {
      const nutrition = item.nutrition || {}
      const calories = Number(item.calories ?? nutrition.calories ?? 0) || 0
      const protein = Number(item.protein ?? nutrition.protein ?? 0) || 0
      const carbs = Number(item.carbs ?? nutrition.carbs ?? 0) || 0
      const fat = Number(item.fat ?? nutrition.fat ?? 0) || 0
      const sugar = Number(item.sugar ?? nutrition.sugar ?? 0) || 0
      const sodium = Number(item.sodium ?? nutrition.sodium ?? 0) || 0
      const fiber = Number(item.fiber ?? nutrition.fiber ?? 0) || 0

      totals.calories += calories
      totals.protein += protein
      totals.carbs += carbs
      totals.fats += fat
      totals.sugar += sugar
      totals.sodium += sodium
      totals.fiber += fiber
    })
  })

  return {
    calories: Math.round(totals.calories),
    protein: Math.round(totals.protein),
    carbs: Math.round(totals.carbs),
    fats: Math.round(totals.fats),
    sugar: Math.round(totals.sugar),
    sodium: Math.round(totals.sodium),
    fiber: Math.round(totals.fiber),
  }
}

function normalizeInstructions(rawInstructions) {
  if (!rawInstructions) return []
  if (Array.isArray(rawInstructions)) {
    return rawInstructions.map((step) => String(step || '').trim()).filter(Boolean)
  }
  return String(rawInstructions)
    .split(/\r?\n+/)
    .map((step) => step.trim())
    .filter(Boolean)
}

function normalizeIngredients(rawIngredients) {
  if (!rawIngredients) return []
  if (!Array.isArray(rawIngredients)) return []
  return rawIngredients.map((ingredient) => ({
    name: ingredient.name || ingredient.ingredient_name || '',
    quantity: ingredient.quantity ?? ingredient.amount ?? '',
    unit: ingredient.unit ?? ingredient.measure ?? '',
    misc: ingredient.misc ?? '',
  }))
}

function derivePlanRecipes(meals = []) {
  const recipes = []
  meals.forEach((meal) => {
    const items = Array.isArray(meal.items) ? meal.items : []
    items.forEach((item) => {
      if ((item.type || '').toLowerCase() !== 'recipe') return
      const nutrition = item.nutrition || {}
      recipes.push({
        id: item.recipeId || item.id,
        planItemId: item.id,
        mealId: meal.id,
        mealLabel: meal.label,
        name: item.name || 'Recipe',
        servings: item.servings || item.quantity || '',
        description: item.description || '',
        image: item.image || '',
        instructions: normalizeInstructions(item.instructions),
        ingredients: normalizeIngredients(item.ingredients),
        nutrition: {
          calories: Number(item.calories ?? nutrition.calories ?? 0) || 0,
          protein: Number(item.protein ?? nutrition.protein ?? 0) || 0,
          carbs: Number(item.carbs ?? nutrition.carbs ?? 0) || 0,
          fat: Number(item.fat ?? nutrition.fat ?? 0) || 0,
          fiber: Number(item.fiber ?? nutrition.fiber ?? 0) || 0,
          sugar: Number(item.sugar ?? nutrition.sugar ?? 0) || 0,
          sodium: Number(item.sodium ?? nutrition.sodium ?? 0) || 0,
        },
      })
    })
  })
  return recipes
}

function persistPlansLocally(userId, plans) {
  if (!userId) return
  try {
    localStorage.setItem(`mealPlans:${userId}`, JSON.stringify(plans))
  } catch (error) {
    console.warn('[MealPlanStore] Failed to persist plans to localStorage', error)
  }
}

function loadPersistedPlans(userId) {
  if (!userId) return []
  try {
    const raw = localStorage.getItem(`mealPlans:${userId}`)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.warn('[MealPlanStore] Failed to read plans from localStorage', error)
    return []
  }
}

export const useMealPlanStore = defineStore('mealPlan', {
  state: () => ({
    userId: null,
    plans: [],
    activePlanId: null,
    loading: false,
    error: null,
  }),

  getters: {
    activePlan(state) {
      return state.plans.find((plan) => plan.id === state.activePlanId) || null
    },
  },

  actions: {
    setUser(userId) {
      if (this.userId === userId) return
      this.userId = userId || null
      if (!this.userId) {
        this.plans = []
        this.activePlanId = null
        return
      }
    },

    async loadPlans(userId) {
      this.setUser(userId)
      if (!this.userId) return

      this.loading = true
      try {
        const plans = await fetchMealPlans(this.userId)
        this.plans = plans.map((plan) => {
          const meals = cloneMeals(plan.meals || [])
          return {
            ...plan,
            meals,
            nutritionTotals: plan.nutritionTotals || aggregateNutritionTotals(meals),
            recipes:
              Array.isArray(plan.recipes) && plan.recipes.length
                ? plan.recipes
                : derivePlanRecipes(meals),
          }
        })
        this.activePlanId = this.plans[0]?.id || null
        persistPlansLocally(this.userId, this.plans)
        this.error = null
      } catch (error) {
        console.warn('[MealPlanStore] Failed to fetch meal plans', error)
        this.error = error?.message || 'Failed to load meal plans'
        const persisted = loadPersistedPlans(this.userId)
        this.plans = persisted.map((plan) => {
          const meals = cloneMeals(plan.meals)
          return {
            ...plan,
            meals,
            nutritionTotals: aggregateNutritionTotals(meals),
            recipes: Array.isArray(plan.recipes) && plan.recipes.length
              ? plan.recipes
              : derivePlanRecipes(meals),
          }
        })
        this.activePlanId = this.plans[0]?.id || null
      } finally {
        this.loading = false
      }
    },

    selectPlan(planId) {
      this.activePlanId = planId
    },

    async savePlan(planDraft) {
      if (!this.userId) {
        this.error = 'Sign in to manage meal plans.'
        return
      }

      const draft = {
        ...createMealPlanDraft(planDraft),
        meals: cloneMeals(planDraft.meals || []),
      }

      const plan = {
        ...draft,
        id: draft.id || `plan-${Date.now().toString(16)}`,
        updatedAt: new Date().toISOString(),
      }
      plan.nutritionTotals = aggregateNutritionTotals(plan.meals)
      plan.recipes = derivePlanRecipes(plan.meals)

      const index = this.plans.findIndex((existing) => existing.id === plan.id)
      if (index >= 0) {
        this.plans.splice(index, 1, plan)
      } else {
        this.plans.unshift(plan)
      }

      if (!this.activePlanId || plan.status === 'active') {
        this.activePlanId = plan.id
      }
      persistPlansLocally(this.userId, this.plans)
      saveMealPlan(this.userId, plan).catch((error) => {
        console.warn('[MealPlanStore] Failed to persist meal plan', error)
      })
      return plan
    },

    async updatePlanStatus(planId, status) {
      if (!this.userId) {
        this.error = 'Sign in to manage meal plans.'
        return
      }

      const index = this.plans.findIndex((plan) => plan.id === planId)
      if (index < 0) return

      const plan = {
        ...this.plans[index],
        status,
        updatedAt: new Date().toISOString(),
      }
      this.plans.splice(index, 1, plan)

      if (status === 'active') {
        this.activePlanId = planId
      } else if (this.activePlanId === planId) {
        this.activePlanId = null
      }

      persistPlansLocally(this.userId, this.plans)
      saveMealPlan(this.userId, plan).catch((error) => {
        console.warn('[MealPlanStore] Failed to update meal plan status', error)
      })
    },

    async addItemToActivePlan(payload) {
      if (!this.activePlanId) {
        this.error = 'Select or create a meal plan first.'
        throw new Error(this.error)
      }

      const planIndex = this.plans.findIndex((plan) => plan.id === this.activePlanId)
      if (planIndex < 0) throw new Error('Active plan not found.')

      const plan = { ...this.plans[planIndex], meals: cloneMeals(this.plans[planIndex].meals) }
      const label = payload.label || 'Meal'
      let mealIndex = plan.meals.findIndex((meal) => meal.label === label)
      if (mealIndex < 0) {
        plan.meals.push({
          id: `meal-${Date.now().toString(16)}${Math.random().toString(16).slice(2, 6)}`,
          label,
          scheduledAt: '',
          items: [],
        })
        mealIndex = plan.meals.length - 1
      }

      const meal = { ...plan.meals[mealIndex] }
      const items = meal.items ? [...meal.items] : []
      items.push({
        id: `item-${Date.now().toString(16)}${Math.random().toString(16).slice(2, 6)}`,
        ...payload.item,
      })
      meal.items = items
      plan.meals.splice(mealIndex, 1, meal)

      plan.nutritionTotals = aggregateNutritionTotals(plan.meals)
      plan.recipes = derivePlanRecipes(plan.meals)
      this.plans.splice(planIndex, 1, plan)
      persistPlansLocally(this.userId, this.plans)
      saveMealPlan(this.userId, plan).catch((error) => {
        console.warn('[MealPlanStore] Failed to add item to meal plan', error)
      })
    },

    async removeItemFromActivePlan(payload) {
      const planIndex = this.plans.findIndex((plan) => plan.id === this.activePlanId)
      if (planIndex < 0) return

      const plan = { ...this.plans[planIndex], meals: cloneMeals(this.plans[planIndex].meals) }
      const mealIndex = plan.meals.findIndex((meal) => meal.id === payload.mealId)
      if (mealIndex < 0) return

      const meal = { ...plan.meals[mealIndex] }
      meal.items = (meal.items || []).filter((item) => item.id !== payload.itemId)

      if (!meal.items.length) {
        plan.meals.splice(mealIndex, 1)
      } else {
        plan.meals.splice(mealIndex, 1, meal)
      }

      plan.nutritionTotals = aggregateNutritionTotals(plan.meals)
      plan.recipes = derivePlanRecipes(plan.meals)
      this.plans.splice(planIndex, 1, plan)
      persistPlansLocally(this.userId, this.plans)
      saveMealPlan(this.userId, plan).catch((error) => {
        console.warn('[MealPlanStore] Failed to remove item from meal plan', error)
      })
    },

    async archiveActivePlan() {
      if (!this.activePlanId) return
      await this.updatePlanStatus(this.activePlanId, 'archived')
    },
  },
})
