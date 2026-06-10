import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PROTEINS = ['Chicken', 'Beef', 'Pork', 'Seafood', 'Tofu/Veg']
const CUISINES = ['Japanese', 'Chinese', 'Korean', 'Italian', 'French', 'Thai', 'American']
const TASTES   = ['Soy', 'Miso', 'Dashi', 'Sesame', 'Tomato', 'Cream', 'Citrus', 'Spicy', 'Vinegar', 'Butter', 'Coconut', 'Wine']
const STARCHES = ['Rice', 'Udon', 'Soba', 'Chinese Noodles', 'Pasta', 'Bread', 'Dumplings']
const WEIGHT_OPTIONS     = [{ value: 'hearty', label: 'Hearty & filling' }, { value: 'light',     label: 'Light & fresh' }]
const COOK_TIME_OPTIONS  = [{ value: 'quick',  label: 'Quick  <45 min'   }, { value: 'medium',    label: 'Medium  45–90 min' }, { value: 'leisurely', label: 'Leisurely  2hr+' }]
const COMPLEXITY_OPTIONS = [{ value: 'simple', label: 'Simple'           }, { value: 'complex',   label: 'Complex' }]
const SPICE_OPTIONS      = [{ value: 'mild',   label: 'Mild'             }, { value: 'some_heat', label: 'Some heat' }, { value: 'spicy', label: 'Spicy 🌶' }]
const TEMP_OPTIONS       = [{ value: 'warm',   label: 'Warm / hot'       }, { value: 'cool',      label: 'Cool / room temp' }]

// ── Chip — CSS transition for colour, Framer spring for the tap press ─────────
function Chip({ label, active, onPress }) {
  return (
    <motion.button
      onClick={onPress}
      whileTap={{ scale: 0.88 }}
      transition={{ type: 'spring', stiffness: 600, damping: 20 }}
      className={`
        px-3 py-1.5 rounded-full text-sm font-medium min-h-[36px] select-none
        transition-colors duration-150
        ${active ? 'bg-orange-500 text-white shadow-sm' : 'bg-stone-100 text-stone-600'}
      `}
    >
      {label}
    </motion.button>
  )
}

function FilterLabel({ children }) {
  return <p className="px-4 text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">{children}</p>
}

function ChipGroup({ children }) {
  return <div className="flex flex-wrap gap-2 px-4">{children}</div>
}

function ToggleRow({ options, value, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2 px-4">
      {options.map(opt => (
        <Chip key={opt.value} label={opt.label} active={value === opt.value} onPress={() => onToggle(opt.value)} />
      ))}
    </div>
  )
}

