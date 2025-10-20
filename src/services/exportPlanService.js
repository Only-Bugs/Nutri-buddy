/**
 * @service exportPlanService
 * Creates a lightweight PDF summary of a meal plan and emails it using SendGrid directly
 * from the client. Requires exposing a SendGrid API key via Vite env vars — only do this for
 * trusted demos; real deployments should proxy through a backend to keep the key secret.
 */

import { firebaseAuth } from '@/config/firebase'

const SENDGRID_API_KEY = import.meta.env.VITE_SENDGRID_API_KEY || ''
const SENDGRID_FROM_EMAIL = import.meta.env.VITE_SENDGRID_FROM_EMAIL || ''

if (import.meta.env.DEV && (!SENDGRID_API_KEY || !SENDGRID_FROM_EMAIL)) {
  console.warn(
    '[exportPlanService] Missing VITE_SENDGRID_API_KEY or VITE_SENDGRID_FROM_EMAIL. Email export will fail.',
  )
}

function escapePdfText(input) {
  return String(input ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
}

function normaliseLine(text) {
  return String(text ?? '').replace(/\s+/g, ' ').trim()
}

function toArray(value) {
  if (!value) return []
  if (Array.isArray(value)) return value
  return String(value)
    .split(/\r?\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
}

function stitchLines(plan) {
  const lines = []
  lines.push(`Plan: ${normaliseLine(plan.name || 'Untitled plan')}`)
  lines.push(
    `Dates: ${plan.startDate || 'No start'} → ${plan.endDate || 'Open-ended'}`,
  )
  lines.push(`Status: ${plan.status || 'draft'}`)
  lines.push('')

  if (plan.notes) {
    lines.push('Notes:')
    toArray(plan.notes).forEach((note) => lines.push(`• ${normaliseLine(note)}`))
    lines.push('')
  }

  const meals = Array.isArray(plan.meals) ? plan.meals : []
  meals.forEach((meal) => {
    const heading = `${normaliseLine(meal.label || 'Meal')} ${meal.scheduledAt ? `(${meal.scheduledAt})` : ''}`
    lines.push(heading.trim())
    const items = Array.isArray(meal.items) ? meal.items : []
    if (!items.length) {
      lines.push('  - No items yet')
      return
    }
    items.forEach((item) => {
      const name = normaliseLine(item.name || item.food || item.recipe_name || 'Item')
      const amount = normaliseLine(item.quantity || item.servings || '')
      const calories = typeof item.calories === 'number' ? `${Math.round(item.calories)} kcal` : ''
      const macros = []
      if (typeof item.protein === 'number') macros.push(`P${Math.round(item.protein)}g`)
      if (typeof item.carbs === 'number') macros.push(`C${Math.round(item.carbs)}g`)
      if (typeof item.fat === 'number') macros.push(`F${Math.round(item.fat)}g`)
      const macroText = macros.length ? ` [${macros.join(' · ')}]` : ''
      const extra = [amount, calories].filter(Boolean).join(', ')
      lines.push(`  - ${name}${extra ? ` — ${extra}` : ''}${macroText}`)
    })
    lines.push('')
  })

  const totals = plan.nutritionTotals || {}
  const summary = [
    `Total calories: ${Math.round(totals.calories || 0)} kcal`,
    `Protein: ${Math.round(totals.protein || 0)} g`,
    `Carbs: ${Math.round(totals.carbs || 0)} g`,
    `Fat: ${Math.round(totals.fats || totals.fat || 0)} g`,
  ]
  lines.push(...summary)
  return lines
}

function buildPdf(plan) {
  const lines = stitchLines(plan)
  const contentOps = ['BT', '/F1 16 Tf', '1 0 0 1 72 780 Tm']
  lines.forEach((line, index) => {
    if (index > 0) contentOps.push('0 -20 Td')
    contentOps.push(`(${escapePdfText(line)}) Tj`)
  })
  contentOps.push('ET')
  const contentStream = contentOps.join('\n')

  const objects = [
    { id: 1, body: '<< /Type /Catalog /Pages 2 0 R >>' },
    { id: 2, body: '<< /Type /Pages /Kids [3 0 R] /Count 1 >>' },
    {
      id: 3,
      body: '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
    },
    {
      id: 4,
      body: `<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream`,
    },
    { id: 5, body: '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>' },
  ]

  let pdf = '%PDF-1.4\n'
  const offsets = [pdf.length]
  pdf += `1 0 obj\n${objects[0].body}\nendobj\n`
  objects.slice(1).forEach((obj) => {
    offsets.push(pdf.length)
    pdf += `${obj.id} 0 obj\n${obj.body}\nendobj\n`
  })

  const xrefPosition = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n`
  pdf += '0000000000 65535 f \n'
  offsets.forEach((offset) => {
    pdf += `${offset.toString().padStart(10, '0')} 00000 n \n`
  })
  pdf += `trailer\n<< /Root 1 0 R /Size ${objects.length + 1} >>\nstartxref\n${xrefPosition}\n%%EOF`

  return pdf
}

function pdfToBase64(pdfString) {
  if (typeof btoa === 'function') {
    return btoa(unescape(encodeURIComponent(pdfString)))
  }
  return Buffer.from(pdfString, 'utf8').toString('base64')
}

export async function sendPlanExport(plan, email) {
  if (!SENDGRID_API_KEY || !SENDGRID_FROM_EMAIL) {
    throw new Error('SendGrid client is not configured. Set VITE_SENDGRID_API_KEY and VITE_SENDGRID_FROM_EMAIL.')
  }

  const user = firebaseAuth.currentUser
  if (!user) {
    throw new Error('User not authenticated.')
  }

  await user.getIdToken(true) // ensures recent login; unused but keeps parity with backend approach

  const pdf = buildPdf(plan)
  const base64Pdf = pdfToBase64(pdf)
  const fileName = `${(plan.name || 'meal-plan').replace(/\s+/g, '_')}.pdf`

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email }] }],
      from: { email: SENDGRID_FROM_EMAIL },
      subject: `Your NutriBuddy meal plan: ${plan.name || 'Plan'}`,
      content: [
        {
          type: 'text/plain',
          value:
            `Hi there,\n\nYour meal plan "${plan.name || 'Plan'}" is attached as a PDF.\nKeep tracking and stay consistent!\n\n— NutriBuddy`,
        },
      ],
      attachments: [
        {
          content: base64Pdf,
          filename: fileName,
          type: 'application/pdf',
          disposition: 'attachment',
        },
      ],
    }),
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(`SendGrid request failed: ${response.status} ${message}`)
  }
}
