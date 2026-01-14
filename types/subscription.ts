// Subscription Types for InteliPadel

export interface ClubSubscription {
  id: number;
  club_id: number;
  name: string;
  description: string | null;
  price_monthly: number;
  currency: string;
  booking_discount_percent: number | null;
  booking_credits_monthly: number | null;
  bar_discount_percent: number | null;
  merch_discount_percent: number | null;
  event_discount_percent: number | null;
  class_discount_percent: number | null;
  extras: SubscriptionExtra[] | null;
  is_active: boolean;
  display_order: number;
  max_subscribers: number | null;
  current_subscribers?: number;
  stripe_product_id: string | null;
  stripe_price_id: string | null;
  created_at?: string;
  updated_at?: string;
  // For UI display
  club_name?: string;
}

export interface SubscriptionExtra {
  id?: string;
  description: string;
  icon?: string;
}

export interface UserSubscriptionData {
  id: number;
  user_id: number;
  subscription_id: number;
  stripe_subscription_id: string;
  status: "active" | "cancelled" | "past_due" | "incomplete";
  bookings_used_this_month: number;
  started_at: string;
  current_period_start: string;
  current_period_end: string;
  cancelled_at: string | null;
  subscription: ClubSubscription;
}

export interface PaymentMethod {
  id: string; // stripe_payment_method_id
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  is_default: boolean;
  created_at: string;
}

export interface CancelSubscriptionPayload {
  user_id: number;
  subscription_id: number;
  cancellation_reason?: string;
}

export interface SubscribePayload {
  user_id: number;
  subscription_id: number;
  payment_method_id: string;
}

// API Response Types
export interface SubscriptionAPIResponse {
  success: boolean;
  message?: string;
  subscription?: any;
  error?: string;
}

export interface UserSubscriptionAPIResponse extends UserSubscriptionData {}
