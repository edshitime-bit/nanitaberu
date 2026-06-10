import { useState } from 'react'

const PROTEINS = ['Chicken', 'Beef', 'Pork', 'Seafood', 'Tofu/Veg']
const CUISINES = ['Japanese', 'Chinese', 'Korean', 'Italian', 'French', 'Thai', 'American']
const TASTES = ['Soy', 'Miso', 'Dashi', 'Sesame', 'Tomato', 'Cream', 'Citrus', 'Spicy', 'Vinegar', 'Butter', 'Coconut', 'Wine']
const STARCHES = ['Rice', 'Udon', 'Soba', 'Chinese Noodles', 'Pasta', 'Bread', 'Dumplings']

const WEIGHT_OPTIONS = [
  { value: 'hearty', label: 'Hearty & filling' },
  { value: 'light',  label: 'Light & fresh' },
]
const COOK_TIME_OPTIONS = [
  { value: 'quick',     label: 'Quick  <45 min' },
  { value: 'medium',    label: 'Medium  45–90 min' },
  { value: 'leisurely', label: 'Leisurely  2hr+' },
]
const COMPLEXITY_OPTIONS = [
  { value: 'simple',  label: 'Simple' },
  { value: 'complex', label: 'Complex' },
]
const SPICE_OPTIONS = [
  { value: 'mild',      label: 'Mild' },
  { value: 'some_heat', label: 'Some heat' },
  { value: 'spicy',     label: 'Spicy 🌶' },
]
const TEMP_OPTIONS = [
  { value: 'warm', label: 'Warm / hot' },
  { value: 'cool', label: 'Cool / room temp' },
]

// ── Design system ─────────────────────────────────────────────────────────────
// Inspired by Calm / Headspace:
//   • Orange = interactive / selected only — never used on static text
//   • Dark charcoal = headings and content
//   • stone-100 = neutral inactive backgrounds (no coloured borders)
//   • Accent is earned — used sparingly so it actually signals something

function Chip({ label, active, onPress }) {
  return (
    <button
      onClick={onPress}
      className={`
        px-3 py-1.5 rounded-full text-sm font-medium
        min-h-[36px] select-none transition-all duration-100 active:scale-95
        ${active ? 'bg-orange-500 text-white' : 'bg-stone-100 text-stone-600'}
      `}
    >
      {label}
    </button>
  )
}

function FilterLabel({ children }) {
  return (
    <p className="px-4 text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
      {children}
    </p>
  )
}

function ToggleRow({ options, value, onToggle }) {
  return (
    <div className="flex gap-2 px-4 flex-wrap">
      {options.map(opt => (
        <Chip
          key={opt.value}
          label={opt.label}
          active={value === opt.value}
          onPress={() => onToggle(opt.value)}
        />
      ))}
    </div>
  )
}

// ── FilterBar ─────────────────────────────────────────────────────────────────

export function FilterBar({
  filters, toggleMulti, toggleSingle, setMainSide,
  moreActiveCount, hasAnyActiveFilter, clearAll, dishCount,
}) {
  const [moreOpen, setMoreOpen] = useState(false)

  return (
    <div className="bg-white border-b border-stone-100 shadow-sm">

      {/* Header: dark title (not orange) + neutral count + orange "Clear all" CTA */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-stone-900 tracking-tight">何食べる</span>
          <span className="text-xs text-stone-400 font-medium">
            {dishCount} {filters.mainSide === 'main' ? 'main' : 'side'}{dishCount !== 1 ? 's' : ''}
          </span>
        </div>
        {hasAnyActiveFilter && (
          <button
            onClick={clearAll}
            className="text-xs text-orange-500 font-semibold px-2 py-1 rounded-lg active:bg-orange-50"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Main / Side — only ONE is orange at a time, so no visual pile-up */}
      <div className="flex gap-1.5 px-4 mb-3">
        {['main', 'side'].map(val => (
          <button
            key={val}
            onClick={() => setMainSide(val)}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors duration-100
              ${filters.mainSide === val
                ? 'bg-orange-500 text-white'
                : 'bg-stone-100 text-stone-500'}`}
          >
            {val.charAt(0).toUpperCase() + val.slice(1)}
          </button>
        ))}
      </div>

      {/* Protein */}
      <FilterLabel>Protein</FilterLabel>
      <div className="chip-row mb-3">
        <Chip label="Any" active={filters.proteins.length === 0} onPress={() => toggleMulti('proteins', '__clear__')} />
        {PROTEINS.map(p => (
          <Chip key={p} label={p} active={filters.proteins.includes(p)} onPress={() => toggleMulti('proteins', p)} />
        ))}
      </div>

      {/* Cuisine */}
      <FilterLabel>Cuisine</FilterLabel>
      <div className="chip-row mb-3">
        <Chip label="Any" active={filters.cuisines.length === 0} onPress={() => toggleMulti('cuisines', '__clear__')} />
        {CUISINES.map(c => (
          <Chip key={c} label={c} active={filters.cuisines.includes(c)} onPress={() => toggleMulti('cuisines', c)} />
        ))}
      </div>

      {/* More toggle — neutral gray, orange badge only when active */}
      <button
        onClick={() => setMoreOpen(o => !o)}
        className="flex items-center gap-1.5 mx-4 mb-3 px-3 py-1.5 rounded-full bg-stone-100 text-sm text-stone-600 font-medium active:bg-stone-200 transition-colors"
      >
        <span className="text-xs">{moreOpen ? '▲' : '▼'}</span>
        <span>More filters</span>
        {moreActiveCount > 0 && (
          <span className="bg-orange-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
            {moreActiveCount}
          </span>
        )}
      </button>

      {/* Extended filters */}
      {moreOpen && (
        <div className="border-t border-stone-100 pt-3 pb-2 space-y-4">
          <div>
            <FilterLabel>Taste / Base</FilterLabel>
            <div className="chip-row">
              {TASTES.map(t => (
                <Chip key={t} label={t} active={filters.tastes.includes(t)} onPress={() => toggleMulti('tastes', t)} />
              ))}
            </div>
          </div>
          <div>
            <FilterLabel>Starch Pairing</FilterLabel>
            <div className="chip-row">
              {STARCHES.map(s => (
                <Chip key={s} label={s} active={filters.starches.includes(s)} onPress={() => toggleMulti('starches', s)} />
              ))}
            </div>
          </div>
          <div>
            <FilterLabel>Cook Time</FilterLabel>
            <ToggleRow options={COOK_TIME_OPTIONS} value={filters.cookTime} onToggle={v => toggleSingle('cookTime', v)} />
          </div>
          <div>
            <FilterLabel>Complexity</FilterLabel>
            <ToggleRow options={COMPLEXITY_OPTIONS} value={filters.complexity} onToggle={v => toggleSingle('complexity', v)} />
          </div>
          <div>
            <FilterLabel>Weight</FilterLabel>
            <ToggleRow options={WEIGHT_OPTIONS} value={filters.weight} onToggle={v => toggleSingle('weight', v)} />
          </div>
          <div>
            <FilterLabel>Spice Level</FilterLabel>
            <ToggleRow options={SPICE_OPTIONS} value={filters.spice} onToggle={v => toggleSingle('spice', v)} />
          </div>
          <div className="pb-1">
            <FilterLabel>Temperature</FilterLabel>
            <ToggleRow options={TEMP_OPTIONS} value={filters.temperature} onToggle={v => toggleSingle('temperature', v)} />
          </div>
        </div>
      )}
    </div>
  )
}
