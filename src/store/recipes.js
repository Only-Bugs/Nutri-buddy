/**
 * @file recipes.js
 * @description Pinia store managing recipe catalog, favorites, and pagination helpers.
 */

import { defineStore } from 'pinia'

const FALLBACK_MEAL_TYPE = 'Dinner'
const MEAL_TYPE_ORDER = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Beverage']

function toArray(value) {
  if (!value) return []
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    try {
      const jsonReady = value.replace(/'/g, '"')
      const parsed = JSON.parse(jsonReady)
      if (Array.isArray(parsed)) return parsed
    } catch (error) {
      return value
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean)
    }
  }
  return []
}

function normalizeMealTypes(rawTypes = []) {
  const mapped = toArray(rawTypes)
    .map((type) => String(type || '').trim())
    .filter(Boolean)
    .map((type) => {
      const lower = type.toLowerCase()
      if (lower.includes('breakfast')) return 'Breakfast'
      if (lower.includes('lunch')) return 'Lunch'
      if (lower.includes('dinner') || lower.includes('entree')) return 'Dinner'
      if (lower.includes('snack') || lower.includes('appetizer')) return 'Snack'
      if (lower.includes('dessert') || lower.includes('sweet')) return 'Dessert'
      if (lower.includes('drink') || lower.includes('beverage') || lower.includes('smoothie'))
        return 'Beverage'
      return type.replace(/^\w/, (c) => c.toUpperCase())
    })

  const deduped = Array.from(new Set(mapped))
  return deduped.length ? deduped : [FALLBACK_MEAL_TYPE]
}

function toNumber(value) {
  const num = Number(value)
  return Number.isFinite(num) ? num : 0
}

function buildIngredients(rawIngredients = []) {
  if (!Array.isArray(rawIngredients)) return []
  return rawIngredients.map((item) => ({
    name: item.name || item.ingredient_name || '',
    quantity: item.quantity ?? '',
    unit: item.unit ?? '',
    misc: item.misc ?? '',
  }))
}

function placeholderImage(primaryMealType) {
  const map = {
    Breakfast: 'https://images.unsplash.com/photo-1546069901-eacef0df6022',
    Lunch: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
    Dinner: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17',
    Snack: 'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83',
    Dessert: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587',
    Beverage: 'https://images.unsplash.com/photo-1527169402691-feff5539e52c',
  }
  return map[primaryMealType] || map.Dinner
}

function normalizeRecipe(raw) {
  const mealTypes =
    normalizeMealTypes(raw.meal_types || raw.mealTypes || raw.category || raw.meal_type) ||
    [FALLBACK_MEAL_TYPE]
  const instructionsArray = Array.isArray(raw.instructions)
    ? raw.instructions
    : toArray(raw.instructions)
  const cuisines = Array.isArray(raw.cuisines) ? raw.cuisines : toArray(raw.cuisine)
  const primaryMealType = mealTypes[0] || FALLBACK_MEAL_TYPE

  const fallbackId = `recipe-${Math.random().toString(36).slice(2, 10)}`

  return {
    id: raw.id ?? raw.recipe_id ?? fallbackId,
    name: raw.name ?? raw.recipe_name ?? 'Untitled recipe',
    description: raw.description || '',
    mealTypes,
    primaryMealType,
    cuisines,
    prepTimeMinutes: toNumber(raw.prep_time_minutes || raw.prep_time),
    cookTimeMinutes: toNumber(raw.cook_time_minutes || raw.cook_time),
    servings: toNumber(raw.servings || raw.servings_count || 1),
    instructions: instructionsArray,
    ingredients: buildIngredients(raw.ingredients),
    nutrition: {
      calories: toNumber(raw.nutrition?.calories ?? raw.calories),
      protein: toNumber(raw.nutrition?.protein ?? raw.protein),
      carbs: toNumber(raw.nutrition?.carbs ?? raw.carbs),
      fat: toNumber(raw.nutrition?.fat ?? raw.fat),
      fiber: toNumber(raw.nutrition?.fiber ?? raw.fiber),
      sugar: toNumber(raw.nutrition?.sugar ?? raw.sugar),
      sodium: toNumber(raw.nutrition?.sodium ?? raw.sodium),
    },
    image: raw.image || placeholderImage(primaryMealType),
  }
}

export const useRecipeStore = defineStore('recipes', {
  state: () => ({
    recipes: [],
    favorites: [],
    initialized: false,
    loading: false,
  }),

  getters: {
    recipeMap(state) {
      return state.recipes.reduce((acc, recipe) => {
        acc[recipe.id] = recipe
        return acc
      }, {})
    },
    favoriteRecipes(state) {
      if (!state.favorites.length) return []
      return state.favorites
        .map((id) => state.recipes.find((recipe) => recipe.id === id))
        .filter(Boolean)
    },
    favoriteMealTypes(state) {
      const types = new Set()
      state.favorites.forEach((id) => {
        const recipe = state.recipes.find((r) => r.id === id)
        if (!recipe) return
        recipe.mealTypes.forEach((type) => types.add(type))
      })
      return MEAL_TYPE_ORDER.filter((type) => types.has(type))
    },
  },

  actions: {
    async initialize(force = false) {
      if (this.initialized && !force) return
      if (this.loading) return
      this.loading = true
      try {
        let payload
        try {
          const response = await fetch(`${import.meta.env.BASE_URL || '/'}temp.json`)
          if (!response.ok) throw new Error(`Failed to load temp.json (${response.status})`)
          payload = await response.json()
        } catch (fetchError) {
          // Vite dev server fallback to bundler import if fetch not available (e.g., SSR)
          const module = await import('../../temp.json', { assert: { type: 'json' } })
          payload = module.default || module
        }
        const parsed = Array.isArray(payload.recipes) ? payload.recipes : []
        this.recipes = parsed.map(normalizeRecipe)
        this.initialized = true
      } catch (error) {
        console.error('[RecipeStore] Failed to load recipes dataset', error)
        this.recipes = []
        this.initialized = false
      } finally {
        this.loading = false
      }
    },

    async toggleFavorite(recipeId) {
      if (!this.initialized) await this.initialize()
      const exists = this.favorites.includes(recipeId)
      if (exists) {
        this.favorites = this.favorites.filter((id) => id !== recipeId)
      } else {
        this.favorites.push(recipeId)
      }
    },

    isFavorite(recipeId) {
      return this.favorites.includes(recipeId)
    },

    getRecipesByMealType(mealType) {
      if (!this.initialized) return []
      if (!mealType || mealType === 'All') return this.recipes
      return this.recipes.filter((recipe) => recipe.mealTypes.includes(mealType))
    },

    getFavoritesByMealType(mealType) {
      if (!this.initialized) return []
      return this.favoriteRecipes.filter((recipe) => recipe.mealTypes.includes(mealType))
    },
  },
})
