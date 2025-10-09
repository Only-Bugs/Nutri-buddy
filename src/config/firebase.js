/**
 * @config firebase
 * Initializes Firebase App and Auth instance using Vite env vars.
 * # Generated under NutriBuddy SpecGuard v1.0.0
 */
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

let _app
export function getFirebaseApp() {
  if (!_app) _app = initializeApp(firebaseConfig)
  return _app
}
export const firebaseAuth = getAuth(getFirebaseApp())
