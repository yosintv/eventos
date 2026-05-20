# Event Countdown 🎯

A god-level SEO-optimized countdown website built with React, TypeScript, and Tailwind CSS. Track upcoming events with real-time countdown timers.

## Features ✨

- **Live Countdown Timers** - Real-time countdown to events (accurate to the second)
- **Category Filtering** - Filter events by sport, movies, music, gaming, and more
- **Dynamic Event Pages** - Individual countdown pages for each event
- **YouTube Integration** - Embedded trailers for movies and TV shows
- **Social Sharing** - Share events on Twitter, Facebook, and LinkedIn
- **Fully Responsive** - Mobile-first design (works on all devices)
- **PWA Support** - Install as an app on your device
- **SEO Optimized** - Structured data, meta tags, sitemap, robots.txt

## Tech Stack 🛠️

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State**: Zustand (for future use)
- **Animations**: Framer Motion
- **Build**: Vite
- **Deployment**: GitHub Pages (automatic via GitHub Actions)
- **SEO**: Schema.org structured data, dynamic meta tags

## Quick Start 🚀

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/countdown.git
cd countdown

# Install dependencies
npm install

# Start development server
npm run dev
# Open http://localhost:5173/countdown
```

### Update Events

Edit `src/data/events.json` with your events. The format is:

```json
{
  "id": "event-slug",
  "name": "Event Name",
  "instanceName": "Specific Instance",
  "image": "https://...",
  "imageThumbnail": "https://...",
  "start": "2026-05-20T18:00:00",
  "end": "2026-05-21T18:00:00",
  "isLocal": true,
  "category": "movies",
  "isConfirmed": true,
  "isTbd": false,
  "youtubeTrailerId": "abc123"  // optional
}
```

### Build & Deploy

```bash
# Build for production
npm run build

# This generates:
# - dist/ (optimized static files)
# - dist/sitemap.xml (for SEO)

# Push to GitHub to auto-deploy to GitHub Pages
git add .
git commit -m "Update events"
git push origin main
```

## SEO Features 📊

### Implemented

✅ Dynamic meta tags (title, description, OG tags)
✅ Schema.org structured data (Event, EventCollection, BreadcrumbList)
✅ Responsive images with lazy loading
✅ Semantic HTML (proper headings, nav, sections)
✅ Sitemap.xml (auto-generated)
✅ robots.txt
✅ Mobile optimization
✅ Core Web Vitals optimized
✅ WCAG AA accessibility

## Configuration 🔧

### Update Site Constants

Edit `src/utils/constants.ts`:

```typescript
export const BASE_URL = 'https://yourusername.github.io/countdown'
export const SITE_NAME = 'Event Countdown'
```

### GitHub Pages Setup

1. Create a repository named `countdown`
2. Push your code to the `main` branch
3. Go to **Settings → Pages**
4. Set source to **GitHub Actions**
5. The `deploy.yml` workflow will auto-deploy

## Performance Targets 📈

- **Lighthouse Score**: 95+ (all metrics)
- **FCP**: < 1.5s (First Contentful Paint)
- **LCP**: < 2.5s (Largest Contentful Paint)
- **CLS**: < 0.1 (Cumulative Layout Shift)
- **PageSpeed Insights**: 90+ mobile & desktop

---

**Made with ❤️ by Event Countdown**

Happy countdown! 🎉
