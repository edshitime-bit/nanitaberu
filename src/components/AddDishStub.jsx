import { motion } from 'framer-motion'

// Stub for Phase 2. Shows the planned form shape so the path is clear.
// Replace this entire component with the real form in Phase 2.

const PLANNED_FIELDS = [
  { emoji: '🍽️', label: 'Name', note: 'e.g. Chicken Karaage' },
  { emoji: '🌏', label: 'Cuisine', note: 'Japanese · Chinese · Korean · …' },
  { emoji: '🥩', label: 'Protein', note: 'Chicken · Beef · Pork · Seafood · …' },
  { emoji: '🧂', label: 'Taste / Base', note: 'Soy · Miso · Tomato · Cream · …' },
  { emoji: '🍚', label: 'Starch Pairing', note: 'Rice · Pasta · Bread · …' },
  { emoji: '⏱️', label: 'Cook Time', note: 'Quick · Medium · Leisurely' },
  { emoji: '📷', label: 'Photo', note: 'Optional — from camera roll or in-app' },
]

export function AddDishStub({ onClose }) {
  return (
    <div className="h-full bg-stone-50 flex flex-col">

      {/* Top bar */}
      <div className="flex items-center px-4 py-3 bg-white border-b border-stone-100 shrink-0">
        <motion.button
          onClick={onClose}
          whileTap={{ scale: 0.9 }}
          className="mr-3 w-9 h-9 flex items-center justify-center rounded-full bg-stone-100 text-stone-600 text-lg"
          aria-label="Close"
        >
          ×
        </motion.button>
        <h1 className="text-base font-bold text-stone-900">Add a dish</h1>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-6">

        <div className="flex flex-col items-center text-center mb-8">
          <span className="text-5xl mb-3">🍳</span>
          <h2 className="text-lg font-bold text-stone-900 mb-1">Dish library — Phase 2</h2>
          <p className="text-sm text-stone-500 leading-relaxed max-w-xs">
            Here you'll build your personal dish library. Every field is a tap — no typing except the dish name.
          </p>
        </div>

        {/* Planned fields preview */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm divide-y divide-stone-100">
          {PLANNED_FIELDS.map(({ emoji, label, note }) => (
            <div key={label} className="flex items-center gap-3 px-4 py-3">
              <span className="text-xl w-7 text-center">{emoji}</span>
              <div>
                <p className="text-sm font-semibold text-stone-700">{label}</p>
                <p className="text-xs text-stone-400">{note}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-stone-400 text-center mt-6">
          Minimum entry is name + a few taps. Under 20 seconds.
        </p>
      </div>

      {/* Disabled CTA */}
      <div
        className="px-4 pt-3 bg-white border-t border-stone-100"
        style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
      >
        <button
          disabled
          className="w-full py-4 bg-stone-200 text-stone-400 font-bold text-base rounded-2xl cursor-not-allowed"
        >
          Save dish — coming in Phase 2
        </button>
      </div>
    </div>
  )
}
