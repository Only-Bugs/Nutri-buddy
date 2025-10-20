import { Router } from 'express'
import axios from 'axios'

const router = Router()

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || ''
const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || ''

function ensureConfigured() {
  if (!SENDGRID_API_KEY || !SENDGRID_FROM_EMAIL) {
    throw new Error('SendGrid environment variables are not configured.')
  }
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
  lines.push(`Dates: ${plan.startDate || 'No start'} → ${plan.endDate || 'Open-ended'}`)
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
    { id: 4, body: `<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream` },
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

function buildCsv(plan) {
  const rows = []
  rows.push(['Plan', normaliseLine(plan.name || 'Untitled plan')].join(','))
  rows.push(['Status', normaliseLine(plan.status || 'draft')].join(','))
  rows.push(['Start', plan.startDate || 'No start'].join(','))
  rows.push(['End', plan.endDate || 'Open-ended'].join(','))
  rows.push([])
  rows.push(['Meal', 'Scheduled', 'Item', 'Quantity', 'Calories', 'Protein', 'Carbs', 'Fat'])

  const meals = Array.isArray(plan.meals) ? plan.meals : []
  meals.forEach((meal) => {
    if (!(meal.items || []).length) {
      rows.push([
        normaliseLine(meal.label || 'Meal'),
        normaliseLine(meal.scheduledAt || ''),
        '—',
        '—',
        '0',
        '0',
        '0',
        '0',
      ])
      return
    }
    ;(meal.items || []).forEach((item) => {
      rows.push([
        normaliseLine(meal.label || 'Meal'),
        normaliseLine(meal.scheduledAt || ''),
        normaliseLine(item.name || item.food || item.recipe_name || 'Item'),
        normaliseLine(item.quantity || item.servings || ''),
        String(Math.round(Number(item.calories ?? 0) || 0)),
        String(Math.round(Number(item.protein ?? 0) || 0)),
        String(Math.round(Number(item.carbs ?? 0) || 0)),
        String(Math.round(Number(item.fat ?? 0) || 0)),
      ])
    })
  })

  const totals = plan.nutritionTotals || {}
  rows.push([])
  rows.push([
    'Totals',
    '',
    '',
    '',
    Math.round(totals.calories || 0),
    Math.round(totals.protein || 0),
    Math.round(totals.carbs || 0),
    Math.round(totals.fats || totals.fat || 0),
  ])

  return rows.map((cols) => cols.join(',')).join('\n')
}

async function sendMail({ to, subject, text, attachments = [] }) {
  ensureConfigured()
  await axios.post(
    'https://api.sendgrid.com/v3/mail/send',
    {
      personalizations: [{ to: [{ email: to }] }],
      from: { email: SENDGRID_FROM_EMAIL, name: 'NutriBuddy' },
      subject,
      content: [{ type: 'text/plain', value: text }],
      attachments,
    },
    {
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
    },
  )
}

router.post('/plan/export', async (req, res) => {
  try {
    const { plan, email, format = 'pdf' } = req.body || {}
    if (!plan || typeof plan !== 'object') {
      return res.status(400).json({ error: 'Missing plan payload.' })
    }
    if (!email) {
      return res.status(400).json({ error: 'Missing recipient email.' })
    }

    const fmt = String(format || 'pdf').toLowerCase()
    const isPdf = fmt === 'pdf'
    const isCsv = fmt === 'csv'
    if (!isPdf && !isCsv) {
      return res.status(400).json({ error: 'Unsupported format. Use "pdf" or "csv".' })
    }

    const attachmentContent = isPdf ? buildPdf(plan) : buildCsv(plan)
    const buffer = Buffer.from(attachmentContent, 'utf8')
    const attachment = {
      content: buffer.toString('base64'),
      filename: `${(plan.name || 'meal-plan').replace(/\s+/g, '_')}.${isPdf ? 'pdf' : 'csv'}`,
      type: isPdf ? 'application/pdf' : 'text/csv',
      disposition: 'attachment',
    }

    await sendMail({
      to: email,
      subject: `Your NutriBuddy meal plan: ${plan.name || 'Plan'} (${fmt.toUpperCase()})`,
      text: `Hi there,\n\nYour meal plan "${plan.name || 'Plan'}" is attached as a ${fmt.toUpperCase()}.\nKeep tracking and stay consistent!\n\n— The NutriBuddy Team`,
      attachments: [attachment],
    })

    res.json({ success: true })
  } catch (error) {
    const status = error?.response?.status || 500
    const details = error?.response?.data || error?.message || 'Unexpected error'
    console.error('[mailer] plan export failed', details)
    res.status(status).json({ error: 'Failed to export meal plan.', details })
  }
})

router.post('/mail/welcome', async (req, res) => {
  try {
    const { email } = req.body || {}
    if (!email) {
      return res.status(400).json({ error: 'Missing email address.' })
    }

    await sendMail({
      to: email,
      subject: 'Welcome to NutriBuddy',
      text: 'Hi there!\n\nThanks for joining NutriBuddy. Explore the dashboard, build your first plan, and tell us how we can help.\n\n— The NutriBuddy Team',
    })

    res.json({ success: true })
  } catch (error) {
    const status = error?.response?.status || 500
    const details = error?.response?.data || error?.message || 'Unexpected error'
    console.error('[mailer] welcome email failed', details)
    res.status(status).json({ error: 'Failed to send welcome email.', details })
  }
})

export default router