// ── FilterBar ─────────────────────────────────────────────────────────────────
export function FilterBar({ filters, toggleMulti, toggleSingle, setMainSide, moreActiveCount, hasAnyActiveFilter, clearAll, dishCount }) {
  const [moreOpen, setMoreOpen] = useState(false)

  return (
    <div className="bg-white border-b border-stone-100 shadow-sm">

      {/* Gradient header — identity only, no interactive clutter */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-400 px-4 pt-4 pb-3">
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-white tracking-tight">🍱 何食べる</span>
          <span className="text-sm text-orange-100 font-medium">
            {dishCount} {filters.mainSide === 'main' ? 'main' : 'side'}{dishCount !== 1 ? 's' : ''}
          </span>
        </div>
        <p className="text-xs text-orange-200 mt-0.5">What should we eat?</p>
      </div>

      {/* Filter controls */}
      <div className="pt-3 pb-1">

        {/* Main / Side — sliding indicator gives iOS segmented-control feel */}
        <div className="relative flex bg-stone-100 rounded-xl mx-4 mb-4">
          <motion.div
            className="absolute inset-0 w-1/2 bg-orange-500 rounded-xl shadow-sm"
            animate={{ x: filters.mainSide === 'side' ? '100%' : '0%' }}
            transition={{ type: 'spring', stiffness: 500, damping: 38 }}
          />
          {['main', 'side'].map(val => (
            <button
              key={val}
              onClick={() => setMainSide(val)}
              className={`relative z-10 flex-1 py-2 text-sm font-semibold transition-colors duration-150
                ${filters.mainSide === val ? 'text-white' : 'text-stone-500'}`}
            >
              {val.charAt(0).toUpperCase() + val.slice(1)}
            </button>
          ))}
        </div>

        {/* Protein */}
        <FilterLabel>Protein</FilterLabel>
        <div className="mb-4">
          <ChipGroup>
            <Chip label="Any" active={filters.proteins.length === 0} onPress={() => toggleMulti('proteins', '__clear__')} />
            {PROTEINS.map(p => <Chip key={p} label={p} active={filters.proteins.includes(p)} onPress={() => toggleMulti('proteins', p)} />)}
          </ChipGroup>
        </div>

        {/* Cuisine */}
        <FilterLabel>Cuisine</FilterLabel>
        <div className="mb-4">
          <ChipGroup>
            <Chip label="Any" active={filters.cuisines.length === 0} onPress={() => toggleMulti('cuisines', '__clear__')} />
            {CUISINES.map(c => <Chip key={c} label={c} active={filters.cuisines.includes(c)} onPress={() => toggleMulti('cuisines', c)} />)}
          </ChipGroup>
        </div>

        {/* Clear all — simple, always in the filter area when active */}
        <AnimatePresence>
          {hasAnyActiveFilter && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 mb-3">
                <motion.button
                  onClick={clearAll}
                  whileTap={{ scale: 0.95 }}
                  className="text-sm text-orange-500 font-semibold flex items-center gap-1 active:opacity-70"
                >
                  <span className="text-base leading-none">×</span> Clear all filters
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* More toggle */}
        <div className="px-4 mb-3">
          <motion.button
            onClick={() => setMoreOpen(o => !o)}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 text-sm text-stone-600 font-medium"
          >
            <motion.span
              animate={{ rotate: moreOpen ? 180 : 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className="text-xs inline-block"
            >
              ▼
            </motion.span>
            <span>More filters</span>
            <AnimatePresence>
              {moreActiveCount > 0 && (
                <motion.span
                  key="badge"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 600, damping: 20 }}
                  className="bg-orange-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none"
                >
                  {moreActiveCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Extended filters — springs open, pushing cards down naturally */}
        <AnimatePresence initial={false}>
          {moreOpen && (
            <motion.div
              key="more-panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                height: { type: 'spring', stiffness: 280, damping: 28 },
                opacity: { duration: 0.2 },
              }}
              style={{ overflow: 'hidden' }}
            >
              <div className="border-t border-stone-100 pt-4 pb-2 space-y-4">
                <div><FilterLabel>Taste / Base</FilterLabel><ChipGroup>{TASTES.map(t => <Chip key={t} label={t} active={filters.tastes.includes(t)} onPress={() => toggleMulti('tastes', t)} />)}</ChipGroup></div>
                <div><FilterLabel>Starch Pairing</FilterLabel><ChipGroup>{STARCHES.map(s => <Chip key={s} label={s} active={filters.starches.includes(s)} onPress={() => toggleMulti('starches', s)} />)}</ChipGroup></div>
                <div><FilterLabel>Cook Time</FilterLabel><ToggleRow options={COOK_TIME_OPTIONS} value={filters.cookTime} onToggle={v => toggleSingle('cookTime', v)} /></div>
                <div><FilterLabel>Complexity</FilterLabel><ToggleRow options={COMPLEXITY_OPTIONS} value={filters.complexity} onToggle={v => toggleSingle('complexity', v)} /></div>
                <div><FilterLabel>Weight</FilterLabel><ToggleRow options={WEIGHT_OPTIONS} value={filters.weight} onToggle={v => toggleSingle('weight', v)} /></div>
                <div><FilterLabel>Spice Level</FilterLabel><ToggleRow options={SPICE_OPTIONS} value={filters.spice} onToggle={v => toggleSingle('spice', v)} /></div>
                <div className="pb-2"><FilterLabel>Temperature</FilterLabel><ToggleRow options={TEMP_OPTIONS} value={filters.temperature} onToggle={v => toggleSingle('temperature', v)} /></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
