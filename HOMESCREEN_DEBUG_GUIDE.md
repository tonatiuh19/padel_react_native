# HomeScreen Debug Guide

## Issues Fixed

### 1. Today's Events Card Not Showing ✅

**Problem**: Code expected nested structure `e.event.event_date` but API returns flat structure with fields directly on the object.

**Fix Applied**: Updated filtering to use `e.event_date` directly instead of `e.event.event_date`.

**Location**: Lines 141-156 in [HomeScreen.tsx](screens/HomeScreen/HomeScreen.tsx)

### 2. Crown Icon & Subscription Issues

**Status**: Debugging added

**What to Check**:

1. Open the app and navigate to HomeScreen
2. Check console logs for:
   ```
   [HomeScreen] User subscription: {...}
   [HomeScreen] Subscription status: active
   [HomeScreen] Has active subscription: true
   ```
3. If subscription is null or status is not 'active', the issue is in the API call
4. If subscription data looks correct but crown doesn't show, it's a render issue

**Expected Data Structure**:

```typescript
{
  id: number,
  user_id: number,
  status: 'active',  // Must be exactly 'active'
  subscription: {
    name: string,
    // ... other fields
  }
}
```

### 3. Quick Links Not Showing ⚠️

**Problem**: Quick links for Events, Classes, and Memberships don't show even when available.

**Root Cause**: The `/api/clubs/:id` endpoint doesn't return `has_events`, `has_instructors`, or `has_subscriptions` fields.

**What to Check**:

1. Open the app and check console for:

   ```
   [HomeScreen] Club has_events: undefined (or 0/1/true/false)
   [HomeScreen] Club has_instructors: undefined (or 0/1/true/false)
   [HomeScreen] Club has_subscriptions: undefined (or 0/1/true/false)
   ```

2. If these are `undefined`, the API needs to be updated.

## API Fix Needed

The `/api/clubs/:id` endpoint needs to include these fields in the SELECT query:

**File**: `api/index.ts` (around line 400)

**Current Query**:

```sql
SELECT c.*, COUNT(ct.id) as court_count
FROM clubs c
LEFT JOIN courts ct ON c.id = ct.club_id AND ct.is_active = TRUE
WHERE c.id = ? AND c.is_active = TRUE
GROUP BY c.id
```

**Required Fix**: The SELECT already uses `c.*` which should include all columns. The fields exist in the database (they're set when creating events/instructors/subscriptions), so they should be returned.

**Verify in Database**:

```sql
SELECT id, name, has_events, has_instructors, has_subscriptions
FROM clubs
WHERE id = 1;
```

If these fields are NULL or 0 but you have events/instructors/subscriptions, they need to be manually updated:

```sql
-- Update flags based on actual data
UPDATE clubs c
SET has_events = (SELECT COUNT(*) > 0 FROM events WHERE club_id = c.id)
WHERE c.id = 1;

UPDATE clubs c
SET has_instructors = (SELECT COUNT(*) > 0 FROM instructors WHERE club_id = c.id AND is_active = 1)
WHERE c.id = 1;

UPDATE clubs c
SET has_subscriptions = (SELECT COUNT(*) > 0 FROM club_subscriptions WHERE club_id = c.id AND is_active = 1)
WHERE c.id = 1;
```

## Testing Steps

1. **Test Events Card**:

   - User must have registered for an event happening TODAY
   - Check console: `[HomeScreen] Today's events:` should show array with events
   - If empty, verify user has event registrations for today's date
   - API endpoint: `/api/users/:userId/event-registrations`

2. **Test Crown Icon**:

   - User must have `status: 'active'` in their subscription
   - Check console logs for subscription data
   - Verify crown appears next to user name in header
   - Verify membership name shows below user name in gold text

3. **Test Quick Links**:
   - Check console for club flags
   - If undefined: API needs fix
   - If 0 or false: Database needs update (run SQL above)
   - If 1 or true: Quick links should show

## Quick Link Visibility Logic

**Current Code** (lines 234-259):

```typescript
const quickActions = [
  {
    id: "book",
    visible: true, // Always shows
  },
  {
    id: "events",
    visible:
      (club as any)?.has_events === true || (club as any)?.has_events === 1,
  },
  {
    id: "classes",
    visible:
      (club as any)?.has_instructors === true ||
      (club as any)?.has_instructors === 1,
  },
].filter((action) => action.visible);
```

**Checks both boolean and integer** (database might store as TINYINT or BOOLEAN)

## Console Debugging

With the added debug logs, you should see:

```
[HomeScreen] Fetching data for user: 123
[HomeScreen] Club data: { id: 1, name: "...", ... }
[HomeScreen] Club has_events: 1 (or true/false/undefined)
[HomeScreen] Club has_instructors: 1 (or true/false/undefined)
[HomeScreen] Club has_subscriptions: 1 (or true/false/undefined)
[HomeScreen] User subscription: { status: "active", ... }
[HomeScreen] Subscription status: active
[HomeScreen] Has active subscription: true
[HomeScreen] Events response: [...]
[HomeScreen] Today's events: [...]
[HomeScreen] Today's classes: [...]
```

## Common Issues

1. **Events card empty but user has events**:

   - Check if event date matches TODAY exactly (timezone issues)
   - Verify `event_date` field format in API response

2. **Crown doesn't show but subscription is active**:

   - Check exact string match: `subscription.status === 'active'`
   - Verify subscription object is not null

3. **Quick links missing**:
   - Most likely: API doesn't return the flags
   - Alternative: Database flags not set correctly
   - Check both console logs and database directly

## Next Steps

1. Run the app and collect console logs
2. If club flags are undefined → API needs SELECT fix or database UPDATE
3. If subscription is null → Check Redux/API connection
4. If events array is empty → Check event registration dates
