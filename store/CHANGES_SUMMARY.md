# API Migration - Summary of Changes

## Files Created/Modified

### 1. **store/effects.tsx** (Replaced)

- **Old file backed up as**: `effects_old_backup.tsx`
- **Changes**:
  - Updated API base URL to `https://intelipadel.com/api`
  - Converted all endpoints to RESTful structure
  - Added TypeScript interfaces matching new database schema
  - Implemented new functions for:
    - Authentication (check user, create user, send/verify code)
    - Booking management (create, cancel, list)
    - Availability fetching (courts, time slots, events, classes)
    - Event registration
    - Private class booking
    - Subscription management
    - Payment processing
  - Maintained backward compatibility with legacy function names

### 2. **screens/HomeScreen/shared/CourtTimeSlotSelector.tsx** (New)

- React Native component for displaying and selecting:
  - Available court time slots
  - Tournament/event listings with registration
  - Private class instructor selection
  - Integrated availability checking for all types
- Features:
  - Automatic blocking of unavailable slots
  - Visual feedback for selected slots
  - Support for instructor-led classes
  - Event registration UI
  - Subscription discount display
  - Responsive layout

### 3. **screens/HomeScreen/HomeScreen.model.new.tsx** (New)

- Updated TypeScript interfaces matching new database structure
- Includes all new types:
  - User, Club, Court, Booking
  - Event, EventParticipant
  - Instructor, PrivateClass
  - ClubSubscription, UserSubscription
  - AvailabilityData
  - PriceCalculation
- Maintained legacy types for backward compatibility
- New AppState interface for Redux

### 4. **store/MIGRATION_GUIDE.md** (New)

- Comprehensive guide with:
  - Step-by-step migration instructions
  - Code examples for all major flows
  - Authentication examples
  - Booking creation examples
  - Event registration examples
  - Private class booking examples
  - Component usage examples
  - Migration checklist

## Key API Changes

### Endpoints Mapping

| Old Endpoint                       | New Endpoint                           | Method |
| ---------------------------------- | -------------------------------------- | ------ |
| `getPlatformFieldsById.php`        | `/api/clubs/:id`                       | GET    |
| `getPlatformSlotsById.php`         | `/api/availability`                    | GET    |
| `createPaymentIntent.php`          | `/api/payment/create-intent`           | POST   |
| `insertPlatformDateTimeSlot.php`   | `/api/bookings`                        | POST   |
| `deletePlatformDateTimeSlot.php`   | `/api/bookings/:id/cancel`             | POST   |
| `validateUserByEmail.php`          | `/api/auth/check-user`                 | POST   |
| `insertPlatformUser.php`           | `/api/auth/create-user`                | POST   |
| `sendCodeByMail.php`               | `/api/auth/send-code`                  | POST   |
| `validateSessionCode.php`          | `/api/auth/verify-code`                | POST   |
| `getReservationsByUserId.php`      | `/api/bookings?user_id=X`              | GET    |
| `insertEventUser.php`              | `/api/events/payment/confirm`          | POST   |
| `getClassesByIdPlatform.php`       | `/api/events?club_id=X`                | GET    |
| `insertPlatformFieldClassUser.php` | `/api/private-classes/payment/confirm` | POST   |
| `getPlatformSectionsById.php`      | `/api/subscriptions/active/:club_id`   | GET    |

### Database Table Changes

| Old Table                          | New Table                                   |
| ---------------------------------- | ------------------------------------------- |
| `platforms`                        | `clubs`                                     |
| `platforms_field`                  | `courts`                                    |
| `platforms_user`                   | `users`                                     |
| `platforms_date_time_slot`         | `bookings`                                  |
| `platforms_disabled_date` (events) | `events` + `event_participants`             |
| `platforms_fields_classes`         | `private_classes`                           |
| `platforms_sections`               | `club_subscriptions` + `user_subscriptions` |

## New Features

### 1. **Unified Availability API**

The new `/api/availability` endpoint returns everything needed in one call:

- All courts
- Club schedules
- Existing bookings
- Blocked slots
- Events
- Event court schedules
- Private classes

### 2. **Event Management**

- Full tournament/event system
- Event registration with payment
- Participant tracking
- Event-specific court schedules

### 3. **Private Classes**

- Instructor profiles with availability
- Class type support (individual, group, semi-private)
- Court-specific class booking
- Instructor rating system

### 4. **Subscription System**

- Club membership plans
- Recurring billing through Stripe
- Discount percentages for bookings, events, classes
- Subscription status tracking

### 5. **Enhanced Payment Flow**

- Standardized payment intent creation
- Separate confirmation endpoints
- Better error handling
- Transaction tracking

## Component Integration

### CourtTimeSlotSelector Usage

```typescript
import CourtTimeSlotSelector from "./shared/CourtTimeSlotSelector";
import { getAvailability, getInstructors } from "../../store/effects";

<CourtTimeSlotSelector
  selectedDate={selectedDate}
  selectedTime={selectedTime}
  selectedCourt={selectedCourt}
  availability={availability}
  loading={loading}
  duration={90}
  calculatedPrice={priceData}
  onSelectTimeSlot={handleBooking}
  onEventSelect={handleEventRegistration}
  onClassSelect={handleClassBooking}
  instructors={instructors}
  selectedInstructor={selectedInstructor}
  onInstructorSelect={setSelectedInstructor}
  userSubscription={userSubscription}
/>;
```

## Testing Recommendations

1. **Authentication Flow**

   - Test user creation
   - Test code sending/verification
   - Test session management

2. **Booking Flow**

   - Test availability fetching
   - Test price calculation
   - Test payment intent creation
   - Test booking creation after payment
   - Test booking cancellation

3. **Event Registration**

   - Test event listing
   - Test event payment
   - Test registration confirmation
   - Test user event list

4. **Private Classes**

   - Test instructor fetching
   - Test class payment
   - Test class confirmation
   - Test user class list

5. **Subscriptions**
   - Test plan listing
   - Test subscription creation
   - Test discount application
   - Test subscription cancellation

## Breaking Changes

1. **Function Signatures**: Many functions now have different parameters matching the new API
2. **Return Types**: Response structures have changed to match new database schema
3. **API Base URL**: Must be updated in all environments
4. **Redux State**: Consider updating Redux state structure to match new types

## Backward Compatibility

Legacy function names are aliased to maintain compatibility:

- `fetchPlatformFields` → `getClubById`
- `fetchPlatformsFields` → `getAvailability`
- `insertPlatformDateTimeSlot` → `createBooking`
- `deletePlatformDateTimeSlot` → `cancelBooking`
- And many more...

## Next Steps

1. Update Redux slice (`appSlice.tsx`) to handle new data structures
2. Update screens to use new component and functions
3. Test all payment flows thoroughly
4. Update environment variables for API URL
5. Migrate existing data if necessary
6. Update any remaining PHP endpoint references

## Support

- See `API_DOCUMENTATION.md` for full API reference
- See `MIGRATION_GUIDE.md` for detailed examples
- See `schema.sql` for database structure

## Notes

- Old `effects.tsx` is saved as `effects_old_backup.tsx` for reference
- Consider merging `HomeScreen.model.new.tsx` into `HomeScreen.model.tsx` when ready
- The new structure supports future features like:
  - Tournament brackets
  - Team management
  - Coaching programs
  - Equipment rental
  - Merchandise shop
