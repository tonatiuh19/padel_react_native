import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  ClubSubscription,
  UserSubscriptionData,
  PaymentMethod,
  CancelSubscriptionPayload,
  SubscribePayload,
} from "../types/subscription";
import {
  setLoading,
  setError,
  fetchPlatformFieldsStart,
  fetchPlatformFieldsSuccess,
  fetchPlatformFieldsFailure,
  fetchPlatformsFieldsStart,
  fetchPlatformsFieldsSuccess,
  fetchPlatformsFieldsFailure,
  insertPlatformDateTimeSlotStart,
  insertPlatformDateTimeSlotSuccess,
  insertPlatformDateTimeSlotFailure,
  deletePlatformDateTimeSlotStart,
  deletePlatformDateTimeSlotSuccess,
  deletePlatformDateTimeSlotFailure,
  fetchgetDisabledSlotsStart,
  fetchgetDisabledSlotsSuccess,
  fetchgetDisabledSlotsFailure,
  validateUserSessionStart,
  validateUserSessionSuccess,
  validateUserSessionFailure,
  validateUserByPhoneNumberStart,
  validateUserByPhoneNumberSuccess,
  validateUserByPhoneNumberFailure,
  insertPlatformUserStart,
  insertPlatformUserSuccess,
  insertPlatformUserFailure,
  sendCodeStart,
  sendCodeSuccess,
  sendCodeFailure,
  validateSessionCodeStart,
  validateSessionCodeSuccess,
  validateSessionCodeFailure,
  validateUserByEmailStart,
  validateUserByEmailSuccess,
  validateUserByEmailFailure,
  sendCodeByMailStart,
  sendCodeByMailSuccess,
  sendCodeByMailFailure,
  logoutStart,
  logoutSuccess,
  logoutFailure,
  getUserInfoByIdStart,
  getUserInfoByIdSuccess,
  getUserInfoByIdFailure,
  updatePlatformDateTimeSlotStart,
  updatePlatformDateTimeSlotSuccess,
  updatePlatformDateTimeSlotFailure,
  getReservationsByUserIdStart,
  getReservationsByUserIdSuccess,
  getReservationsByUserIdFailure,
  getAdsByIdStart,
  getAdsByIdSuccess,
  getAdsByIdFailure,
  getPriceByIdAndTimeStart,
  getPriceByIdAndTimeSuccess,
  getPriceByIdAndTimeFailure,
  getEventPricebyDateAndIdPlatformStart,
  getEventPricebyDateAndIdPlatformSuccess,
  getEventPricebyDateAndIdPlatformFailure,
  insertEventUserStart,
  insertEventUserSuccess,
  insertEventUserFailure,
  deleteEventUserByIdStart,
  deleteEventUserByIdSuccess,
  deleteEventUserByIdFailure,
  updateEventUserByIdStart,
  updateEventUserByIdSuccess,
  updateEventUserByIdFailure,
  getClassesByIdPlatformStart,
  getClassesByIdPlatformSuccess,
  getClassesByIdPlatformFailure,
  getClassesByIdFieldStart,
  getClassesByIdFieldSuccess,
  getClassesByIdFieldFailure,
  insertPlatformFieldClassUsersStart,
  insertPlatformFieldClassUsersSuccess,
  insertPlatformFieldClassUsersFailure,
  deletePlatformFieldClassUsersStart,
  deletePlatformFieldClassUsersSuccess,
  deletePlatformFieldClassUsersFailure,
  updatePlatformFieldClassUserByIdStart,
  updatePlatformFieldClassUserByIdSuccess,
  updatePlatformFieldClassUserByIdFailure,
  getClassesByUserIdStart,
  getClassesByUserIdSuccess,
  getClassesByUserIdFailure,
  getPlatformSectionsByIdStart,
  getPlatformSectionsByIdSuccess,
  getPlatformSectionsByIdFailure,
  attachPaymentMethodStart,
  attachPaymentMethodSuccess,
  attachPaymentMethodFailure,
  createSubscriptionStart,
  createSubscriptionSuccess,
  createSubscriptionFailure,
} from "./appSlice";

// ===== NEW API STRUCTURE =====
const API_BASE_URL = __DEV__
  ? "http://localhost:8080/api"
  : "https://intelipadel.com/api";

// TypeScript Interfaces matching new database structure
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
  court_name: string;
  club_name: string;
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
  rating: number | null;
  review_count: number | null;
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
}

