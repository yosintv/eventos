import { SITE_NAME, BASE_URL } from './constants'
import type { Event } from '../types/event'
import { formatDate, getDaysUntil as getDaysUntilFor } from './formatters'

export interface MetaTags {
  title: string
  description: string
  image: string
  url: string
  type: 'website' | 'article'
  keywords?: string
}

export function getEventTitle(event: Event): string {
  const daysUntil = Math.max(0, getDaysUntilFor(event.start))
  return `${event.name} Countdown – ${daysUntil} Days Until ${formatDate(event.start)}`
}

export function getEventDescription(event: Event): string {
  const date = formatDate(event.start)
  return `Count down to ${event.name} on ${date}. ${event.instanceName} with live countdown timer. Get the exact local time and hours remaining.`
}

export function getEventKeywords(event: Event): string {
  const keywords = [
    `${event.name} countdown`,
    `countdown to ${event.name}`,
    `how many days until ${event.name}`,
    `${event.name} countdown 2026`,
    `${event.name} timer`,
    `${event.category} countdown`,
    `${event.category} event countdown 2026`,
    'event countdown',
    'countdown timer',
    'upcoming events 2026',
  ]
  return keywords.join(', ')
}

export function buildMetaTags(meta: MetaTags): Record<string, string> {
  const defaultKeywords = 'countdown, events, timer, upcoming events, event countdown 2026'

  return {
    // Basic meta tags
    charset: 'utf-8',
    viewport: 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes',
    description: meta.description,
    keywords: meta.keywords || defaultKeywords,
    'robots': 'index, follow, max-image-preview:large',
    'theme-color': '#3B82F6',

    // Open Graph
    'og:title': meta.title,
    'og:description': meta.description,
    'og:image': meta.image,
    'og:url': meta.url,
    'og:type': meta.type,
    'og:site_name': SITE_NAME,

    // Twitter Card
    'twitter:card': 'summary_large_image',
    'twitter:title': meta.title,
    'twitter:description': meta.description,
    'twitter:image': meta.image,

    // Canonical
    'canonical': meta.url,
  }
}

export function generateEventSchema(event: Event): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    description: getEventDescription(event),
    image: [event.image],
    startDate: event.start,
    endDate: event.end,
    eventStatus: 'EventScheduled',
    eventAttendanceMode: 'OnlineEventAttendanceMode',
  }
  return JSON.stringify(schema)
}

export function generateHomepageSchema(): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    description: 'Event countdown website with live timers for upcoming events',
    url: BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
  return JSON.stringify(schema)
}

export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>): string {
  const items = breadcrumbs.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  }))

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  }
  return JSON.stringify(schema)
}

export function generateEventCollectionSchema(events: Event[]): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'EventSeries',
    name: 'Upcoming Events',
    description: 'A collection of upcoming events with countdown timers',
    events: events.slice(0, 10).map(event => ({
      '@type': 'Event',
      name: event.name,
      startDate: event.start,
      endDate: event.end,
      image: event.image,
      url: `${BASE_URL}/countdown/${event.id}`,
    })),
  }
  return JSON.stringify(schema)
}
