# Payment Flow Integration Guide

## Overview

This guide demonstrates how to integrate the complete payment flow (summary → payment → confirmation) into your booking screens.

## Components Created

### 1. **BookingSummary** - Court booking summary

- Location: `screens/ScheduleScreen/BookingSummary/BookingSummary.tsx`
- Purpose: Display court booking details before payment

### 2. **ClassRegistrationSummary** - Private class summary

- Location: `screens/ScheduleScreen/ClassRegistrationSummary/ClassRegistrationSummary.tsx`
- Purpose: Display private class booking details before payment

### 3. **EventRegistrationSummary** - Event registration summary

- Location: `screens/ScheduleScreen/EventRegistrationSummary/EventRegistrationSummary.tsx`
- Purpose: Display event registration details before payment

### 4. **PaymentMethodSelector** - Payment method selection

- Location: `screens/ScheduleScreen/PaymentMethodSelector/PaymentMethodSelector.tsx`
- Purpose: Display and select saved payment methods or add new ones
- API: `GET /api/users/:userId/payment-methods`

### 5. **PaymentProcessingScreen** - Complete payment flow

- Location: `screens/ScheduleScreen/PaymentProcessingScreen/PaymentProcessingScreen.tsx`
- Purpose: Orchestrate the entire payment process
- Features:
  - Calls `calculate-price` API
  - Shows appropriate summary component
  - Displays payment method selector
  - Creates payment intent
  - Confirms payment
  - Handles errors and loading states

### 6. **PaymentConfirmationScreen** - Success screen

- Location: `screens/ScheduleScreen/PaymentConfirmationScreen/PaymentConfirmationScreen.tsx`
- Purpose: Show confirmation after successful payment
- Features: Confirmation number, booking details, add to calendar option

## API Endpoints Used

### Calculate Price

```typescript
POST /api/calculate-price
Body (Court):
{
  club_id: number,
  court_id: number,
  booking_date: string,
  start_time: string,
  duration_minutes: number,
  user_id: number
}

Body (Private Class):
{
  club_id: number,
  instructor_id: number,
  class_date: string,
  start_time: string,
  end_time: string,
  user_id: number,
  booking_type: 'private_class'
}

Body (Event):
{
  event_id: number,
  user_id: number,
  booking_type: 'event'
}

Response:
{
  base_price: number,
  service_fee: number,
  user_pays_service_fee: number,
  subtotal: number,
  iva: number,
  total_with_iva: number,
  fee_structure: string,
  original_price?: number,
  discount_applied?: number
}
```

### Payment Methods

```typescript
GET /api/users/:userId/payment-methods
Response:
{
  payment_methods: [
    {
      id: string,
      type: string,
      card: {
        brand: string,
        last4: string,
        exp_month: number,
        exp_year: number
      },
      is_default: boolean
    }
  ]
}
```

### Create Payment Intent

```typescript
// Court Booking
POST /api/payment/create-intent
Body:
{
  user_id: number,
  payment_method_id: string,
  club_id: number,
  court_id: number,
  booking_date: string,
  start_time: string,
  end_time: string
}

// Private Class
POST /api/private-classes/payment/create-intent
Body:
{
  user_id: number,
  payment_method_id: string,
  instructor_id: number,
  club_id: number,
  court_id: number,
  class_date: string,
  start_time: string,
  end_time: string,
  class_type: string,
  number_of_students: number,
  focus_areas?: string[],
  student_level?: string
}

// Event
POST /api/events/payment/create-intent
Body:
{
  user_id: number,
  payment_method_id: string,
  event_id: number
}

Response:
{
  payment_intent_id: string
}
```

### Confirm Payment

```typescript
// Court Booking
POST /api/payment/confirm
Body: { payment_intent_id: string }

// Private Class
POST /api/private-classes/payment/confirm
Body: { payment_intent_id: string }

// Event
POST /api/events/payment/confirm
Body: { payment_intent_id: string }

Response:
{
  success: boolean,
  booking_id: number,
  confirmation_number: string,
  ...booking_details
}
```

## Integration Example

### Option 1: Modal-Based Flow (Recommended)

