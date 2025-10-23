# GitHub Activity Diagnosis Report

## 🔍 Issue Analysis

### Current Situation (October 2025):
- **Your GitHub Profile**: @EdwinJia1
- **Expected Contributions**: 64 contributions in the last year
- **Recent Activity**:
  - EdwinJia1/evanNewweb - 1 commit (Oct 17)
  - EdwinJia1/24hoursAiCoding - JavaScript project (Oct 10)
  - EdwinJia1/EVANweb-unsw-maturial - 1 commit (Oct 7)

### Problem:
The GitHub activity card on your homepage is not displaying the same data as your actual GitHub profile.

---

## 🛠️ Changes Made

### 1. ✅ Increased Event Fetching
**Before**: Fetched only 100 events (1 page)
**After**: Fetches up to 300 events (3 pages)

**Why**: More events = better chance of capturing all your recent activity

```typescript
// Old code:
const response = await fetch(
  `https://api.github.com/users/${username}/events/public?per_page=100`
);

// New code:
let allEvents: any[] = [];
let page = 1;
const maxPages = 3; // Fetch up to 300 events

while (page <= maxPages) {
  const response = await fetch(
    `https://api.github.com/users/${username}/events/public?per_page=100&page=${page}`
  );
  // ... fetch and combine events
}
```

### 2. ✅ Enhanced Debug Logging
Added more detailed console logs to help diagnose issues:

```javascript
// New logs:
📊 Total GitHub Events fetched: X
📅 Latest event: 2025-10-17 - PushEvent
📅 Oldest event: 2025-09-01
📋 Event types: { PushEvent: 10, CreateEvent: 2, ... }
✅ Events in last 12 weeks: X/Y
📊 Events by date: [['2025-10-17', 3], ['2025-10-10', 5], ...]
```

### 3. ✅ Better Event Tracking
Now tracks events by date and shows which dates have activity:

```typescript
const eventsByDate: { [key: string]: number } = {};
// ... count events per date
console.log('📊 Events by date:', Object.entries(eventsByDate).sort().slice(-10));
```

---

## 🧪 How to Test

### Step 1: Open Your Website
Visit your deployed website or run locally:
```bash
cd 01-projects/personal-website
npm run dev
```

### Step 2: Open Browser Console
1. Press `F12` (Windows/Linux) or `Cmd+Option+I` (Mac)
2. Go to the **Console** tab
3. Refresh the page

### Step 3: Check Console Output
You should see detailed logs like:

```
🔄 Fetching GitHub activity for: EdwinJia1
📊 Total GitHub Events fetched: 64
📅 Latest event: 2025-10-17T12:34:56Z - PushEvent
📅 Oldest event: 2025-09-01T08:22:11Z
📋 Event types: { 
  PushEvent: 45, 
  CreateEvent: 10, 
  WatchEvent: 5,
  IssuesEvent: 4
}
✅ Events in last 12 weeks: 64/64
📊 Events by date: [
  ['2025-10-07', 1],
  ['2025-10-10', 3],
  ['2025-10-17', 1]
]
```

### Step 4: Verify Visual Indicators
Look at the GitHub Activity card:
- **Green dot (●)**: Successfully fetched real data from GitHub API
- **Yellow dot (○)**: Using fallback data (API failed)
- **No dot**: Still loading

### Step 5: Check Contribution Count
The card should show: `X contributions` where X matches your actual GitHub activity.

---

## 🔧 Troubleshooting

### Issue 1: Still Showing Wrong Data

**Possible Causes:**
1. **Browser Cache**: Your browser cached the old data
2. **GitHub API Delay**: Recent commits may take 5-15 minutes to appear in the API
3. **Private Repositories**: Private repo activity won't show (need authentication)

**Solutions:**
```bash
# Clear cache and hard refresh:
Windows/Linux: Ctrl + Shift + R
Mac: Cmd + Shift + R

