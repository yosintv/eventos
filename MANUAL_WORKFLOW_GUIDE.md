# Manual Workflow Guide

## Overview

You now have **two workflows**:

| Workflow | Trigger | Use Case |
|----------|---------|----------|
| **Auto Deploy** | Every push to `main` | Regular deployments |
| **Manual Deploy** | On-demand (click button) | Force builds, test, updates |

---

## Manual Workflow Features

### ✨ Workflow Inputs

When you manually trigger the workflow, you can specify:

1. **Reason for deployment** (optional)
   - Description: Why you're deploying
   - Default: "Manual deployment"
   - Examples: "Update sitemap", "Fix bug", "Force API fetch"

2. **Clear cache** (optional)
   - Default: `false`
   - When `true`: Clears npm cache and rebuilds from scratch
   - Use when: Dependencies are out of sync, cache is corrupted

---

## How to Trigger Manual Workflow

### Method 1: GitHub Web UI (Easiest)

1. Go to your repo: https://github.com/yosintv/eventos
2. Click: **Actions** tab
3. Look for: **"🚀 Manual Build & Deploy"** workflow
4. Click: **"Run workflow"** button
5. Fill in (optional):
   - **Reason**: "Update sitemap" or "Force deploy"
   - **Clear cache**: Check if needed
6. Click: **"Run workflow"** (green button)
7. Wait: 2-5 minutes for deployment

### Method 2: GitHub CLI

```bash
# Simple trigger (no inputs)
gh workflow run manual-deploy.yml

# With reason
gh workflow run manual-deploy.yml \
  -f reason="Update sitemap for new API events"

# With cache clear
gh workflow run manual-deploy.yml \
  -f clear_cache=true

# With both
gh workflow run manual-deploy.yml \
  -f reason="Force rebuild" \
  -f clear_cache=true
```

### Method 3: API Call

```bash
curl -X POST \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/yosintv/eventos/actions/workflows/manual-deploy.yml/dispatches \
  -d '{
    "ref": "main",
    "inputs": {
      "reason": "Manual sitemap update",
      "clear_cache": "false"
    }
  }'
```

---

## When to Use Manual Workflow

### ✅ Force Sitemap Update
```
Scenario: New events added to API, but you haven't pushed code
Solution: Trigger manual workflow
Result: Sitemap fetches latest API data, regenerates
```

**Steps:**
1. Go to Actions → Manual Build & Deploy
2. Click "Run workflow"
3. Reason: "Update sitemap from API"
4. Clear cache: No
5. Run!

### ✅ Clear Cache & Rebuild
```
Scenario: npm dependencies seem out of sync
Solution: Trigger with "Clear cache" enabled
Result: Fresh install, clean build
```

**Steps:**
1. Go to Actions → Manual Build & Deploy
2. Click "Run workflow"
3. Reason: "Clear cache and rebuild"
4. Clear cache: YES ✓
5. Run!

### ✅ Test After Code Changes
```
Scenario: Made changes locally, want to test deployment
Solution: Trigger manual workflow
Result: Verify build works without pushing
```

**Steps:**
1. Make changes locally
2. Run `npm run build && npm run preview` locally
3. Trigger manual workflow to test on GitHub
4. Check deployment

### ✅ Deploy Fixes Quickly
```
Scenario: Found and fixed a bug
Solution: Trigger manual workflow
Result: Deploy without waiting for code push
```

**Steps:**
1. Fix the bug locally
2. Trigger manual workflow
3. Reason: "Fix: [issue description]"
4. Check deployment

### ✅ Force API Fetch
```
Scenario: API was down, now it's back up
Solution: Trigger manual workflow
Result: Sitemap fetches latest events
```

**Steps:**
1. Go to Actions → Manual Build & Deploy
2. Reason: "Fetch updated events from API"
3. Run!

---

## Understanding the Workflow Output

### Build Phase

```
📋 Checkout code
   ↓ ✓ Downloads your code

🚀 Log deployment reason
   ↓ ✓ Shows who triggered and why

🗑️ Clear cache (if requested)
   ↓ ✓ Removes node_modules (only if selected)

🔧 Setup Node.js
   ↓ ✓ Installs Node 18

📦 Install dependencies
   ↓ ✓ npm ci

✅ TypeScript check
   ↓ ✓ Validates code

🏗️ Build project
   ↓ ✓ npm run build
   ✓ Fetches from API
   ✓ Generates sitemap
   ✓ Creates 404.html

📊 Analyze build output
   ↓ Shows file sizes, counts
```

### Example Output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📁 BUILD OUTPUT ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Critical files check:
  ✓ index.html (2891 bytes)
  ✓ 404.html (3456 bytes)
  ✓ sitemap.xml (14000 bytes)
  ✓ robots.txt

📊 Sitemap statistics:
  Total URLs: 80
  - Homepage: 1
  - Categories: 15
  - Events: 64

📤 Upload Pages artifact
   ↓ ✓ Uploads dist/ to GitHub

🌐 Deploy to GitHub Pages
   ↓ ✓ Deploys to yosintv.github.io/eventos/

🎉 Deployment successful
   ↓ ✓ Your site is live!
```

---

## Monitoring Manual Workflow

### 1. Real-time Monitoring
1. Go to: https://github.com/yosintv/eventos/actions
2. Click on the running workflow
3. Watch each step execute
4. See live logs

### 2. Check Results
After workflow completes:
- ✅ Build logs (full output)
- 📊 Build summary
- 🚀 Deployment status
- 📱 Live URL

### 3. View Artifacts
- Scroll to "Artifacts" section
- Download the build output
- Inspect dist/ folder contents

---

## Workflow Comparison

### Auto-Deploy Workflow
```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```
- Triggers automatically
- Runs on every push
- No user input
- Standard build

### Manual Workflow
```yaml
on:
  workflow_dispatch:
    inputs:
      reason: ...
      clear_cache: ...
