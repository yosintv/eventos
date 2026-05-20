import { useSearchParams } from 'react-router-dom'
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../utils/constants'

interface CategoryNavProps {
  categories: string[]
}

export function CategoryNav({ categories }: CategoryNavProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = searchParams.get('category') || 'all'

  const handleCategoryClick = (category: string) => {
    if (category === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ category })
    }
  }

  return (
    <div className="mb-8 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex gap-2 pb-2">
        <button
          onClick={() => handleCategoryClick('all')}
          className={`whitespace-nowrap px-4 py-2 rounded-full font-semibold transition-all ${
            activeCategory === 'all'
              ? 'bg-black text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Events
        </button>
        {categories.map(category => {
          const categoryColor = CATEGORY_COLORS[category] || 'bg-gray-500 text-white'
          const categoryLabel = CATEGORY_LABELS[category] || category
          const isActive = activeCategory === category

          return (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`whitespace-nowrap px-4 py-2 rounded-full font-semibold transition-all ${
                isActive
                  ? `${categoryColor}`
                  : `${categoryColor.split(' ')[0]} opacity-50 hover:opacity-75`
              }`}
            >
              {categoryLabel}
            </button>
          )
        })}
      </div>
    </div>
  )
}
