import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Read events data
const eventsPath = path.resolve(__dirname, 'src/data/events.json')
const events = JSON.parse(fs.readFileSync(eventsPath, 'utf-8'))

// Domain configuration
const BASE_URL = 'https://countdown.singhyogendra.com.np'
const currentDate = new Date().toISOString().split('T')[0]

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

// Write to dist directory
const distPath = path.resolve(__dirname, 'dist/sitemap.xml')
try {
  if (!fs.existsSync(path.dirname(distPath))) {
    fs.mkdirSync(path.dirname(distPath), { recursive: true })
  }
  fs.writeFileSync(distPath, sitemap)
  console.log(`✓ Sitemap generated successfully: ${distPath}`)
  console.log(`✓ Total URLs in sitemap: ${events.length + categories.length + 1}`)
} catch (error) {
  console.error(`✗ Error writing sitemap:`, error)
  process.exit(1)
}

// Also write to public for development
const publicPath = path.resolve(__dirname, 'public/sitemap.xml')
try {
  fs.writeFileSync(publicPath, sitemap)
  console.log(`✓ Public sitemap updated: ${publicPath}`)
} catch (error) {
  console.warn(`⚠ Could not write to public directory (not critical)`)
}
