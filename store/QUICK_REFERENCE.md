# Quick Reference: New API Functions

## Authentication

```typescript
// Check if user exists
checkUserExists(email, club_id);

// Create new user
createUser(email, name, phone, club_id);

// Send verification code
sendVerificationCode(email);

// Verify code and login
verifyCode(email, code);

// Get user info
getUserInfo(user_id);
```

## Club & Courts

```typescript
// Get club details
getClubById(club_id);

// Get courts for a club
getCourts(club_id);

// Get availability (includes courts, bookings, events, classes, blocked slots)
getAvailability(club_id, date, duration_minutes);
```

## Bookings

```typescript
// Calculate price for booking
calculatePrice(club_id, court_id, date, start_time, duration_minutes, user_id)

// Create payment intent
createBookingPaymentIntent(user_id, club_id, court_id, booking_date, start_time, duration_minutes)

// Create booking (after payment)
createBooking(user_id, club_id, court_id, booking_date, start_time, duration_minutes, payment_intent_id)

// Get user's bookings
getUserBookings(user_id, club_id?)

// Cancel booking
cancelBooking(booking_id, cancellation_reason)
```

## Events

```typescript
// Get events
getEvents(club_id, status?)

// Create payment intent for event
createEventPaymentIntent(user_id, event_id)

// Register for event (after payment)
registerForEvent(payment_intent_id, user_id, event_id)

// Get user's event registrations
getUserEventRegistrations(user_id)
```

## Private Classes

```typescript
// Get instructors
getInstructors(club_id);

// Create payment intent for class
createPrivateClassPaymentIntent(
  user_id,
  instructor_id,
  club_id,
  court_id,
  class_date,
  start_time,
  duration_minutes,
  class_type,
  number_of_students
);

// Book private class (after payment)
bookPrivateClass(payment_intent_id);

// Get user's private classes
getUserPrivateClasses(user_id);
```

## Subscriptions

```typescript
// Get active subscription plans
getActiveSubscriptions(club_id);

// Get user's subscription
getUserSubscription(user_id);

// Subscribe user to plan
subscribeUser(user_id, club_id, plan_id, payment_method_id);

// Cancel subscription
cancelSubscription(user_id, subscription_id, cancellation_reason);

// Attach payment method
attachPaymentMethod(stripe_customer_id, payment_method_id, user_id);
```

## Complete Booking Example

```typescript
import { useStripe } from "@stripe/stripe-react-native";
import {
  calculatePrice,
  createBookingPaymentIntent,
  createBooking,
} from "../store/effects";

const handleCompleteBooking = async () => {
  const { confirmPayment } = useStripe();

  try {
    // 1. Calculate price
    const price = await dispatch(
      calculatePrice(clubId, courtId, date, time, 90, userId)
    );

    // 2. Create payment intent
    const intent = await dispatch(
      createBookingPaymentIntent(userId, clubId, courtId, date, time, 90)
    );

    // 3. Confirm payment with Stripe
    const { error, paymentIntent } = await confirmPayment(intent.clientSecret, {
      paymentMethodType: "Card",
    });

    if (error) throw new Error(error.message);

    // 4. Create booking
    const booking = await dispatch(
      createBooking(userId, clubId, courtId, date, time, 90, paymentIntent.id)
    );

    Alert.alert("Éxito", "Reserva creada");
  } catch (error) {
    Alert.alert("Error", error.message);
  }
};
```

## CourtTimeSlotSelector Props

```typescript
interface Props {
  selectedDate: Date; // Selected date
  selectedTime: string; // Selected time (HH:MM)
  selectedCourt: Court | null; // Selected court
  availability: AvailabilityData | null; // From getAvailability()
  loading: boolean; // Loading state
  duration: number; // Booking duration (minutes)
  calculatedPrice: number | null; // From calculatePrice()
  onSelectTimeSlot: (court, time) => void; // Handle court booking
  onEventSelect?: (event) => void; // Handle event registration
  onClassSelect?: (instructor, time, court) => void; // Handle class booking
  instructors?: Instructor[]; // From getInstructors()
  selectedInstructor?: Instructor | null;
  onInstructorSelect?: (instructor) => void;
  userSubscription?: UserSubscription; // For discount display
}
```

## Type Imports

```typescript
import type {
  User,
  Club,
  Court,
  Booking,
  Event,
  EventParticipant,
  Instructor,
  PrivateClass,
  ClubSubscription,
  UserSubscription,
  AvailabilityData,
  PriceCalculation,
} from "../store/effects";
```

## Common Patterns

### Loading Availability

```typescript
useEffect(() => {
  const load = async () => {
    const data = await dispatch(
      getAvailability(clubId, format(date, "yyyy-MM-dd"), 90)
    );
    setAvailability(data);
  };
  load();
}, [date]);
```

### Payment Flow Template

```typescript
const handlePayment = async (createIntentFn, confirmFn) => {
  try {
    // 1. Create payment intent
    const intent = await dispatch(createIntentFn());

    // 2. Confirm with Stripe
    const { error, paymentIntent } = await confirmPayment(intent.clientSecret, {
      paymentMethodType: "Card",
    });

    if (error) throw new Error(error.message);

    // 3. Confirm on backend
    await dispatch(confirmFn(paymentIntent.id));

    Alert.alert("Éxito", "Pago completado");
  } catch (error) {
    Alert.alert("Error", error.message);
  }
};
```

## Environment Setup

```typescript
// .env or config file
API_BASE_URL=https://intelipadel.com/api
STRIPE_PUBLISHABLE_KEY=pk_...
```

## Redux Dispatch Pattern

All functions follow this pattern:

```typescript
const result = await dispatch(functionName(params));
```

They automatically dispatch:

- Start action (loading state)
- Success/Failure action (with data)
- Return the result for immediate use
