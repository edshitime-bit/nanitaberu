const CUISINE_COLORS = {
  Japanese: 'bg-red-100 text-red-600',
  Chinese: 'bg-amber-100 text-amber-700',
  Korean: 'bg-pink-100 text-pink-700',
  Italian: 'bg-green-100 text-green-700',
  French: 'bg-blue-100 text-blue-700',
  Thai: 'bg-emerald-100 text-emerald-700',
  American: 'bg-orange-100 text-orange-700',
}

const PROTEIN_COLORS = {
  Chicken: 'bg-yellow-100 text-yellow-700',
  Beef: 'bg-amber-200 text-amber-800',
  Pork: 'bg-rose-100 text-rose-600',
  Seafood: 'bg-sky-100 text-sky-700',
  'Tofu/Veg': 'bg-lime-100 text-lime-700',
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
    <span className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full text-sm font-medium border border-orange-100">
      {label}
    </span>
  )
}

function formatLastCooked(dateStr) {
  if (!dateStr) return null
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000)
  if (days === 0) return 'Cooked today'
  if (days === 1) return 'Cooked yesterday'
  if (days < 7) return `Cooked ${days} days ago`
  if (days < 30) return `Cooked ${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`
  if (days < 365) return `Cooked ${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''} ago`
  return `Cooked ${Math.floor(days / 365)} year${Math.floor(days / 365) > 1 ? 's' : ''} ago`
}

const WEIGHT_LABEL = { hearty: 'Hearty & filling', light: 'Light & fresh' }
const COOK_TIME_LABEL = { quick: 'Quick  <45 min', medium: 'Medium  45–90 min', leisurely: 'Leisurely  2hr+' }
const COMPLEXITY_LABEL = { simple: 'Simple', complex: 'Complex' }
const SPICE_LABEL = { mild: 'Mild', some_heat: 'Some heat', spicy: 'Spicy 🌶' }
const TEMP_LABEL = { warm: 'Warm / hot', cool: 'Cool / room temp' }

export function DishDetail({ dish, onClose, onMakingTonight }) {
  const lastCooked = formatLastCooked(dish.lastCooked)

  return (
    <div className="fixed inset-0 z-50 bg-orange-50 flex flex-col">

      {/* Top bar */}
      <div className="flex items-center px-4 py-3 bg-white border-b border-orange-100 shrink-0">
        <button
          onClick={onClose}
          className="mr-3 w-9 h-9 flex items-center justify-center rounded-full bg-orange-100 text-orange-600 text-lg active:bg-orange-200"
          aria-label="Back"
        >
          ←
        </button>
        <h1 className="flex-1 text-base font-bold text-stone-900 leading-tight truncate">
          {dish.name}
        </h1>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 pt-5 pb-32">

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge label={dish.cuisine} colorClass={CUISINE_COLORS[dish.cuisine] ?? 'bg-stone-100 text-stone-600'} />
            {dish.protein !== 'None' && (
              <Badge label={dish.protein} colorClass={PROTEIN_COLORS[dish.protein] ?? 'bg-stone-100 text-stone-600'} />
            )}
            {dish.complexity === 'complex' && (
              <Badge label="Complex" colorClass="bg-purple-100 text-purple-600" />
            )}
          </div>

          {/* Description */}
          {dish.description && (
            <p className="text-stone-600 text-sm leading-relaxed mb-5">{dish.description}</p>
          )}

          {/* Meta pills */}
          <div className="flex flex-wrap gap-2 mb-5">
            <MetaPill label={COOK_TIME_LABEL[dish.cookTime]} />
            <MetaPill label={COMPLEXITY_LABEL[dish.complexity]} />
            <MetaPill label={WEIGHT_LABEL[dish.weight]} />
            <MetaPill label={SPICE_LABEL[dish.spice]} />
            <MetaPill label={TEMP_LABEL[dish.temperature]} />
          </div>

          {/* Taste / Base */}
          {dish.tastes.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-orange-400 uppercase tracking-wider mb-2">Taste / Base</p>
              <div className="flex flex-wrap gap-1.5">
                {dish.tastes.map(t => (
                  <span key={t} className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm font-medium border border-orange-100">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Starch pairing */}
          {dish.starches.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-orange-400 uppercase tracking-wider mb-2">Starch Pairing</p>
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
              <p className="text-xs font-semibold text-orange-400 uppercase tracking-wider mb-1.5">Key Ingredients</p>
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
          <p className="text-xs mt-2">
            {lastCooked
              ? <span className="text-stone-400">{lastCooked}</span>
              : <span className="text-emerald-500 font-medium">✦ Never cooked — this could be your first time!</span>
            }
          </p>
        </div>
      </div>

      {/* Sticky CTA */}
      <div
        className="absolute bottom-0 left-0 right-0 px-4 pt-3 bg-white border-t border-orange-100"
        style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
      >
        <button
          onClick={onMakingTonight}
          className="w-full py-4 bg-orange-500 text-white font-bold text-base rounded-2xl active:bg-orange-600 active:scale-[0.98] transition-all duration-100 shadow-sm"
        >
          Making this tonight! 🍳
        </button>
      </div>
    </div>
  )
}
