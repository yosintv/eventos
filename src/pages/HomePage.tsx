import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useEventsAPI } from '../hooks/useEventsAPI'
import { MetaTags } from '../components/SEO/MetaTags'
import { StructuredData } from '../components/SEO/StructuredData'
import { CategoryNav } from '../components/CategoryNav'
import { EventGrid } from '../components/EventGrid'
import { SITE_NAME, BASE_URL } from '../utils/constants'
import { generateHomepageSchema, generateEventCollectionSchema } from '../utils/seo'

export function HomePage() {
  const [searchParams] = useSearchParams()
  const { events, loading, error, getCategories, getEventsByCategory } = useEventsAPI()

  const selectedCategory = searchParams.get('category') || 'all'
  const categories = useMemo(() => getCategories(), [events])
  const filteredEvents = useMemo(
    () => getEventsByCategory(selectedCategory),
    [events, selectedCategory]
  )

  const pageTitle = selectedCategory === 'all'
    ? `Event Countdown — Live Timers for Upcoming Events & Dates 2026 | ${SITE_NAME}`
    : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Events Countdown 2026 — Live Timers | ${SITE_NAME}`

  const pageDescription = selectedCategory === 'all'
    ? 'Count down to the biggest events of 2026. Live countdown timers for movies, sports, music, gaming, and more. Never miss a date again.'
    : `Countdown to upcoming ${selectedCategory} events in 2026. Live timers, event dates, and schedules.`

  const url = selectedCategory === 'all'
    ? BASE_URL
    : `${BASE_URL}/?category=${selectedCategory}`

  return (
    <>
      <MetaTags
        title={pageTitle}
        description={pageDescription}
        image="https://via.placeholder.com/1200x630/000000/FFFFFF/?text=Event+Countdown"
        url={url}
        type="website"
      />
      <StructuredData schema={generateHomepageSchema()} />
      <StructuredData schema={generateEventCollectionSchema(filteredEvents)} />

      <div className="space-y-12 md:space-y-16">
        {/* Hero Section */}
        <div className="text-center py-8 md:py-16 animate-fade-in">
          <h1 className="gradient-text mb-6">
            Upcoming Events Countdown
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Track the world's biggest events with live countdown timers. Never miss an important date again.
          </p>

          {/* Loading Indicator */}
          {loading && (
            <div className="max-w-md mx-auto mb-6 card p-4 bg-blue-50 border-2 border-blue-200">
              <div className="flex items-center justify-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-200"></div>
                </div>
                <span className="text-sm font-semibold text-blue-700">Loading events from API...</span>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto mt-10">
            <div className="card p-4 md:p-6">
              <div className="text-2xl md:text-3xl font-bold gradient-text">{events.length}</div>
              <p className="text-sm text-gray-600 mt-1">Events</p>
            </div>
            <div className="card p-4 md:p-6">
              <div className="text-2xl md:text-3xl font-bold gradient-text">{categories.length}</div>
              <p className="text-sm text-gray-600 mt-1">Categories</p>
            </div>
            <div className="card p-4 md:p-6 col-span-2 md:col-span-1">
              <div className="text-2xl md:text-3xl font-bold gradient-text">✓</div>
              <p className="text-sm text-gray-600 mt-1">Live Timers</p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6 md:p-8 fade-in">
            <div className="text-4xl mb-4">⏱️</div>
            <h3 className="text-lg font-bold mb-2">Live Timers</h3>
            <p className="text-gray-600 text-sm">Real-time countdown to every event, accurate to the second</p>
          </div>
          <div className="card p-6 md:p-8 fade-in">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-lg font-bold mb-2">Filter by Category</h3>
            <p className="text-gray-600 text-sm">Browse movies, sports, music, gaming, and more</p>
          </div>
          <div className="card p-6 md:p-8 fade-in">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-lg font-bold mb-2">Mobile Friendly</h3>
            <p className="text-gray-600 text-sm">Works perfectly on all devices and screen sizes</p>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold">Explore by Category</h2>
          <CategoryNav categories={categories} />
        </div>

        {/* Error Message */}
        {!loading && error && (
          <div className="card bg-red-50 border-2 border-red-200 p-6 text-center">
            <p className="text-red-700 font-semibold mb-2">⚠️ Unable to load events</p>
            <p className="text-sm text-red-600">{error}</p>
            <p className="text-xs text-red-500 mt-3">Please check your API endpoints and try refreshing the page.</p>
          </div>
        )}

        {/* Results Info */}
        {!loading && filteredEvents.length > 0 && (
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
            <p className="text-sm md:text-base text-gray-600">
              📊 Showing <span className="font-bold text-gray-900">{filteredEvents.length}</span> {selectedCategory === 'all' ? 'events' : `${selectedCategory} events`}
            </p>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => window.location.href = '/'}
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors hover:underline"
              >
                ✕ Clear Filter
              </button>
            )}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredEvents.length === 0 && !error && (
          <div className="card bg-amber-50 border-2 border-amber-200 p-8 text-center">
            <p className="text-lg text-amber-700 font-semibold mb-2">No events found</p>
            <p className="text-sm text-amber-600">Try selecting a different category or check back later for new events.</p>
          </div>
        )}

        {/* Events Grid */}
        <EventGrid events={filteredEvents} isLoading={loading} />

        {/* CTA Section */}
        {!loading && filteredEvents.length > 0 && (
          <div className="card bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-8 md:p-12 text-center text-white rounded-2xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Never Miss an Event</h2>
            <p className="text-lg opacity-90 mb-6">
              Track all your favorite events with live countdown timers
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-8 py-3 bg-white text-blue-600 rounded-xl font-bold hover:shadow-xl transition-all duration-300"
            >
              Start Countdown
            </button>
          </div>
        )}
      </div>
    </>
  )
}
