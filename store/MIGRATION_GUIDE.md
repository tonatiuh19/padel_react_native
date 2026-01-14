# Migration Guide: New API Structure

## Overview

This guide explains how to use the new API structure that follows RESTful conventions and uses the updated database schema.

## Key Changes

### 1. API Base URL

```typescript
// Old
const DOMAIN = "https://garbrix.com/padel/api/";

// New
const API_BASE_URL = "https://intelipadel.com/api";
```

### 2. Database Changes

- `platforms_date_time_slot` → `bookings` table
- `platforms_user` → `users` table
- `platforms` → `clubs` table
- `platforms_field` → `courts` table
- Added: `events`, `event_participants`, `instructors`, `private_classes`, `club_subscriptions`, `user_subscriptions`

### 3. Endpoint Structure

Old endpoints used specific PHP files. New endpoints use RESTful routing:

**Old:**

```typescript
const GET_PLATFORM_FIELDS_BY_ID = `${DOMAIN}/getPlatformFieldsById.php`;
const CREATE_PAYMENT_INTENT = `${DOMAIN}/createPaymentIntent.php`;
```

**New:**

```typescript
GET /api/clubs/:id
POST /api/payment/create-intent
POST /api/bookings
```

## Usage Examples

### 1. Authentication Flow

#### Check if User Exists

```typescript
import { checkUserExists } from "../store/effects";

const handleLogin = async (email: string, clubId: number) => {
  try {
    const result = await dispatch(checkUserExists(email, clubId));

    if (result.exists) {
      // User exists, send verification code
      await dispatch(sendVerificationCode(email));
    } else {
      // Show registration form
      showRegistrationForm();
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
```

#### Create New User

```typescript
import { createUser, sendVerificationCode } from "../store/effects";

const handleRegister = async (
  email: string,
  name: string,
  phone: string,
  clubId: number
) => {
  try {
    const result = await dispatch(createUser(email, name, phone, clubId));

    if (result.success) {
      // Send verification code
      await dispatch(sendVerificationCode(email));
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
```

#### Verify Code and Login

```typescript
import { verifyCode } from "../store/effects";

const handleVerifyCode = async (email: string, code: string) => {
  try {
    const result = await dispatch(verifyCode(email, code));

    if (result.success) {
      const user = result.user;
      const sessionCode = result.session.session_code;

      // Store user data
      storeUserData(user, sessionCode);

      // Navigate to home
      navigation.navigate("Home");
    }
  } catch (error) {
    console.error("Invalid code");
  }
};
```

### 2. Fetching Availability

#### Get Courts and Availability

```typescript
import { getCourts, getAvailability } from "../store/effects";
import type { AvailabilityData } from "../store/effects";

const [availability, setAvailability] = useState<AvailabilityData | null>(null);

const loadAvailability = async (
  clubId: number,
  date: string,
  duration: number = 90
) => {
  try {
    // Get availability includes courts, bookings, events, etc.
    const data = await dispatch(getAvailability(clubId, date, duration));
    setAvailability(data);
  } catch (error) {
    console.error("Error loading availability:", error);
  }
};

// Usage
useEffect(() => {
  loadAvailability(1, "2026-01-15", 90);
}, [selectedDate]);
```

### 3. Creating a Booking

#### Full Booking Flow

```typescript
import {
  calculatePrice,
  createBookingPaymentIntent,
  createBooking,
} from '../store/effects';
import { useStripe } from '@stripe/stripe-react-native';

const BookingScreen = () => {
  const { confirmPayment } = useStripe();

  const handleBooking = async (
    userId: number,
    clubId: number,
    courtId: number,
    date: string,
    time: string,
    duration: number
  ) => {
    try {
      // Step 1: Calculate price
      const priceData = await dispatch(
        calculatePrice(clubId, courtId, date, time, duration, userId)
      );

      console.log('Total price:', priceData.total_price);

      // Step 2: Create payment intent
      const paymentIntent = await dispatch(
        createBookingPaymentIntent(userId, clubId, courtId, date, time, duration)
      );

      // Step 3: Confirm payment with Stripe
      const { error, paymentIntent: confirmedPayment } = await confirmPayment(
        paymentIntent.clientSecret,
        {
          paymentMethodType: 'Card',
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      // Step 4: Create booking after successful payment
      const booking = await dispatch(
        createBooking(
          userId,
          clubId,
          courtId,
          date,
          time,
          duration,
          confirmedPayment.id
        )
      );

      console.log('Booking created:', booking);
      Alert.alert('Éxito', 'Reserva creada exitosamente');

    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'No se pudo completar la reserva');
    }
  };

  return (
    // Your UI here
  );
};
```

