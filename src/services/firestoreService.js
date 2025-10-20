/**
 * @file firestoreService.js
 * @description Helper utilities for reading/writing NutriBuddy data to Firebase Firestore.
 */

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore'
import { firebaseDb } from '@/config/firebase'

const USERS_COLLECTION = 'users'
const RECIPES_COLLECTION = 'recipes'

function userDocRef(userId) {
  return doc(firebaseDb, USERS_COLLECTION, userId)
}

function userNutritionCollection(userId) {
  return collection(firebaseDb, USERS_COLLECTION, userId, 'nutritionHistory')
}

function userMealPlansCollection(userId) {
  return collection(firebaseDb, USERS_COLLECTION, userId, 'mealPlans')
}

/**
 * Fetches persisted user profile preferences.
 * @param {string} userId
 * @returns {Promise<object|null>}
 */
export async function fetchUserProfile(userId) {
  if (!userId) return null
  const snapshot = await getDoc(userDocRef(userId))
  if (!snapshot.exists()) return null
  return snapshot.data()?.profile || null
}

/**
 * Saves profile data under users/{uid}.
 * @param {string} userId
 * @param {object} profile
 */
export async function saveUserProfile(userId, profile) {
  if (!userId) throw new Error('Missing userId when saving profile')
  await setDoc(
    userDocRef(userId),
    {
      profile: {
        ...profile,
        updatedAt: new Date().toISOString(),
      },
    },
    { merge: true },
  )
}

/**
 * Fetches nutrition history entries for the user.
 * @param {string} userId
 * @param {number} [take=25]
 * @returns {Promise<Array<object>>}
 */
export async function fetchNutritionHistory(userId, take = 25) {
  if (!userId) return []
  const historyQuery = query(
    userNutritionCollection(userId),
    orderBy('createdAt', 'desc'),
    limit(take),
  )
  const snapshot = await getDocs(historyQuery)
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }))
}

/**
 * Persists a nutrition history entry under users/{uid}/nutritionHistory/{entryId}.
 * @param {string} userId
 * @param {object} payload
 */
export async function saveNutritionEntry(userId, payload) {
  if (!userId) throw new Error('Missing userId when saving nutrition entry')
  if (!payload?.id) throw new Error('Nutrition entry must include an id')
  await setDoc(
    doc(userNutritionCollection(userId), payload.id),
    {
      ...payload,
      createdAt: payload.createdAt || new Date().toISOString(),
    },
    { merge: true },
  )
}

/**
 * Removes a nutrition entry.
 * @param {string} userId
 * @param {string} entryId
 */
export async function deleteNutritionEntry(userId, entryId) {
  if (!userId || !entryId) return
  await deleteDoc(doc(userNutritionCollection(userId), entryId))
}

/**
 * Fetches meal plans for a user.
 * @param {string} userId
 * @returns {Promise<Array<object>>}
 */
export async function fetchMealPlans(userId) {
  if (!userId) return []
  const plansQuery = query(userMealPlansCollection(userId), orderBy('updatedAt', 'desc'))
  const snapshot = await getDocs(plansQuery)
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }))
}

/**
 * Persists a meal plan under users/{uid}/mealPlans/{planId}.
 * @param {string} userId
 * @param {object} plan
 */
export async function saveMealPlan(userId, plan) {
  if (!userId) throw new Error('Missing userId when saving meal plan')
  if (!plan?.id) throw new Error('Meal plan must include an id')
  await setDoc(
    doc(userMealPlansCollection(userId), plan.id),
    {
      ...plan,
      updatedAt: plan.updatedAt || new Date().toISOString(),
    },
    { merge: true },
  )
}

/**
 * Removes a meal plan document.
 * @param {string} userId
 * @param {string} planId
 */
export async function deleteMealPlan(userId, planId) {
  if (!userId || !planId) return
  await deleteDoc(doc(userMealPlansCollection(userId), planId))
}

/**
 * Fetches all recipes from the shared collection.
 * @returns {Promise<Array<object>>}
 */
export async function fetchRecipes() {
  const recipesQuery = query(collection(firebaseDb, RECIPES_COLLECTION), orderBy('name'))
  const snapshot = await getDocs(recipesQuery)
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }))
}

/**
 * Saves or updates a recipe document.
 * @param {object} recipe
 */
export async function saveRecipe(recipe) {
  if (!recipe) throw new Error('Cannot save empty recipe')
  const id = recipe.id || recipe.recipe_id || `recipe-${Date.now().toString(16)}`
  await setDoc(
    doc(firebaseDb, RECIPES_COLLECTION, id),
    {
      ...recipe,
      id,
      updatedAt: new Date().toISOString(),
    },
    { merge: true },
  )
}
