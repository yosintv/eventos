import { useParams, useNavigate } from 'react-router-dom'
import { useEventsAPI } from '../hooks/useEventsAPI'
import { CountdownTimer } from '../components/CountdownTimer'
import { SocialShare } from '../components/SocialShare'
import { EventFAQ } from '../components/EventFAQ'
import { MetaTags } from '../components/SEO/MetaTags'
import { StructuredData } from '../components/SEO/StructuredData'
import { EventGrid } from '../components/EventGrid'
import { BASE_URL } from '../utils/constants'
import { formatDate, formatDateTime, formatTimeWithTimezone, formatLocalDateTime } from '../utils/formatters'
import { getEventDescription, getEventTitle, getEventKeywords, generateEventSchema, generateBreadcrumbSchema } from '../utils/seo'

export function EventDetailPage() {
  const { eventId } = useParams<{ eventId: string }>()
  const { getEventById, getRelatedEvents } = useEventsAPI()
  const navigate = useNavigate()

  if (!eventId) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h1>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Events
        </button>
      </div>
    )
  }

  const event = getEventById(eventId)

  if (!event) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h1>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Events
        </button>
      </div>
    )
  }

  const relatedEvents = getRelatedEvents(event.id, event.category)
  const eventUrl = `${BASE_URL}/countdown/${event.id}`
  const shareTitle = `${event.name} - Countdown to ${formatDate(event.start)}`

  const breadcrumbs = [
    { name: 'Home', url: BASE_URL },
    { name: event.name, url: eventUrl },
  ]

  return (
    <>
      <MetaTags
        title={getEventTitle(event)}
        description={getEventDescription(event)}
        image={event.image}
        url={eventUrl}
        type="article"
        keywords={getEventKeywords(event)}
      />
      <StructuredData schema={generateEventSchema(event)} />
      <StructuredData schema={generateBreadcrumbSchema(breadcrumbs)} />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 flex gap-2">
          <button
            onClick={() => navigate('/')}
            className="hover:text-gray-900 hover:underline"
          >
            Home
          </button>
          <span>/</span>
          <span className="text-gray-900 font-semibold">{event.name}</span>
        </nav>

        {/* Event Header */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{event.name}</h1>
          <p className="text-lg text-gray-600">{event.instanceName}</p>
        </div>

        {/* Main Image */}
        <div className="w-full h-80 md:h-96 overflow-hidden rounded-lg shadow-lg">
          <img
            src={event.image}
            alt={event.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Countdown Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Countdown</h2>
          <CountdownTimer
            startDate={event.start}
            endDate={event.end}
            variant="expanded"
            size="lg"
          />
        </div>

        {/* Event Details */}
        <div className="space-y-6">
          {/* Local Time Display - Highlighted */}
          <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-2 border-blue-200">
            <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">⏰ Your Local Time</h3>
            <p className="text-lg md:text-xl font-bold text-gray-900">
              {formatLocalDateTime(event.start)}
            </p>
            <p className="text-sm text-gray-600 mt-2 italic">
              {formatTimeWithTimezone(event.start)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase">Start Time</h3>
                <p className="text-lg text-gray-900">{formatDateTime(event.start)}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase">End Time</h3>
                <p className="text-lg text-gray-900">{formatDateTime(event.end)}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase">Category</h3>
                <p className="text-lg text-gray-900 capitalize">{event.category}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase">Status</h3>
                <p className="text-lg text-gray-900">
                  {event.isConfirmed ? '✓ Confirmed' : '⚠ TBD'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* YouTube Trailer */}
        {event.youtubeTrailerId && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Trailer</h2>
            <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${event.youtubeTrailerId}`}
                title={`${event.name} Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Share Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Share Event</h2>
          <SocialShare title={shareTitle} url={eventUrl} />
        </div>

        {/* FAQ Section */}
        <div className="space-y-8 py-8">
          <EventFAQ event={event} />
        </div>

        {/* Related Events */}
        {relatedEvents.length > 0 && (
          <div className="space-y-6 py-8">
            <h2 className="text-2xl font-bold text-gray-900">Similar Events</h2>
            <EventGrid events={relatedEvents} />
          </div>
        )}

        {/* Back Button */}
        <div className="text-center py-8">
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            ← Back to All Events
          </button>
        </div>
      </div>
    </>
  )
}