// Legacy ClubSubscription interface - kept for backward compatibility
// This will be removed in future versions. Use types from types/subscription.ts
export interface ClubSubscription_Legacy {
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

// Legacy UserSubscription interface - kept for backward compatibility
// Prefer using UserSubscriptionData from types/subscription.ts
export interface UserSubscription_Legacy {
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
  subscription?: ClubSubscription; // Uses the imported type
}

export interface AvailabilityData {
  club: Club;
  courts: Court[];
  schedules: Array<{
    day_of_week: number;
    opens_at: string;
    closes_at: string;
    is_closed: boolean;
  }>;
  bookings: Booking[];
  blockedSlots: Array<{
    id: number;
    court_id: number | null;
    block_date: string;
    start_time: string | null;
    end_time: string | null;
    is_all_day: boolean;
    reason: string | null;
  }>;
  events: Event[];
  eventCourtSchedules: Array<{
    id: number;
    event_id: number;
    court_id: number;
    event_date: string;
    start_time: string;
    end_time: string;
  }>;
  privateClasses: PrivateClass[];
}

// ===== AUTHENTICATION FUNCTIONS =====

/**
 * Check if user exists by email
 */
export const checkUserExists =
  (email: string, club_id: number) => async (dispatch: any) => {
    try {
      console.log("🔍 [CHECK USER] Request payload:", { email, club_id });
      dispatch(validateUserByEmailStart({ email }));
      const response = await axios.post(`${API_BASE_URL}/auth/check-user`, {
        email,
        club_id,
      });
      console.log(
        "✅ [CHECK USER] Response data:",
        JSON.stringify(response.data, null, 2)
      );
      console.log("✅ [CHECK USER] User exists:", response.data.exists);
      console.log(
        "✅ [CHECK USER] Patient active status:",
        response.data.patient?.is_active
      );
      console.log(
        "✅ [CHECK USER] User (fallback) active status:",
        response.data.user?.is_active
      );
      dispatch(validateUserByEmailSuccess(response.data));
      return response.data;
    } catch (error) {
      console.error("❌ [CHECK USER] Error:", error);
      if (axios.isAxiosError(error)) {
        console.error("❌ [CHECK USER] Response data:", error.response?.data);
        console.error(
          "❌ [CHECK USER] Response status:",
          error.response?.status
        );
      }
      dispatch(validateUserByEmailFailure());
      throw error;
    }
  };

/**
 * Create a new user
 */
export const createUser =
  (
    email: string,
    first_name: string,
    last_name: string,
    phone: string,
    date_of_birth: string | undefined,
    club_id: number
  ) =>
  async (dispatch: any) => {
    try {
      const payload: any = {
        email,
        first_name,
        last_name,
        phone,
        club_id,
      };

      // Only include date_of_birth if provided
      if (date_of_birth) {
        payload.date_of_birth = date_of_birth;
      }

      console.log("👤 [CREATE USER] Request payload:", payload);
      dispatch(insertPlatformUserStart());
      const response = await axios.post(
        `${API_BASE_URL}/auth/create-user`,
        payload
      );
      console.log(
        "✅ [CREATE USER] Response data:",
        JSON.stringify(response.data, null, 2)
      );
      console.log("✅ [CREATE USER] User ID:", response.data.data?.id);
      console.log(
        "✅ [CREATE USER] User active status:",
        response.data.data?.is_active
      );
      dispatch(insertPlatformUserSuccess(response.data));
      return response.data;
    } catch (error) {
      console.error("❌ [CREATE USER] Error:", error);
      if (axios.isAxiosError(error)) {
        console.error("❌ [CREATE USER] Response data:", error.response?.data);
        console.error(
          "❌ [CREATE USER] Response status:",
          error.response?.status
        );
      }
      dispatch(insertPlatformUserFailure());
      throw error;
    }
  };

/**
 * Send verification code to email
 */
export const sendVerificationCode =
  (email: string, user_id: number) => async (dispatch: any) => {
    try {
      console.log("📧 [SEND CODE] Request payload:", { email, user_id });
      dispatch(sendCodeByMailStart());
      const response = await axios.post(`${API_BASE_URL}/auth/send-code`, {
        email,
        user_id,
      });
      console.log(
        "✅ [SEND CODE] Response data:",
        JSON.stringify(response.data, null, 2)
      );
      console.log(
        "✅ [SEND CODE] Code sent successfully:",
        response.data.success
      );
      dispatch(sendCodeByMailSuccess(response.data));
      return response.data;
    } catch (error) {
      console.error("❌ [SEND CODE] Error:", error);
      if (axios.isAxiosError(error)) {
        console.error("❌ [SEND CODE] Response data:", error.response?.data);
        console.error(
          "❌ [SEND CODE] Response status:",
          error.response?.status
        );
      }
      dispatch(sendCodeByMailFailure());
      throw error;
    }
  };

/**
 * Verify code and login user
 */
export const verifyCode =
  (email: string, code: string, user_id: number) => async (dispatch: any) => {
    try {
      console.log("🔑 [VERIFY CODE] Request payload:", {
        email,
        code,
        user_id,
      });
      dispatch(validateSessionCodeStart());
      const response = await axios.post(`${API_BASE_URL}/auth/verify-code`, {
        email,
        code,
        user_id,
      });
      console.log(
        "✅ [VERIFY CODE] Response data:",
        JSON.stringify(response.data, null, 2)
      );
      console.log("✅ [VERIFY CODE] User ID:", response.data.user?.id);
      console.log("✅ [VERIFY CODE] User email:", response.data.user?.email);
      console.log(
        "✅ [VERIFY CODE] User active status:",
        response.data.user?.is_active
      );
      console.log("✅ [VERIFY CODE] Session valid:", response.data.valid);
      dispatch(validateSessionCodeSuccess(response.data));
      return response.data;
    } catch (error) {
      console.error("❌ [VERIFY CODE] Error:", error);
      if (axios.isAxiosError(error)) {
        console.error("❌ [VERIFY CODE] Response data:", error.response?.data);
        console.error(
          "❌ [VERIFY CODE] Response status:",
          error.response?.status
        );
      }
      dispatch(validateSessionCodeFailure());
      throw error;
    }
  };

/**
 * Get user info by ID
 */
export const getUserInfo = (user_id: number) => async (dispatch: any) => {
  try {
    console.log("👤 [GET USER INFO] Request - User ID:", user_id);
    dispatch(getUserInfoByIdStart());
    const response = await axios.get(`${API_BASE_URL}/users/${user_id}`);
    console.log(
      "✅ [GET USER INFO] Response data:",
      JSON.stringify(response.data, null, 2)
    );

    // Map new API response to expected UserInfo format for backward compatibility
    const user = response.data.user;
    console.log(
      "✅ [GET USER INFO] User object:",
      JSON.stringify(user, null, 2)
    );
    console.log("✅ [GET USER INFO] User email:", user?.email);
    console.log("✅ [GET USER INFO] User active status:", user?.is_active);
    console.log("✅ [GET USER INFO] User club_id:", user?.club_id);

    const normalizedUser = {
      id_platforms_user: user.id,
      full_name: user.name,
      email: user.email,
      phone_number: user.phone || "",
      stripe_id: user.stripe_customer_id || "",
      active: user.is_active ? 1 : 0,
      id_platforms: user.club_id,
      date_created: user.created_at,
      // Keep other fields that might exist in state
      age: 0,
      date_of_birth: "",
      phone_number_code: "",
      type: 0,
      publishable_key: "",
      card_info: null,
      subscription: null,
    };

    console.log(
      "✅ [GET USER INFO] Normalized user:",
      JSON.stringify(normalizedUser, null, 2)
    );
    console.log("✅ [GET USER INFO] Dispatching normalized user to Redux...");
    dispatch(getUserInfoByIdSuccess(normalizedUser));
    console.log("✅ [GET USER INFO] Dispatch complete");
    return normalizedUser;
  } catch (error) {
    console.error("❌ [GET USER INFO] Error:", error);
    if (axios.isAxiosError(error)) {
      console.error("❌ [GET USER INFO] Response data:", error.response?.data);
      console.error(
        "❌ [GET USER INFO] Response status:",
        error.response?.status
      );
    }
    dispatch(getUserInfoByIdFailure());
    throw error;
  }
};

// ===== CLUB & COURTS FUNCTIONS =====

/**
 * Get club information by ID
 */
export const getClubById = (club_id: number) => async (dispatch: any) => {
  try {
    dispatch(fetchPlatformFieldsStart());
    const response = await axios.get<any>(`${API_BASE_URL}/clubs/${club_id}`);

    console.log(
      "[getClubById] Raw API response:",
      JSON.stringify(response.data, null, 2)
    );

    // Get courts for the club
    const courtsResponse = await axios.get<{ courts: Court[] }>(
      `${API_BASE_URL}/courts/${club_id}`
    );

    // Transform to legacy format expected by Redux
    const legacyPlatformFields = {
      ...response.data,
      platforms_fields: (courtsResponse.data.courts || []).map((court) => ({
        id_platforms_field: court.id,
        title: court.name,
        carrouselImages: [], // Empty for now
        court_type: court.court_type,
        surface_type: court.surface_type,
        has_lighting: court.has_lighting,
        is_active: court.is_active,
      })),
      last_reservation: null, // Will be populated by getUserBookings
      last_class: null, // Will be populated by getUserPrivateClasses
      classes: [], // Will be populated by getEvents
    };

    console.log(
      "[getClubById] legacyPlatformFields:",
      JSON.stringify(legacyPlatformFields, null, 2)
    );
    dispatch(fetchPlatformFieldsSuccess(legacyPlatformFields));

    // API returns { success: true, data: {...} }, extract the actual club data
    const clubData = response.data.data || response.data;
    console.log(
      "[getClubById] Returning club data:",
      JSON.stringify(clubData, null, 2)
    );
    return clubData;
  } catch (error) {
    console.error("Error fetching club:", error);
    dispatch(fetchPlatformFieldsFailure());
    throw error;
  }
};

/**
 * Get courts for a club
 */
export const getCourts = (club_id: number) => async (dispatch: any) => {
  try {
    const response = await axios.get<{ courts: Court[] }>(
      `${API_BASE_URL}/courts/${club_id}`
    );
    return response.data.courts;
  } catch (error) {
    console.error("Error fetching courts:", error);
    throw error;
  }
};

/**
 * Get availability for booking
 * This is the key function for court selection
 */
export const getAvailability =
  (club_id: number, date: string, duration_minutes: number = 90) =>
  async (dispatch: any) => {
    try {
      dispatch(fetchPlatformsFieldsStart());
      const response = await axios.get<{
        success: boolean;
        data: AvailabilityData;
      }>(`${API_BASE_URL}/availability`, {
        params: {
          clubId: club_id,
          startDate: date,
          endDate: date,
        },
      });
      dispatch(fetchPlatformsFieldsSuccess(response.data.data));
      return response.data.data;
    } catch (error) {
      console.error("Error fetching availability:", error);
      dispatch(fetchPlatformsFieldsFailure());
      throw error;
    }
  };

/**
 * Get instructors with availability for a specific date
 */
export const getInstructorsAvailability =
  (club_id: number, date: string) => async (dispatch: any) => {
    try {
      const response = await axios.get<{
        success: boolean;
        data: Instructor[];
      }>(`${API_BASE_URL}/instructors/${club_id}`, {
        params: {
          date: date,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching instructors availability:", error);
      throw error;
    }
  };

// ===== BOOKING FUNCTIONS =====

/**
 * Calculate price for a booking
 */
export const calculatePrice =
  (
    club_id: number,
    court_id: number,
    date: string,
    start_time: string,
    duration_minutes: number,
    user_id: number
  ) =>
  async (dispatch: any) => {
    try {
      dispatch(getPriceByIdAndTimeStart());
      const response = await axios.post(`${API_BASE_URL}/calculate-price`, {
        club_id,
        court_id,
        booking_date: date, // API expects "booking_date", not "date"
        start_time,
        duration_minutes,
        user_id,
      });
      dispatch(getPriceByIdAndTimeSuccess(response.data));
      return response.data;
    } catch (error) {
      console.error("Error calculating price:", error);
      dispatch(getPriceByIdAndTimeFailure());
      throw error;
    }
  };

/**
 * Create payment intent for booking
 */
export const createBookingPaymentIntent =
  (
    user_id: number,
    club_id: number,
    court_id: number,
    booking_date: string,
    start_time: string,
    duration_minutes: number
  ) =>
  async (dispatch: any) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/payment/create-intent`,
        {
          user_id,
          club_id,
          court_id,
          booking_date,
          start_time,
          duration_minutes,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating payment intent:", error);
      throw error;
    }
  };

/**
 * Create a booking after successful payment
 */
export const createBooking =
  (
    user_id: number,
    club_id: number,
    court_id: number,
    booking_date: string,
    start_time: string,
    duration_minutes: number,
    payment_intent_id: string
  ) =>
  async (dispatch: any) => {
    try {
      dispatch(insertPlatformDateTimeSlotStart());
      const response = await axios.post<{ success: boolean; booking: Booking }>(
        `${API_BASE_URL}/bookings`,
        {
          user_id,
          club_id,
          court_id,
          booking_date,
          start_time,
          duration_minutes,
          payment_intent_id,
        }
      );
      // Transform to legacy format
      const legacyPaymentState = {
        id_platforms_date_time_slot: response.data.booking.id,
        id_platforms_field: response.data.booking.court_id,
        platforms_date_time_start: response.data.booking.start_time,
        platforms_date_time_end: response.data.booking.end_time,
        active: response.data.booking.status === "confirmed" ? 1 : 0,
        stripe_id: response.data.booking.stripe_payment_intent_id || "",
      };
      dispatch(insertPlatformDateTimeSlotSuccess(legacyPaymentState));
      return response.data.booking;
    } catch (error) {
      console.error("Error creating booking:", error);
      dispatch(insertPlatformDateTimeSlotFailure());
      throw error;
    }
  };

/**
 * Get user's bookings
 */
export const getUserBookings =
  (user_id: number, club_id?: number) => async (dispatch: any) => {
    try {
      dispatch(getReservationsByUserIdStart());

      // API expects userId (not user_id) and returns { success: true, data: [] }
      const response = await axios.get<{ success: boolean; data: Booking[] }>(
        `${API_BASE_URL}/bookings`,
        { params: { userId: user_id, club_id } }
      );

      // API returns { success: true, data: [] }
      const bookingsArray = response.data.data || [];

      // Pass to Redux in the format it expects (Reservations interface)
      const reservationsPayload = {
        reservations: bookingsArray,
        eventReservations: [],
      };
      dispatch(getReservationsByUserIdSuccess(reservationsPayload));

      // But return the raw array for direct use in components
      return bookingsArray;
    } catch (error) {
      console.error("Error fetching bookings:", error);
      dispatch(getReservationsByUserIdFailure());
      return [];
    }
  };

/**
 * Cancel a booking
 */
export const cancelBooking =
  (booking_id: number, cancellation_reason: string) =>
  async (dispatch: any) => {
    try {
      dispatch(deletePlatformDateTimeSlotStart());
      const response = await axios.post(
        `${API_BASE_URL}/bookings/${booking_id}/cancel`,
        {
          cancellation_reason,
        }
      );
      dispatch(deletePlatformDateTimeSlotSuccess(response.data));
      return response.data;
    } catch (error) {
      console.error("Error cancelling booking:", error);
      dispatch(deletePlatformDateTimeSlotFailure());
      throw error;
    }
  };

// ===== EVENT FUNCTIONS =====

/**
 * Get events for a club
 */
export const getEvents =
  (club_id: number, status?: string) => async (dispatch: any) => {
    try {
      dispatch(getClassesByIdPlatformStart());
      const params: any = { club_id };
      if (status) params.status = status;

      const response = await axios.get<{ events: Event[] }>(
        `${API_BASE_URL}/events`,
        { params }
      );
      // Handle both response formats
      const eventsArray =
        response.data.events ||
        (Array.isArray(response.data) ? response.data : []);
      // Transform to legacy format
      const legacyClasses = eventsArray.map((e: any) => ({
        id_platforms_disabled_date: e.id,
        start_date_time: e.start_time,
        end_date_time: e.end_time,
        active: e.status === "open" ? 1 : 0,
        title: e.title,
        id_platforms_field: e.courts_used?.[0] || 0,
        event_title: e.title,
        type: 1,
        price: e.registration_fee.toString(),
      }));
      dispatch(getClassesByIdPlatformSuccess(legacyClasses));
      return eventsArray;
    } catch (error) {
      console.error("Error fetching events:", error);
      dispatch(getClassesByIdPlatformFailure());
      return [];
    }
  };

/**
 * Create payment intent for event registration
 */
export const createEventPaymentIntent =
  (user_id: number, event_id: number) => async (dispatch: any) => {
    try {
      dispatch(getEventPricebyDateAndIdPlatformStart());
      const response = await axios.post(
        `${API_BASE_URL}/events/payment/create-intent`,
        {
          user_id,
          event_id,
        }
      );
      dispatch(getEventPricebyDateAndIdPlatformSuccess(response.data));
      return response.data;
    } catch (error) {
      console.error("Error creating event payment intent:", error);
      dispatch(getEventPricebyDateAndIdPlatformFailure());
      throw error;
    }
  };

/**
 * Register for event after successful payment
 */
export const registerForEvent =
  (payment_intent_id: string, user_id: number, event_id: number) =>
  async (dispatch: any) => {
    try {
      dispatch(insertEventUserStart());
      const response = await axios.post<{
        success: boolean;
        participant: EventParticipant;
      }>(`${API_BASE_URL}/events/payment/confirm`, {
        payment_intent_id,
        user_id,
        event_id,
      });
      // Transform to legacy format
      const legacyEventState = {
        id_platforms_fields_events_users: response.data.participant.id,
        id_platforms_user: response.data.participant.user_id,
        id_platforms_disabled_date: response.data.participant.event_id,
        active: response.data.participant.status === "confirmed" ? 1 : 0,
        platforms_fields_events_users_inserted:
          response.data.participant.registration_date,
      };
      dispatch(insertEventUserSuccess(legacyEventState));
      return response.data.participant;
    } catch (error) {
      console.error("Error registering for event:", error);
      dispatch(insertEventUserFailure());
      throw error;
    }
  };

/**
 * Get user's event registrations
 * API: GET /api/users/:userId/event-registrations
 * Returns: { success: true, data: [...] }
 */
export const getUserEventRegistrations =
  (user_id: number) => async (dispatch: any) => {
    try {
      const response = await axios.get<{ success: boolean; data: any[] }>(
        `${API_BASE_URL}/users/${user_id}/event-registrations`
      );

      // API returns { success: true, data: [...] }
      const registrationsArray = response.data.data || [];
      return registrationsArray;
    } catch (error) {
      console.error("Error fetching event registrations:", error);
      return [];
    }
  };

// ===== PRIVATE CLASS FUNCTIONS =====

/**
 * Get instructors for a club
 */
export const getInstructors = (club_id: number) => async (dispatch: any) => {
  try {
    const response = await axios.get<{ instructors: Instructor[] }>(
      `${API_BASE_URL}/instructors/${club_id}`
    );
    return response.data.instructors;
  } catch (error) {
    console.error("Error fetching instructors:", error);
    throw error;
  }
};

/**
 * Create payment intent for private class
 */
export const createPrivateClassPaymentIntent =
  (
    user_id: number,
    instructor_id: number,
    club_id: number,
    court_id: number,
    class_date: string,
    start_time: string,
    duration_minutes: number,
    class_type: "individual" | "group" | "semi_private",
    number_of_students: number
  ) =>
  async (dispatch: any) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/private-classes/payment/create-intent`,
        {
          user_id,
          instructor_id,
          club_id,
          court_id,
          class_date,
          start_time,
          duration_minutes,
          class_type,
          number_of_students,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating private class payment intent:", error);
      throw error;
    }
  };

/**
 * Book private class after successful payment
 */
export const bookPrivateClass =
  (payment_intent_id: string) => async (dispatch: any) => {
    try {
      dispatch(insertPlatformFieldClassUsersStart());
      const response = await axios.post<{
        success: boolean;
        privateClass: PrivateClass;
      }>(`${API_BASE_URL}/private-classes/payment/confirm`, {
        payment_intent_id,
      });
      // Transform to legacy format
      const legacyClassState = {
        id_platforms_fields_classes_users: response.data.privateClass.id,
        id_platforms_user: response.data.privateClass.user_id,
        id_platforms_disabled_date: response.data.privateClass.instructor_id,
        platforms_date_time_start: response.data.privateClass.start_time,
        platforms_date_time_end: response.data.privateClass.end_time,
        price: response.data.privateClass.total_price,
        active: response.data.privateClass.status === "confirmed" ? 1 : 0,
        validated: response.data.privateClass.payment_status === "paid" ? 1 : 0,
        platforms_fields_classes_users_inserted:
          response.data.privateClass.created_at,
      };
      dispatch(insertPlatformFieldClassUsersSuccess(legacyClassState));
      return response.data.privateClass;
    } catch (error) {
      console.error("Error booking private class:", error);
      dispatch(insertPlatformFieldClassUsersFailure());
      throw error;
    }
  };

/**
 * Get user's private classes
 * API: GET /api/users/:userId/private-classes
 * Returns: { success: true, data: [...] }
 */
export const getUserPrivateClasses =
  (user_id: number) => async (dispatch: any) => {
    try {
      dispatch(getClassesByUserIdStart());

      const response = await axios.get<{
        success: boolean;
        data: PrivateClass[];
      }>(`${API_BASE_URL}/users/${user_id}/private-classes`);

      // API returns { success: true, data: [] }
      const classesArray = response.data.data || [];

      // Map backend fields directly to the model (NO transformation needed)
      const classReservations = classesArray.map((c: any) => ({
        // Backend fields - use as-is
        id: c.id,
        booking_number: c.booking_number,
        user_id: c.user_id,
        instructor_id: c.instructor_id,
        instructor_name: c.instructor_name,
        instructor_email: c.instructor_email,
        club_id: c.club_id,
        club_name: c.club_name,
        court_id: c.court_id,
        court_name: c.court_name,
        class_date: c.class_date,
        start_time: c.start_time,
        end_time: c.end_time,
        duration_minutes: c.duration_minutes,
        class_type: c.class_type,
        number_of_students: c.number_of_students,
        total_price: c.total_price,
        status: c.status,
        payment_status: c.payment_status,
        notes: c.notes,
        confirmed_at: c.confirmed_at,
        created_at: c.created_at,

        // Legacy fields for backward compatibility (optional)
        validated: c.payment_status === "paid" ? 1 : 0,
        stripe_id: c.stripe_payment_intent_id || "",
      }));
      dispatch(getClassesByUserIdSuccess(classReservations));
      return classesArray;
    } catch (error) {
      console.error("Error fetching private classes:", error);
      dispatch(getClassesByUserIdFailure());
      return [];
    }
  };

// ===== SUBSCRIPTION FUNCTIONS =====

/**
 * Get active sections (tabs) for a club - simplified version
 */
export const getActiveSubscriptions =
  (club_id: number) => async (dispatch: any) => {
    try {
      dispatch(getPlatformSectionsByIdStart());

      // In the new system, we fetch club info to determine which sections are available
      const response = await axios.get<{ success: boolean; data: Club }>(
        `${API_BASE_URL}/clubs/${club_id}`
      );
      const club = response.data.data;

      // Create sections based on club features
      const legacySections = [
        {
          id_platforms_sections: 1,
          section: "reservations",
          active: 1, // Always active
        },
        {
          id_platforms_sections: 2,
          section: "classes",
          active: 1, // Always active
        },
        {
          id_platforms_sections: 3,
          section: "memberships",
          active: club.has_subscriptions ? 1 : 0,
        },
      ];

      dispatch(getPlatformSectionsByIdSuccess(legacySections));
      return legacySections;
    } catch (error) {
      console.error("Error fetching sections:", error);
      dispatch(getPlatformSectionsByIdFailure());
      // Return default sections on error
      return [
        { id_platforms_sections: 1, section: "reservations", active: 1 },
        { id_platforms_sections: 2, section: "classes", active: 1 },
        { id_platforms_sections: 3, section: "memberships", active: 1 },
      ];
    }
  };

/**
 * Get user's active subscription
 */
export const getUserSubscription =
  (user_id: number) => async (dispatch: any, getState: any) => {
    try {
      const response = await axios.get<UserSubscriptionData | null>(
        `${API_BASE_URL}/users/${user_id}/subscription`
      );

      // API returns the subscription data directly, or null if no active subscription
      const subscriptionData = response.data;

      // Merge subscription into existing userInfo
      const currentUserInfo = getState().app.userInfo.info;
      dispatch(
        getUserInfoByIdSuccess({
          ...currentUserInfo,
          subscription: subscriptionData,
        })
      );

      return subscriptionData;
    } catch (error) {
      console.error("Error fetching user subscription:", error);
      throw error;
    }
  };

/**
 * Subscribe user to a plan
 */
export const subscribeUser =
  (
    user_id: number,
    club_id: number,
    plan_id: number,
    payment_method_id: string
  ) =>
  async (dispatch: any) => {
    try {
      dispatch(createSubscriptionStart());
      const response = await axios.post<{
        success: boolean;
        subscription: UserSubscriptionData;
      }>(`${API_BASE_URL}/subscriptions/subscribe`, {
        user_id,
        club_id,
        plan_id,
        payment_method_id,
      });
      dispatch(createSubscriptionSuccess(response.data));
      return response.data.subscription;
    } catch (error) {
      console.error("Error subscribing user:", error);
      dispatch(createSubscriptionFailure());
      throw error;
    }
  };

/**
 * Attach payment method to user
 */
export const attachPaymentMethod =
  (stripe_customer_id: string, payment_method_id: string, user_id: number) =>
  async (dispatch: any) => {
    try {
      dispatch(attachPaymentMethodStart());
      const response = await axios.post(`${API_BASE_URL}/payment-methods`, {
        stripe_customer_id,
        payment_method_id,
        user_id,
      });
      dispatch(attachPaymentMethodSuccess(response.data));
      return response.data;
    } catch (error) {
      console.error("Error attaching payment method:", error);
      dispatch(attachPaymentMethodFailure());
      throw error;
    }
  };

/**
 * Cancel user subscription
 */
export const cancelSubscription =
  (user_id: number, subscription_id: number, cancellation_reason: string) =>
  async (dispatch: any) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/subscriptions/cancel`,
        {
          user_id,
          subscription_id,
          cancellation_reason,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      throw error;
    }
  };

/**
 * Cancel user subscription (alternative API with payload object)
 */
export const cancelUserSubscription =
  (payload: CancelSubscriptionPayload) => async (dispatch: any) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/subscriptions/cancel`,
        {
          user_id: payload.user_id,
          subscription_id: payload.subscription_id,
          cancellation_reason:
            payload.cancellation_reason || "Cancelled by user",
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      throw error;
    }
  };

// ===== LEGACY COMPATIBILITY FUNCTIONS =====
// These maintain backward compatibility with existing code

export const fetchPaymentIntentClientSecret = async (
  amount: number,
  customerId: string,
  booking_id?: number
) => {
  // This is now handled by createBookingPaymentIntent
  console.warn(
    "fetchPaymentIntentClientSecret is deprecated, use createBookingPaymentIntent instead"
  );
  throw new Error("Use new payment flow with createBookingPaymentIntent");
};

// Keep old function names that might be referenced elsewhere
export const fetchPlatformFields = getClubById;
export const fetchPlatformsFields = getAvailability;
export const insertPlatformDateTimeSlot = createBooking;
export const deletePlatformDateTimeSlot = cancelBooking;
export const getReservationsByUserId = getUserBookings;
export const validateUserByEmail = checkUserExists;
export const insertPlatformUser = createUser;
export const sendCodeByMail = sendVerificationCode;
export const validateSessionCode = verifyCode;
export const getUserInfoById = getUserInfo;
export const getPriceByIdAndTime = calculatePrice;
export const getEventPricebyDateAndIdPlatform = createEventPaymentIntent;
export const insertEventUser = registerForEvent;
export const getClassesByIdPlatform = getEvents;
export const insertPlatformFieldClassUser = bookPrivateClass;
export const getClassesByUserId = getUserPrivateClasses;
export const getPlatformSectionsById = getActiveSubscriptions;

/**
 * Update user profile
 * API: PUT /api/users/:id
 */
export const updateUserProfile =
  (user_id: number, data: { name: string; phone?: string }) =>
  async (dispatch: any) => {
    try {
      console.log(
        "📝 [UPDATE USER] Request - User ID:",
        user_id,
        "Data:",
        data
      );
      const response = await axios.put(`${API_BASE_URL}/users/${user_id}`, {
        name: data.name,
        phone: data.phone,
        requesting_user_id: user_id,
      });
      console.log("✅ [UPDATE USER] Response:", response.data);

      // Refresh user info after update
      await dispatch(getUserInfo(user_id));

      // Also refresh payment methods to prevent them from disappearing
      await dispatch(fetchPaymentMethods(user_id));

      return response.data;
    } catch (error) {
      console.error("❌ [UPDATE USER] Error:", error);
      throw error;
    }
  };

/**
 * Fetch user payment methods
 * API: GET /api/payment-methods?userId=X
 */
export const fetchPaymentMethods =
  (user_id: number) => async (dispatch: any, getState: any) => {
    try {
      console.log("💳 [FETCH PAYMENT METHODS] Request - User ID:", user_id);
      const response = await axios.get(`${API_BASE_URL}/payment-methods`, {
        params: { userId: user_id },
      });
      console.log("✅ [FETCH PAYMENT METHODS] Response:", response.data);

      // Update user info with payment methods (update card_info in the store)
      if (response.data && response.data.length > 0) {
        const defaultCard =
          response.data.find((pm: any) => pm.is_default) || response.data[0];
        const cardInfo = {
          default_payment_method: defaultCard.id,
          last4: defaultCard.last4,
          brand: defaultCard.brand,
        };

        // Dispatch to update card info in state
        const currentState = getState();
        dispatch(
          getUserInfoByIdSuccess({
            ...(currentState.app.userInfo.info || {}),
            card_info: cardInfo,
          })
        );
      }

      return response.data;
    } catch (error) {
      console.error("❌ [FETCH PAYMENT METHODS] Error:", error);
      throw error;
    }
  };

/**
 * Set default payment method
 * API: PUT /api/payment-methods/:paymentMethodId/set-default
 */
export const setDefaultPaymentMethod =
  (user_id: number, payment_method_id: string) =>
  async (dispatch: any, getState: any) => {
    try {
      console.log(
        "💳 [SET DEFAULT PAYMENT METHOD] Request - User ID:",
        user_id,
        "Payment Method ID:",
        payment_method_id
      );

      const response = await axios.put(
        `${API_BASE_URL}/payment-methods/${payment_method_id}/set-default`,
        { user_id }
      );

      console.log("✅ [SET DEFAULT PAYMENT METHOD] Response:", response.data);

      // Update Redux store with the new default payment method
      if (response.data.success && response.data.paymentMethods) {
        const defaultCard = response.data.paymentMethods.find(
          (pm: any) => pm.is_default
        );

        if (defaultCard) {
          const cardInfo = {
            default_payment_method: defaultCard.id,
            last4: defaultCard.last4,
            brand: defaultCard.brand,
          };

          // Get current state and update card info
          const currentState = getState();
          dispatch(
            getUserInfoByIdSuccess({
              ...(currentState.app.userInfo.info || {}),
              card_info: cardInfo,
            })
          );
        }
      }

      return response.data;
    } catch (error) {
      console.error("❌ [SET DEFAULT PAYMENT METHOD] Error:", error);
      throw error;
    }
  };

// Logout function (if needed)
export const logout = (user_id: number) => async (dispatch: any) => {
  try {
    dispatch(logoutStart());
    // Clear local storage or session
    // The new API doesn't have a dedicated logout endpoint for users
    // Just clear local state
    dispatch(logoutSuccess());
  } catch (error) {
    console.error("Error logging out:", error);
    dispatch(logoutFailure());
    throw error;
  }
};

// Re-export types for backward compatibility with existing components
export type {
  ClubSubscription,
  UserSubscriptionData,
  PaymentMethod,
  CancelSubscriptionPayload,
  SubscribePayload,
} from "../types/subscription";
