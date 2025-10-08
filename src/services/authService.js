/**
 * @service authService
 * Single-responsibility: encapsulate auth workflows (login/register/logout).
 * # Generated under NutriBuddy SpecGuard v1.0.0
 */

// In-memory store fallback (replace with real API later)
const _db = {
  users: [
    { email: 'email@email.com', password: '123456', role: 'user' },
    { email: 'admin@admin.com', password: 'admin123', role: 'admin' },
  ],
}

/**
 * Register user.
 * @param {{email:string,password:string}} newUser
 * @returns {{email:string,role:string}}
 */
export function registerUser(newUser) {
  const exists = _db.users.some(u => u.email === newUser.email)
  if (exists) throw new Error('User already exists')
  const user = { email: newUser.email, password: newUser.password, role: 'user' }
  _db.users.push(user)
  return { email: user.email, role: user.role }
}

/**
 * Login user.
 * @param {{email:string,password:string}} credentials
 * @returns {{email:string,role:string}|null}
 */
export function loginUser(credentials) {
  const match = _db.users.find(
    u => u.email === credentials.email && u.password === credentials.password
  )
  return match ? { email: match.email, role: match.role } : null
}

/** Logout is a no-op for this stub */
export function logoutUser() {
  return true
}
