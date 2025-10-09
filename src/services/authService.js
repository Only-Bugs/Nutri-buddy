/**
 * @service authService
 * Handles all authentication workflows via Firebase Auth.
 * Maintains backward-compatible interface with previous local mock.
 * # Generated under NutriBuddy SpecGuard v1.0.0
 */
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth'
import { firebaseAuth } from '@/config/firebase'

/**
 * Register user via Firebase.
 * @param {{email: string, password: string}} newUser
 * @returns {Promise<{email: string, uid: string, role: string}>}
 */
export async function registerUser(newUser) {
  const { user } = await createUserWithEmailAndPassword(firebaseAuth, newUser.email, newUser.password)
  return { email: user.email, uid: user.uid, role: 'user' }
}

/**
 * Login user via Firebase.
 * @param {{email: string, password: string}} credentials
 * @returns {Promise<{email: string, uid: string, role: string}|null>}
 */
export async function loginUser(credentials) {
  try {
    const { user } = await signInWithEmailAndPassword(firebaseAuth, credentials.email, credentials.password)
    return { email: user.email, uid: user.uid, role: 'user' }
  } catch {
    return null
  }
}

/**
 * Login user with Google popup.
 * @returns {Promise<{email:string, uid:string, provider:string}>}
 */
export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider()
  const { user } = await signInWithPopup(firebaseAuth, provider)
  return { email: user.email, uid: user.uid, provider: 'google' }
}

/**
 * Logout the current Firebase user.
 * @returns {Promise<boolean>}
 */
export async function logoutUser() {
  await signOut(firebaseAuth)
  return true
}
