import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from './hooks/useAuth'
import { useFilters } from './hooks/useFilters'
import { useDishes } from './hooks/useDishes'
import { FilterBar } from './components/FilterBar'
import { DishCard } from './components/DishCard'
import { DishDetail } from './components/DishDetail'
import { AddDishStub } from './components/AddDishStub'
import { EmptyState } from './components/EmptyState'

export default function App() {
  const { isAuthenticated } = useAuth()
  const { filters, toggleMulti, toggleSingle, setMainSide, clearAll, moreActiveCount, hasAnyActiveFilter } = useFilters()
  const { dishes, markCooked } = useDishes(filters)
  const [selectedDish, setSelectedDish] = useState(null)
  const [addingDish, setAddingDish] = useState(false)

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
    <div className="h-dvh flex flex-col bg-stone-50 max-w-lg mx-auto relative">

      <FilterBar
        filters={filters}
        toggleMulti={toggleMulti}
        toggleSingle={toggleSingle}
        setMainSide={setMainSide}
        moreActiveCount={moreActiveCount}
        hasAnyActiveFilter={hasAnyActiveFilter}
        clearAll={clearAll}
        dishCount={dishes.length}
      />

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
            <motion.div key="list" className="px-4 pt-4 pb-28 space-y-3">
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

      {/* Floating action button — the path to add a dish */}
      <motion.button
        onClick={() => setAddingDish(true)}
        whileTap={{ scale: 0.88 }}
        whileHover={{ scale: 1.08 }}
        transition={{ type: 'spring', stiffness: 500, damping: 22 }}
        className="absolute bottom-6 right-4 w-14 h-14 bg-orange-500 text-white rounded-full shadow-lg text-3xl flex items-center justify-center z-30 leading-none"
        style={{ bottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
        aria-label="Add a dish"
      >
        +
      </motion.button>

      {/* Dish detail — slides up from bottom */}
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

      {/* Add dish — slides up from bottom */}
      <AnimatePresence>
        {addingDish && (
          <motion.div
            key="add-dish"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="fixed inset-0 z-50 max-w-lg mx-auto"
          >
            <AddDishStub onClose={() => setAddingDish(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
