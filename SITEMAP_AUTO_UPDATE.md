# Automatic Sitemap Updates from External API

## Overview

The sitemap.xml now **automatically updates** when new events are added to the external API. You don't need to manually manage events!

## How It Works

### Build Process Flow
```
1. You push code to GitHub
   ↓
2. GitHub Actions triggers build
   ↓
3. Build script runs: npm run build
   ↓
4. Vite builds the React app
   ↓
5. build-sitemap.mjs runs:
   - Fetches events from external API
   - Extracts categories from fetched events
   - Generates sitemap.xml with all URLs
   - Copies 404.html for SPA routing
   ↓
6. Deploy to GitHub Pages
   ↓
7. ✅ Sitemap includes all API events
```

### API Endpoints
```typescript
// Fetches from these endpoints during build
const API_ENDPOINTS = [
  'https://yosintv.github.io/ytv-api/events/page1.json',
  'https://yosintv.github.io/ytv-api/events/page2.json',
  'https://yosintv.github.io/ytv-api/events/page3.json',
  'https://yosintv.github.io/ytv-api/events/page4.json',
  'https://yosintv.github.io/ytv-api/events/page5.json',
]
```

If any page fails (404), it's gracefully skipped.

## ✅ Current Status

| Metric | Value |
|--------|-------|
| Events Fetched | 64 total |
| From page1.json | 32 events |
| From page2.json | 32 events |
| Pages 3-5 | 404 (skipped) |
| **Categories** | 15 unique |
| **Sitemap URLs** | 80 total |
| | 1 homepage + 15 categories + 64 events |

## Automatic Updates

### When Sitemap Updates
The sitemap automatically updates when:

1. **Events added to API** → New events appear in page1/page2
2. **You push code** → GitHub Actions rebuilds
3. **Build completes** → API is queried during build
4. **New sitemap generated** → Includes all events
5. **Deploy completes** → Sitemap pushed to GitHub Pages

### Timeline
```
Event added to API
     ↓
You push any code (or manually trigger build)
     ↓
GitHub Actions starts build (1-2 minutes)
     ↓
Build fetches latest events from API
     ↓
Sitemap regenerated with new events
     ↓
Deploy completes (2-5 minutes total)
     ↓
✅ Sitemap includes new events
```

## Manual Sitemap Regeneration

### Force Rebuild (Trigger Sitemap Update)
If you want to update the sitemap immediately without code changes:

```bash
# Option 1: Make a dummy commit and push
git add .
git commit --allow-empty -m "chore: trigger sitemap update"
git push origin main

# Option 2: Build locally and verify
npm run build

# Check that sitemap was generated
cat dist/sitemap.xml | grep "<url>" | wc -l
```

## Monitoring Sitemap

### Check Sitemap Locally
```bash
# After building
npm run build

# Count URLs
grep "<url>" dist/sitemap.xml | wc -l

# View sample entries
head -50 dist/sitemap.xml

# Check for specific event
grep "event-name" dist/sitemap.xml
```

### Check Generated Sitemap
```bash
# View sitemap URLs
curl https://countdown.singhyogendra.com.np/sitemap.xml | head -50

# Count total URLs
curl https://countdown.singhyogendra.com.np/sitemap.xml | grep -c "<url>"
```

## Handling Failures

### API Unavailable
If the API is down during build:
1. Build will attempt all endpoints
2. Successfully fetched events are used
3. Failed endpoints are skipped (with warning)
4. Fallback to local `src/data/events.json` if no events fetched

### Build Still Works
Even if API is temporarily down, the build won't fail:
- Events already in local JSON are used as fallback
- Sitemap is generated from whatever events are available
- Build completes successfully ✓

### Log Output
During build, you'll see:
```
📡 Fetching events from external API...
✓ Loaded 32 events from page1.json
✓ Loaded 32 events from page2.json
⚠ Skipping page3.json (HTTP 404)
✅ Successfully fetched 64 total events from API
🗺️  Generating sitemap...
✓ Sitemap generated successfully
✓ Total URLs in sitemap: 80
```

## Google Search Console

### Verify Sitemap in Google
1. Go to: https://search.google.com/search-console
2. Select property: countdown.singhyogendra.com.np
3. Go to: Sitemaps → your sitemap
4. Check:
   - ✅ Status: Submitted
   - ✅ Last update: Recent date
   - ✅ Index status: Shows number of indexed URLs

### Submit New Sitemap
Google automatically checks sitemaps, but you can:
1. Go to Sitemaps section
2. Submit: `https://countdown.singhyogendra.com.np/sitemap.xml`
3. Google will crawl and index new events

### Typical Crawl Timeline
- Day 0: Sitemap updated
- Day 1-2: Google crawls new URLs
- Day 2-7: New events indexed
- Week 2-4: New events start ranking

## FAQ

### Q: Do I need to update events.json?
**A**: No! The build script fetches from the API automatically.

### Q: What if API adds more events?
**A**: Next time you push code (or trigger a rebuild), sitemap updates with all new events.

### Q: How often does sitemap update?
**A**: Every time the code is built. You can:
- Push code changes → builds automatically
- Make a dummy commit → triggers build
- Run `npm run build` locally → updates for local testing

### Q: Will sitemap always match the site?
**A**: Yes! Both fetch from the same API at runtime/buildtime, so they're always in sync.

### Q: What if the API goes down?
**A**: Build uses fallback from local events.json, so build still succeeds.

### Q: Can I add events without rebuilding?
**A**: Events show immediately at runtime (via API), but sitemap updates only on rebuild.

## Code Implementation

### Build Script
The updated `build-sitemap.mjs`:
- Fetches all events from API endpoints
- Gracefully handles 404 responses
- Extracts unique categories from events
- Generates sitemap with all URLs
- Fallback to local JSON if needed

### Key Features
✅ Parallel fetching (all endpoints at once)
✅ Error handling (skips failures gracefully)
✅ Logging (shows what was fetched)
✅ Automatic category detection
✅ Image URLs included (for Google Images)

## Best Practices

1. **Regular Deployments**: Push code regularly so sitemap stays fresh
2. **Monitor Builds**: Check GitHub Actions to ensure builds succeed
3. **Verify Sitemap**: Periodically check sitemap in Search Console
4. **Update Domain**: If moving to custom domain, update BASE_URL in build script

## Configuration

To modify the setup:

### Change API Endpoints
Edit `build-sitemap.mjs`:
```javascript
const API_ENDPOINTS = [
  'https://your-api.com/events/page1.json',
  'https://your-api.com/events/page2.json',
  // add more endpoints
]
```

### Change Domain
Edit `build-sitemap.mjs`:
```javascript
const BASE_URL = 'https://your-domain.com'
```

### Change Category Colors
Edit `src/utils/constants.ts`:
```typescript
export const CATEGORY_COLORS = {
  sport: 'bg-red-500 text-white',
  // customize as needed
}
```

## Status

✅ **Automatic Sitemap Updates Enabled**
- Build script fetches from external API
- Sitemap regenerates on every build
- 64 events currently included
- 80 total URLs (1 home + 15 categories + 64 events)
- Ready for production deployment

---

**Summary**: Your sitemap will always match your API data. No manual management needed! Just keep deploying code and the sitemap stays current. 🎉
