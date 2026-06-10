import { useState, useCallback } from 'react'

const INITIAL_FILTERS = {
  mainSide: 'main',
  proteins: [],
  cuisines: [],
  tastes: [],
  starches: [],
  weight: null,
  cookTime: null,
  complexity: null,
  spice: null,
  temperature: null,
}

export function useFilters() {
  const [filters, setFilters] = useState(INITIAL_FILTERS)

  // Passing '__clear__' resets the category to [] ("Any" chip behaviour).
  const toggleMulti = useCallback((key, value) => {
    if (value === '__clear__') {
      setFilters(f => ({ ...f, [key]: [] }))
      return
    }
    setFilters(f => ({
      ...f,
      [key]: f[key].includes(value)
        ? f[key].filter(v => v !== value)
        : [...f[key], value],
    }))
  }, [])

  // Tapping the active value clears it back to null.
  const toggleSingle = useCallback((key, value) => {
    setFilters(f => ({ ...f, [key]: f[key] === value ? null : value }))
  }, [])

  const setMainSide = useCallback((value) => {
    setFilters(f => ({ ...f, mainSide: value }))
  }, [])

  const clearAll = useCallback(() => setFilters(INITIAL_FILTERS), [])

  const moreActiveCount = [
    filters.tastes.length > 0,
    filters.starches.length > 0,
    filters.weight !== null,
    filters.cookTime !== null,
    filters.complexity !== null,
    filters.spice !== null,
    filters.temperature !== null,
  ].filter(Boolean).length

  const hasAnyActiveFilter =
    filters.proteins.length > 0 ||
    filters.cuisines.length > 0 ||
    moreActiveCount > 0

  return {
    filters,
    toggleMulti,
    toggleSingle,
    setMainSide,
    clearAll,
    moreActiveCount,
    hasAnyActiveFilter,
  }
}