```
- Triggered manually
- Detailed logging
- Optional cache clear
- Comprehensive output
- Better for diagnostics

---

## Useful Scenarios

### Scenario 1: "Sitemap not updating"

**Problem**: New events in API, but sitemap hasn't changed

**Solution**:
1. GitHub Actions → Manual Build & Deploy
2. Reason: "Force update sitemap"
3. Clear cache: No
4. Run workflow
5. Check sitemap at: `dist/sitemap.xml`

**What happens**:
- Build fetches fresh API data
- Regenerates sitemap.xml
- Deploys updated sitemap

---

### Scenario 2: "npm dependencies broken"

**Problem**: Build fails due to dependency issues

**Solution**:
1. GitHub Actions → Manual Build & Deploy
2. Reason: "Clear cache and rebuild"
3. Clear cache: YES ✓
4. Run workflow

**What happens**:
- Clears npm cache
- Deletes node_modules
- Fresh clean install
- Full rebuild from scratch

---

### Scenario 3: "Testing deployment before push"

**Problem**: Want to test if workflow works without committing

**Solution**:
1. Make changes locally
2. Test locally: `npm run build && npm run preview`
3. Trigger manual workflow
4. Reason: "Test deployment"
5. Verify on GitHub Pages

**What happens**:
- Workflow tests your code
- Shows if build would work
- Deploys to preview
- No code changes needed

---

### Scenario 4: "Emergency hotfix"

**Problem**: Found critical bug, need to deploy immediately

**Solution**:
1. Fix bug locally
2. Test locally
3. GitHub Actions → Manual Build & Deploy
4. Reason: "Hotfix: [bug description]"
5. Run immediately
6. Deploy without full code push

**What happens**:
- Deploys fix right away
- 2-5 minute deployment time
- No waiting for commit/push

---

## Tips & Best Practices

### 1. Use Meaningful Reasons
```
❌ Bad:  "Deploy"
✅ Good: "Update sitemap from new API events"

❌ Bad:  "Manual"
✅ Good: "Fix: broken category filter"

❌ Bad:  "Test"
✅ Good: "Test deployment before morning launch"
```

### 2. Monitor Logs
- Always check the workflow logs
- Look for errors or warnings
- Verify sitemap URL count
- Confirm all files deployed

### 3. When to Clear Cache
```
Clear cache when:
- ✓ npm install fails
- ✓ Dependencies seem outdated
- ✓ Getting weird build errors
- ✓ Changing Node version

Don't clear when:
- ✗ Just updating a file
- ✗ Regular deployment
- ✗ Testing code changes
```

### 4. Check Results
Always verify after deployment:
```bash
# Check homepage loads
curl https://yosintv.github.io/eventos/

# Count sitemap URLs
curl https://yosintv.github.io/eventos/sitemap.xml | grep -c "<url>"

# Test a specific route
curl https://yosintv.github.io/eventos/countdown/
```

---

## Troubleshooting

### Workflow Won't Show

**Problem**: "Manual Build & Deploy" not visible in Actions

**Solution**:
1. Push the manual-deploy.yml file to GitHub
   ```bash
   git add .github/workflows/manual-deploy.yml
   git commit -m "add: manual workflow"
   git push origin main
   ```
2. Go to Actions tab
3. Workflow should appear after 1-2 minutes

### Workflow Triggers but Build Fails

**Problem**: Manual workflow runs but build fails

**Solution**:
1. Check the build logs for errors
2. Try clearing cache and rebuilding
3. Test locally: `npm run build`
4. Push code fix and retry

### Deployment Completes but Site Not Updated

**Problem**: Workflow succeeds but site shows old content

**Solutions**:
1. Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
2. Clear browser cache
3. Wait 5-10 minutes (GitHub Pages cache)
4. Check different browser

---

## File Location

**Workflow file**: `.github/workflows/manual-deploy.yml`

To edit the workflow:
1. Go to repo
2. Click `.github/workflows/manual-deploy.yml`
3. Edit directly or clone locally
4. Make changes
5. Commit and push

---

## Advanced: Customize Workflow

### Add More Inputs
```yaml
inputs:
  custom_input:
    description: 'Custom parameter'
    required: false
    default: 'value'
    type: string
```

### Add Slack Notification
```yaml
- name: Notify Slack
  run: |
    curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
      -d '{"text": "Deployment complete!"}'
```

### Add Email Notification
```yaml
- name: Send Email
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: ...
    server_port: ...
    username: ...
    password: ...
    subject: "Deployment Complete"
    body: "Your site has been deployed successfully!"
```

---

## Summary

**Two Workflows, Two Modes:**

| Mode | Trigger | When to Use |
|------|---------|------------|
| **Auto** | Every push | Regular deployments |
| **Manual** | Click button | Force updates, testing, hotfixes |

**Key Benefits:**
- ✅ No need to push code to trigger deploy
- ✅ Force sitemap updates from API
- ✅ Clear cache for fresh builds
- ✅ Test deployments safely
- ✅ Deploy hotfixes immediately
- ✅ Detailed build output
- ✅ Full control and visibility

---

## Next Steps

1. **Commit and push** the manual workflow file
2. **Go to Actions** tab on GitHub
3. **Find** "🚀 Manual Build & Deploy" workflow
4. **Click "Run workflow"** and test it out!

Happy deploying! 🚀
