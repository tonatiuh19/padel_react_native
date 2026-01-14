// New API Base URL
export const DOMAIN = "https://intelipadel.com/api";
// For development: export const DOMAIN = "http://localhost:8080/api";

// ===== NEW DATABASE TYPES (matching effects.tsx) =====

export interface User {
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

export interface Club {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  address: string;
  city: string;
  state: string | null;
  postal_code: string | null;
  country: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  image_url: string | null;
  logo_url: string | null;
  amenities: string[] | null;
  rating: number;
  review_count: number;
  price_per_hour: number;
  default_booking_duration: number;
  currency: string;
  is_active: boolean;
  has_subscriptions: boolean;
  fee_structure: "user_pays_fee" | "shared_fee" | "club_absorbs_fee";
  service_fee_percentage: number;
}

export interface Court {
  id: number;
  club_id: number;
  name: string;
  court_type: "indoor" | "outdoor" | "covered";
  surface_type: "glass" | "concrete" | "artificial_grass";
  has_lighting: boolean;
  is_active: boolean;
  display_order: number;
}

export interface Booking {
  id: number;
  booking_number: string;
  user_id: number;
  club_id: number;
  court_id: number;
  booking_date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  total_price: number;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "no_show";
  payment_status: "pending" | "paid" | "refunded" | "failed";
  payment_method: string | null;
  stripe_payment_intent_id: string | null;
  created_at: string;
  updated_at: string;
  court?: Court;
}

export interface Event {
  id: number;
  club_id: number;
  event_type: "tournament" | "league" | "clinic" | "social" | "championship";
  title: string;
  description: string | null;
  event_date: string;
  start_time: string;
  end_time: string;
  max_participants: number | null;
  current_participants: number;
  registration_fee: number;
  prize_pool: number;
  skill_level: "all" | "beginner" | "intermediate" | "advanced" | "expert";
  status: "draft" | "open" | "full" | "in_progress" | "completed" | "cancelled";
  courts_used: number[] | null;
  image_url: string | null;
}

export interface EventParticipant {
  id: number;
  event_id: number;
  user_id: number;
  registration_date: string;
  payment_status: "pending" | "paid" | "refunded";
  status: "registered" | "confirmed" | "withdrawn" | "disqualified";
  event?: Event;
}

export interface Instructor {
  id: number;
  club_id: number;
  name: string;
  email: string | null;
  phone: string | null;
  bio: string | null;
  specialties: string[] | null;
  hourly_rate: number;
  avatar_url: string | null;
  rating: number;
  review_count: number;
  is_active: boolean;
  availability?: Array<{
    day_of_week: number;
    start_time: string;
    end_time: string;
  }>;
}

export interface PrivateClass {
  id: number;
  booking_number: string;
  user_id: number;
  instructor_id: number;
  club_id: number;
  court_id: number | null;
  class_type: "individual" | "group" | "semi_private";
  class_date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  number_of_students: number;
  total_price: number;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "rescheduled";
  payment_status: "pending" | "paid" | "refunded" | "failed";
  created_at: string;
  instructor?: Instructor;
  court?: Court;
}

export interface ClubSubscription {
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
  extras: Array<{ id: string; description: string }> | null;
  is_active: boolean;
  display_order: number;
}

export interface UserSubscription {
  id: number;
  user_id: number;
  club_id: number;
  plan_id: number;
  subscription_number: string;
  stripe_subscription_id: string | null;
  status: "active" | "trial" | "past_due" | "cancelled" | "expired";
  started_at: string;
  current_period_start: string;
  current_period_end: string;
  cancelled_at: string | null;
  subscription?: ClubSubscription;
}

export interface BlockedSlot {
  id: number;
  club_id: number;
  court_id: number | null;
  block_date: string;
  start_time: string | null;
  end_time: string | null;
  is_all_day: boolean;
  reason: string | null;
}

export interface ClubSchedule {
  id: number;
  club_id: number;
  day_of_week: number;
  opens_at: string;
  closes_at: string;
  is_closed: boolean;
}

export interface EventCourtSchedule {
  id: number;
  event_id: number;
  court_id: number;
  event_date: string;
  start_time: string;
  end_time: string;
}

export interface AvailabilityData {
  club: Club;
  courts: Court[];
  schedules: ClubSchedule[];
  bookings: Booking[];
  blockedSlots: BlockedSlot[];
  events: Event[];
  eventCourtSchedules: EventCourtSchedule[];
  privateClasses: PrivateClass[];
}

export interface PaymentMethod {
  id: number;
  user_id: number;
  payment_type: "card" | "paypal" | "bank_transfer" | "cash";
  is_default: boolean;
  card_brand: string | null;
  card_last4: string | null;
  stripe_payment_method_id: string | null;
  is_active: boolean;
}

export interface PriceCalculation {
  base_price: number;
  discount: number;
  service_fee: number;
  tax: number;
  total_price: number;
  currency: string;
  breakdown: {
    base: number;
    discount_percent: number;
    service_fee_percent: number;
    tax_percent: number;
  };
}

// ===== REDUX STATE INTERFACE =====

export interface AppState {
  // Club & Courts
  club: Club | null;
  courts: Court[];
  availability: AvailabilityData | null;

  // User
  user: User | null;
  userSession: {
    isAuthenticated: boolean;
    session_code: number | null;
  };
  userSubscription: UserSubscription | null;
  paymentMethods: PaymentMethod[];

  // Bookings
  bookings: Booking[];
  selectedBooking: Booking | null;
  lastBooking: Booking | null;

  // Events
  events: Event[];
  eventRegistrations: EventParticipant[];
  selectedEvent: Event | null;

