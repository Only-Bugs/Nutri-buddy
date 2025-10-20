function normaliseLine(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim()
}

function row(values = []) {
  return values
    .map((value) => {
      const text = normaliseLine(value)
      if (text.includes(',') || text.includes('"') || text.includes('\n')) {
        return `"${text.replace(/"/g, '""')}"`
      }
      return text
    })
    .join(',')
}

function planToCsv(plan) {
  const lines = []
  lines.push(row(['Plan', plan.name || 'Untitled plan']))
  lines.push(row(['Status', plan.status || 'draft']))
  lines.push(row(['Start', plan.startDate || 'No start']))
  lines.push(row(['End', plan.endDate || 'Open-ended']))
  lines.push('')
  lines.push(row(['Meal', 'Scheduled', 'Item', 'Quantity', 'Calories', 'Protein', 'Carbs', 'Fat']))

  const meals = Array.isArray(plan.meals) ? plan.meals : []
  meals.forEach((meal) => {
    const items = Array.isArray(meal.items) ? meal.items : []
    if (!items.length) {
      lines.push(
        row([
          meal.label || 'Meal',
          meal.scheduledAt || '',
          '—',
          '—',
          0,
          0,
          0,
          0,
        ]),
      )
      return
    }
    items.forEach((item) => {
      lines.push(
        row([
          meal.label || 'Meal',
          meal.scheduledAt || '',
          item.name || item.food || item.recipe_name || 'Item',
          item.quantity || item.servings || '',
          Math.round(Number(item.calories ?? 0) || 0),
          Math.round(Number(item.protein ?? 0) || 0),
          Math.round(Number(item.carbs ?? 0) || 0),
          Math.round(Number(item.fat ?? 0) || 0),
        ]),
      )
    })
  })

  const totals = plan.nutritionTotals || {}
  lines.push('')
  lines.push(
    row([
      'Totals',
      '',
      '',
      '',
      Math.round(totals.calories || 0),
      Math.round(totals.protein || 0),
      Math.round(totals.carbs || 0),
      Math.round(totals.fats || totals.fat || 0),
    ]),
  )

  return lines.join('\n')
}

export function downloadPlanCsv(plan) {
  if (!plan) throw new Error('Cannot export empty plan.')
  const csv = planToCsv(plan)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${(plan.name || 'meal-plan').replace(/\s+/g, '_')}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function planCsvString(plan) {
  return planToCsv(plan)
}
