export function EmptyState({ onClearAll }) {
  return (
    <div className="flex flex-col items-center justify-center px-8 py-20 text-center">
      <span className="text-5xl mb-4">🍽️</span>
      <h2 className="text-lg font-semibold text-stone-700 mb-1">No dishes match</h2>
      <p className="text-sm text-stone-400 mb-6">Try removing a filter to see more options.</p>
      <button
        onClick={onClearAll}
        className="px-5 py-2.5 bg-orange-500 text-white font-semibold text-sm rounded-full active:bg-orange-600 shadow-sm"
      >
        Clear all filters
      </button>
    </div>
  )
}
