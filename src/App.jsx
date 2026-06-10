import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from './hooks/useAuth'
import { useFilters } from './hooks/useFilters'
import { useDishes } from './hooks/useDishes'
import { FilterBar } from './components/FilterBar'
import { DishCard } from './components/DishCard'
import { DishDetail } from './components/DishDetail'
import { EmptyState } from './components/EmptyState'

export default function App() {
  const { isAuthenticated } = useAuth()
  const { filters, toggleMulti, toggleSingle, setMainSide, clearAll, moreActiveCount, hasAnyActiveFilter } = useFilters()
  const { dishes, markCooked } = useDishes(filters)
  const [selectedDish, setSelectedDish] = useState(null)

  function handleToggleMulti(key, value) {
    toggleMulti(key, value)
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

      {/* Subtle warm gradient behind the dish list */}
      <main
        className="flex-1 overflow-y-auto"
        style={{ background: 'linear-gradient(to bottom, #fafaf9 0%, #fff7ed 100%)' }}
      >
        <AnimatePresence mode="popLayout">
          {dishes.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <EmptyState onClearAll={clearAll} />
            </motion.div>
          ) : (
            <motion.div key="list" className="px-4 pt-4 pb-8 space-y-3">
              <AnimatePresence mode="popLayout">
                {dishes.map((dish, index) => (
                  <motion.div
                    key={dish.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      layout: { type: 'spring', stiffness: 350, damping: 32 },
                      opacity: { duration: 0.18 },
                      y: { type: 'spring', stiffness: 500, damping: 30, delay: Math.min(index * 0.035, 0.25) },
                      scale: { duration: 0.15 },
                    }}
                  >
                    <DishCard dish={dish} onTap={() => setSelectedDish(dish)} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* DishDetail slides up as a bottom sheet with spring physics */}
      <AnimatePresence>
        {selectedDish && (
          <motion.div
            key="detail"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="fixed inset-0 z-50 max-w-lg mx-auto"
          >
            <DishDetail
              dish={selectedDish}
              onClose={() => setSelectedDish(null)}
              onMakingTonight={() => handleMakingTonight(selectedDish)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
