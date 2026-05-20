import { useState, useEffect } from 'react'
import type { Event } from '../types/event'
import eventsData from '../data/events.json'

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // Use the imported JSON directly (no fetch needed for static data)
      setEvents(eventsData as Event[])
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events')
      setLoading(false)
    }
  }, [])

  const getCategories = () => {
    const categories = new Set(events.map(e => e.category))
    return Array.from(categories).sort()
  }

  const getEventsByCategory = (category: string) => {
    if (category === 'all') return events
    return events.filter(e => e.category === category)
  }

  const getEventById = (id: string) => {
    return events.find(e => e.id === id)
  }

  const getRelatedEvents = (eventId: string, category: string, limit = 3) => {
    return events
      .filter(e => e.category === category && e.id !== eventId)
      .slice(0, limit)
  }

  return {
    events,
    loading,
    error,
    getCategories,
    getEventsByCategory,
    getEventById,
    getRelatedEvents,
  }
}
