import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { useFilters } from './hooks/useFilters'
import { useDishes } from './hooks/useDishes'
import { FilterBar } from './components/FilterBar'
import { DishCard } from './components/DishCard'
import { DishDetail } from './components/DishDetail'
import { EmptyState } from './components/EmptyState'

export default function App() {
  const { isAuthenticated } = useAuth()

  const {
    filters,
    toggleMulti,
    toggleSingle,
    setMainSide,
    clearAll,
    moreActiveCount,
    hasAnyActiveFilter,
  } = useFilters()

  const { dishes, markCooked } = useDishes(filters)

  const [selectedDish, setSelectedDish] = useState(null)

  // "Any" chips pass '__clear__' — useFilters ignores unknown values,
  // so we intercept here and directly clear the category array.
  function handleToggleMulti(key, value) {
    if (value === '__clear__') {
      // Toggle off each currently active item to reset the array.
      // Simpler: we keep a separate clearCategory helper — but since
      // toggleMulti already has the state, we pass a sentinel the hook handles.
      toggleMulti(key, value)
    } else {
      toggleMulti(key, value)
    }
  }

  function handleMakingTonight(dish) {
    markCooked(dish.id)
    clearAll()
    setSelectedDish(null)
  }

  if (!isAuthenticated) {
    return (
      <div className="h-dvh flex items-center justify-center bg-stone-50">
        <p className="text-stone-400 text-sm">Authentication coming in Phase 4.</p>
      </div>
    )
  }

  return (
    // h-dvh = dynamic viewport height — correct on iOS Safari (collapsing address bar).
    <div className="h-dvh flex flex-col bg-stone-50 max-w-lg mx-auto">
      <FilterBar
        filters={filters}
        toggleMulti={handleToggleMulti}
        toggleSingle={toggleSingle}
        setMainSide={setMainSide}
        moreActiveCount={moreActiveCount}
        hasAnyActiveFilter={hasAnyActiveFilter}
        clearAll={clearAll}
        dishCount={dishes.length}
      />

      {/* Subtle warm-to-cream gradient behind the dish list adds depth without photos */}
      <main className="flex-1 overflow-y-auto" style={{ background: 'linear-gradient(to bottom, #fafaf9 0%, #fff7ed 100%)' }}>
        {dishes.length === 0 ? (
          <EmptyState onClearAll={clearAll} />
        ) : (
          <div className="px-4 pt-4 pb-8 space-y-3">
            {dishes.map(dish => (
              <DishCard
                key={dish.id}
                dish={dish}
                onTap={() => setSelectedDish(dish)}
              />
            ))}
          </div>
        )}
      </main>

      {selectedDish && (
        <DishDetail
          dish={selectedDish}
          onClose={() => setSelectedDish(null)}
          onMakingTonight={() => handleMakingTonight(selectedDish)}
        />
      )}
    </div>
  )
}