  // Private Classes
  instructors: Instructor[];
  privateClasses: PrivateClass[];
  selectedInstructor: Instructor | null;
  lastPrivateClass: PrivateClass | null;

  // Subscriptions
  availableSubscriptions: ClubSubscription[];

  // UI State
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;

  // Pricing
  calculatedPrice: PriceCalculation | null;

  // Selected date/time for booking
  selectedDate: string | null;
  selectedTime: string | null;
  selectedCourt: Court | null;
  selectedDuration: number; // in minutes
}

// ===== LEGACY TYPES (for backward compatibility) =====

export interface ReservationCardProps {
  id_platforms_field: number;
  title: string;
  time: string;
  player: string;
  images: { uri: string }[];
  field: PlatformsField;
}

export interface ReservationCardAdsProps {
  id_platforms_ad: number;
  id_platform?: number;
  platforms_ad_title: string;
  platforms_ad_image: string;
  active?: number;
}

export interface PlatformField {
  title: string;
  today: string;
  start_time: string;
  end_time: string;
  platforms_fields: PlatformsField[];
}

export interface PlatformsField {
  id_platforms_field: number;
  title: string;
  today: string;
  carrouselImages: CarrouselImage[];
  last_reservation: Reservations | null;
}

export interface EPlatformField {
  id_platforms_field: number;
  title: string;
  today: string;
  markedDates: { [key: string]: MarkedDate };
  active_slots?: ESlot[];
  idle_slots?: ESlot[];
  slots: { [key: string]: Slot[] };
  classes: { [key: string]: Slot[] };
}

export interface MarkedDate {
  marked: boolean;
  dotColor: string;
  activeOpacity: number;
  id_platforms_disabled_date: number;
  start_date_time: Date;
  end_date_time: Date;
  active: number;
}

export interface ESlot {
  id_platforms_date_time_slot: number;
  id_platforms_field: number;
  platforms_date_time_start: Date;
  platforms_date_time_end: Date;
  active: number;
}

export interface CarrouselImage {
  name: string;
  path: string;
}

export interface Slot {
  active: number;
  height: number;
  name: string;
}

export interface Reservations {
  reservations: Reservation[];
  eventReservations: EventReservation[];
}

export interface EventReservation {
  id_platforms_fields_events_users: number;
  id_platforms_user: number;
  id_platforms_disabled_date: number;
  stripe_id: string;
  active: number;
  validated: number;
  platforms_fields_events_users_inserted: string;
  start_date_time: string;
  end_date_time: string;
  id_platforms_field: number;
}

export interface Reservation {
  id_platforms_date_time_slot: number;
  id_platforms_field: number;
  id_platforms_user: number;
  platforms_date_time_start: string;
  platforms_date_time_end: string;
  active: number;
  stripe_id: string;
  validated: number;
  title?: string;
  event_title?: string;
}

export interface ScheduleState {
  isDayEmpty: boolean;
  markedActiveDay: number;
}

export interface PaymentState {
  id_platforms_date_time_slot?: number;
  id_platforms_field: number;
  platforms_date_time_start: string;
  platforms_date_time_end?: string;
  active: number;
  stripe_id?: string;
}

export interface DisabledSlotsState {
  disabledSlots: string[];
  today: string;
  fullToday: string;
}

export interface UserState {
  isSignedIn: boolean;
  isUserExist: boolean;
  isCodeSent: boolean;
  isIncorrectCode: boolean;
  isUserValidated: boolean;
  info: UserInfo;
}

export interface UserInfo {
  id_platforms_user: number;
  full_name: string;
  age: number;
  date_of_birth: string;
  email: string;
  phone_number: string;
  phone_number_code: string;
  stripe_id: string;
  active: number;
  type: number;
  date_created: string;
  id_platforms: number;
  publishable_key: string;
  card_info: CardInfoModel | null;
  subscription: SubscriptionModel | null;
}

export interface PriceModel {
  id_platforms_fields_price: number;
  id_platforms: number;
  price: number;
  active: number;
}

export interface PriceEventModel {
  id_platforms_fields_price: number;
  id_platforms: number;
  id_platforms_field: number;
  id_platforms_disabled_date: number;
  price: number;
  platforms_fields_price_start_time: string;
  platforms_fields_price_end_time: string;
  slots: number;
  available_slots: number;
}

export interface PaymentEventState {
  id_platforms_fields_events_users: number;
  id_platforms_user: number;
  id_platforms_disabled_date: number;
  active: number;
  platforms_fields_events_users_inserted: string;
}

export interface ClassesModel {
  id_platforms_disabled_date: number;
  start_date_time: string;
  end_date_time: string;
  active: number;
  title: string;
  id_platforms_field: number;
  event_title: string;
  type: number;
  price: string;
}

export interface PaymentClassModel {
  id_platforms_fields_classes_users: number;
  id_platforms_user: number;
  id_platforms_disabled_date: number;
  platforms_date_time_start: string;
  platforms_date_time_end: string;
  price: number;
  active: number;
  validated: number;
  platforms_fields_classes_users_inserted: string;
}

export interface ClassesReservationModel {
  id_platforms_fields_classes_users: number;
  id_platforms_user: number;
  id_platforms_disabled_date: number;
  platforms_date_time_start: string;
  platforms_date_time_end: string;
  price: number;
  stripe_id: string;
  validated: number;
  id_platforms_field: number;
  cancha: string;
  event_title: string;
}

export interface SectionsModel {
  id_platforms_sections: number;
  section: string;
  active: number;
}

export interface CardInfoModel {
  default_payment_method: string;
  last4: string;
  brand: string;
}

export interface SubscriptionModel {
  id: number;
  id_platforms_user: number;
  created: Date;
  active: number;
  stripe_id: string;
}
