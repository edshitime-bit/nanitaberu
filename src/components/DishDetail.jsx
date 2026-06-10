// Full-screen detail view — renders over the main list as a fixed overlay.
// "Making this tonight!" logs today's date, clears filters, and returns to list.

const CUISINE_COLORS = {
  Japanese: 'bg-red-100 text-red-700',
  Chinese: 'bg-orange-100 text-orange-700',
  Korean: 'bg-pink-100 text-pink-700',
  Italian: 'bg-green-100 text-green-700',
  French: 'bg-blue-100 text-blue-700',
  Thai: 'bg-emerald-100 text-emerald-700',
  American: 'bg-amber-100 text-amber-700',
}

const PROTEIN_COLORS = {
  Chicken: 'bg-yellow-100 text-yellow-700',
  Beef: 'bg-red-100 text-red-700',
  Pork: 'bg-rose-100 text-rose-700',
  Seafood: 'bg-cyan-100 text-cyan-700',
  'Tofu/Veg': 'bg-lime-100 text-lime-700',
  None: 'bg-stone-100 text-stone-500',
}

function Badge({ label, colorClass }) {
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-sm font-semibold ${colorClass}`}>
      {label}
    </span>
  )
}

function MetaPill({ label }) {
  return (
    <span className="px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-sm font-medium">
      {label}
    </span>
  )
}

function formatLastCooked(dateStr) {
  if (!dateStr) return 'Never cooked'
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000)
  if (days === 0) return 'Cooked today'
  if (days === 1) return 'Cooked yesterday'
  if (days < 7) return `Cooked ${days} days ago`
  if (days < 30) return `Cooked ${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`
  if (days < 365) return `Cooked ${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''} ago`
  return `Cooked ${Math.floor(days / 365)} year${Math.floor(days / 365) > 1 ? 's' : ''} ago`
}

const WEIGHT_LABEL = { hearty: 'Hearty & filling', light: 'Light & fresh' }
const COOK_TIME_LABEL = { quick: 'Quick (<45 min)', leisurely: 'Leisurely (1hr+)' }
const SPICE_LABEL = { mild: 'Mild', some_heat: 'Some heat', spicy: 'Spicy 🌶' }
const TEMP_LABEL = { warm: 'Warm / hot', cool: 'Cool / room temp' }

export function DishDetail({ dish, onClose, onMakingTonight }) {
  return (
    <div className="fixed inset-0 z-50 bg-stone-50 flex flex-col">

      {/* Sticky top bar */}
      <div className="flex items-center px-4 py-3 bg-white border-b border-stone-100 shrink-0">
        <button
          onClick={onClose}
          className="mr-3 w-9 h-9 flex items-center justify-center rounded-full bg-stone-100 text-stone-600 text-lg active:bg-stone-200"
          aria-label="Back"
        >
          ←
        </button>
        <h1 className="flex-1 text-base font-semibold text-stone-900 leading-tight truncate">
          {dish.name}
        </h1>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 pt-5 pb-32">

          {/* Cuisine + protein badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge label={dish.cuisine} colorClass={CUISINE_COLORS[dish.cuisine] ?? 'bg-stone-100 text-stone-600'} />
            {dish.protein !== 'None' && (
              <Badge label={dish.protein} colorClass={PROTEIN_COLORS[dish.protein] ?? 'bg-stone-100 text-stone-600'} />
            )}
          </div>

          {/* Description */}
          {dish.description && (
            <p className="text-stone-600 text-sm leading-relaxed mb-5">
              {dish.description}
            </p>
          )}

          {/* Meta pills grid */}
          <div className="flex flex-wrap gap-2 mb-5">
            <MetaPill label={COOK_TIME_LABEL[dish.cookTime]} />
            <MetaPill label={WEIGHT_LABEL[dish.weight]} />
            <MetaPill label={SPICE_LABEL[dish.spice]} />
            <MetaPill label={TEMP_LABEL[dish.temperature]} />
          </div>

          {/* Taste / Base */}
          {dish.tastes.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">Taste / Base</p>
              <div className="flex flex-wrap gap-1.5">
                {dish.tastes.map(t => (
                  <span key={t} className="px-3 py-1 bg-violet-50 text-violet-700 rounded-full text-sm font-medium border border-violet-100">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Starch pairing */}
          {dish.starches.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">Starch Pairing</p>
              <div className="flex flex-wrap gap-1.5">
                {dish.starches.map(s => (
                  <span key={s} className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm font-medium border border-amber-100">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Key ingredients */}
          {dish.keyIngredients && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1.5">Key Ingredients</p>
              <p className="text-sm text-stone-600 leading-relaxed">{dish.keyIngredients}</p>
            </div>
          )}

          {/* Notes / tips */}
          {dish.note && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-100 rounded-xl">
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1">Tip</p>
              <p className="text-sm text-amber-800 leading-relaxed">{dish.note}</p>
            </div>
          )}

          {/* Last cooked */}
          <p className="text-xs text-stone-400 mt-2">
            {formatLastCooked(dish.lastCooked)}
          </p>
        </div>
      </div>

      {/* Sticky CTA — fixed to bottom with safe area padding for iOS */}
      <div
        className="absolute bottom-0 left-0 right-0 px-4 pt-3 pb-6 bg-white border-t border-stone-100"
        style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
      >
        <button
          onClick={onMakingTonight}
          className="w-full py-4 bg-violet-600 text-white font-bold text-base rounded-2xl active:bg-violet-700 active:scale-[0.98] transition-all duration-100"
        >
          Making this tonight! 🍳
        </button>
      </div>
    </div>
  )
}
