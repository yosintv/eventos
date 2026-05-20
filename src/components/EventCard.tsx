import { useNavigate } from 'react-router-dom'
import type { Event } from '../types/event'
import { CountdownTimer } from './CountdownTimer'
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../utils/constants'
import { formatDate } from '../utils/formatters'

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  const navigate = useNavigate()
  const categoryColor = CATEGORY_COLORS[event.category] || 'bg-gray-500 text-white'
  const categoryLabel = CATEGORY_LABELS[event.category] || event.category

  return (
    <button
      onClick={() => navigate(`/countdown/${event.id}`)}
      className="group w-full text-left focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-2xl"
    >
      <div className="card bg-white h-full flex flex-col overflow-hidden hover:scale-105 active:scale-95 transition-all duration-300">
        {/* Image Container with Overlay */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 h-44 sm:h-52 md:h-56">
          <img
            src={event.imageThumbnail}
            alt={event.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-500"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Category Badge with icon */}
          <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm glass ${categoryColor}`}>
            <span className="inline-block mr-1">📌</span>
            {categoryLabel}
          </div>

          {/* Status Badge */}
          {!event.isConfirmed && (
            <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-white glass backdrop-blur-sm">
              ⚠️ TBD
            </div>
          )}

          {/* Confirmed Badge */}
          {event.isConfirmed && (
            <div className="absolute bottom-3 right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg text-lg">
              ✓
            </div>
          )}
        </div>

        {/* Content Container */}
        <div className="p-5 md:p-6 flex-1 flex flex-col justify-between">
          {/* Event Name */}
          <div className="mb-4">
            <h3 className="font-bold text-base md:text-lg line-clamp-2 text-gray-900 group-hover:gradient-text transition-all duration-300">
              {event.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1 line-clamp-1">
              {event.instanceName}
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="mb-4">
            <CountdownTimer
              startDate={event.start}
              endDate={event.end}
              variant="compact"
              size="sm"
            />
          </div>

          {/* Date info */}
          <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3 mt-auto">
            <span>📅 {formatDate(event.start)}</span>
            <span className="text-blue-600 font-semibold group-hover:text-blue-700">
              Explore →
            </span>
          </div>
        </div>
      </div>
    </button>
  )
}
