#!/usr/bin/env zsh
set -euo pipefail

# --- sanity checks ---
[[ -f package.json && -d src ]] || { echo "Run this from the repo root (where package.json lives)"; exit 1; }

BRANCH="chore/firebase-auth-swap"
echo "→ Creating git branch: $BRANCH"
git checkout -b "$BRANCH" 2>/dev/null || git checkout "$BRANCH"

# --- deps ---
echo "→ Installing firebase SDK"
npm install firebase

# --- create firebase config ---
echo "→ Writing src/config/firebase.js"
mkdir -p src/config
cat > src/config/firebase.js <<'EOF'
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
EOF

# --- replace auth service with Firebase version (incl. Google) ---
echo "→ Replacing src/services/authService.js"
mkdir -p src/services
cat > src/services/authService.js <<'EOF'
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
EOF

# --- update pinia auth store to async + Google ---
echo "→ Updating src/store/auth.js"
mkdir -p src/store
cat > src/store/auth.js <<'EOF'
import { defineStore } from 'pinia'
import { registerUser, loginUser, logoutUser, loginWithGoogle } from '@/services/authService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
  }),

  actions: {
    async register(newUser) {
      try {
        const created = await registerUser(newUser)
        this.user = created
        return true
      } catch (err) {
        console.error('Registration failed:', err?.message || err)
        return false
      }
    },

    async login(credentials) {
      try {
        const match = await loginUser(credentials)
        if (match) {
          this.user = match
          return true
        }
        return false
      } catch (err) {
        console.error('Login failed:', err?.message || err)
        return false
      }
    },

    async loginWithGoogle() {
      try {
        const user = await loginWithGoogle()
        this.user = user
        return true
      } catch (err) {
        console.error('Google login failed:', err?.message || err)
        return false
      }
    },

    async logout() {
      try {
        await logoutUser()
        this.user = null
        return true
      } catch (err) {
        console.error('Logout failed:', err?.message || err)
        return false
      }
    },
  },
})
// # Generated under NutriBuddy SpecGuard v1.0.0
EOF

# --- toast system ---
echo "→ Adding toast composable and container"
mkdir -p src/composables src/components/common

cat > src/composables/useToast.js <<'EOF'
/**
 * @composable useToast
 * Lightweight global toast handler (no dependencies)
 * # Generated under NutriBuddy SpecGuard v1.0.0
 */
import { reactive } from 'vue'
const state = reactive({ message: '', type: 'info', visible: false })
export function useToast() {
  function showToast(message, type = 'info', duration = 3000) {
    state.message = message
    state.type = type
    state.visible = true
    setTimeout(() => (state.visible = false), duration)
  }
  return { state, showToast }
}
EOF

cat > src/components/common/ToastContainer.vue <<'EOF'
<script setup>
import { useToast } from '@/composables/useToast'
const { state } = useToast()
</script>

<template>
  <transition name="fade">
    <div
      v-if="state.visible"
      class="fixed bottom-6 right-6 px-4 py-2 rounded-lg shadow-lg text-white"
      :class="{
        'bg-green-600': state.type === 'success',
        'bg-red-600': state.type === 'error',
        'bg-gray-700': state.type === 'info',
      }"
    >
      {{ state.message }}
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,.fade-leave-active{ transition: opacity .3s; }
.fade-enter-from,.fade-leave-to{ opacity:0; }
</style>
EOF

# --- App.vue: ensure ToastContainer is mounted globally ---
echo "→ Rewriting src/App.vue to include ToastContainer"
cat > src/App.vue <<'EOF'
<script setup>
import ToastContainer from '@/components/common/ToastContainer.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-900">
    <main class="flex-1 flex items-center justify-center w-full px-4">
      <router-view />
    </main>
    <ToastContainer />
  </div>
</template>
EOF

# --- Auth forms & page (Firebase + toasts) ---
echo "→ Updating LoginForm.vue, RegisterForm.vue, AuthPage.vue"
cat > src/components/forms/LoginForm.vue <<'EOF'
<script setup>
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import DOMPurify from 'dompurify'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'

