import { useState, useMemo } from 'react'
import { DISHES } from '../data/dishes'

export function useDishes(filters) {
  const [dishes, setDishes] = useState(DISHES)

  function markCooked(id) {
    const today = new Date().toISOString().split('T')[0]
    setDishes(prev =>
      prev.map(d => (d.id === id ? { ...d, lastCooked: today } : d))
    )
  }

  const filtered = useMemo(() => {
    return dishes.filter(dish => {
      if (dish.mainSide !== filters.mainSide) return false
      if (filters.proteins.length > 0 && !filters.proteins.includes(dish.protein)) return false
      if (filters.cuisines.length > 0 && !filters.cuisines.includes(dish.cuisine)) return false
      if (filters.tastes.length > 0 && !filters.tastes.some(t => dish.tastes.includes(t))) return false
      if (filters.starches.length > 0 && !filters.starches.some(s => dish.starches.includes(s))) return false
      if (filters.weight && dish.weight !== filters.weight) return false
      if (filters.cookTime && dish.cookTime !== filters.cookTime) return false
      if (filters.complexity && dish.complexity !== filters.complexity) return false
      if (filters.spice && dish.spice !== filters.spice) return false
      if (filters.temperature && dish.temperature !== filters.temperature) return false
      return true
    })
  }, [dishes, filters])

  return { dishes: filtered, allDishes: dishes, markCooked }
}
