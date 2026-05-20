import type { Event } from '../types/event'
import { EventCard } from './EventCard'

interface EventGridProps {
  events: Event[]
  isLoading?: boolean
}

function SkeletonCard() {
  return (
    <div className="card overflow-hidden bg-white h-full">
      {/* Image skeleton */}
      <div className="h-44 sm:h-52 md:h-56 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />

      {/* Content skeleton */}
      <div className="p-5 md:p-6 space-y-4">
        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded-lg w-3/4 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded-lg w-1/2 animate-pulse"></div>
        </div>

        {/* Countdown skeleton */}
        <div className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>

        {/* Date skeleton */}
        <div className="h-3 bg-gray-200 rounded-lg w-2/3 animate-pulse"></div>
      </div>
    </div>
  )
}

export function EventGrid({ events, isLoading = false }: EventGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-gray-500">No events found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {events.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}
