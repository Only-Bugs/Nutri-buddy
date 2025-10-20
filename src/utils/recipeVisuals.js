const mealTypeVisuals = {
  Breakfast: {
    icon: ['fas', 'mug-hot'],
    gradient: 'from-amber-200 via-amber-100 to-orange-100',
    accent: 'text-amber-700',
    badge: 'bg-amber-100 text-amber-700',
  },
  Lunch: {
    icon: ['fas', 'bowl-food'],
    gradient: 'from-lime-200 via-lime-100 to-green-100',
    accent: 'text-lime-700',
    badge: 'bg-lime-100 text-lime-700',
  },
  Dinner: {
    icon: ['fas', 'utensils'],
    gradient: 'from-emerald-200 via-emerald-100 to-green-100',
    accent: 'text-emerald-700',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  Snack: {
    icon: ['fas', 'apple-whole'],
    gradient: 'from-rose-200 via-rose-100 to-pink-100',
    accent: 'text-rose-700',
    badge: 'bg-rose-100 text-rose-700',
  },
  Dessert: {
    icon: ['fas', 'ice-cream'],
    gradient: 'from-purple-200 via-purple-100 to-pink-100',
    accent: 'text-purple-700',
    badge: 'bg-purple-100 text-purple-700',
  },
  Beverage: {
    icon: ['fas', 'martini-glass-citrus'],
    gradient: 'from-sky-200 via-sky-100 to-cyan-100',
    accent: 'text-sky-700',
    badge: 'bg-sky-100 text-sky-700',
  },
}

const defaultMealVisual = {
  icon: ['fas', 'utensils'],
  gradient: 'from-green-200 via-green-100 to-emerald-100',
  accent: 'text-green-700',
  badge: 'bg-green-100 text-green-700',
}

const macroDefinitions = [
  {
    key: 'calories',
    label: 'Calories',
    icon: ['fas', 'fire'],
    accent: 'text-amber-600',
    bg: 'bg-amber-50',
    formatter: (nutrition = {}) => `${Math.round(nutrition.calories || 0)} kcal`,
  },
  {
    key: 'protein',
    label: 'Protein',
    icon: ['fas', 'drumstick-bite'],
    accent: 'text-emerald-600',
    bg: 'bg-emerald-50',
    formatter: (nutrition = {}) => `${Math.round(nutrition.protein || 0)} g`,
  },
  {
    key: 'carbs',
    label: 'Carbs',
    icon: ['fas', 'bread-slice'],
    accent: 'text-sky-600',
    bg: 'bg-sky-50',
    formatter: (nutrition = {}) => `${Math.round(nutrition.carbs || 0)} g`,
  },
  {
    key: 'fat',
    label: 'Fat',
    icon: ['fas', 'droplet'],
    accent: 'text-rose-600',
    bg: 'bg-rose-50',
    formatter: (nutrition = {}) => `${Math.round(nutrition.fat || 0)} g`,
  },
  {
    key: 'fiber',
    label: 'Fiber',
    icon: ['fas', 'leaf'],
    accent: 'text-green-600',
    bg: 'bg-green-50',
    formatter: (nutrition = {}) => `${Math.round(nutrition.fiber || 0)} g`,
  },
  {
    key: 'sugar',
    label: 'Sugar',
    icon: ['fas', 'ice-cream'],
    accent: 'text-purple-600',
    bg: 'bg-purple-50',
    formatter: (nutrition = {}) => `${Math.round(nutrition.sugar || 0)} g`,
  },
  {
    key: 'sodium',
    label: 'Sodium',
    icon: ['fas', 'droplet'],
    accent: 'text-blue-600',
    bg: 'bg-blue-50',
    formatter: (nutrition = {}) => `${Math.round(nutrition.sodium || 0)} mg`,
  },
]

export function getMealTypeVisual(primaryType) {
  return mealTypeVisuals[primaryType] || defaultMealVisual
}

export function getSecondaryMealTypes(mealTypes = [], primaryType) {
  return mealTypes.filter((type) => type !== primaryType).slice(0, 2)
}

export function buildMacroSummary(nutrition = {}, includeExtended = false) {
  const baseKeys = includeExtended ? macroDefinitions : macroDefinitions.slice(0, 4)
  return baseKeys.map((def) => ({
    ...def,
    value: def.formatter(nutrition),
  }))
}

export function buildInfoItems(recipe = {}) {
  const totalTime = (recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0)
  return [
    {
      label: 'Prep',
      value: `${recipe.prepTimeMinutes || 0} min`,
      icon: ['fas', 'clock'],
    },
    {
      label: 'Cook',
      value: `${recipe.cookTimeMinutes || 0} min`,
      icon: ['fas', 'hourglass-half'],
    },
    {
      label: 'Servings',
      value: recipe.servings || 1,
      icon: ['fas', 'utensils'],
    },
    {
      label: 'Total time',
      value: `${totalTime} min`,
      icon: ['fas', 'stopwatch'],
    },
    {
      label: 'Cuisine',
      value: recipe.cuisines?.join(', ') || '—',
      icon: ['fas', 'globe'],
    },
  ]
}
