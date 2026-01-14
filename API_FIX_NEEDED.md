# API Fix Required for Mobile App Authentication

## Problem

The mobile app's authentication flow currently fails because the `/api/auth/send-code` endpoint requires both `email` and `user_id`, but the mobile app doesn't have the `user_id` until after the user is authenticated.

## Current Flow (Mobile App - React Native)

1. User enters email in `LoginForm.tsx`
2. Call `checkUserExists(email, club_id)` → Returns user data including `id`
3. User data stored in Redux: `userInfo.info.id_platforms_user = response.data.patient.id`
4. User clicks "Send Code" in `CodeValidationForm.tsx`
5. Call `sendVerificationCode(userInfo.info.email, userInfo.info.id_platforms_user)`
6. **This works IF the API accepts the user_id** ✅

## Current Flow (Web App)

1. User enters email
2. Call `checkUserExists(email, club_id)` → Returns user data
3. User clicks "Send Code"
4. Call `sendVerificationCode(email)` → **API looks up user_id internally by email** ✅

## Solution

Update the `/api/auth/send-code` endpoint in the backend API file to:

```typescript
const handleSendCode: RequestHandler = async (req, res) => {
  try {
    console.log("🔵 sendCode endpoint called");
    console.log("   Request body:", req.body);

    const { email, user_id } = req.body;

    if (!email) {
      console.log("❌ Missing email");
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    console.log("   Email:", email);
    console.log("   User ID (if provided):", user_id);

    // Get user from database - either by ID or by email
    console.log("📊 Querying user from database...");
    let userRows: any[];

    if (user_id) {
      // If user_id provided, use it (faster, more specific)
      [userRows] = await pool.query<any[]>(
        "SELECT id, name, email FROM users WHERE id = ? AND email = ?",
        [user_id, email],
      );
    } else {
      // If only email provided, look up user by email
      [userRows] = await pool.query<any[]>(
        "SELECT id, name, email FROM users WHERE email = ?",
        [email],
      );
    }

    if (userRows.length === 0) {
      console.log("❌ User not found in database");
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const user = userRows[0];
    const userId = user.id;
    const userName = user.name || user.email.split("@")[0];

    console.log("✅ User found:", userName, "ID:", userId);

    // Delete old session codes for this user
    console.log("🗑️  Deleting old session codes...");
    await pool.query("DELETE FROM users_sessions WHERE user_id = ?", [userId]);

    // ... rest of the function (code generation and email sending)
    // Use userId instead of user_id from request body
```

## Key Changes

1. Make `user_id` optional in request body (only `email` is required)
2. If `user_id` is provided, use it for validation (mobile app flow)
3. If `user_id` is NOT provided, look it up by email (web app flow)
4. Use the looked-up `userId` for the rest of the logic

## Benefits

- **Backward compatible**: Still works with both parameters (mobile app)
- **Forward compatible**: Works with just email (web app, simpler flow)
- **More secure**: No need to expose user_id in client before authentication
- **Consistent**: Both platforms can use the same simplified flow

## Mobile App Status

✅ The React Native app is **already correctly implemented**:

- `checkUserExists` returns and stores `id_platforms_user` in Redux
- `sendVerificationCode` passes both `email` and `user_id`
- No changes needed on the mobile side

## Next Steps

1. Update the backend API `/api/auth/send-code` endpoint as shown above
2. Test with mobile app (should work immediately)
3. Optionally simplify mobile app to only send email (if desired for consistency)
