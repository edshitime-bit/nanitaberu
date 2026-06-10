import { useState, useCallback } from 'react'

// mainSide always has a value (defaults to 'main') — it always constrains.
// All other filters start unset — unset means no constraint (PRD §4).
const INITIAL_FILTERS = {
  mainSide: 'main',
  proteins: [],
  cuisines: [],
  tastes: [],
  starches: [],
  weight: null,
  cookTime: null,
  spice: null,
  temperature: null,
}

export function useFilters() {
  const [filters, setFilters] = useState(INITIAL_FILTERS)

  // Toggle a value in a multi-select array (OR logic within category).
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

  // Toggle a single-select value — tapping the active value clears it.
  const toggleSingle = useCallback((key, value) => {
    setFilters(f => ({ ...f, [key]: f[key] === value ? null : value }))
  }, [])

  const setMainSide = useCallback((value) => {
    setFilters(f => ({ ...f, mainSide: value }))
  }, [])

  const clearAll = useCallback(() => setFilters(INITIAL_FILTERS), [])

  // Count of active extended-panel filters for the 'More' badge.
  const moreActiveCount = [
    filters.tastes.length > 0,
    filters.starches.length > 0,
    filters.weight !== null,
    filters.cookTime !== null,
    filters.spice !== null,
    filters.temperature !== null,
  ].filter(Boolean).length

  // Count of active quick filters (excluding mainSide which is always set).
  const quickActiveCount = [
    filters.proteins.length > 0,
    filters.cuisines.length > 0,
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
    quickActiveCount,
    hasAnyActiveFilter,
  }
}