### 4. Using the CourtTimeSlotSelector Component

```typescript
import CourtTimeSlotSelector from "./shared/CourtTimeSlotSelector";
import { getAvailability, getInstructors } from "../../store/effects";
import type { Court, Instructor, AvailabilityData } from "../../store/effects";

const ScheduleScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [availability, setAvailability] = useState<AvailabilityData | null>(
    null
  );
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [selectedInstructor, setSelectedInstructor] =
    useState<Instructor | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load availability
      const availData = await dispatch(
        getAvailability(clubId, format(selectedDate, "yyyy-MM-dd"), 90)
      );
      setAvailability(availData);

      // Load instructors
      const instructorData = await dispatch(getInstructors(clubId));
      setInstructors(instructorData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeSlotSelect = (court: Court, time: string) => {
    setSelectedCourt(court);
    setSelectedTime(time);
    // Proceed with booking
    proceedToPayment(court, time);
  };

  const handleEventSelect = async (event: Event) => {
    // Handle event registration
    try {
      const paymentIntent = await dispatch(
        createEventPaymentIntent(userId, event.id)
      );

      // Show Stripe payment sheet
      // After payment confirmation:
      await dispatch(
        registerForEvent(paymentIntent.payment_intent_id, userId, event.id)
      );

      Alert.alert("Éxito", "Te has inscrito al evento");
    } catch (error) {
      Alert.alert("Error", "No se pudo inscribir al evento");
    }
  };

  const handleClassSelect = async (
    instructor: Instructor,
    time: string,
    court: Court
  ) => {
    // Handle private class booking
    try {
      const paymentIntent = await dispatch(
        createPrivateClassPaymentIntent(
          userId,
          instructor.id,
          clubId,
          court.id,
          format(selectedDate, "yyyy-MM-dd"),
          time,
          90, // duration
          "individual",
          1 // number of students
        )
      );

      // Show Stripe payment sheet
      // After payment confirmation:
      await dispatch(bookPrivateClass(paymentIntent.payment_intent_id));

      Alert.alert("Éxito", "Clase privada reservada");
    } catch (error) {
      Alert.alert("Error", "No se pudo reservar la clase");
    }
  };

  return (
    <View>
      {/* Date Picker */}
      <DatePicker value={selectedDate} onChange={setSelectedDate} />

      {/* Court & Time Slot Selector */}
      <CourtTimeSlotSelector
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        selectedCourt={selectedCourt}
        availability={availability}
        loading={loading}
        duration={90}
        calculatedPrice={null}
        onSelectTimeSlot={handleTimeSlotSelect}
        onEventSelect={handleEventSelect}
        onClassSelect={handleClassSelect}
        instructors={instructors}
        selectedInstructor={selectedInstructor}
        onInstructorSelect={setSelectedInstructor}
        userSubscription={userSubscription}
      />
    </View>
  );
};
```

### 5. Managing Events

#### Get Events for a Club

```typescript
import { getEvents } from "../store/effects";

const loadEvents = async (clubId: number) => {
  try {
    const events = await dispatch(getEvents(clubId, "open"));
    setEvents(events);
  } catch (error) {
    console.error("Error loading events:", error);
  }
};
```

#### Register for an Event

```typescript
import { createEventPaymentIntent, registerForEvent } from "../store/effects";

const handleEventRegistration = async (userId: number, eventId: number) => {
  try {
    // Create payment intent
    const paymentIntent = await dispatch(
      createEventPaymentIntent(userId, eventId)
    );

    // Confirm payment with Stripe
    const { error, paymentIntent: confirmedPayment } = await confirmPayment(
      paymentIntent.clientSecret,
      { paymentMethodType: "Card" }
    );

    if (error) throw new Error(error.message);

    // Register user after payment
    const participant = await dispatch(
      registerForEvent(confirmedPayment.id, userId, eventId)
    );

    Alert.alert("Éxito", "Inscripción completada");
  } catch (error) {
    Alert.alert("Error", "No se pudo completar la inscripción");
  }
};
```

### 6. Private Classes

#### Book a Private Class

