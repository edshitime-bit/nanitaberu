import { useState, useMemo } from 'react'
import { DISHES } from '../data/dishes'

// Owns the local dish list. Phase 2 replaces useState(DISHES) with a
// Firestore listener — the returned shape and markCooked API stay identical.
export function useDishes(filters) {
  const [dishes, setDishes] = useState(DISHES)

  function markCooked(id) {
    const today = new Date().toISOString().split('T')[0]
    setDishes(prev =>
      prev.map(d => (d.id === id ? { ...d, lastCooked: today } : d))
    )
  }

  // Filter logic: OR within a category, AND across categories (PRD §4).
  const filtered = useMemo(() => {
    return dishes.filter(dish => {
      // mainSide is always active (has a default).
      if (dish.mainSide !== filters.mainSide) return false

      // Multi-selects: skip constraint when empty (unset = show all).
      if (filters.proteins.length > 0 && !filters.proteins.includes(dish.protein)) return false
      if (filters.cuisines.length > 0 && !filters.cuisines.includes(dish.cuisine)) return false

      // OR within taste/starch: dish must match at least one selected value.
      if (filters.tastes.length > 0 && !filters.tastes.some(t => dish.tastes.includes(t))) return false
      if (filters.starches.length > 0 && !filters.starches.some(s => dish.starches.includes(s))) return false

      // Single-select toggles.
      if (filters.weight && dish.weight !== filters.weight) return false
      if (filters.cookTime && dish.cookTime !== filters.cookTime) return false
      if (filters.spice && dish.spice !== filters.spice) return false
      if (filters.temperature && dish.temperature !== filters.temperature) return false

      return true
    })
  }, [dishes, filters])

  return { dishes: filtered, allDishes: dishes, markCooked }
}
