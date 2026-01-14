# Component Migration Status

## Summary

The following components need to be updated to use the new API endpoints:

1. ✅ **LoginScreen** - Partially uses new functions (needs full update)
2. ❌ **HomeScreen** - Uses old functions
3. ❌ **ScheduleScreen** - Uses old functions
4. ❌ **ReservationsScreen** - Uses old functions
5. ❌ **MembresiasScreen** - Not using store effects (static data)
6. ❌ **ProfileScreen** - Uses old functions
7. ❌ **ClasesScreen** - Uses old functions

## Required Changes Per Component

### 1. LoginScreen/SignInForm/CodeValidationForm

**Current:** Uses `validateUserByEmail`, `insertPlatformUser`, `sendCodeByMail`, `validateSessionCode`
**Update to:** Use `checkUserExists`, `createUser`, `sendVerificationCode`, `verifyCode`

### 2. HomeScreen

**Current:** Uses `fetchPlatformFields`, `getAdsById`, `getPlatformSectionsById`, `getUserInfoById`
**Update to:**

- `getClubById(club_id)` instead of `fetchPlatformFields`
- Keep `getUserInfo(user_id)` (aliased from `getUserInfoById`)
- `getActiveSubscriptions(club_id)` instead of `getPlatformSectionsById`
- Add: `getAvailability(club_id, date, duration)` for court availability
- Add: `getEvents(club_id)` for events
- Add: `getUserSubscription(user_id)` for user's subscription status

### 3. ScheduleScreen

**Current:** Uses `fetchPlatformsFields`, `getClassesByIdField`
**Update to:**

- `getAvailability(club_id, date, duration)` instead of `fetchPlatformsFields`
- Replace schedule logic with CourtTimeSlotSelector component
- `getInstructors(club_id)` for private classes
- `createBookingPaymentIntent` + `createBooking` for bookings
- `createPrivateClassPaymentIntent` + `bookPrivateClass` for classes

### 4. ReservationsScreen

**Current:** Uses `getReservationsByUserId`
**Update to:**

- `getUserBookings(user_id, club_id)` - Returns new Booking[] format
- `getUserPrivateClasses(user_id)` - For class reservations
- `getUserEventRegistrations(user_id)` - For event registrations
- Update UI to handle new data structures

### 5. ProfileScreen

**Current:** Uses `attachPaymentMethod`, `logout`
**Update to:**

- Keep `attachPaymentMethod` (updated signature)
- Keep `logout` (updated to clear session only)
- Add: `cancelSubscription` for subscription cancellation
- Update payment method management with new structure

### 6. ClasesScreen (Events/Classes Screen)

**Current:** Uses `getClassesByIdPlatform`, `getClassesByUserId`
**Update to:**

- `getEvents(club_id, 'open')` instead of `getClassesByIdPlatform`
- `getUserEventRegistrations(user_id)` for user's events
- `getUserPrivateClasses(user_id)` for user's classes
- Update UI to distinguish between events and classes

### 7. MembresiasScreen

**Current:** Static subscription data
**Update to:**

- `getActiveSubscriptions(club_id)` to fetch real plans
- `getUserSubscription(user_id)` to check active subscription
- `subscribeUser(user_id, club_id, plan_id, payment_method_id)` to subscribe
- `cancelSubscription(user_id, subscription_id, reason)` to cancel

## Implementation Plan

### Phase 1: Authentication (LoginScreen)

- Update login flow to use new endpoints
- Implement proper session management
- Store user ID and session code

### Phase 2: Core Navigation (HomeScreen)

- Fetch club data with new endpoints
- Display user's subscription status
- Show upcoming bookings and classes

### Phase 3: Booking Flow (ScheduleScreen)

- Integrate CourtTimeSlotSelector component
- Implement new booking payment flow
- Add event registration
- Add private class booking

### Phase 4: User Data (ReservationsScreen, ProfileScreen)

- Fetch and display user's bookings
- Fetch and display user's classes
- Fetch and display user's events
- Update payment method management

### Phase 5: Subscriptions & Events (MembresiasScreen, ClasesScreen)

- Fetch real subscription plans
- Implement subscription purchase
- Display events with proper data
- Show private classes separately

## Code Templates

### Booking Flow Template

\`\`\`typescript
const handleBooking = async (courtId, date, time, duration) => {
// 1. Calculate price
const price = await dispatch(
calculatePrice(clubId, courtId, date, time, duration, userId)
);

// 2. Create payment intent
const intent = await dispatch(
createBookingPaymentIntent(userId, clubId, courtId, date, time, duration)
);

// 3. Confirm with Stripe
const { paymentIntent } = await confirmPayment(intent.clientSecret);

// 4. Create booking
const booking = await dispatch(
createBooking(userId, clubId, courtId, date, time, duration, paymentIntent.id)
);
};
\`\`\`

### Event Registration Template

\`\`\`typescript
const handleEventRegistration = async (eventId) => {
// 1. Create payment intent
const intent = await dispatch(createEventPaymentIntent(userId, eventId));

// 2. Confirm with Stripe
const { paymentIntent } = await confirmPayment(intent.clientSecret);

// 3. Register for event
const participant = await dispatch(
registerForEvent(paymentIntent.id, userId, eventId)
);
};
\`\`\`

### Private Class Booking Template

\`\`\`typescript
const handleClassBooking = async (instructorId, courtId, date, time) => {
// 1. Create payment intent
const intent = await dispatch(
createPrivateClassPaymentIntent(
userId, instructorId, clubId, courtId,
date, time, 90, 'individual', 1
)
);

// 2. Confirm with Stripe
const { paymentIntent } = await confirmPayment(intent.clientSecret);

// 3. Book class
const privateClass = await dispatch(bookPrivateClass(paymentIntent.id));
};
\`\`\`

## Next Steps

1. Update each component following the templates above
2. Test authentication flow end-to-end
3. Test booking flow with Stripe
4. Test event registration
5. Test subscription management
6. Update Redux state structure if needed