```typescript
import {
  getInstructors,
  createPrivateClassPaymentIntent,
  bookPrivateClass,
} from '../store/effects';

const BookPrivateClass = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);

  useEffect(() => {
    loadInstructors();
  }, []);

  const loadInstructors = async () => {
    const data = await dispatch(getInstructors(clubId));
    setInstructors(data);
  };

  const handleBookClass = async (
    instructor: Instructor,
    courtId: number,
    date: string,
    time: string
  ) => {
    try {
      // Create payment intent
      const paymentIntent = await dispatch(
        createPrivateClassPaymentIntent(
          userId,
          instructor.id,
          clubId,
          courtId,
          date,
          time,
          90, // duration
          'individual',
          1 // students
        )
      );

      // Confirm payment
      const { error, paymentIntent: confirmedPayment } = await confirmPayment(
        paymentIntent.clientSecret,
        { paymentMethodType: 'Card' }
      );

      if (error) throw new Error(error.message);

      // Book class
      const privateClass = await dispatch(
        bookPrivateClass(confirmedPayment.id)
      );

      Alert.alert('Éxito', 'Clase reservada');
    } catch (error) {
      Alert.alert('Error', 'No se pudo reservar la clase');
    }
  };

  return (
    // Your UI
  );
};
```

### 7. User Subscriptions

#### Get and Subscribe to Plans

```typescript
import {
  getActiveSubscriptions,
  getUserSubscription,
  subscribeUser,
} from '../store/effects';

const SubscriptionsScreen = () => {
  const [plans, setPlans] = useState<ClubSubscription[]>([]);
  const [userSub, setUserSub] = useState<UserSubscription | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Get available plans
    const plansData = await dispatch(getActiveSubscriptions(clubId));
    setPlans(plansData);

    // Get user's active subscription
    const subData = await dispatch(getUserSubscription(userId));
    setUserSub(subData);
  };

  const handleSubscribe = async (planId: number, paymentMethodId: string) => {
    try {
      const subscription = await dispatch(
        subscribeUser(userId, clubId, planId, paymentMethodId)
      );

      Alert.alert('Éxito', 'Suscripción activada');
      setUserSub(subscription);
    } catch (error) {
      Alert.alert('Error', 'No se pudo completar la suscripción');
    }
  };

  return (
    // Your UI
  );
};
```

### 8. Getting User's Bookings/Classes/Events

```typescript
import {
  getUserBookings,
  getUserPrivateClasses,
  getUserEventRegistrations,
} from "../store/effects";

const MyReservationsScreen = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [classes, setClasses] = useState<PrivateClass[]>([]);
  const [events, setEvents] = useState<EventParticipant[]>([]);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      // Get bookings
      const bookingsData = await dispatch(getUserBookings(userId, clubId));
      setBookings(bookingsData);

      // Get private classes
      const classesData = await dispatch(getUserPrivateClasses(userId));
      setClasses(classesData);

      // Get event registrations
      const eventsData = await dispatch(getUserEventRegistrations(userId));
      setEvents(eventsData);
    } catch (error) {
      console.error("Error loading reservations:", error);
    }
  };

  return (
    <ScrollView>
      {/* Bookings */}
      <Text style={styles.title}>Mis Reservas</Text>
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} />
      ))}

      {/* Private Classes */}
      <Text style={styles.title}>Mis Clases</Text>
      {classes.map((cls) => (
        <ClassCard key={cls.id} class={cls} />
      ))}

      {/* Events */}
      <Text style={styles.title}>Mis Eventos</Text>
      {events.map((event) => (
        <EventCard key={event.id} registration={event} />
      ))}
    </ScrollView>
  );
};
```

## Migration Checklist

- [ ] Update API base URL
- [ ] Replace old authentication functions
- [ ] Update booking creation flow
- [ ] Implement CourtTimeSlotSelector component
- [ ] Update event registration flow
- [ ] Add private class booking
- [ ] Implement subscription management
- [ ] Update user reservations display
- [ ] Test all payment flows
- [ ] Update Redux state structure (if needed)

## Important Notes

1. **Payment Flow**: All payments now go through a two-step process:

   - Create payment intent → Confirm with Stripe → Call confirm endpoint

2. **Availability API**: Single endpoint returns all necessary data (courts, bookings, events, classes)

3. **Type Safety**: Import types from `effects.tsx` for full TypeScript support

4. **Error Handling**: All functions dispatch appropriate Redux actions and throw errors on failure

5. **Backward Compatibility**: Legacy function names are aliased to new functions for easier migration

## Need Help?

See the full API documentation in `store/API_DOCUMENTATION.md` for detailed endpoint information.
