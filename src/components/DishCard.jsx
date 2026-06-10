import { motion } from 'framer-motion'

const CUISINE_COLORS = {
  Japanese: 'bg-red-100 text-red-600',
  Chinese:  'bg-amber-100 text-amber-700',
  Korean:   'bg-pink-100 text-pink-700',
  Italian:  'bg-green-100 text-green-700',
  French:   'bg-blue-100 text-blue-700',
  Thai:     'bg-emerald-100 text-emerald-700',
  American: 'bg-orange-100 text-orange-700',
}

const PROTEIN_COLORS = {
  Chicken:    'bg-yellow-100 text-yellow-700',
  Beef:       'bg-amber-200 text-amber-800',
  Pork:       'bg-rose-100 text-rose-600',
  Seafood:    'bg-sky-100 text-sky-700',
  'Tofu/Veg': 'bg-lime-100 text-lime-700',
  None:       'bg-stone-100 text-stone-500',
}

const CUISINE_BORDER = {
  Japanese: 'border-l-red-400',
  Chinese:  'border-l-amber-400',
  Korean:   'border-l-pink-400',
  Italian:  'border-l-green-500',
  French:   'border-l-blue-400',
  Thai:     'border-l-emerald-400',
  American: 'border-l-orange-400',
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
  if (days < 7)   return `${days}d ago`
  if (days < 30)  return `${Math.floor(days / 7)}w ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

const COOK_TIME_LABEL = { quick: 'Quick', medium: 'Medium', leisurely: 'Leisurely' }

export function DishCard({ dish, onTap }) {
  const lastCooked = formatLastCooked(dish.lastCooked)
  const accentBorder = CUISINE_BORDER[dish.cuisine] ?? 'border-l-stone-300'

  return (
    <motion.button
      onClick={onTap}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      className={`
        w-full text-left bg-white rounded-2xl p-4
        shadow-[0_2px_12px_rgba(0,0,0,0.07)]
        border border-stone-100 border-l-4 ${accentBorder}
      `}
    >
      <div className="flex flex-wrap gap-1.5 mb-2">
        <Badge label={dish.cuisine} colorClass={CUISINE_COLORS[dish.cuisine] ?? 'bg-stone-100 text-stone-600'} />
        {dish.protein !== 'None' && (
          <Badge label={dish.protein} colorClass={PROTEIN_COLORS[dish.protein] ?? 'bg-stone-100 text-stone-600'} />
        )}
        {dish.complexity === 'complex' && (
          <Badge label="Complex" colorClass="bg-purple-100 text-purple-600" />
        )}
      </div>

      <h2 className="text-base font-semibold text-stone-900 mb-2 leading-snug">{dish.name}</h2>

      {dish.tastes.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {dish.tastes.slice(0, 4).map(t => (
            <span key={t} className="text-xs text-orange-700 bg-orange-100 rounded-full px-2 py-0.5 font-medium">{t}</span>
          ))}
          {dish.tastes.length > 4 && <span className="text-xs text-stone-400">+{dish.tastes.length - 4}</span>}
        </div>
      )}

      <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-stone-400">
        {dish.starches.length > 0 && <span>{dish.starches.join(' / ')}</span>}
        <span>{COOK_TIME_LABEL[dish.cookTime]}</span>
        {lastCooked
          ? <span>Last cooked {lastCooked}</span>
          : <span className="text-emerald-500 font-medium">✦ Try it first!</span>
        }
      </div>
    </motion.button>
  )
}