const auth = useAuthStore()
const router = useRouter()
const { showToast } = useToast()

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Min 6 characters').required('Password is required'),
})
const { handleSubmit } = useForm({ validationSchema: schema })
const { value: email, errorMessage: emailError, meta: emailMeta } = useField('email')
const { value: password, errorMessage: passwordError, meta: passwordMeta } = useField('password')

const onSubmit = handleSubmit(async (formValues) => {
  const sanitized = {
    email: DOMPurify.sanitize(formValues.email.trim()),
    password: DOMPurify.sanitize(formValues.password.trim()),
  }
  const ok = await auth.login(sanitized)
  if (ok) {
    showToast('Welcome back!', 'success')
    router.push('/dashboard')
  } else {
    showToast('Invalid credentials or user not found', 'error')
  }
})
</script>

<template>
  <form @submit.prevent="onSubmit" class="space-y-4">
    <div>
      <input v-model="email" type="email" placeholder="Email"
        class="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <div class="min-h-[20px]">
        <span v-if="emailMeta.touched" class="text-red-500 text-sm">{{ emailError }}</span>
      </div>
    </div>
    <div>
      <input v-model="password" type="password" placeholder="Password"
        class="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <div class="min-h-[20px]">
        <span v-if="passwordMeta.touched" class="text-red-500 text-sm">{{ passwordError }}</span>
      </div>
    </div>
    <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full">
      Login
    </button>
  </form>
</template>
EOF

cat > src/components/forms/RegisterForm.vue <<'EOF'
<script setup>
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import DOMPurify from 'dompurify'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'

const auth = useAuthStore()
const router = useRouter()
const { showToast } = useToast()

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Min 6 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
})
const { handleSubmit } = useForm({ validationSchema: schema })
const { value: email, errorMessage: emailError, meta: emailMeta } = useField('email')
const { value: password, errorMessage: passwordError, meta: passwordMeta } = useField('password')
const { value: confirmPassword, errorMessage: confirmError, meta: confirmMeta } = useField('confirmPassword')

const onSubmit = handleSubmit(async (formValues) => {
  const sanitized = {
    email: DOMPurify.sanitize(formValues.email.trim()),
    password: DOMPurify.sanitize(formValues.password.trim()),
  }
  const ok = await auth.register(sanitized)
  if (ok) {
    showToast('Account created successfully!', 'success')
    router.push('/dashboard')
  } else {
    showToast('Registration failed — please try again.', 'error')
  }
})
</script>

<template>
  <form @submit.prevent="onSubmit" class="space-y-4">
    <div>
      <input v-model="email" type="email" placeholder="Email"
        class="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-500" />
      <div class="min-h-[20px]">
        <span v-if="emailMeta.touched" class="text-red-500 text-sm">{{ emailError }}</span>
      </div>
    </div>
    <div>
      <input v-model="password" type="password" placeholder="Password"
        class="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-500" />
      <div class="min-h-[20px]">
        <span v-if="passwordMeta.touched" class="text-red-500 text-sm">{{ passwordError }}</span>
      </div>
    </div>
    <div>
      <input v-model="confirmPassword" type="password" placeholder="Confirm Password"
        class="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-500" />
      <div class="min-h-[20px]">
        <span v-if="confirmMeta.touched" class="text-red-500 text-sm">{{ confirmError }}</span>
      </div>
    </div>
    <button type="submit" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full">
      Register
    </button>
  </form>
</template>
EOF

cat > src/pages/AuthPage.vue <<'EOF'
<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import LoginForm from '@/components/forms/LoginForm.vue'
import RegisterForm from '@/components/forms/RegisterForm.vue'

const activeTab = ref('login')
const auth = useAuthStore()
const router = useRouter()
const { showToast } = useToast()