# Or clear browser cache completely:
Chrome: Settings > Privacy > Clear browsing data
```

### Issue 2: API Rate Limit

**Symptom**: Console shows `GitHub API error: 403`

**Cause**: GitHub API has rate limits:
- **Unauthenticated**: 60 requests/hour
- **Authenticated**: 5000 requests/hour

**Solution**: Add GitHub token (optional):
```typescript
// In ActivityCard.tsx, add token to headers:
headers: {
  'Accept': 'application/vnd.github.v3+json',
  'Authorization': `Bearer YOUR_GITHUB_TOKEN` // Add this
}
```

### Issue 3: Events Not in Range

**Symptom**: Console shows `Events in last 12 weeks: 0/64`

**Cause**: Your activity is older than 12 weeks

**Solution**: Increase the time range:
```typescript
// In ActivityCard.tsx, change:
const weeks = 12; // Change to 24 or 52 for more weeks
```

### Issue 4: Only Seeing Some Events

**Symptom**: Console shows fewer events than expected

**Possible Causes:**
1. **Private repos**: Not included in public events
2. **Event types**: Some activities don't create events
3. **API pagination**: Need to fetch more pages

**Solution**: Already implemented - now fetches 3 pages (300 events)

---

## 📊 Understanding GitHub Events API

### What Counts as an Event?
- ✅ **PushEvent**: Commits pushed to a repository
- ✅ **CreateEvent**: Created a repository, branch, or tag
- ✅ **DeleteEvent**: Deleted a branch or tag
- ✅ **ForkEvent**: Forked a repository
- ✅ **WatchEvent**: Starred a repository
- ✅ **IssuesEvent**: Opened, closed, or commented on an issue
- ✅ **PullRequestEvent**: Opened, closed, or merged a PR
- ✅ **ReleaseEvent**: Published a release

### What Doesn't Count?
- ❌ **Private repository activity** (unless authenticated)
- ❌ **Profile updates** (bio, avatar, etc.)
- ❌ **Repository settings changes**
- ❌ **Commits older than 90 days**

### API Limitations:
- **Time Range**: Only last 90 days
- **Max Events**: 300 events per user
- **Public Only**: Only public repository activity (without auth)
- **Delay**: 5-15 minutes for new events to appear

---

## 🎯 Expected Results

### After the Fix:
1. **Console Logs**: Should show detailed event information
2. **Contribution Count**: Should match your GitHub profile (64 contributions)
3. **Activity Graph**: Should show colored squares on dates with activity
4. **Green Indicator**: Should show green dot (●) next to "GitHub Activity"

### Visual Example:
```
┌─────────────────────────────────────────┐
│ 📊 GitHub Activity ●        64 contributions│
├─────────────────────────────────────────┤
│ [gray][gray][gray][teal][gray][gray]... │
│ [gray][teal][teal][gray][gray][gray]... │
│ [gray][gray][gray][teal][gray][gray]... │
│ ...                                     │
├─────────────────────────────────────────┤
│ Less [▢][▢][▢][▢][▢] More              │
└─────────────────────────────────────────┘
```

- **Gray squares**: No activity on that day
- **Teal squares**: Activity on that day (darker = more activity)
- **Hover**: Shows exact contribution count

---

## 🚀 Next Steps

### 1. Test Immediately:
```bash
cd 01-projects/personal-website
npm run build
npm run dev
```

### 2. Check Console Logs:
- Open browser console (F12)
- Look for the detailed logs
- Verify event count matches expectations

### 3. Verify Visual Display:
- Check for green dot indicator
- Verify contribution count
- Hover over squares to see details

### 4. If Still Not Working:
- Take a screenshot of the console logs
- Check if you see any error messages
- Verify your GitHub username is correct
- Wait 15 minutes and try again (API delay)

---

## 📝 Additional Improvements (Optional)

### Add GitHub Token for Better Data:
1. Create a GitHub Personal Access Token:
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Select scopes: `public_repo`, `read:user`
   - Copy the token

2. Add to environment variables:
   ```bash
   # Create .env.local file:
   NEXT_PUBLIC_GITHUB_TOKEN=your_token_here
   ```

3. Update ActivityCard.tsx:
   ```typescript
   headers: {
     'Accept': 'application/vnd.github.v3+json',
     ...(process.env.NEXT_PUBLIC_GITHUB_TOKEN && {
       'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`
     })
   }
   ```

**Benefits:**
- See private repository activity
- Higher API rate limit (5000/hour vs 60/hour)
- More reliable data fetching

---

## 📞 Support

If you're still experiencing issues after following this guide:

1. **Check Console Logs**: Look for error messages
2. **Verify API Response**: Visit https://api.github.com/users/EdwinJia1/events/public
3. **Check Rate Limits**: Visit https://api.github.com/rate_limit
4. **Wait for API Update**: Recent commits may take 15 minutes to appear

---

**Last Updated**: 2025-10-23  
**Status**: ✅ Enhanced with better event fetching and debugging  
**Next Action**: Test and verify console logs

