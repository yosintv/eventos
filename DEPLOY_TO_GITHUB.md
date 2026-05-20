# Deploy to GitHub Pages - yosintv/eventos

## Repository Details
- **GitHub**: https://github.com/yosintv/eventos
- **GitHub Pages URL**: https://yosintv.github.io/eventos/
- **Deployment Method**: GitHub Actions (automatic)

## Configuration ✅

### Base Path
The vite config is now set to:
```typescript
base: '/eventos/'
```

This ensures:
- ✅ CSS/JS files load from `/eventos/assets/`
- ✅ React Router routes work with `/eventos/` prefix
- ✅ All asset paths are correct for subdirectory deployment

---

## Deployment Steps

### Step 1: Ensure GitHub Pages is Enabled
1. Go to: https://github.com/yosintv/eventos/settings/pages
2. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
3. Save settings

### Step 2: Push Your Code
```bash
# From the countdown directory
cd /Users/apple/Documents/Codex/countdown

# Add all changes
git add .

# Commit the changes
git commit -m "feat: deploy countdown website to GitHub Pages

- Add 404.html for SPA routing
- Update vite config with /eventos/ base path
- Configure for yosintv.github.io/eventos/ deployment
- All assets and routes now work on GitHub Pages"

# Push to GitHub
git push origin main
```

### Step 3: Monitor GitHub Actions
1. Go to: https://github.com/yosintv/eventos/actions
2. Watch for the "Build & Deploy to GitHub Pages" workflow
3. Wait for it to complete (usually 2-5 minutes)
4. Should show ✅ Build and ✅ Deploy steps

### Step 4: Test the Site
Once deployment completes:

1. **Homepage**: https://yosintv.github.io/eventos/
   - Should load with event cards ✓

2. **Event Page**: https://yosintv.github.io/eventos/countdown/uefa-europa-league-final
   - Click an event card or navigate via URL ✓

3. **Category Filter**: https://yosintv.github.io/eventos/?category=sport
   - Should show filtered events ✓

4. **Reload Test**: Reload on any page
   - Should show correct content (not 404) ✓

---

## What's Included

### Files Deployed
```
dist/
├── 404.html                 ← GitHub Pages SPA routing
├── index.html               ← Main app (React SPA)
├── sitemap.xml              ← SEO sitemap
├── robots.txt               ← Crawler directives
├── countdown-clock.svg      ← Favicon
├── manifest.webmanifest     ← PWA manifest
├── sw.js                    ← Service worker
└── assets/
    ├── *.css                ← Styles (~8 KB gzipped)
    ├── *.js                 ← App code (~9 KB gzipped)
    └── react-vendor.js      ← React libraries (~74 KB gzipped)
```

### Total Size
- **~160 KB uncompressed**
- **~92 KB gzipped** ✓

---

## How It Works on GitHub Pages

### File Structure
GitHub Actions will:
1. Build the project: `npm run build`
2. Create `dist/` folder with all files
3. Deploy `dist/` to GitHub Pages
4. GitHub Pages serves from: `yosintv.github.io/eventos/`

### SPA Routing
```
User visits: https://yosintv.github.io/eventos/countdown/event-name
         ↓
GitHub Pages: "File not found" → Serves 404.html
         ↓
404.html script: Redirects to index.html
         ↓
React Router: Takes over and renders the correct page
         ↓
User sees: Event detail page ✓
```

---

## Troubleshooting

### Build Failed?
1. Check GitHub Actions logs: https://github.com/yosintv/eventos/actions
2. Look for error messages
3. Common issues:
   - Node version mismatch → Check workflow uses Node 18+
   - API keys missing → Not needed, API is public
   - Path issues → Already fixed in vite config

### Still Blank Page?
1. **Hard refresh**: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
2. **Clear cache**: 
   - DevTools (F12) → Application → Cache Storage → Clear
3. **Check browser console**:
   - F12 → Console tab
   - Look for JavaScript errors
   - Check Network tab to see if assets load correctly
4. **Wait 5 minutes**: GitHub Pages caches for ~5 minutes

### Assets Not Loading?
Check that paths include `/eventos/`:
- ✅ Correct: `/eventos/assets/index-xxx.js`
- ✗ Wrong: `/assets/index-xxx.js`

If vite config is correct, assets should load properly.

### 404 Pages Happening?
1. Verify 404.html is in dist/: `ls -lh dist/404.html`
2. Check GitHub Actions deployed successfully
3. Wait 5-10 minutes for GitHub Pages to update cache

---

## Configuration Summary

| Setting | Value |
|---------|-------|
| Repository | yosintv/eventos |
| GitHub Pages URL | https://yosintv.github.io/eventos/ |
| Base Path | `/eventos/` |
| Build Command | `npm run build` |
| Deploy Source | GitHub Actions |
| Output Directory | `dist/` |
| SPA Routing | 404.html + React Router |

---

## Next Steps

1. ✅ **Build Complete** - dist/ folder ready
2. ✅ **Config Updated** - base path set to `/eventos/`
3. ✅ **404.html Created** - for SPA routing
4. **→ Push to GitHub** - Run: `git push origin main`
5. **→ Monitor Actions** - Watch the workflow complete
6. **→ Test Site** - Visit https://yosintv.github.io/eventos/

---

## Verification After Deployment

### Check These URLs Work:
- [ ] https://yosintv.github.io/eventos/ - Homepage
- [ ] https://yosintv.github.io/eventos/?category=sport - Category filter
- [ ] https://yosintv.github.io/eventos/countdown/fifa-world-cup - Event page
- [ ] Reload event page - Still shows content (not 404)

### Check SEO Files:
- [ ] https://yosintv.github.io/eventos/sitemap.xml - Valid XML
- [ ] https://yosintv.github.io/eventos/robots.txt - Text file present
- [ ] https://yosintv.github.io/eventos/404.html - HTML redirect file

---

## Custom Domain Later

When ready to use countdown.singhyogendra.com.np:

1. Update vite config:
   ```typescript
   base: '/'  // Root domain instead of /eventos/
   ```

2. Configure custom domain in GitHub:
   - Settings → Pages → Custom domain
   - Enter: countdown.singhyogendra.com.np
   - Update DNS records

3. Rebuild and redeploy

---

## Status

✅ **Ready to Deploy**
- Build: Success
- 404.html: Present
- Base path: Configured for `/eventos/`
- All files: In dist/ folder

**Next**: Push to GitHub and watch it deploy! 🚀

---

**Commands Reference**
```bash
# Build locally
npm run build

# Test locally
npm run preview

# Deploy to GitHub
git push origin main

# Monitor deployment
# Visit: https://github.com/yosintv/eventos/actions
```

Happy deploying! 🎉
