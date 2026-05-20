export const SITE_NAME = 'Event Countdown'
export const SITE_DESCRIPTION = 'Count down to the biggest events of 2026. Live countdown timers for movies, sports, music, gaming, and more.'
export const BASE_URL = 'https://countdown.singhyogendra.com.np'

// External API Configuration - Explicit Page URLs
export const API_ENDPOINTS = [
  'https://yosintv.github.io/ytv-api/events/page1.json',
  'https://yosintv.github.io/ytv-api/events/page2.json',
  'https://yosintv.github.io/ytv-api/events/page3.json',
  'https://yosintv.github.io/ytv-api/events/page4.json',
  'https://yosintv.github.io/ytv-api/events/page5.json',
]

export const CATEGORY_COLORS: Record<string, string> = {
  sport: 'bg-red-500 text-white',
  gaming: 'bg-purple-500 text-white',
  movies: 'bg-cyan-500 text-white',
  tv: 'bg-pink-500 text-white',
  music: 'bg-amber-500 text-white',
  holiday: 'bg-emerald-500 text-white',
  awareness: 'bg-blue-500 text-white',
  astro: 'bg-indigo-500 text-white',
  tech: 'bg-orange-500 text-white',
  calendar: 'bg-gray-500 text-white',
  awards: 'bg-fuchsia-500 text-white',
  seasons: 'bg-lime-500 text-white',
}

export const CATEGORY_LABELS: Record<string, string> = {
  sport: 'Sport',
  gaming: 'Gaming',
  movies: 'Movies',
  tv: 'TV',
  music: 'Music',
  holiday: 'Holiday',
  awareness: 'Awareness',
  astro: 'Astronomy',
  tech: 'Tech',
  calendar: 'Calendar',
  awards: 'Awards',
  seasons: 'Seasons',
}

export const SHARE_URLS = {
  twitter: (text: string, url: string) =>
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
  facebook: (url: string) =>
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  linkedin: (url: string) =>
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
}