```typescript
// In ScheduleScreen.tsx
import { Modal } from 'react-native';
import PaymentProcessingScreen from './PaymentProcessingScreen/PaymentProcessingScreen';
import PaymentConfirmationScreen from './PaymentConfirmationScreen/PaymentConfirmationScreen';

const [showPaymentModal, setShowPaymentModal] = useState(false);
const [showConfirmationModal, setShowConfirmationModal] = useState(false);
const [bookingData, setBookingData] = useState<any>(null);
const [confirmationNumber, setConfirmationNumber] = useState('');
const [paymentType, setPaymentType] = useState<'court' | 'class' | 'event'>('court');

// Court booking handler
const handleTimeSlotSelect = (court: Court, time: string) => {
  setSelectedCourt(court);
  setSelectedTime(time);
  setPaymentType('court');
  setShowPaymentModal(true);
};

// Private class handler
const handleClassSelect = (instructor: Instructor, time: string, court: Court) => {
  setSelectedInstructor(instructor);
  setSelectedTime(time);
  setSelectedCourt(court);
  setPaymentType('class');
  setShowPaymentModal(true);
};

// Event handler
const handleEventSelect = (event: any) => {
  setSelectedEvent(event);
  setPaymentType('event');
  setShowPaymentModal(true);
};

// Payment success handler
const handlePaymentSuccess = (data: any) => {
  setBookingData(data);
  setConfirmationNumber(data.confirmation_number || data.booking_id?.toString() || 'N/A');
  setShowPaymentModal(false);
  setShowConfirmationModal(true);
};

// Confirmation done handler
const handleConfirmationDone = () => {
  setShowConfirmationModal(false);
  // Reset selections
  setSelectedCourt(null);
  setSelectedTime('');
  setSelectedInstructor(null);
  setSelectedEvent(null);
  // Refresh availability
  fetchAvailability(selectedDate);
};

// Add modals to render
<Modal
  visible={showPaymentModal}
  animationType="slide"
  presentationStyle="pageSheet"
  onRequestClose={() => setShowPaymentModal(false)}
>
  <PaymentProcessingScreen
    bookingType={paymentType}
    userId={userId!}
    apiBaseUrl="https://your-api-url.com"

    // Court props
    club={paymentType === 'court' ? availability?.clubs[0] : undefined}
    court={selectedCourt || undefined}
    bookingDate={selectedDate}
    startTime={selectedTime}
    endTime={calculateEndTime(selectedTime, duration)}
    duration={duration}

    // Class props
    instructor={paymentType === 'class' ? selectedInstructor : undefined}
    clubName={paymentType === 'class' ? availability?.clubs[0]?.name : undefined}
    clubImage={paymentType === 'class' ? availability?.clubs[0]?.image_url : undefined}
    classType="individual"
    classDate={selectedDate.toISOString().split('T')[0]}
    numberOfStudents={1}

    // Event props
    event={paymentType === 'event' ? selectedEvent : undefined}
    eventClubName={paymentType === 'event' ? availability?.clubs[0]?.name : undefined}
    eventClubImage={paymentType === 'event' ? availability?.clubs[0]?.image_url : undefined}

    onPaymentSuccess={handlePaymentSuccess}
    onCancel={() => setShowPaymentModal(false)}
  />
</Modal>

<Modal
  visible={showConfirmationModal}
  animationType="slide"
  presentationStyle="pageSheet"
  onRequestClose={handleConfirmationDone}
>
  <PaymentConfirmationScreen
    type={paymentType}
    confirmationNumber={confirmationNumber}
    bookingData={bookingData}
    onDone={handleConfirmationDone}
  />
</Modal>
```

### Option 2: Navigation-Based Flow

```typescript
// Add to navigation stack in AppNavigator.tsx
<Stack.Screen
  name="PaymentProcessing"
  component={PaymentProcessingScreen}
  options={{ headerShown: false }}
/>
<Stack.Screen
  name="PaymentConfirmation"
  component={PaymentConfirmationScreen}
  options={{ headerShown: false }}
/>

// In ScheduleScreen.tsx
const handleTimeSlotSelect = (court: Court, time: string) => {
  navigation.navigate('PaymentProcessing', {
    bookingType: 'court',
    userId,
    club: availability.clubs[0],
    court,
    bookingDate: selectedDate,
    startTime: time,
    endTime: calculateEndTime(time, duration),
    duration,
  });
};
```

## Helper Functions

```typescript
// Calculate end time based on duration
const calculateEndTime = (
  startTime: string,
  durationMinutes: number
): string => {
  const [hours, minutes] = startTime.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;
  return `${endHours.toString().padStart(2, "0")}:${endMinutes
    .toString()
    .padStart(2, "0")}`;
};
```

## Environment Configuration

```typescript
// In your app config or environment file
export const API_BASE_URL = __DEV__
  ? "http://localhost:3000" // Development
  : "https://api.yourapp.com"; // Production
```

## Error Handling

The PaymentProcessingScreen handles various error scenarios:

- Network errors
- API errors
- Payment failures
- Invalid data

All errors are displayed to the user with retry options.

## Testing Checklist

- [ ] Court booking flow (selection → payment → confirmation)
- [ ] Private class booking flow
- [ ] Event registration flow
- [ ] Payment method selection
- [ ] Add new payment method
- [ ] Price calculation with different fee structures
- [ ] Subscription discounts (for events)
- [ ] Error handling
- [ ] Loading states
- [ ] Success confirmation
- [ ] Navigation flow

## Next Steps

1. **Add Payment Method Management**: Implement a screen to add/remove payment methods using Stripe SDK
2. **Add Calendar Integration**: Implement "Add to Calendar" functionality
3. **Add Receipt Download**: Allow users to download/email receipts
4. **Add Booking History**: Show past bookings with payment details
5. **Add Cancellation/Refund Flow**: Handle booking cancellations with refunds

## Notes

- All prices are in MXN (Mexican Pesos)
- IVA is 16% (Mexican tax)
- Fee structures: `user_pays_fee`, `shared_fee`, `club_absorbs_fee`
- Payment processing uses Stripe
- Confirmation numbers should be unique and generated by backend