async function handleGoogleLogin() {
  const ok = await auth.loginWithGoogle()
  if (ok) {
    showToast('Signed in with Google!', 'success')
    router.push('/dashboard')
  } else {
    showToast('Google login failed. Please try again.', 'error')
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
      <div class="text-center mb-6">
        <div class="mx-auto h-12 w-12 bg-green-600 text-white flex items-center justify-center rounded-full text-lg font-bold">
          NB
        </div>
        <h2 class="mt-4 text-2xl font-bold text-gray-900">Welcome to Nutri-Buddy</h2>
        <p class="mt-1 text-sm text-gray-500">Please sign in or create a new account</p>
      </div>

      <div class="flex border-b border-gray-200 mb-6">
        <button class="flex-1 py-2 text-center text-sm font-medium"
          :class="activeTab === 'login' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500'"
          @click="activeTab = 'login'">Sign In</button>
        <button class="flex-1 py-2 text-center text-sm font-medium"
          :class="activeTab === 'register' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500'"
          @click="activeTab = 'register'">Sign Up</button>
      </div>

      <div>
        <LoginForm v-if="activeTab === 'login'" />
        <RegisterForm v-else />
      </div>

      <div class="mt-6 flex items-center">
        <div class="flex-grow h-px bg-gray-200"></div>
        <span class="px-3 text-sm text-gray-400">Or continue with</span>
        <div class="flex-grow h-px bg-gray-200"></div>
      </div>

      <div class="mt-6 grid grid-cols-2 gap-4">
        <button type="button" @click="handleGoogleLogin"
          class="w-full flex items-center justify-center gap-2 border rounded-lg py-2 hover:bg-gray-50 text-sm text-gray-700">
          <img src="/google-icon.svg" alt="Google" class="h-5 w-5" /> Google
        </button>
        <button type="button" disabled
          class="w-full flex items-center justify-center gap-2 border rounded-lg py-2 bg-gray-100 text-gray-400 cursor-not-allowed text-sm">
          <img src="/apple-icon.svg" alt="Apple" class="h-5 w-5" /> Apple
        </button>
      </div>
    </div>
  </div>
</template>
EOF

# --- remove mock/admin leftovers ---
echo "→ Removing mock services and admin page/guard"
rm -f src/services/mockDataService.js || true
rm -f src/pages/AdminPage.vue || true

# Strip admin route and guard condition
if [[ -f src/router/index.js ]]; then
  gsed_available=$(command -v gsed >/dev/null 2>&1 && echo yes || echo no)
  SEDBIN="sed"
  [[ "$gsed_available" == "yes" ]] && SEDBIN="gsed"

  $SEDBIN -i.bak '/meta: { requiresAdmin: true }/d' src/router/index.js
  $SEDBIN -i.bak '/admin/s/.*,//' src/router/index.js
  $SEDBIN -i.bak "s#,{ path: 'admin', component: AdminPage, meta: { requiresAdmin: true } },##" src/router/index.js || true
  rm -f src/router/index.js.bak
fi

if [[ -f src/router/guards/authGuards.js ]]; then
  cat > src/router/guards/authGuards.js <<'EOF'
/**
 * @router-guard applyAuthGuards
 * Auth-only guard. Admin paths removed with Firebase swap.
 * # Generated under NutriBuddy SpecGuard v1.0.0
 */
import { useAuthStore } from '@/store/auth'
export function applyAuthGuards(router) {
  router.beforeEach((to) => {
    const auth = useAuthStore()
    if (to.meta?.requiresAuth && !auth.user) return '/auth'
  })
}
EOF
fi

# --- optional: .env example if missing ---
if [[ ! -f .env.example ]]; then
  echo "→ Creating .env.example"
  cat > .env.example <<'EOF'
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_APP_ID=1:xxxx:web:yyyy
EOF
fi

# --- git add & commit ---
echo "→ Staging and committing changes"
git add -A
git commit -m "feat(auth): swap mock auth for Firebase (email+Google); add toasts; drop admin; remove mockDataService

- Add src/config/firebase.js
- Replace services/authService.js with Firebase implementation (+Google)
- Update store/auth.js to async + loginWithGoogle
- Replace LoginForm, RegisterForm, AuthPage with Firebase+toast versions
- Add composables/useToast and ToastContainer; wire into App.vue
- Remove AdminPage and requiresAdmin guard; drop mockDataService
- Keep ratings store and nutrition proxy intact"

echo "✅ Done. Review changes, then run: npm run dev"
