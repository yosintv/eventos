import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Domain configuration
const BASE_URL = 'https://countdown.singhyogendra.com.np'
const currentDate = new Date().toISOString().split('T')[0]

// API endpoints - fetch from external source
const API_ENDPOINTS = [
  'https://yosintv.github.io/ytv-api/events/page1.json',
  'https://yosintv.github.io/ytv-api/events/page2.json',
  'https://yosintv.github.io/ytv-api/events/page3.json',
  'https://yosintv.github.io/ytv-api/events/page4.json',
  'https://yosintv.github.io/ytv-api/events/page5.json',
]

async function fetchAllEvents() {
  console.log('📡 Fetching events from external API...')
  const allEvents = []

  for (const url of API_ENDPOINTS) {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        console.warn(`⚠ Skipping ${url} (HTTP ${response.status})`)
        continue
      }
      const data = await response.json()
      const pageEvents = Array.isArray(data) ? data : data.events || data.data || []

      if (Array.isArray(pageEvents) && pageEvents.length > 0) {
        allEvents.push(...pageEvents)
        console.log(`✓ Loaded ${pageEvents.length} events from ${url.split('/').pop()}`)
      }
    } catch (error) {
      console.warn(`⚠ Failed to fetch ${url}: ${error.message}`)
    }
  }

  if (allEvents.length === 0) {
    console.error('✗ No events fetched from API! Using local JSON as fallback.')
    // Fallback to local JSON
    const eventsPath = path.resolve(__dirname, 'src/data/events.json')
    try {
      return JSON.parse(fs.readFileSync(eventsPath, 'utf-8'))
    } catch (e) {
      console.error('✗ Could not read local events.json either!')
      process.exit(1)
    }
  }

  console.log(`✅ Successfully fetched ${allEvents.length} total events from API`)
  return allEvents
}

function generateSitemap(events) {
  console.log('🗺️  Generating sitemap...')

  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n'
  sitemap += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n'

  // Homepage - highest priority
  sitemap += `  <url>\n`
  sitemap += `    <loc>${BASE_URL}/</loc>\n`
  sitemap += `    <lastmod>${currentDate}</lastmod>\n`
  sitemap += `    <changefreq>daily</changefreq>\n`
  sitemap += `    <priority>1.0</priority>\n`
  sitemap += `  </url>\n`

  // Category pages - high priority
  const categories = [...new Set(events.map(e => e.category))]
  categories.forEach((category) => {
    sitemap += `  <url>\n`
    sitemap += `    <loc>${BASE_URL}/?category=${encodeURIComponent(category)}</loc>\n`
    sitemap += `    <lastmod>${currentDate}</lastmod>\n`
    sitemap += `    <changefreq>daily</changefreq>\n`
    sitemap += `    <priority>0.9</priority>\n`
    sitemap += `  </url>\n`
  })

  // Event pages - regular priority with images
  events.forEach((event) => {
    sitemap += `  <url>\n`
    sitemap += `    <loc>${BASE_URL}/countdown/${encodeURIComponent(event.id)}</loc>\n`
    sitemap += `    <lastmod>${currentDate}</lastmod>\n`
    sitemap += `    <changefreq>daily</changefreq>\n`
    sitemap += `    <priority>0.8</priority>\n`

    // Include image information for Google
    if (event.image) {
      sitemap += `    <image:image>\n`
      sitemap += `      <image:loc>${event.image}</image:loc>\n`
      sitemap += `      <image:title>${event.name}</image:title>\n`
      sitemap += `    </image:image>\n`
    }

    sitemap += `  </url>\n`
  })

  sitemap += '</urlset>\n'
  return sitemap
}

async function main() {
  try {
    // Fetch events from API
    const events = await fetchAllEvents()

    // Generate sitemap
    const sitemap = generateSitemap(events)

    // Write to dist directory
    const distPath = path.resolve(__dirname, 'dist/sitemap.xml')
    if (!fs.existsSync(path.dirname(distPath))) {
      fs.mkdirSync(path.dirname(distPath), { recursive: true })
    }
    fs.writeFileSync(distPath, sitemap)
    console.log(`✓ Sitemap generated successfully: ${distPath}`)
    console.log(`✓ Total URLs in sitemap: ${events.length + [...new Set(events.map(e => e.category))].length + 1}`)

    // Also write to public for development
    const publicPath = path.resolve(__dirname, 'public/sitemap.xml')
    try {
      fs.writeFileSync(publicPath, sitemap)
      console.log(`✓ Public sitemap updated: ${publicPath}`)
    } catch (error) {
      console.warn(`⚠ Could not write to public directory (not critical)`)
    }

    // Copy 404.html to dist for GitHub Pages SPA routing
    const source404 = path.resolve(__dirname, 'public/404.html')
    const dest404 = path.resolve(__dirname, 'dist/404.html')
    try {
      if (fs.existsSync(source404)) {
        fs.copyFileSync(source404, dest404)
        console.log(`✓ 404.html copied for GitHub Pages SPA routing: ${dest404}`)
      }
    } catch (error) {
      console.warn(`⚠ Warning: Could not copy 404.html (not critical): ${error.message}`)
    }

    console.log('\n✅ Build complete!')
  } catch (error) {
    console.error('✗ Build failed:', error)
    process.exit(1)
  }
}

main()
