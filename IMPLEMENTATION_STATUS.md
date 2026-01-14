# Component Update Instructions

## Current Status: ❌ NO COMPONENTS ARE USING NEW API YET

All components are still importing and using old API functions like:

- `validateUserByEmail`
- `insertPlatformUser`
- `fetchPlatformFields`
- `fetchPlatformsFields`
- `getReservationsByUserId`
- `getClassesByIdPlatform`
- etc.

The new API functions exist in `store/effects.tsx` but are NOT being used by any components yet.

## What Needs to Happen

### Option 1: Keep Backward Compatibility (RECOMMENDED)

The new `effects.tsx` already includes aliases for backward compatibility:

```typescript
// At the end of effects.tsx
export const fetchPlatformFields = getClubById;
export const fetchPlatformsFields = getAvailability;
export const insertPlatformDateTimeSlot = createBooking;
// etc.
```

**This means:** Components should continue to work WITHOUT changes IF the backend API is updated.

**However:** The components won't benefit from new features like:

- Events
- Private classes
- Subscriptions
- Enhanced availability checking

### Option 2: Update Each Component (FULL MIGRATION)

Manually update each component to use new functions and data structures.

## Quick Fix: Enable Current Components

Since the old function names are aliased, the current components SHOULD work if:

1. **Backend API is updated** to new structure
2. **Redux transformations** in effects.tsx map new → old data formats

The transformations are ALREADY in place in the updated effects.tsx:

```typescript
// Example: createBooking transforms new Booking to old PaymentState
const legacyPaymentState = {
  id_platforms_date_time_slot: response.data.booking.id,
  id_platforms_field: response.data.booking.court_id,
  platforms_date_time_start: response.data.booking.start_time,
  // ... etc
};
dispatch(insertPlatformDateTimeSlotSuccess(legacyPaymentState));
```

## Testing Checklist

### ✅ What Should Work Immediately (with new backend):

- [x] Login/Register flow
- [x] Fetching club data
- [x] Creating bookings
- [x] Viewing reservations
- [x] Profile management

### ❌ What WON'T Work Yet (needs component updates):

- [ ] Event registration UI
- [ ] Private class booking UI
- [ ] Subscription management UI
- [ ] CourtTimeSlotSelector component integration
- [ ] Real-time availability checking

## Recommended Next Steps

### Step 1: Test Current Components (No Changes Needed)

1. Update backend to new API structure
2. Test login flow
3. Test booking flow
4. Test profile/reservations

**Expected:** Should work due to backward compatibility

### Step 2: Add New Features Gradually

#### A. Add Events Section

Update `ClasesScreen` to:

```typescript
import {
  getEvents,
  createEventPaymentIntent,
  registerForEvent,
} from "../../store/effects";

// Fetch events
const events = await dispatch(getEvents(clubId, "open"));

// Register for event
const intent = await dispatch(createEventPaymentIntent(userId, eventId));
const { paymentIntent } = await confirmPayment(intent.clientSecret);
await dispatch(registerForEvent(paymentIntent.id, userId, eventId));
```

#### B. Add Private Classes

Update `ClasesScreen` or create new section:

```typescript
import {
  getInstructors,
  createPrivateClassPaymentIntent,
  bookPrivateClass,
} from "../../store/effects";

// Fetch instructors
const instructors = await dispatch(getInstructors(clubId));

// Book class
const intent = await dispatch(
  createPrivateClassPaymentIntent(
    userId,
    instructorId,
    clubId,
    courtId,
    date,
    time,
    90,
    "individual",
    1
  )
);
const { paymentIntent } = await confirmPayment(intent.clientSecret);
await dispatch(bookPrivateClass(paymentIntent.id));
```

#### C. Add Real Subscriptions

Update `MembresiasScreen`:

```typescript
import {
  getActiveSubscriptions,
  getUserSubscription,
  subscribeUser,
} from "../../store/effects";

// Fetch plans
const plans = await dispatch(getActiveSubscriptions(clubId));

// Get user's subscription
const userSub = await dispatch(getUserSubscription(userId));

// Subscribe
await dispatch(subscribeUser(userId, clubId, planId, paymentMethodId));
```

#### D. Integrate CourtTimeSlotSelector

Replace `ScheduleScreen` time slot UI:

```typescript
import CourtTimeSlotSelector from "../HomeScreen/shared/CourtTimeSlotSelector";
import { getAvailability, getInstructors } from "../../store/effects";

// In component:
const [availability, setAvailability] = useState(null);
const [instructors, setInstructors] = useState([]);

useEffect(() => {
  const load = async () => {
    const avail = await dispatch(getAvailability(clubId, date, 90));
    setAvailability(avail);

    const inst = await dispatch(getInstructors(clubId));
    setInstructors(inst);
  };
  load();
}, [date]);

return (
  <CourtTimeSlotSelector
    selectedDate={selectedDate}
    selectedTime={selectedTime}
    selectedCourt={selectedCourt}
    availability={availability}
    loading={loading}
    duration={90}
    onSelectTimeSlot={handleBooking}
    onEventSelect={handleEventRegistration}
    onClassSelect={handleClassBooking}
    instructors={instructors}
    selectedInstructor={selectedInstructor}
    onInstructorSelect={setSelectedInstructor}
  />
);
```

## Summary

**Current State:**

- ✅ New API functions created in effects.tsx
- ✅ Backward compatibility aliases in place
- ✅ Data transformations to old format included
- ✅ CourtTimeSlotSelector component created
- ❌ Components still use old function names (but aliased to new ones)
- ❌ Components don't use new features (events, classes, subscriptions)
- ❌ CourtTimeSlotSelector not integrated into any screen

**Action Required:**

1. **Backend:** Update API to new structure (required for everything)
2. **Testing:** Test existing features without component changes (should work via aliases)
3. **Enhancement:** Gradually add new features by updating components
4. **Integration:** Replace old time slot UI with CourtTimeSlotSelector

**Bottom Line:**
The foundation is ready. Components will continue to work with old function names due to aliases. New features require component updates. The transition can be gradual.
