import { useState, useEffect } from 'react'
import type { Event } from '../types/event'
import { API_ENDPOINTS } from '../utils/constants'

export function useEventsAPI() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        setLoading(true)
        const allEvents: Event[] = []
        let successfulPages = 0

        // Fetch all configured API endpoints in parallel
        const responses = await Promise.allSettled(
          API_ENDPOINTS.map(url =>
            fetch(url)
              .then(res => {
                if (!res.ok) {
                  throw new Error(`HTTP ${res.status}`)
                }
                return res.json()
              })
              .catch(err => {
                console.warn(`Failed to fetch ${url}:`, err)
                return null
              })
          )
        )

        // Process all responses
        responses.forEach((result) => {
          if (result.status === 'fulfilled' && result.value) {
            const pageData = result.value
            const pageEvents = Array.isArray(pageData)
              ? pageData
              : pageData.events || pageData.data || []

            if (Array.isArray(pageEvents) && pageEvents.length > 0) {
              allEvents.push(...pageEvents)
              successfulPages++
            }
          }
        })

        setEvents(allEvents)
        setError(null)

        if (allEvents.length === 0) {
          setError('No events loaded from API endpoints')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load events')
        setEvents([])
      } finally {
        setLoading(false)
      }
    }

    fetchAllEvents()
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
