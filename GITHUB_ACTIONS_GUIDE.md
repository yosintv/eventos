# GitHub Actions Workflow Guide

## File Location
`.github/workflows/deploy.yml`

## What It Does

Automatically builds and deploys your site to GitHub Pages every time you push to the `main` branch.

---

## Workflow Steps

### 1️⃣ **Checkout Code**
```yaml
- name: Checkout code
  uses: actions/checkout@v4
```
- Clones your GitHub repository
- Sets up the runner with your code

### 2️⃣ **Setup Node.js**
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '18'
    cache: 'npm'
```
- Installs Node.js v18
- Caches npm dependencies (faster builds)

### 3️⃣ **Install Dependencies**
```yaml
- name: Install dependencies
  run: npm ci
```
- Installs all npm packages
- `npm ci` (clean install) is preferred in CI/CD

### 4️⃣ **TypeScript Check** (Optional)
```yaml
- name: Run TypeScript check
  run: npm run typecheck || echo "TypeScript check completed"
```
- Verifies TypeScript code is valid
- Continues even if there are issues (|| echo "...")

### 5️⃣ **Build Project**
```yaml
- name: Build project
  run: npm run build
  env:
    CI: true
```
- Runs: `tsc -b && vite build && node build-sitemap.mjs`
- **TypeScript compilation** - Type checking
- **Vite build** - Bundles React app
- **Sitemap generation** - Fetches from API & generates URLs
- **404.html copy** - For SPA routing

### 6️⃣ **Verify Build Output**
```yaml
- name: Verify build output
  run: |
    ls -lh dist/ | head -15
    [ -f dist/index.html ] && echo "✓ index.html"
    [ -f dist/404.html ] && echo "✓ 404.html"
    [ -f dist/sitemap.xml ] && echo "✓ sitemap.xml"
    echo "Sitemap contains $(grep -c '<url>' dist/sitemap.xml) URLs"
```
- Checks that all critical files were created
- Counts sitemap URLs
- Provides visibility into build success

### 7️⃣ **Upload Pages Artifact**
```yaml
- name: Upload Pages artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: ./dist
```
- Uploads the `dist/` folder as a build artifact
- This is what gets deployed to GitHub Pages

### 8️⃣ **Deploy to GitHub Pages**
```yaml
- name: Deploy to GitHub Pages
  id: deployment
  uses: actions/deploy-pages@v2
```
- Takes the artifact
- Deploys to `yosintv.github.io/eventos/`
- Only runs on pushes to `main` (not PRs)

### 9️⃣ **Deployment Summary**
```yaml
- name: Deployment Summary
  run: |
    echo "✅ Deployment completed!"
    echo "📱 Site URL: ${{ steps.deployment.outputs.page_url }}"
```
- Shows deployment status
- Displays the GitHub Pages URL

---

## Key Configuration

### Trigger Events
```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```
- **Builds** on: push OR pull request to main
- **Deploys** on: push to main only (see `if: github.ref == 'refs/heads/main'`)

### Permissions
```yaml
permissions:
  contents: read      # Can read code
  pages: write        # Can write to GitHub Pages
  id-token: write     # Can authenticate with OIDC
```
- Allows the workflow to deploy to GitHub Pages

### Concurrency
```yaml
concurrency:
  group: pages
  cancel-in-progress: true
```
- Only one deployment at a time
- Cancels previous deployments if new push happens

### Node Cache
```yaml
cache: 'npm'
```
- Caches `node_modules/` between builds
- **Reduces build time** from ~2 min to ~30 sec on second run

---

## Build Process Timeline

```
Code pushed to GitHub
    ↓ (< 1 second)
GitHub Actions triggered
    ↓ (1-2 minutes)
Checkout + setup Node.js
    ↓ (10 seconds)
Install dependencies (cached)
    ↓ (30 seconds)
TypeScript check
    ↓ (15 seconds)
Vite build (bundles React)
    ↓ (5 seconds)
Sitemap generation (fetches from API)
    ↓ (5 seconds)
Verify files exist
    ↓ (1 second)
Upload artifact to GitHub
    ↓ (10 seconds)
Deploy to GitHub Pages
    ↓ (30 seconds)
✅ Site live at: yosintv.github.io/eventos/
```

**Total time**: 2-5 minutes from push to live deployment

---

## Environment Variables

```yaml
env:
  CI: true
