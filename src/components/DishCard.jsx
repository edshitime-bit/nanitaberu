// Cuisine and protein badge colour maps — distinct, readable, food-forward.
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
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${colorClass}`}>
      {label}
    </span>
  )
}

function formatLastCooked(dateStr) {
  if (!dateStr) return null
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

const COOK_TIME_LABEL = { quick: 'Quick', leisurely: 'Leisurely' }

export function DishCard({ dish, onTap }) {
  const lastCooked = formatLastCooked(dish.lastCooked)

  return (
    <button
      onClick={onTap}
      className="w-full text-left bg-white rounded-2xl p-4 shadow-sm border border-stone-100 active:scale-[0.98] transition-transform duration-100"
    >
      {/* Badges row */}
      <div className="flex flex-wrap gap-1.5 mb-2">
        <Badge label={dish.cuisine} colorClass={CUISINE_COLORS[dish.cuisine] ?? 'bg-stone-100 text-stone-600'} />
        {dish.protein !== 'None' && (
          <Badge label={dish.protein} colorClass={PROTEIN_COLORS[dish.protein] ?? 'bg-stone-100 text-stone-600'} />
        )}
      </div>

      {/* Name */}
      <h2 className="text-base font-semibold text-stone-900 mb-2 leading-snug">
        {dish.name}
      </h2>

      {/* Taste tags — show up to 4 */}
      {dish.tastes.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {dish.tastes.slice(0, 4).map(t => (
            <span key={t} className="text-xs text-stone-500 bg-stone-50 border border-stone-200 rounded-full px-2 py-0.5">
              {t}
            </span>
          ))}
          {dish.tastes.length > 4 && (
            <span className="text-xs text-stone-400">+{dish.tastes.length - 4}</span>
          )}
        </div>
      )}

      {/* Meta row: starch · cook time · last cooked */}
      <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-stone-400">
        {dish.starches.length > 0 && (
          <span>{dish.starches.join(' / ')}</span>
        )}
        <span>{COOK_TIME_LABEL[dish.cookTime]}</span>
        {lastCooked ? (
          <span>Last cooked {lastCooked}</span>
        ) : (
          <span className="text-violet-400">Never cooked</span>
        )}
      </div>
    </button>
  )
}
