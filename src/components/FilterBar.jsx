import { useState } from 'react'

// ─── Option lists (PRD §4.1 / §4.2) ──────────────────────────────────────────

const PROTEINS = ['Chicken', 'Beef', 'Pork', 'Seafood', 'Tofu/Veg']
const CUISINES = ['Japanese', 'Chinese', 'Korean', 'Italian', 'French', 'Thai', 'American']
const TASTES = ['Soy', 'Miso', 'Dashi', 'Sesame', 'Tomato', 'Cream', 'Citrus', 'Spicy', 'Vinegar', 'Butter', 'Coconut', 'Wine']
const STARCHES = ['Rice', 'Udon', 'Soba', 'Chinese Noodles', 'Pasta', 'Bread', 'Dumplings']
const WEIGHT_OPTIONS = [{ value: 'hearty', label: 'Hearty & filling' }, { value: 'light', label: 'Light & fresh' }]
const COOK_TIME_OPTIONS = [{ value: 'quick', label: 'Quick (<45 min)' }, { value: 'leisurely', label: 'Leisurely (1hr+)' }]
const SPICE_OPTIONS = [{ value: 'mild', label: 'Mild' }, { value: 'some_heat', label: 'Some heat' }, { value: 'spicy', label: 'Spicy 🌶' }]
const TEMP_OPTIONS = [{ value: 'warm', label: 'Warm / hot' }, { value: 'cool', label: 'Cool / room temp' }]

// ─── Shared chip primitives ───────────────────────────────────────────────────

function Chip({ label, active, onPress }) {
  return (
    <button
      onClick={onPress}
      className={`
        shrink-0 px-3 py-1.5 rounded-full text-sm font-medium
        min-h-[36px] min-w-[44px] select-none transition-colors duration-100
        active:scale-95
        ${active
          ? 'bg-stone-900 text-white'
          : 'bg-white border border-stone-200 text-stone-600'}
      `}
    >
      {label}
    </button>
  )
}

function AnyChip({ active, onPress }) {
  return <Chip label="Any" active={active} onPress={onPress} />
}

// Horizontal scroll row — hides the scrollbar on all platforms.
function ChipRow({ children }) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4">
      {children}
    </div>
  )
}

// Label above a filter row.
function FilterLabel({ children }) {
  return <p className="px-4 text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1.5">{children}</p>
}

// ─── More panel sub-sections ─────────────────────────────────────────────────

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

// ─── Main FilterBar component ─────────────────────────────────────────────────

export function FilterBar({ filters, toggleMulti, toggleSingle, setMainSide, moreActiveCount, hasAnyActiveFilter, clearAll, dishCount }) {
  const [moreOpen, setMoreOpen] = useState(false)

  return (
    <div className="bg-white border-b border-stone-100 shadow-sm">

      {/* App name row */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div>
          <span className="text-base font-bold text-stone-900 tracking-tight">何食べる</span>
          <span className="ml-2 text-xs text-stone-400">
            {dishCount} {filters.mainSide === 'main' ? 'main' : 'side'}{dishCount !== 1 ? 's' : ''}
          </span>
        </div>
        {hasAnyActiveFilter && (
          <button
            onClick={clearAll}
            className="text-xs text-violet-600 font-medium px-2 py-1 rounded-lg active:bg-violet-50"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Main / Side toggle */}
      <div className="flex gap-1.5 px-4 mb-3">
        <button
          onClick={() => setMainSide('main')}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors duration-100
            ${filters.mainSide === 'main' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-500'}`}
        >
          Main
        </button>
        <button
          onClick={() => setMainSide('side')}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors duration-100
            ${filters.mainSide === 'side' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-500'}`}
        >
          Side
        </button>
      </div>

      {/* Protein */}
      <FilterLabel>Protein</FilterLabel>
      <ChipRow>
        <AnyChip active={filters.proteins.length === 0} onPress={() => toggleMulti('proteins', '__clear__')} />
        {PROTEINS.map(p => (
          <Chip
            key={p}
            label={p}
            active={filters.proteins.includes(p)}
            onPress={() => toggleMulti('proteins', p)}
          />
        ))}
      </ChipRow>

      {/* Cuisine */}
      <FilterLabel className="mt-3">Cuisine</FilterLabel>
      <ChipRow>
        <AnyChip active={filters.cuisines.length === 0} onPress={() => toggleMulti('cuisines', '__clear__')} />
        {CUISINES.map(c => (
          <Chip
            key={c}
            label={c}
            active={filters.cuisines.includes(c)}
            onPress={() => toggleMulti('cuisines', c)}
          />
        ))}
      </ChipRow>

      {/* More toggle */}
      <button
        onClick={() => setMoreOpen(o => !o)}
        className="flex items-center gap-1.5 mx-4 my-3 px-3 py-1.5 rounded-full border border-stone-200 text-sm text-stone-600 font-medium active:bg-stone-50"
      >
        <span>{moreOpen ? '▴' : '▾'}</span>
        <span>More filters</span>
        {moreActiveCount > 0 && (
          <span className="bg-violet-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
            {moreActiveCount}
          </span>
        )}
      </button>

      {/* Extended filters panel */}
      {moreOpen && (
        <div className="border-t border-stone-100 pt-3 pb-2 space-y-3">
          <div>
            <FilterLabel>Taste / Base</FilterLabel>
            <ChipRow>
              {TASTES.map(t => (
                <Chip
                  key={t}
                  label={t}
                  active={filters.tastes.includes(t)}
                  onPress={() => toggleMulti('tastes', t)}
                />
              ))}
            </ChipRow>
          </div>

          <div>
            <FilterLabel>Starch Pairing</FilterLabel>
            <ChipRow>
              {STARCHES.map(s => (
                <Chip
                  key={s}
                  label={s}
                  active={filters.starches.includes(s)}
                  onPress={() => toggleMulti('starches', s)}
                />
              ))}
            </ChipRow>
          </div>

          <div>
            <FilterLabel>Weight</FilterLabel>
            <ToggleRow options={WEIGHT_OPTIONS} value={filters.weight} onToggle={v => toggleSingle('weight', v)} />
          </div>

          <div>
            <FilterLabel>Cook Time</FilterLabel>
            <ToggleRow options={COOK_TIME_OPTIONS} value={filters.cookTime} onToggle={v => toggleSingle('cookTime', v)} />
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