```
- `CI: true` tells build tools this is a CI environment
- Affects how some tools behave (minification, etc.)

---

## View Workflow Runs

### Monitor Builds
1. Go to: https://github.com/yosintv/eventos/actions
2. See all workflow runs
3. Click on a run to see details

### Check Build Logs
1. Click on a workflow run
2. Click on the "build" job
3. Expand each step to see logs
4. Look for ✅ (success) or ❌ (failure)

### Common Issues & Logs

**Build succeeded**
```
✓ Built in 328ms
✓ Sitemap generated successfully
✓ Total URLs in sitemap: 80
✓ 404.html copied
✅ Build complete!
```

**API fetch issues** (non-fatal)
```
⚠ Skipping https://...page3.json (HTTP 404)
✅ Successfully fetched 64 total events from API
```

**Build failed**
```
✗ Error: Cannot find module
✗ TypeScript error in src/...
```
- Click the failed step
- Read the error message
- Fix the code and push again

---

## Manual Workflow Triggers

### Re-run Failed Workflow
1. Go to: https://github.com/yosintv/eventos/actions
2. Click the failed run
3. Click "Re-run all jobs"

### Force Rebuild (Update Sitemap)
```bash
# Make a dummy commit
git commit --allow-empty -m "chore: trigger sitemap update"
git push origin main
```

---

## Customization

### Change Node Version
```yaml
node-version: '18'  # Change to '20', '22', etc.
```

### Add Environment Variables
```yaml
- name: Build project
  run: npm run build
  env:
    CI: true
    CUSTOM_VAR: value  # Add custom variables
```

### Add Pre-build Steps
```yaml
- name: Custom step
  run: echo "Running before build"

- name: Build project
  run: npm run build
```

### Conditional Deployment
```yaml
deploy:
  if: github.ref == 'refs/heads/main' && success()
```
- Only deploy if build succeeds

---

## Debugging

### Enable Debug Logging
Add to any step:
```yaml
- name: Debug
  run: |
    echo "Node version: $(node -v)"
    echo "npm version: $(npm -v)"
    echo "Current directory: $(pwd)"
    ls -la
```

### Check Build Artifacts
GitHub Actions stores build artifacts for 90 days:
1. Go to workflow run
2. Look for "Artifacts" section
3. Download to inspect locally

---

## Best Practices

1. **Keep dependencies updated**
   ```bash
   npm update
   ```

2. **Monitor workflow runs**
   - Check Actions tab after each push
   - Fix build errors quickly

3. **Use meaningful commit messages**
   ```bash
   git commit -m "feat: add new feature"
   ```

4. **Test locally before pushing**
   ```bash
   npm run build
   npm run preview
   ```

5. **Keep Node version updated**
   - Currently using: Node 18 LTS
   - Update to 20 or 22 when available

---

## Troubleshooting

### Build Keeps Failing

**Check these:**
1. Dependencies issue: `npm install` locally
2. TypeScript errors: `npm run typecheck`
3. Build error: `npm run build` locally
4. API unreachable: Check API endpoints

**Common fixes:**
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Pages Not Updating

**Possible causes:**
1. Build failed (check Actions tab)
2. Deployment failed (check job logs)
3. Browser cache (hard refresh: Ctrl+Shift+R)
4. GitHub Pages cache (wait 5-10 minutes)

### Sitemap Has Wrong URLs

**Check:**
1. Build logs show correct count
2. API endpoints are accessible
3. Local build works: `npm run build`
4. dist/sitemap.xml has correct URLs

---

## GitHub Pages Settings

Your repo needs GitHub Pages enabled:

1. Go to: https://github.com/yosintv/eventos/settings/pages
2. Under "Build and deployment":
   - **Source**: GitHub Actions
3. Save

---

## Status Badges

### Add to README.md
```markdown
[![Build and Deploy](https://github.com/yosintv/eventos/actions/workflows/deploy.yml/badge.svg)](https://github.com/yosintv/eventos/actions)
```

Shows current build status on your README.

---

## Complete Workflow File

See `.github/workflows/deploy.yml` in the repository for the complete, up-to-date workflow file.

---

**Summary**: The workflow automatically builds your site, fetches fresh events from the API, generates a sitemap, and deploys everything to GitHub Pages on every push. It's fully automated! 🚀
