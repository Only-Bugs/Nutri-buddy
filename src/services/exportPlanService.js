/**
 * @service exportPlanService
 * Client helpers to trigger meal-plan exports and transactional email via the
 * backend mailer endpoints. Requires VITE_API_BASE_URL to point at the Express
 * API (local proxy or deployed server).
 */

import { API_BASE_URL } from '@/config/api'
import { firebaseAuth } from '@/config/firebase'

async function authedPost(path, payload) {
  if (!API_BASE_URL) {
    throw new Error('Missing API base URL (VITE_API_BASE_URL).')
  }

  const user = firebaseAuth.currentUser
  if (!user) {
    throw new Error('User not authenticated.')
  }

  const token = await user.getIdToken()

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Request failed with status ${response.status}`)
  }

  return response.json().catch(() => ({}))
}

export async function sendPlanExport(plan, email, format = 'pdf') {
  return authedPost('/plan/export', { plan, email, format })
}

export async function sendWelcomeEmail(email) {
  return authedPost('/mail/welcome', { email })
}
