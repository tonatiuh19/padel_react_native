# InteliPadel API Documentation

**Base URL:** `https://intelipadel.com/api` or `http://localhost:8080/api` (development)

**Last Updated:** January 8, 2026

---

## Table of Contents

1. [Authentication](#authentication)
2. [TypeScript Interfaces](#typescript-interfaces)
3. [API Endpoints](#api-endpoints)
   - [Health & Ping](#health--ping)
   - [Clubs](#clubs)
   - [User Authentication](#user-authentication)
   - [Admin Authentication](#admin-authentication)
   - [Bookings](#bookings)
   - [Courts](#courts)
   - [Availability](#availability)
   - [Payments](#payments)
   - [Events](#events)
   - [Private Classes](#private-classes)
   - [Instructors](#instructors)
   - [Subscriptions](#subscriptions)
   - [Users](#users)
   - [Admin Management](#admin-management)
4. [Error Handling](#error-handling)
5. [Webhooks](#webhooks)

---

## Authentication

### User Authentication

- **Session-based**: Uses email + verification code system
- **Session tracking**: `users_sessions` table with `session_code`
- **Header**: Include user session info in requests where needed

### Admin Authentication

- **Session Token**: Token-based authentication
- **Header**: `Authorization: Bearer {session_token}`
- **Middleware**: `verifyAdminSession` protects admin routes

---

## TypeScript Interfaces

### Core Database Types

```typescript
// User
interface User {
  id: number;
  club_id: number | null;
  email: string;
  name: string;
  phone: string | null;
  avatar_url: string | null;
  stripe_customer_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
}

// Admin
interface Admin {
  id: number;
  email: string;
  name: string;
  phone: string | null;
  role: "super_admin" | "club_admin";
  club_id: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
}

// Admin Session
interface AdminSession {
  id: number;
  admin_id: number;
  session_token: string;
  expires_at: string;
  created_at: string;
  last_activity_at: string;
  ip_address: string | null;
  user_agent: string | null;
}

// Club
interface Club {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  address: string;
  city: string;
  state: string | null;
  postal_code: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  image_url: string | null;
  logo_url: string | null;
  gallery: string[] | null; // JSON
  amenities: string[] | null; // JSON
  rating: number;
  review_count: number;
  price_per_hour: number;
  default_booking_duration: number; // 60, 90, or 120 minutes
  currency: string;
  is_active: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
  has_subscriptions: boolean;
  fee_structure: "user_pays_fee" | "shared_fee" | "club_absorbs_fee";
  service_fee_percentage: number;
  fee_terms_accepted_at: string | null;
}

// Court
interface Court {
  id: number;
  club_id: number;
  name: string;
  court_type: "indoor" | "outdoor" | "covered";
  surface_type: "glass" | "concrete" | "artificial_grass";
  has_lighting: boolean;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Time Slot
interface TimeSlot {
  id: number;
  court_id: number;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:MM:SS
  end_time: string; // HH:MM:SS
  duration_minutes: number;
  price: number;
  is_available: boolean;
  availability_status: "available" | "booked" | "blocked" | "maintenance";
  created_at: string;
  updated_at: string;
}

// Booking
interface Booking {
  id: number;
  booking_number: string;
  user_id: number;
  club_id: number;
  court_id: number;
  time_slot_id: number;
  booking_date: string; // YYYY-MM-DD
  start_time: string; // HH:MM:SS
  end_time: string; // HH:MM:SS
  duration_minutes: number;
  total_price: number;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "no_show";
  payment_status: "pending" | "paid" | "refunded" | "failed";
  payment_method: string | null;
  stripe_payment_intent_id: string | null;
  booking_type: "single" | "recurring";
  is_recurring: boolean;
  notes: string | null;
  factura_requested: boolean;
  factura_requested_at: string | null;
  factura_sent_at: string | null;
  cancellation_reason: string | null;
  cancelled_at: string | null;
  confirmed_at: string | null;
  created_at: string;
  updated_at: string;
  created_by_admin_id: number | null;
}

// Event
interface Event {
  id: number;
  club_id: number;
  event_type: "tournament" | "league" | "clinic" | "social" | "championship";
  title: string;
  description: string | null;
  event_date: string; // YYYY-MM-DD
  start_time: string; // HH:MM:SS
  end_time: string; // HH:MM:SS
  max_participants: number | null;
  current_participants: number;
  registration_fee: number;
  prize_pool: number;
  skill_level: "all" | "beginner" | "intermediate" | "advanced" | "expert";
  status: "draft" | "open" | "full" | "in_progress" | "completed" | "cancelled";
  courts_used: number[] | null; // JSON array of court IDs
  image_url: string | null;
  rules: string | null;
  organizer_name: string | null;
  organizer_email: string | null;
  created_at: string;
  updated_at: string;
}

// Event Court Schedule
interface EventCourtSchedule {
  id: number;
  event_id: number;
  court_id: number;
  start_time: string; // HH:MM:SS
  end_time: string; // HH:MM:SS
  notes: string | null;
  created_at: string;
}

// Event Participant
interface EventParticipant {
  id: number;
  event_id: number;
  user_id: number;
  registration_date: string;
  payment_status: "pending" | "paid" | "refunded";
  team_name: string | null;
  partner_user_id: number | null;
  status: "registered" | "confirmed" | "withdrawn" | "disqualified";
  notes: string | null;
}

// Instructor
interface Instructor {
  id: number;
  club_id: number;
  name: string;
  email: string | null;
  phone: string | null;
  bio: string | null;
  specialties: string[] | null; // JSON
  hourly_rate: number;
  avatar_url: string | null;
  rating: number;
  review_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Instructor Availability
interface InstructorAvailability {
  id: number;
  instructor_id: number;
  day_of_week: number; // 0 = Sunday, 6 = Saturday
  start_time: string; // HH:MM:SS
  end_time: string; // HH:MM:SS
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Private Class
interface PrivateClass {
  id: number;
  booking_number: string;
  user_id: number;
  instructor_id: number;
  club_id: number;
  court_id: number | null;
  class_type: "individual" | "group" | "semi_private";
  class_date: string; // YYYY-MM-DD
  start_time: string; // HH:MM:SS
  end_time: string; // HH:MM:SS
  duration_minutes: number;
  number_of_students: number;
  total_price: number;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "rescheduled";
  payment_status: "pending" | "paid" | "refunded" | "failed";
  focus_areas: string[] | null; // JSON
  student_level: "beginner" | "intermediate" | "advanced" | "expert" | null;
  notes: string | null;
  instructor_notes: string | null;
  cancellation_reason: string | null;
  cancelled_at: string | null;
  confirmed_at: string | null;
  created_at: string;
  updated_at: string;
  created_by_admin_id: number | null;
}

// Club Subscription (Membership Plan)
interface ClubSubscription {
  id: number;
  club_id: number;
  name: string;
  description: string | null;
  price_monthly: number;
  currency: string;
  stripe_product_id: string | null;
  stripe_price_id: string | null;
  booking_discount_percent: number | null;
  booking_credits_monthly: number | null;
  bar_discount_percent: number | null;
  merch_discount_percent: number | null;
  event_discount_percent: number | null;
  class_discount_percent: number | null;
  extras: Array<{ id: string; description: string }> | null; // JSON
  is_active: boolean;
  display_order: number;
  max_subscribers: number | null;
  current_subscribers: number;
  created_at: string;
  updated_at: string;
}

// User Subscription
interface UserSubscription {
  id: number;
  user_id: number;
  club_id: number;
  plan_id: number; // References club_subscriptions.id
  subscription_number: string;
  stripe_subscription_id: string | null;
  status: "active" | "trial" | "past_due" | "cancelled" | "expired";
  started_at: string;
  trial_ends_at: string | null;
  current_period_start: string;
  current_period_end: string;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  cancel_at_period_end: boolean;
  bookings_used_this_month: number;
  guest_passes_used_this_month: number;
  auto_renew: boolean;
  payment_method_id: number | null;
  created_at: string;
  updated_at: string;
}

// Payment Transaction
interface PaymentTransaction {
  id: number;
  transaction_number: string;
  user_id: number;
  club_id: number | null;
  transaction_type:
    | "booking"
    | "subscription"
    | "event"
    | "private_class"
    | "refund";
  booking_id: number | null;
  subscription_id: number | null;
  event_participant_id: number | null;
  private_class_id: number | null;
  amount: number;
  currency: string;
  status:
    | "pending"
    | "processing"
    | "completed"
    | "failed"
    | "refunded"
    | "partially_refunded";
  payment_method_id: number | null;
  payment_provider: string;
  stripe_payment_intent_id: string | null;
  stripe_charge_id: string | null;
  stripe_invoice_id: string | null;
  stripe_refund_id: string | null;
  provider_transaction_id: string | null;
  provider_response: any | null; // JSON
  refund_amount: number;
  refund_reason: string | null;
  refunded_at: string | null;
  paid_at: string | null;
  failed_at: string | null;
  failure_reason: string | null;
  failure_code: string | null;
  metadata: any | null; // JSON
  created_at: string;
  updated_at: string;
}

// Payment Method
interface PaymentMethod {
  id: number;
  user_id: number;
  payment_type: "card" | "paypal" | "bank_transfer" | "cash";
  is_default: boolean;
  card_brand: string | null;
  card_last4: string | null;
  card_exp_month: number | null;
  card_exp_year: number | null;
  paypal_email: string | null;
  bank_name: string | null;
  bank_account_last4: string | null;
  stripe_payment_method_id: string | null;
  paypal_billing_agreement_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Price Rule
interface PriceRule {
  id: number;
  club_id: number;
  court_id: number | null;
  rule_name: string;
  rule_type: "time_of_day" | "day_of_week" | "seasonal" | "special_date";
  start_time: string | null; // HH:MM:SS
  end_time: string | null; // HH:MM:SS
  days_of_week: number[] | null; // JSON
  start_date: string | null; // YYYY-MM-DD
  end_date: string | null; // YYYY-MM-DD
  price_per_hour: number;
  priority: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Blocked Slot
interface BlockedSlot {
  id: number;
  club_id: number;
  court_id: number | null;
  block_type: "maintenance" | "holiday" | "event" | "private_event" | "other";
  block_date: string; // YYYY-MM-DD
  start_time: string | null; // HH:MM:SS
  end_time: string | null; // HH:MM:SS
  is_all_day: boolean;
  reason: string | null;
  notes: string | null;
  created_by_admin_id: number | null;
  created_at: string;
  updated_at: string;
}

// Club Schedule
interface ClubSchedule {
  id: number;
  club_id: number;
  day_of_week: number; // 0 = Sunday, 6 = Saturday
  opens_at: string; // HH:MM:SS
  closes_at: string; // HH:MM:SS
  is_closed: boolean;
}

// Club Policy (Terms, Privacy, Cancellation)
interface ClubPolicy {
  id: number;
  club_id: number;
  version: string;
  content: string; // HTML or markdown
  effective_date: string; // YYYY-MM-DD
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Specifically for club_cancellation_policy
interface ClubCancellationPolicy extends ClubPolicy {
  hours_before_cancellation: number;
  refund_percentage: number;
}
```

---

## API Endpoints

### Health & Ping

#### `GET /api/health`

Health check endpoint.

**Response:**

```json
{
  "status": "ok"
}
```

#### `GET /api/ping`

Simple ping endpoint.

**Response:**

```json
{
  "message": "pong"
}
```

---

### Clubs

#### `GET /api/clubs`

Get all clubs.

**Query Parameters:**

- `city` (optional): Filter by city
- `featured` (optional): Filter featured clubs

**Response:**

```json
{
  "clubs": [Club]
}
```

#### `GET /api/clubs/:id`

Get club by ID.

**Response:**

```json
{
  "club": Club
}
```

#### `GET /api/clubs/:clubId/policies/:policyType`

Get club policy (terms, privacy, cancellation).

**Path Parameters:**

- `clubId`: Club ID
- `policyType`: `terms` | `privacy` | `cancellation`

**Response:**

```json
{
  "policy": ClubPolicy
}
```

#### `POST /api/clubs/onboard`

Onboard a new club (admin functionality).

**Request Body:**

```json
{
  "name": "Club Name",
  "slug": "club-slug",
  "address": "Street Address",
  "city": "City",
  "country": "Country",
  "phone": "+1234567890",
  "email": "club@example.com",
  "price_per_hour": 50.0,
  "currency": "USD"
}
```

**Response:**

```json
{
  "success": true,
  "club": Club
}
```

---

### User Authentication

#### `POST /api/auth/check-user`

Check if user exists.

**Request Body:**

```json
{
  "email": "user@example.com",
  "club_id": 1
}
```

**Response:**

```json
{
  "exists": true,
  "user": User
}
```

#### `POST /api/auth/create-user`

Create a new user.

**Request Body:**

```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "phone": "+1234567890",
  "club_id": 1
}
```

**Response:**

```json
{
  "success": true,
  "user": User
}
```

#### `POST /api/auth/send-code`

Send verification code via email.

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Verification code sent"
}
```

#### `POST /api/auth/verify-code`

Verify the email code.

**Request Body:**

```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**Response:**

```json
{
  "success": true,
  "user": User,
  "session": {
    "session_code": 123456
  }
}
```

---

### Admin Authentication

#### `POST /api/admin/auth/send-code`

Send admin verification code.

**Request Body:**

```json
{
  "email": "admin@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Verification code sent"
}
```

#### `POST /api/admin/auth/verify-code`

Verify admin code and get session token.

**Request Body:**

```json
{
  "email": "admin@example.com",
  "code": "123456"
}
```

**Response:**

```json
{
  "success": true,
  "admin": Admin,
  "session_token": "abc123...",
  "expires_at": "2026-01-15T00:00:00.000Z"
}
```

#### `GET /api/admin/auth/validate`

Validate admin session.

**Headers:**

- `Authorization: Bearer {session_token}`

**Response:**

```json
{
  "valid": true,
  "admin": Admin
}
```

#### `POST /api/admin/auth/logout`

Logout admin.

**Headers:**

- `Authorization: Bearer {session_token}`

**Response:**

```json
{
  "success": true
}
```

---

### Bookings

#### `GET /api/bookings`

Get user bookings.

**Query Parameters:**

- `user_id`: User ID (required)
- `club_id`: Club ID (optional)
- `status`: Filter by status (optional)

**Response:**

```json
{
  "bookings": [Booking]
}
```

#### `POST /api/bookings`

Create a new booking.

**Request Body:**

```json
{
  "user_id": 1,
  "club_id": 1,
  "court_id": 1,
  "booking_date": "2026-01-15",
  "start_time": "18:30",
  "duration_minutes": 90,
  "payment_intent_id": "pi_abc123"
}
```

**Response:**

```json
{
  "success": true,
  "booking": Booking
}
```

#### `POST /api/bookings/:id/cancel`

Cancel a booking.

**Request Body:**

```json
{
  "cancellation_reason": "Cannot make it"
}
```

**Response:**

```json
{
  "success": true,
  "refund_amount": 50.0
}
```

#### `POST /api/bookings/:id/request-invoice`

Request an invoice for a booking.

**Response:**

```json
{
  "success": true,
  "message": "Invoice requested"
}
```

---

### Courts

#### `GET /api/courts/:clubId`

Get all courts for a club.

**Response:**

```json
{
  "courts": [Court]
}
```

---

### Availability

#### `GET /api/availability`

Check availability for bookings.

**Query Parameters:**

- `club_id`: Club ID (required)
- `court_id`: Court ID (optional, if not provided returns all courts)
- `date`: Date in YYYY-MM-DD format (required)
- `duration_minutes`: Duration (default: 90)

**Response:**

```json
{
  "availability": [
    {
      "court_id": 1,
      "court_name": "Court 1",
      "date": "2026-01-15",
      "slots": [
        {
          "start_time": "18:30",
          "end_time": "20:00",
          "is_available": true,
          "price": 50.0
        }
      ]
    }
  ]
}
```

---

### Payments

#### `POST /api/payment/create-intent`

Create a Stripe payment intent for booking.

**Request Body:**

```json
{
  "user_id": 1,
  "club_id": 1,
  "court_id": 1,
  "booking_date": "2026-01-15",
  "start_time": "18:30",
  "duration_minutes": 90
}
```

**Response:**

```json
{
  "clientSecret": "pi_abc123_secret_xyz",
  "amount": 5000,
  "currency": "usd",
  "payment_intent_id": "pi_abc123"
}
```

#### `POST /api/payment/confirm`

Confirm payment after Stripe confirmation.

**Request Body:**

```json
{
  "payment_intent_id": "pi_abc123"
}
```

**Response:**

```json
{
  "success": true,
  "booking": Booking
}
```

#### `POST /api/calculate-price`

Calculate price for a booking.

**Request Body:**

```json
{
  "club_id": 1,
  "court_id": 1,
  "date": "2026-01-15",
  "start_time": "18:30",
  "duration_minutes": 90,
  "user_id": 1
}
```

**Response:**

```json
{
  "base_price": 50.0,
  "discount": 5.0,
  "service_fee": 4.0,
  "tax": 4.5,
  "total_price": 53.5,
  "currency": "USD",
  "breakdown": {
    "base": 50.0,
    "discount_percent": 10,
    "service_fee_percent": 8,
    "tax_percent": 10
  }
}
```

---

### Events

#### `GET /api/events`

Get public events.

**Query Parameters:**

- `club_id`: Filter by club (optional)
- `status`: Filter by status (optional)
- `event_type`: Filter by type (optional)

**Response:**

```json
{
  "events": [Event]
}
```

#### `POST /api/events/payment/create-intent`

Create payment intent for event registration.

**Request Body:**

```json
{
  "user_id": 1,
  "event_id": 1
}
```

**Response:**

```json
{
  "clientSecret": "pi_abc123_secret_xyz",
  "amount": 5000,
  "payment_intent_id": "pi_abc123"
}
```

#### `POST /api/events/payment/confirm`

Confirm event registration payment.

**Request Body:**

```json
{
  "payment_intent_id": "pi_abc123",
  "user_id": 1,
  "event_id": 1
}
```

**Response:**

```json
{
  "success": true,
  "participant": EventParticipant
}
```

#### `GET /api/admin/events/:eventId/participants`

Get event participants (admin).

**Headers:**

- `Authorization: Bearer {session_token}`

**Response:**

```json
{
  "participants": [EventParticipant & { user: User }]
}
```

---

### Private Classes

#### `POST /api/private-classes/payment/create-intent`

Create payment intent for private class.

**Request Body:**

```json
{
  "user_id": 1,
  "instructor_id": 1,
  "club_id": 1,
  "court_id": 1,
  "class_date": "2026-01-15",
  "start_time": "18:30",
  "duration_minutes": 90,
  "class_type": "individual",
  "number_of_students": 1
}
```

**Response:**

```json
{
  "clientSecret": "pi_abc123_secret_xyz",
  "amount": 6000,
  "payment_intent_id": "pi_abc123"
}
```

#### `POST /api/private-classes/payment/confirm`

Confirm private class payment.

**Request Body:**

```json
{
  "payment_intent_id": "pi_abc123"
}
```

**Response:**

```json
{
  "success": true,
  "privateClass": PrivateClass
}
```

#### `GET /api/users/:userId/private-classes`

Get user's private classes.

**Response:**

```json
{
  "classes": [PrivateClass]
}
```

---

### Instructors

#### `GET /api/instructors/:clubId`

Get instructors for a club.

**Response:**

```json
{
  "instructors": [Instructor]
}
```

---

### Subscriptions

#### `GET /api/subscriptions`

Get all subscriptions (plans).

**Query Parameters:**

- `club_id`: Filter by club (optional)

**Response:**

```json
{
  "subscriptions": [ClubSubscription]
}
```

#### `GET /api/subscriptions/active/:club_id`

Get active subscriptions for a club.

**Response:**

```json
{
  "subscriptions": [ClubSubscription]
}
```

#### `GET /api/subscriptions/:id`

Get subscription by ID.

**Response:**

```json
{
  "subscription": ClubSubscription
}
```

#### `POST /api/subscriptions/subscribe`

Subscribe user to a plan.

**Request Body:**

```json
{
  "user_id": 1,
  "club_id": 1,
  "plan_id": 1,
  "payment_method_id": "pm_abc123"
}
```

**Response:**

```json
{
  "success": true,
  "subscription": UserSubscription,
  "stripe_subscription": {...}
}
```

#### `POST /api/subscriptions/cancel`

Cancel user subscription.

**Request Body:**

```json
{
  "user_id": 1,
  "subscription_id": 1,
  "cancellation_reason": "Too expensive"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Subscription cancelled"
}
```

#### `GET /api/users/:userId/subscription`

Get user's active subscription.

**Response:**

```json
{
  "subscription": UserSubscription & { plan: ClubSubscription }
}
```

#### `POST /api/subscriptions/webhook`

Stripe webhook for subscription events.

**Note:** This endpoint receives raw Stripe webhook data.

---

### Users

#### `PUT /api/users/:id`

Update user profile.

**Request Body:**

```json
{
  "name": "John Doe",
  "phone": "+1234567890"
}
```

**Response:**

```json
{
  "success": true,
  "user": User
}
```

#### `GET /api/users/:userId/event-registrations`

Get user's event registrations.

**Response:**

```json
{
  "registrations": [EventParticipant & { event: Event }]
}
```

#### `GET /api/users/:userId/payment-methods`

Get user's payment methods.

**Response:**

```json
{
  "payment_methods": [PaymentMethod]
}
```

#### `DELETE /api/payment-methods/:paymentMethodId`

Delete a payment method.

**Response:**

```json
{
  "success": true
}
```

---

### Admin Management

**Note:** All admin routes require `Authorization: Bearer {session_token}` header.

#### Dashboard & Stats

##### `GET /api/admin/dashboard/stats`

Get dashboard statistics.

**Response:**

```json
{
  "total_bookings": 150,
  "total_revenue": 15000.00,
  "active_users": 45,
  "upcoming_events": 3,
  "recent_bookings": [Booking],
  "revenue_by_day": [...]
}
```

#### Bookings Management

##### `GET /api/admin/bookings`

Get all bookings for admin's club.

**Query Parameters:**

- `status`: Filter by status
- `date_from`: Start date
- `date_to`: End date

**Response:**

```json
{
  "bookings": [Booking & { user: User, court: Court }]
}
```

##### `POST /api/admin/bookings/manual`

Create manual booking (admin-created).

**Request Body:**

```json
{
  "user_id": 1,
  "court_id": 1,
  "booking_date": "2026-01-15",
  "start_time": "18:30",
  "duration_minutes": 90,
  "notes": "VIP customer"
}
```

**Response:**

```json
{
  "success": true,
  "booking": Booking
}
```

#### Court Management

##### `GET /api/admin/courts`

Get all courts.

**Response:**

```json
{
  "courts": [Court]
}
```

##### `POST /api/admin/courts`

Create a new court.

**Request Body:**

```json
{
  "name": "Court 5",
  "court_type": "indoor",
  "surface_type": "glass",
  "has_lighting": true
}
```

**Response:**

```json
{
  "success": true,
  "court": Court
}
```

##### `PUT /api/admin/courts/:id`

Update a court.

**Request Body:**

```json
{
  "name": "Court 5 - Premium",
  "is_active": true
}
```

**Response:**

```json
{
  "success": true,
  "court": Court
}
```

#### Blocked Slots Management

##### `GET /api/admin/blocked-slots`

Get blocked slots.

**Query Parameters:**

- `date_from`: Start date
- `date_to`: End date

**Response:**

```json
{
  "blocked_slots": [BlockedSlot]
}
```

##### `POST /api/admin/blocked-slots`

Create blocked slot.

**Request Body:**

```json
{
  "court_id": 1,
  "block_type": "maintenance",
  "block_date": "2026-01-20",
  "start_time": "09:00",
  "end_time": "13:00",
  "reason": "Court resurfacing"
}
```

**Response:**

```json
{
  "success": true,
  "blocked_slot": BlockedSlot
}
```

##### `DELETE /api/admin/blocked-slots/:id`

Delete blocked slot.

**Response:**

```json
{
  "success": true
}
```

#### Instructor Management

##### `GET /api/admin/instructors`

Get all instructors.

**Response:**

```json
{
  "instructors": [Instructor]
}
```

##### `POST /api/admin/instructors`

Create instructor.

**Request Body:**

```json
{
  "name": "Carlos Rodriguez",
  "email": "carlos@club.com",
  "phone": "+1234567890",
  "hourly_rate": 60.0,
  "specialties": ["advanced", "tactics"]
}
```

**Response:**

```json
{
  "success": true,
  "instructor": Instructor
}
```

##### `PUT /api/admin/instructors/:id`

Update instructor.

##### `DELETE /api/admin/instructors/:id`

Delete instructor.

##### `GET /api/admin/instructors/:id/availability`

Get instructor availability.

##### `POST /api/admin/instructors/:id/availability`

Add instructor availability.

**Request Body:**

```json
{
  "day_of_week": 1,
  "start_time": "09:00",
  "end_time": "17:00"
}
```

##### `DELETE /api/admin/instructors/availability/:availabilityId`

Delete instructor availability.

#### Private Classes Management

##### `GET /api/admin/private-classes`

Get all private classes.

##### `POST /api/admin/private-classes/manual`

Create manual private class.

#### Players Management

##### `GET /api/admin/players`

Get all players (users).

**Response:**

```json
{
  "players": [User]
}
```

##### `POST /api/admin/players`

Create a new player/user.

#### Admin Management

##### `GET /api/admin/admins`

Get all admins.

##### `POST /api/admin/admins`

Create new admin.

##### `PUT /api/admin/admins/:id`

Update admin.

#### Subscription Management

##### `POST /api/admin/subscriptions`

Create subscription plan.

##### `PUT /api/admin/subscriptions/:id`

Update subscription plan.

##### `DELETE /api/admin/subscriptions/:id`

Delete subscription plan.

##### `GET /api/admin/subscriptions/:subscriptionId/subscribers`

Get subscribers of a plan.

##### `POST /api/admin/subscriptions/:userSubscriptionId/cancel`

Cancel user's subscription (admin action).

##### `POST /api/admin/subscriptions/:userSubscriptionId/upgrade`

Upgrade user's subscription.

#### Event Management

##### `GET /api/admin/events`

Get all events.

##### `POST /api/admin/events`

Create event.

**Request Body:**

```json
{
  "event_type": "tournament",
  "title": "Summer Championship",
  "description": "...",
  "event_date": "2026-07-15",
  "start_time": "09:00",
  "end_time": "18:00",
  "max_participants": 32,
  "registration_fee": 50.0,
  "courts_used": [1, 2, 3]
}
```

##### `PUT /api/admin/events/:id`

Update event.

##### `DELETE /api/admin/events/:id`

Delete event.

##### `POST /api/admin/events/:eventId/participants`

Add participant to event.

#### Price Rules Management

##### `GET /api/admin/price-rules`

Get price rules.

##### `POST /api/admin/price-rules`

Create price rule.

##### `PUT /api/admin/price-rules/:id`

Update price rule.

##### `DELETE /api/admin/price-rules/:id`

Delete price rule.

#### Settings Management

##### `GET /api/admin/schedules`

Get club schedules.

##### `PUT /api/admin/schedules/:id`

Update schedule.

##### `PUT /api/admin/club-settings`

Update club settings.

##### `GET /api/admin/club-colors`

Get club colors.

##### `PUT /api/admin/club-colors`

Update club colors.

##### `GET /api/admin/fee-structure`

Get fee structure settings.

##### `PUT /api/admin/fee-structure`

Update fee structure.

##### `PUT /api/admin/clubs/:id/policies/:policyType`

Update club policy (terms, privacy, cancellation).

#### Payment Management

##### `GET /api/admin/payments`

Get all payments/transactions.

##### `GET /api/admin/payments/stats`

Get payment statistics.

##### `POST /api/admin/payments/:paymentId/refund`

Refund a payment.

##### `POST /api/admin/payments/sync-stripe`

Sync with Stripe.

##### `POST /api/admin/payments/sync-pending`

Sync pending payments.

---

## Error Handling

All API endpoints return errors in the following format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {...}
}
```

### Common HTTP Status Codes:

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `500`: Internal Server Error

### Common Error Codes:

- `INVALID_INPUT`: Invalid request data
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `ALREADY_EXISTS`: Resource already exists
- `PAYMENT_FAILED`: Payment processing failed
- `BOOKING_UNAVAILABLE`: Time slot not available
- `SUBSCRIPTION_ERROR`: Subscription operation failed

---

## Webhooks

### Stripe Webhook

**Endpoint:** `POST /api/subscriptions/webhook`

This endpoint handles Stripe webhook events for subscription management. Events include:

- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`

**Authentication:** Stripe signature verification

---

## Notes for React Native Integration

### Authentication Flow

1. Call `POST /api/auth/check-user` to check if user exists
2. If not, call `POST /api/auth/create-user`
3. Call `POST /api/auth/send-code` to send verification code
4. Call `POST /api/auth/verify-code` to verify and get session
5. Store session info in secure storage (e.g., AsyncStorage or SecureStore)

### Admin Authentication Flow

1. Call `POST /api/admin/auth/send-code`
2. Call `POST /api/admin/auth/verify-code` to get session token
3. Store token securely
4. Include token in `Authorization` header for all admin requests
5. Call `GET /api/admin/auth/validate` to check token validity

### Stripe Integration

- Use Stripe React Native SDK for payment collection
- Create payment intent on backend
- Collect payment details in app
- Confirm payment and create booking/subscription

### Recommended Libraries

- **HTTP Client**: axios or fetch
- **State Management**: Redux Toolkit or Zustand
- **Stripe**: @stripe/stripe-react-native
- **Secure Storage**: expo-secure-store or react-native-keychain

---

**End of Documentation**
