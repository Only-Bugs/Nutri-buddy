/**
 * @file userProfile.js
 * @description Centralised user profile store for avatar, username, and preferences.
 * Persists settings to Firestore with a localStorage cache for fast reads.
 * @module store/userProfile
 */

import { defineStore } from 'pinia'
import { fetchUserProfile, saveUserProfile } from '@/services/firestoreService'

const STORAGE_PREFIX = 'userProfile'
const DEFAULT_CALORIE_LIMIT = 2000

function storageKey(userId) {
  return `${STORAGE_PREFIX}:${userId}`
}

function loadStoredProfile(userId) {
  if (!userId) return null
  try {
    const raw = localStorage.getItem(storageKey(userId))
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch (error) {
    console.warn('[UserProfileStore] Failed to parse stored profile', error)
    return null
  }
}

function persistProfileLocally(userId, payload) {
  if (!userId) return
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(payload))
  } catch (error) {
    console.warn('[UserProfileStore] Failed to persist profile', error)
  }
}

async function persistProfile(userId, payload) {
  persistProfileLocally(userId, payload)
  try {
    await saveUserProfile(userId, payload)
  } catch (error) {
    console.warn('[UserProfileStore] Failed to persist profile remotely', error)
  }
}

export const useUserProfileStore = defineStore('userProfile', {
  state: () => ({
    userId: null,
    email: '',
    displayName: '',
    photoURL: '',
    customUsername: '',
    dailyCalorieLimit: DEFAULT_CALORIE_LIMIT,
    isCalorieLimitCustom: false,
    lastSyncedAt: null,
  }),

  getters: {
    /**
     * Primary name to render in the UI.
     * Prefers custom username, then the Firebase displayName, then the email prefix.
     */
    resolvedDisplayName(state) {
      if (state.customUsername?.trim()) return state.customUsername.trim()
      if (state.displayName?.trim()) return state.displayName.trim()
      if (state.email?.includes('@')) {
        return state.email.split('@')[0] || 'User'
      }
      return 'User'
    },
    /**
     * Short name useful for greetings.
     */
    resolvedFirstName(state) {
      const name = this.resolvedDisplayName
      return name.split(' ')[0] || name
    },
    /**
     * Determines the avatar URL to use.
     */
    avatarUrl(state) {
      return state.photoURL || ''
    },
  },

  actions: {
    /**
     * Resets store state.
     */
    reset() {
      this.userId = null
      this.email = ''
      this.displayName = ''
      this.photoURL = ''
      this.customUsername = ''
      this.dailyCalorieLimit = DEFAULT_CALORIE_LIMIT
      this.isCalorieLimitCustom = false
      this.lastSyncedAt = null
    },

    /**
     * Hydrates state from Firebase auth user and stored preferences.
     * @param {import('firebase/auth').User|null} authUser
     */
    async initializeFromAuth(authUser) {
      if (!authUser) {
        this.reset()
        return
      }

      this.userId = authUser.uid
      this.email = authUser.email || ''
      this.displayName = authUser.displayName || ''
      this.photoURL = authUser.photoURL || ''
      this.lastSyncedAt = new Date().toISOString()

      const stored = loadStoredProfile(this.userId)
      if (stored) {
        this.customUsername = stored.customUsername || ''
        this.dailyCalorieLimit =
          Number(stored.dailyCalorieLimit) > 0 ? Number(stored.dailyCalorieLimit) : DEFAULT_CALORIE_LIMIT
        this.isCalorieLimitCustom = Boolean(stored.isCalorieLimitCustom)
      } else {
        this.customUsername = ''
        this.dailyCalorieLimit = DEFAULT_CALORIE_LIMIT
        this.isCalorieLimitCustom = false
      }

      try {
        const remoteProfile = await fetchUserProfile(this.userId)
        if (remoteProfile) {
          this.customUsername = remoteProfile.customUsername || this.customUsername || ''
          this.dailyCalorieLimit =
            Number(remoteProfile.dailyCalorieLimit) > 0
              ? Number(remoteProfile.dailyCalorieLimit)
              : this.dailyCalorieLimit
          this.isCalorieLimitCustom =
            remoteProfile.isCalorieLimitCustom ?? this.isCalorieLimitCustom ?? false
          this.lastSyncedAt = remoteProfile.updatedAt || new Date().toISOString()
          persistProfileLocally(this.userId, {
            customUsername: this.customUsername,
            dailyCalorieLimit: this.dailyCalorieLimit,
            isCalorieLimitCustom: this.isCalorieLimitCustom,
          })
        }
      } catch (error) {
        console.warn('[UserProfileStore] Failed to fetch remote profile', error)
      }
    },

    /**
     * Persists the current state for the active user.
     */
    persist() {
      if (!this.userId) return
      persistProfile(this.userId, {
        customUsername: this.customUsername || '',
        dailyCalorieLimit: this.dailyCalorieLimit || DEFAULT_CALORIE_LIMIT,
        isCalorieLimitCustom: this.isCalorieLimitCustom || false,
      })
    },

    /**
     * Updates the custom username and persists it.
     * @param {string} value
     */
    setCustomUsername(value) {
      this.customUsername = (value || '').trim()
      this.persist()
    },

    /**
     * Updates the stored calorie limit. Falls back to default when invalid.
     * @param {number} value
     */
    setDailyCalorieLimit(value) {
      const parsed = Number(value)
      if (Number.isFinite(parsed) && parsed > 0) {
        this.dailyCalorieLimit = Math.round(parsed)
        this.isCalorieLimitCustom = true
        this.persist()
      } else {
        this.clearCustomCalorieLimit()
      }
    },

    /**
     * Synchronises the limit with the user's current intake when no custom value is set.
     * @param {number} calories
     */
    syncFromIntake(calories) {
      if (this.isCalorieLimitCustom) return
      const parsed = Number(calories)
      if (!Number.isFinite(parsed) || parsed <= 0) return
      this.dailyCalorieLimit = Math.max(DEFAULT_CALORIE_LIMIT, Math.round(parsed))
    },

    /**
     * Resets the calorie limit to the default and marks it as automatic.
     */
    clearCustomCalorieLimit() {
      this.dailyCalorieLimit = DEFAULT_CALORIE_LIMIT
      this.isCalorieLimitCustom = false
      this.persist()
    },
  },
})
