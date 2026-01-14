import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  Animated,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useStripe, CardField } from "@stripe/stripe-react-native";
import BookingSummary from "../BookingSummary/BookingSummary";
import ClassRegistrationSummary from "../ClassRegistrationSummary/ClassRegistrationSummary";
import EventRegistrationSummary from "../EventRegistrationSummary/EventRegistrationSummary";
import PaymentMethodSelector from "../PaymentMethodSelector/PaymentMethodSelector";

interface Club {
  id: number;
  name: string;
  image_url: string;
  city: string;
  fee_structure: string;
  service_fee_percentage: number;
}

interface Court {
  id: number;
  club_id: number;
  name: string;
  court_type: string;
  surface_type: string;
  has_lighting: boolean;
  is_active: boolean;
  display_order: number;
}

interface Instructor {
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
}

interface Event {
  id: number;
  title: string;
  description?: string;
  event_type: string;
  event_date: string;
  start_time: string;
  end_time: string;
  registration_fee: number;
  current_participants: number;
  max_participants: number | null;
  skill_level?: string;
  prize_pool?: number | null;
}

interface PriceCalculation {
  base_price: number;
  booking_price?: number;
  service_fee: number;
  user_pays_service_fee: number;
  subtotal: number;
  iva: number;
  total_with_iva: number;
  fee_structure: string;
  original_price?: number;
  discount_applied?: number;
  service_fee_percentage?: number;
}

type BookingType = "court" | "class" | "event";

interface PaymentProcessingScreenProps {
  bookingType: BookingType;
  userId: number;
  apiBaseUrl: string;

  // Court booking props
  club?: Club;
  court?: Court;
  bookingDate?: Date;
  startTime?: string;
  endTime?: string;
  duration?: number;

  // Private class props
  instructor?: Instructor;
  clubName?: string;
  clubImage?: string;
  classType?: "individual" | "group" | "semi_private";
  classDate?: string;
  numberOfStudents?: number;
  focusAreas?: string[];
  studentLevel?: "beginner" | "intermediate" | "advanced" | "expert" | null;

  // Event props
  event?: Event;
  eventClubName?: string;
  eventClubImage?: string;

  // Pre-calculated price data (optional)
  priceCalculation?: any;

  // Callbacks
  onPaymentSuccess: (bookingData: any) => void;
  onCancel: () => void;
}

export default function PaymentProcessingScreen({
  bookingType,
  userId,
  apiBaseUrl,
  club,
  court,
  bookingDate,
  startTime,
  endTime,
  duration,
  instructor,
  clubName,
  clubImage,
  classType,
  classDate,
  numberOfStudents,
  focusAreas,
  studentLevel,
  event,
  eventClubName,
  eventClubImage,
  priceCalculation: precalculatedPrice,
  onPaymentSuccess,
  onCancel,
}: PaymentProcessingScreenProps) {
  console.log("🎬 PaymentProcessingScreen - Component initialized");
  console.log("   Critical props:");
  console.log("   - bookingType:", bookingType);
  console.log("   - userId:", userId, `(type: ${typeof userId})`);
  console.log("   - apiBaseUrl:", apiBaseUrl);
  console.log(
    "   - club:",
    club ? `${club.name} (id: ${club.id})` : "undefined"
  );
  console.log(
    "   - court:",
    court ? `${court.name} (id: ${court.id})` : "undefined"
  );
  console.log(
    "   - priceCalculation:",
    precalculatedPrice ? "provided" : "not provided"
  );

  const [priceCalculation, setPriceCalculation] =
    useState<PriceCalculation | null>(null);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<
    string | null
  >(null);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [paymentMethodsLoading, setPaymentMethodsLoading] = useState(true);
  const [paymentMethodsError, setPaymentMethodsError] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showNewCardModal, setShowNewCardModal] = useState(false);
  const [bookingResult, setBookingResult] = useState<any>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [processingNewCard, setProcessingNewCard] = useState(false);

  // Initialize Stripe hook
  const { confirmPayment: confirmStripePayment, createPaymentMethod } =
    useStripe();

  console.log("   Initial state:");
  console.log("   - loading:", loading);
  console.log("   - processing:", processing);
  console.log("   - error:", error);
  console.log("   - selectedPaymentMethodId:", selectedPaymentMethodId);

  useEffect(() => {
    // If price calculation data is provided, use it directly
    if (precalculatedPrice) {
      console.log("✅ Using pre-calculated price data:", precalculatedPrice);
      // Map the data structure to match what we need
      setPriceCalculation({
        base_price:
          precalculatedPrice.booking_price ||
          precalculatedPrice.base_price ||
          0,
        booking_price:
          precalculatedPrice.booking_price ||
          precalculatedPrice.base_price ||
          0,
        service_fee: precalculatedPrice.service_fee || 0,
        user_pays_service_fee: precalculatedPrice.user_pays_service_fee || 0,
        subtotal:
          precalculatedPrice.subtotal ||
          precalculatedPrice.booking_price ||
          precalculatedPrice.base_price ||
          0,
        iva: precalculatedPrice.iva || 0,
        total_with_iva: precalculatedPrice.total_with_iva || 0,
        fee_structure: precalculatedPrice.fee_structure || "user_pays_fee",
        original_price: precalculatedPrice.original_price,
        discount_applied:
          precalculatedPrice.subscription_discount ||
          precalculatedPrice.discount_applied,
        service_fee_percentage: precalculatedPrice.service_fee_percentage || 8,
      });
      setLoading(false);
    } else {
      // Otherwise, fetch from API
      calculatePrice();
    }
  }, [precalculatedPrice]);

  // Fetch payment methods
  useEffect(() => {
    fetchPaymentMethods();
  }, [userId]);

  const fetchPaymentMethods = async () => {
    try {
      console.log("💳 Fetching payment methods for user:", userId);
      setPaymentMethodsLoading(true);
      setPaymentMethodsError(null);

      const url = `${apiBaseUrl}/api/payment-methods?userId=${userId}`;
      console.log("📡 Payment methods URL:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      });

      console.log("📥 Payment methods response:", response.status);

      if (!response.ok) {
        throw new Error(`Error al cargar métodos de pago (${response.status})`);
      }

      const data = await response.json();
      const methodsArray = Array.isArray(data)
        ? data
        : data.payment_methods || [];
      console.log(`✅ Loaded ${methodsArray.length} payment methods`);

      setPaymentMethods(methodsArray);

      // Auto-select default payment method
      const defaultMethod = methodsArray.find((pm: any) => pm.is_default);
      if (defaultMethod && !selectedPaymentMethodId) {
        console.log(
          "🎯 Auto-selecting default payment method:",
          defaultMethod.id
        );
        setSelectedPaymentMethodId(defaultMethod.id);
      }
    } catch (err) {
      console.error("❌ Error fetching payment methods:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar métodos de pago";
      setPaymentMethodsError(errorMessage);
    } finally {
      setPaymentMethodsLoading(false);
    }
  };

  const calculatePrice = async () => {
    try {
      console.log("🚀 PaymentProcessingScreen - Starting price calculation");
      console.log("📋 Booking type:", bookingType);
      console.log("🏢 Club:", club);
      console.log("🎾 Court:", court);
      console.log("📅 Booking date:", bookingDate);
      console.log("⏰ Start time:", startTime);
      console.log("⏱️ Duration:", duration);
      console.log("👤 User ID:", userId);

      setLoading(true);
      setError(null);

      let endpoint = "";
      let body: any = {};

      if (
        bookingType === "court" &&
        club &&
        court &&
        bookingDate &&
        startTime &&
        duration
      ) {
        endpoint = `${apiBaseUrl}/api/calculate-price`;
        body = {
          club_id: club.id,
          court_id: court.id,
          booking_date: bookingDate.toISOString().split("T")[0],
          start_time: startTime,
          duration_minutes: duration,
          user_id: userId,
        };
        console.log(
          "✅ Court booking - Request body:",
          JSON.stringify(body, null, 2)
        );
      } else if (
        bookingType === "class" &&
        instructor &&
        classDate &&
        startTime &&
        endTime
      ) {
        endpoint = `${apiBaseUrl}/api/calculate-price`;
        body = {
          club_id: instructor.club_id,
          instructor_id: instructor.id,
          class_date: classDate,
          start_time: startTime,
          end_time: endTime,
          user_id: userId,
          booking_type: "private_class",
        };
        console.log(
          "✅ Class booking - Request body:",
          JSON.stringify(body, null, 2)
        );
      } else if (bookingType === "event" && event) {
        endpoint = `${apiBaseUrl}/api/calculate-price`;
        body = {
          event_id: event.id,
          user_id: userId,
          booking_type: "event",
        };
        console.log(
          "✅ Event booking - Request body:",
          JSON.stringify(body, null, 2)
        );
      } else {
        console.error("❌ Missing required data for price calculation");
        console.error("Missing:", {
          hasClub: !!club,
          hasCourt: !!court,
          hasBookingDate: !!bookingDate,
          hasStartTime: !!startTime,
          hasDuration: !!duration,
          hasInstructor: !!instructor,
          hasEvent: !!event,
        });
        throw new Error("Datos incompletos para calcular el precio");
      }

      console.log("📡 Sending request to:", endpoint);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      console.log("📥 Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Response not OK. Status:", response.status);
        console.error("❌ Error response:", errorText);
        throw new Error(`Error al calcular el precio (${response.status})`);
      }

      const data = await response.json();
      console.log(
        "✅ Price calculation response:",
        JSON.stringify(data, null, 2)
      );
      setPriceCalculation(data);
    } catch (err) {
      console.error("❌ Error in calculatePrice:", err);
      console.error("❌ Error details:", {
        message: err instanceof Error ? err.message : "Unknown error",
        stack: err instanceof Error ? err.stack : undefined,
      });
      setError(
        err instanceof Error ? err.message : "Error al calcular el precio"
      );
      Alert.alert("Error", "No se pudo calcular el precio. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const createPaymentIntent = async (): Promise<{
    paymentIntentId: string;
    clientSecret: string;
  }> => {
    console.log("💳 [CREATE PAYMENT INTENT] Starting...");
    console.log("   Booking type:", bookingType);
    console.log("   User ID:", userId);
    console.log("   Selected payment method:", selectedPaymentMethodId);

    let endpoint = "";
    let body: any = {
      user_id: userId,
      payment_method_id: selectedPaymentMethodId,
    };

    if (
      bookingType === "court" &&
      club &&
      court &&
      bookingDate &&
      startTime &&
      endTime
    ) {
      endpoint = `${apiBaseUrl}/api/payment/create-intent`;

      // Calculate duration in minutes from start and end times
      const calculateDurationMinutes = (start: string, end: string): number => {
        const [startHour, startMin] = start.split(":").map(Number);
        const [endHour, endMin] = end.split(":").map(Number);
        const startTotalMin = startHour * 60 + startMin;
        const endTotalMin = endHour * 60 + endMin;
        return endTotalMin - startTotalMin;
      };

      const durationMinutes =
        duration || calculateDurationMinutes(startTime, endTime);
      const totalPrice = priceCalculation?.total_with_iva || 0;

      body = {
        ...body,
        club_id: club.id,
        court_id: court.id,
        booking_date: bookingDate.toISOString().split("T")[0],
        start_time: startTime,
        end_time: endTime,
        duration_minutes: durationMinutes,
        total_price: totalPrice,
      };
      console.log("   Court booking endpoint:", endpoint);
      console.log("   Request body:", JSON.stringify(body, null, 2));
    } else if (
      bookingType === "class" &&
      instructor &&
      classDate &&
      startTime &&
      endTime &&
      court
    ) {
      endpoint = `${apiBaseUrl}/api/private-classes/payment/create-intent`;

      // Calculate duration in minutes from start and end times
      const calculateDurationMinutes = (start: string, end: string): number => {
        const [startHour, startMin] = start.split(":").map(Number);
        const [endHour, endMin] = end.split(":").map(Number);
        const startTotalMin = startHour * 60 + startMin;
        const endTotalMin = endHour * 60 + endMin;
        return endTotalMin - startTotalMin;
      };

      const durationMinutes =
        duration || calculateDurationMinutes(startTime, endTime);
      const totalPrice = priceCalculation?.total_with_iva || 0;

      body = {
        ...body,
        instructor_id: instructor.id,
        club_id: instructor.club_id,
        court_id: court.id,
        class_date: classDate,
        start_time: startTime,
        end_time: endTime,
        duration_minutes: durationMinutes,
        class_type: classType || "individual",
        number_of_students: numberOfStudents || 1,
        total_price: totalPrice,
        focus_areas: focusAreas,
        student_level: studentLevel,
      };
      console.log("   Class booking endpoint:", endpoint);
      console.log("   Request body:", JSON.stringify(body, null, 2));
    } else if (bookingType === "event" && event) {
      endpoint = `${apiBaseUrl}/api/events/payment/create-intent`;
      const registrationFee =
        priceCalculation?.total_with_iva || event.registration_fee || 0;

      body = {
        ...body,
        event_id: event.id,
        registration_fee: registrationFee,
      };
      console.log("   Event booking endpoint:", endpoint);
      console.log("   Request body:", JSON.stringify(body, null, 2));
    }

    console.log("📡 Sending payment intent request to:", endpoint);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log("📥 Payment intent response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Payment intent failed!");
      console.error("   Status:", response.status);
      console.error("   Response:", errorText);

      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText };
      }

      throw new Error(errorData.error || "Error al crear la intención de pago");
    }

    const data = await response.json();
    console.log("✅ Payment intent created successfully!");
    console.log("   Payment intent ID:", data.paymentIntentId);
    console.log("   Client secret:", data.clientSecret ? "present" : "missing");
    console.log("   Full response:", JSON.stringify(data, null, 2));

    return {
      paymentIntentId: data.paymentIntentId,
      clientSecret: data.clientSecret,
    };
  };

  const confirmPayment = async (paymentIntentId: string) => {
    console.log("✅ [CONFIRM PAYMENT] Starting...");
    console.log("   Payment intent ID:", paymentIntentId);
    console.log("   Booking type:", bookingType);

    let endpoint = "";
    let body: any = {
      payment_intent_id: paymentIntentId,
      user_id: userId,
    };

    if (
      bookingType === "court" &&
      club &&
      court &&
      bookingDate &&
      startTime &&
      endTime
    ) {
      endpoint = `${apiBaseUrl}/api/payment/confirm`;

      // Calculate duration in minutes
      const calculateDurationMinutes = (start: string, end: string): number => {
        const [startHour, startMin] = start.split(":").map(Number);
        const [endHour, endMin] = end.split(":").map(Number);
        const startTotalMin = startHour * 60 + startMin;
        const endTotalMin = endHour * 60 + endMin;
        return endTotalMin - startTotalMin;
      };

      const durationMinutes =
        duration || calculateDurationMinutes(startTime, endTime);
      const totalPrice = priceCalculation?.total_with_iva || 0;

      body = {
        ...body,
        club_id: club.id,
        court_id: court.id,
        booking_date: bookingDate.toISOString().split("T")[0],
        start_time: startTime,
        end_time: endTime,
        duration_minutes: durationMinutes,
        total_price: totalPrice,
      };
    } else if (
      bookingType === "class" &&
      instructor &&
      classDate &&
      startTime &&
      endTime &&
      court
    ) {
      endpoint = `${apiBaseUrl}/api/private-classes/payment/confirm`;

      // Calculate duration in minutes
      const calculateDurationMinutes = (start: string, end: string): number => {
        const [startHour, startMin] = start.split(":").map(Number);
        const [endHour, endMin] = end.split(":").map(Number);
        const startTotalMin = startHour * 60 + startMin;
        const endTotalMin = endHour * 60 + endMin;
        return endTotalMin - startTotalMin;
      };

      const durationMinutes =
        duration || calculateDurationMinutes(startTime, endTime);
      const totalPrice = priceCalculation?.total_with_iva || 0;

      body = {
        ...body,
        instructor_id: instructor.id,
        club_id: instructor.club_id,
        court_id: court.id,
        class_date: classDate,
        start_time: startTime,
        end_time: endTime,
        duration_minutes: durationMinutes,
        class_type: classType || "individual",
        number_of_students: numberOfStudents || 1,
        total_price: totalPrice,
        focus_areas: focusAreas,
        student_level: studentLevel,
      };
    } else if (bookingType === "event" && event) {
      endpoint = `${apiBaseUrl}/api/events/payment/confirm`;
      const registrationFee =
        priceCalculation?.total_with_iva || event.registration_fee || 0;

      body = {
        ...body,
        event_id: event.id,
        registration_fee: registrationFee,
      };
    }

    console.log("📡 Sending confirm payment request to:", endpoint);
    console.log("   Request body:", JSON.stringify(body, null, 2));

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log("📥 Confirm payment response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Payment confirmation failed!");
      console.error("   Status:", response.status);
      console.error("   Response:", errorText);

      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText };
      }

      throw new Error(errorData.error || "Error al confirmar el pago");
    }

    const data = await response.json();
    console.log("✅ Payment confirmed successfully!");
    console.log("   Response:", JSON.stringify(data, null, 2));

    return data;
  };

  const handlePayment = async () => {
    console.log("🎯 [HANDLE PAYMENT] Button clicked!");
    console.log("   Selected payment method ID:", selectedPaymentMethodId);

    if (!selectedPaymentMethodId) {
      console.error("❌ No payment method selected!");
      Alert.alert("Error", "Por favor selecciona un método de pago");
      return;
    }

    try {
      console.log("🚀 Starting payment process...");
      setProcessing(true);
      setError(null);

      // Step 1: Create payment intent
      console.log("📝 Step 1: Creating payment intent...");
      const { paymentIntentId, clientSecret } = await createPaymentIntent();
      console.log("✅ Step 1 complete. Payment intent ID:", paymentIntentId);
      console.log("   Client secret:", clientSecret ? "received" : "missing");

      // Step 2: Confirm payment with Stripe (CLIENT-SIDE)
      console.log("📝 Step 2: Confirming payment with Stripe...");

      if (!clientSecret) {
        throw new Error("Client secret not received from backend");
      }

      const { error: stripeError, paymentIntent } = await confirmStripePayment(
        clientSecret,
        {
          paymentMethodType: "Card",
          paymentMethodData: {
            paymentMethodId: selectedPaymentMethodId,
          },
        }
      );

      if (stripeError) {
        console.error("❌ Stripe confirmation failed!");
        console.error("   Error:", stripeError);
        throw new Error(stripeError.message || "Stripe confirmation failed");
      }

      if (paymentIntent?.status !== "Succeeded") {
        console.error("❌ Payment not succeeded!");
        console.error("   Status:", paymentIntent?.status);
        throw new Error("Payment was not completed successfully");
      }

      console.log("✅ Step 2 complete. Payment confirmed with Stripe!");
      console.log("   Payment Intent Status:", paymentIntent?.status);

      // Step 3: Confirm payment on backend (create booking/class/event)
      console.log("📝 Step 3: Confirming payment with backend...");
      const result = await confirmPayment(paymentIntentId);
      console.log(
        "✅ Step 3 complete. Result:",
        JSON.stringify(result, null, 2)
      );

      // Step 4: Success callback
      console.log("📝 Step 4: Calling success callback...");
      setBookingResult(result);
      setShowSuccessModal(true);
      console.log("🎉 Payment process completed successfully!");
    } catch (err) {
      console.error("❌ Payment process failed!");
      console.error("   Error:", err);
      console.error(
        "   Error message:",
        err instanceof Error ? err.message : "Unknown error"
      );
      console.error(
        "   Error stack:",
        err instanceof Error ? err.stack : "No stack trace"
      );

      const errorMessage =
        err instanceof Error ? err.message : "Error al procesar el pago";
      setError(errorMessage);
      setErrorDetails(errorMessage);
      setShowErrorModal(true);
    } finally {
      console.log("🏁 Payment process finished (success or error)");
      setProcessing(false);
    }
  };

  const handleAddNewCard = () => {
    setShowNewCardModal(true);
  };

  const handleCloseNewCardModal = () => {
    setShowNewCardModal(false);
    setCardComplete(false);
  };

  const handlePayWithNewCard = async () => {
    if (!cardComplete) {
      Alert.alert("Error", "Por favor completa los datos de la tarjeta");
      return;
    }

    try {
      setProcessingNewCard(true);
      console.log("💳 Creating payment method from card field...");

      const { error, paymentMethod } = await createPaymentMethod({
        paymentMethodType: "Card",
      });

      if (error) {
        console.error("❌ Failed to create payment method:", error);
        throw new Error(error.message || "Error al procesar la tarjeta");
      }

      if (!paymentMethod) {
        throw new Error("No se pudo crear el método de pago");
      }

      console.log("✅ Payment method created:", paymentMethod.id);
      console.log(
        "   Full payment method object:",
        JSON.stringify(paymentMethod, null, 2)
      );

      // Add the new payment method to the list so it's visible
      // Handle different possible property names from Stripe SDK
      const card = (paymentMethod as any).card || (paymentMethod as any).Card;
      const newPaymentMethodData = {
        id: paymentMethod.id,
        brand: card?.brand || card?.Brand || "card",
        last4: card?.last4 || card?.Last4 || "****",
        exp_month: card?.expMonth || card?.exp_month || card?.ExpMonth,
        exp_year: card?.expYear || card?.exp_year || card?.ExpYear,
        is_default: false,
      };

      console.log("   Card object:", JSON.stringify(card, null, 2));
      console.log(
        "   New payment method data:",
        JSON.stringify(newPaymentMethodData, null, 2)
      );
      console.log("   Current payment methods count:", paymentMethods.length);

      setPaymentMethods((prev) => {
        const updated = [...prev, newPaymentMethodData];
        console.log("   Updated payment methods count:", updated.length);
        return updated;
      });

      // Set as selected payment method
      setSelectedPaymentMethodId(paymentMethod.id);
      setShowNewCardModal(false);
      setCardComplete(false);

      // Automatically trigger payment
      Alert.alert("Tarjeta Lista", "Ahora puedes proceder con el pago.", [
        { text: "OK" },
      ]);
    } catch (err) {
      console.error("❌ Error processing new card:", err);
      Alert.alert(
        "Error",
        err instanceof Error ? err.message : "Error al procesar la tarjeta"
      );
    } finally {
      setProcessingNewCard(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    onPaymentSuccess(bookingResult);
  };

  const handleErrorClose = () => {
    setShowErrorModal(false);
    setError(null);
    setErrorDetails(null);
  };

  const handleRetryPayment = () => {
    setShowErrorModal(false);
    setError(null);
    setErrorDetails(null);
    // User can try again with the same form
  };

  const formatBookingDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-MX", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8c8a1a" />
          <Text style={styles.loadingText}>Calculando precio...</Text>
        </View>
      </View>
    );
  }

  if (error && !priceCalculation) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color="#ef4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={calculatePrice}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirmar Reserva</Text>
        <View style={styles.closeButton} />
      </View>

      {/* Summary Section */}
      {bookingType === "court" &&
        club &&
        court &&
        bookingDate &&
        startTime &&
        endTime &&
        duration &&
        priceCalculation && (
          <View style={styles.summaryContainer}>
            <BookingSummary
              club={club}
              court={court}
              date={bookingDate}
              startTime={startTime}
              endTime={endTime}
              duration={duration}
              totalPrice={priceCalculation.total_with_iva}
              bookingPrice={priceCalculation.base_price}
              serviceFee={priceCalculation.service_fee}
              userPaysServiceFee={priceCalculation.user_pays_service_fee}
              feeStructure={priceCalculation.fee_structure}
              subtotal={priceCalculation.subtotal}
              iva={priceCalculation.iva}
              totalWithIVA={priceCalculation.total_with_iva}
            />
          </View>
        )}

      {bookingType === "class" &&
        instructor &&
        clubName &&
        clubImage &&
        classType &&
        classDate &&
        startTime &&
        endTime &&
        priceCalculation && (
          <View style={styles.summaryContainer}>
            <ClassRegistrationSummary
              instructor={instructor as any}
              clubName={clubName}
              clubImage={clubImage}
              classType={classType}
              classDate={classDate}
              startTime={startTime}
              endTime={endTime}
              numberOfStudents={numberOfStudents || 1}
              totalPrice={priceCalculation.base_price}
              focusAreas={focusAreas}
              studentLevel={studentLevel}
              feeStructure={priceCalculation.fee_structure as any}
              serviceFeePercentage={club?.service_fee_percentage || 8}
              // Pass price breakdown from backend
              bookingPrice={
                priceCalculation.booking_price || priceCalculation.base_price
              }
              serviceFee={priceCalculation.service_fee}
              userPaysServiceFee={priceCalculation.user_pays_service_fee}
              subtotal={priceCalculation.subtotal}
              iva={priceCalculation.iva}
              totalWithIVA={priceCalculation.total_with_iva}
            />
          </View>
        )}

      {bookingType === "event" &&
        event &&
        eventClubName &&
        eventClubImage &&
        priceCalculation && (
          <View style={styles.summaryContainer}>
            <EventRegistrationSummary
              event={event}
              clubName={eventClubName}
              clubImage={eventClubImage}
              totalPrice={priceCalculation.base_price}
              originalPrice={priceCalculation.original_price}
              discountApplied={priceCalculation.discount_applied}
              feeStructure={priceCalculation.fee_structure as any}
              serviceFeePercentage={club?.service_fee_percentage || 8}
            />
          </View>
        )}

      {/* Payment Method Section */}
      <View style={styles.paymentSection}>
        {(() => {
          console.log(
            "💳 PaymentProcessingScreen - Rendering PaymentMethodSelector"
          );
          console.log("   Passing props:");
          console.log("   - paymentMethods:", paymentMethods.length, "methods");
          console.log("   - loading:", paymentMethodsLoading);
          console.log("   - error:", paymentMethodsError);
          console.log("   - selectedPaymentMethodId:", selectedPaymentMethodId);
          return null;
        })()}
        <PaymentMethodSelector
          paymentMethods={paymentMethods}
          loading={paymentMethodsLoading}
          error={paymentMethodsError}
          onSelectPaymentMethod={setSelectedPaymentMethodId}
          onAddNewCard={handleAddNewCard}
          onRetry={fetchPaymentMethods}
          selectedPaymentMethodId={selectedPaymentMethodId}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        {error && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={20} color="#ef4444" />
            <Text style={styles.errorBannerText}>{error}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.payButton,
            (!selectedPaymentMethodId || processing) &&
              styles.payButtonDisabled,
          ]}
          onPress={handlePayment}
          disabled={!selectedPaymentMethodId || processing}
        >
          {processing ? (
            <>
              <ActivityIndicator size="small" color="#ffffff" />
              <Text style={styles.payButtonText}>Procesando...</Text>
            </>
          ) : (
            <>
              <Ionicons name="card" size={20} color="#ffffff" />
              <Text style={styles.payButtonText}>
                Pagar ${priceCalculation?.total_with_iva.toFixed(2) || "0.00"}{" "}
                MXN
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}
          disabled={processing}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>

      {/* Security Notice */}
      <View style={styles.securityNotice}>
        <Ionicons name="shield-checkmark" size={16} color="#10b981" />
        <Text style={styles.securityNoticeText}>
          Pago seguro procesado con certificación PCI DSS
        </Text>
      </View>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        animationType="fade"
        transparent={true}
        onRequestClose={handleSuccessClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModalContainer}>
            {/* Success Icon */}
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark-circle" size={80} color="#10b981" />
            </View>

            {/* Success Title */}
            <Text style={styles.successTitle}>¡Pago Exitoso!</Text>
            <Text style={styles.successSubtitle}>
              Tu reserva ha sido confirmada
            </Text>

            {/* Booking Details Card */}
            <View style={styles.bookingDetailsCard}>
              {bookingType !== "event" && (
                <>
                  <View style={styles.bookingDetailRow}>
                    <Ionicons
                      name="receipt-outline"
                      size={20}
                      color="#8c8a1a"
                    />
                    <Text style={styles.bookingDetailLabel}>
                      Número de Reserva
                    </Text>
                  </View>
                  <Text style={styles.bookingNumber}>
                    {bookingResult?.data?.bookingNumber || "N/A"}
                  </Text>

                  <View style={styles.divider} />
                </>
              )}

              {bookingType === "court" && bookingDate && (
                <>
                  <View style={styles.detailRow}>
                    <Ionicons
                      name="calendar-outline"
                      size={18}
                      color="#9ca3af"
                    />
                    <Text style={styles.detailText}>
                      {formatBookingDate(bookingDate.toISOString())}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons name="time-outline" size={18} color="#9ca3af" />
                    <Text style={styles.detailText}>
                      {startTime} - {endTime}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons
                      name="location-outline"
                      size={18}
                      color="#9ca3af"
                    />
                    <Text style={styles.detailText}>
                      {club?.name} - {court?.name}
                    </Text>
                  </View>
                </>
              )}

              {bookingType === "class" && classDate && (
                <>
                  <View style={styles.detailRow}>
                    <Ionicons
                      name="calendar-outline"
                      size={18}
                      color="#9ca3af"
                    />
                    <Text style={styles.detailText}>
                      {formatBookingDate(classDate)}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons name="time-outline" size={18} color="#9ca3af" />
                    <Text style={styles.detailText}>
                      {startTime} - {endTime}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons name="person-outline" size={18} color="#9ca3af" />
                    <Text style={styles.detailText}>{instructor?.name}</Text>
                  </View>
                </>
              )}

              {bookingType === "event" && event && (
                <>
                  <View style={styles.detailRow}>
                    <Ionicons name="trophy-outline" size={18} color="#9ca3af" />
                    <Text style={styles.detailText}>{event.title}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons
                      name="calendar-outline"
                      size={18}
                      color="#9ca3af"
                    />
                    <Text style={styles.detailText}>
                      {formatBookingDate(event.event_date)}
                    </Text>
                  </View>

                  {event.start_time && event.end_time && (
                    <View style={styles.detailRow}>
                      <Ionicons name="time-outline" size={18} color="#9ca3af" />
                      <Text style={styles.detailText}>
                        {event.start_time.substring(0, 5)} -{" "}
                        {event.end_time.substring(0, 5)}
                      </Text>
                    </View>
                  )}
                </>
              )}

              <View style={styles.divider} />

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Pagado</Text>
                <Text style={styles.totalAmount}>
                  ${priceCalculation?.total_with_iva.toFixed(2)} MXN
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            {bookingType !== "event" && (
              <TouchableOpacity
                style={styles.successButton}
                onPress={handleSuccessClose}
              >
                <Text style={styles.successButtonText}>
                  {bookingType === "class" ? "Ver Clases" : "Ver Mis Reservas"}
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#ffffff" />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={
                bookingType === "event"
                  ? styles.successButton
                  : styles.successSecondaryButton
              }
              onPress={handleSuccessClose}
            >
              <Text
                style={
                  bookingType === "event"
                    ? styles.successButtonText
                    : styles.successSecondaryButtonText
                }
              >
                Cerrar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Error Modal */}
      <Modal
        visible={showErrorModal}
        animationType="fade"
        transparent={true}
        onRequestClose={handleErrorClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.errorModalContainer}>
            {/* Error Icon */}
            <View style={styles.errorIconContainer}>
              <Ionicons name="close-circle" size={80} color="#ef4444" />
            </View>

            {/* Error Title */}
            <Text style={styles.errorTitle}>Error en el Pago</Text>
            <Text style={styles.errorSubtitle}>
              No pudimos procesar tu pago
            </Text>

            {/* Error Details Card */}
            <View style={styles.errorDetailsCard}>
              <View style={styles.errorDetailRow}>
                <Ionicons
                  name="alert-circle-outline"
                  size={20}
                  color="#ef4444"
                />
                <Text style={styles.errorDetailLabel}>Detalles del Error</Text>
              </View>
              <Text style={styles.errorMessage}>
                {errorDetails || "Ocurrió un error inesperado"}
              </Text>

              <View style={styles.divider} />

              <View style={styles.errorHelpSection}>
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color="#9ca3af"
                />
                <Text style={styles.errorHelpText}>
                  Por favor verifica tu método de pago e intenta nuevamente
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <TouchableOpacity
              style={styles.errorRetryButton}
              onPress={handleRetryPayment}
            >
              <Ionicons name="refresh" size={20} color="#ffffff" />
              <Text style={styles.errorRetryButtonText}>
                Intentar Nuevamente
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.errorSecondaryButton}
              onPress={handleErrorClose}
            >
              <Text style={styles.errorSecondaryButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* New Card Modal */}
      <Modal
        visible={showNewCardModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseNewCardModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.newCardModalContainer}>
            {/* Header */}
            <View style={styles.newCardHeader}>
              <Text style={styles.newCardTitle}>Pagar con Otra Tarjeta</Text>
              <TouchableOpacity onPress={handleCloseNewCardModal}>
                <Ionicons name="close" size={28} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            {/* Security Notice */}
            <View style={styles.securityBadge}>
              <Ionicons name="shield-checkmark" size={20} color="#10b981" />
              <Text style={styles.securityBadgeText}>
                Pago 100% seguro con encriptación SSL
              </Text>
            </View>

            {/* Card Input */}
            <View style={styles.cardFieldContainer}>
              <CardField
                postalCodeEnabled={false}
                placeholders={{
                  number: "4242 4242 4242 4242",
                }}
                cardStyle={{
                  backgroundColor: "#111827",
                  textColor: "#ffffff",
                  placeholderColor: "#6b7280",
                  borderWidth: 1,
                  borderColor: "#374151",
                  borderRadius: 8,
                }}
                style={styles.cardField}
                onCardChange={(cardDetails) => {
                  console.log("Card details changed:", cardDetails);
                  setCardComplete(cardDetails.complete);
                }}
              />
            </View>

            {/* Info Text */}
            <View style={styles.cardInfoSection}>
              <Ionicons
                name="information-circle-outline"
                size={18}
                color="#3b82f6"
              />
              <Text style={styles.cardInfoText}>
                Esta tarjeta se usará solo para este pago. Para guardar
                tarjetas, ve a tu perfil.
              </Text>
            </View>

            {/* Accepted Cards */}
            <View style={styles.acceptedCardsContainer}>
              <Text style={styles.acceptedCardsLabel}>Aceptamos</Text>
              <View style={styles.cardBrands}>
                <View
                  style={[
                    styles.cardBrandBadge,
                    { backgroundColor: "#1434CB" },
                  ]}
                >
                  <FontAwesome name="cc-visa" size={28} color="#ffffff" />
                </View>
                <View
                  style={[
                    styles.cardBrandBadge,
                    { backgroundColor: "#EB001B" },
                  ]}
                >
                  <FontAwesome name="cc-mastercard" size={28} color="#ffffff" />
                </View>
                <View
                  style={[
                    styles.cardBrandBadge,
                    { backgroundColor: "#006FCF" },
                  ]}
                >
                  <FontAwesome name="cc-amex" size={28} color="#ffffff" />
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <TouchableOpacity
              style={[
                styles.newCardConfirmButton,
                (!cardComplete || processingNewCard) &&
                  styles.newCardConfirmButtonDisabled,
              ]}
              onPress={handlePayWithNewCard}
              disabled={!cardComplete || processingNewCard}
            >
              {processingNewCard ? (
                <>
                  <ActivityIndicator size="small" color="#ffffff" />
                  <Text style={styles.newCardConfirmButtonText}>
                    Procesando...
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons name="card-outline" size={20} color="#ffffff" />
                  <Text style={styles.newCardConfirmButtonText}>
                    Usar Esta Tarjeta
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.newCardCancelButton}
              onPress={handleCloseNewCardModal}
              disabled={processingNewCard}
            >
              <Text style={styles.newCardCancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 60,
    backgroundColor: "#1f2937",
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  summaryContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
  },
  loadingText: {
    color: "#d1d5db",
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  errorText: {
    color: "#ef4444",
    marginTop: 16,
    fontSize: 16,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#8c8a1a",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  retryButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
  paymentSection: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  actionsContainer: {
    padding: 16,
    gap: 12,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ef4444",
  },
  errorBannerText: {
    flex: 1,
    color: "#ef4444",
    fontSize: 14,
  },
  payButton: {
    flexDirection: "row",
    backgroundColor: "#8c8a1a",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  payButtonDisabled: {
    backgroundColor: "#4b5563",
    opacity: 0.5,
  },
  payButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 18,
  },
  cancelButton: {
    backgroundColor: "transparent",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4b5563",
  },
  cancelButtonText: {
    color: "#9ca3af",
    fontWeight: "600",
    fontSize: 16,
  },
  securityNotice: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
  },
  securityNoticeText: {
    color: "#10b981",
    fontSize: 12,
  },
  // Success Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  successModalContainer: {
    backgroundColor: "#1f2937",
    borderRadius: 20,
    padding: 32,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#374151",
  },
  successIconContainer: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#10b981",
    marginBottom: 8,
    textAlign: "center",
  },
  successSubtitle: {
    fontSize: 16,
    color: "#9ca3af",
    marginBottom: 24,
    textAlign: "center",
  },
  bookingDetailsCard: {
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#374151",
  },
  bookingDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  bookingDetailLabel: {
    fontSize: 14,
    color: "#9ca3af",
    fontWeight: "500",
  },
  bookingNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8c8a1a",
    marginBottom: 16,
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#374151",
    marginVertical: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: "#d1d5db",
    flex: 1,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#d1d5db",
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#10b981",
  },
  successButton: {
    flexDirection: "row",
    backgroundColor: "#8c8a1a",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    marginBottom: 12,
  },
  successButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  successSecondaryButton: {
    backgroundColor: "transparent",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#4b5563",
  },
  successSecondaryButtonText: {
    color: "#9ca3af",
    fontWeight: "600",
    fontSize: 14,
  },
  // Error Modal Styles
  errorModalContainer: {
    backgroundColor: "#1f2937",
    borderRadius: 20,
    padding: 32,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#374151",
  },
  errorIconContainer: {
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ef4444",
    marginBottom: 8,
    textAlign: "center",
  },
  errorSubtitle: {
    fontSize: 16,
    color: "#9ca3af",
    marginBottom: 24,
    textAlign: "center",
  },
  errorDetailsCard: {
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#374151",
  },
  errorDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  errorDetailLabel: {
    fontSize: 14,
    color: "#9ca3af",
    fontWeight: "500",
  },
  errorMessage: {
    fontSize: 15,
    color: "#ef4444",
    lineHeight: 22,
    marginBottom: 16,
  },
  errorHelpSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  errorHelpText: {
    fontSize: 13,
    color: "#9ca3af",
    lineHeight: 20,
    flex: 1,
  },
  errorRetryButton: {
    flexDirection: "row",
    backgroundColor: "#8c8a1a",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    marginBottom: 12,
  },
  errorRetryButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  errorSecondaryButton: {
    backgroundColor: "transparent",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#4b5563",
  },
  errorSecondaryButtonText: {
    color: "#9ca3af",
    fontWeight: "600",
    fontSize: 14,
  },
  // New Card Modal Styles
  newCardModalContainer: {
    backgroundColor: "#1f2937",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    width: "100%",
    maxHeight: "80%",
    borderWidth: 1,
    borderColor: "#374151",
    marginTop: "auto",
  },
  newCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  newCardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
  },
  securityBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)",
  },
  securityBadgeText: {
    fontSize: 14,
    color: "#10b981",
    fontWeight: "600",
  },
  cardFieldContainer: {
    marginBottom: 16,
  },
  cardField: {
    width: "100%",
    height: 50,
    marginVertical: 8,
  },
  securityInfoSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(16, 185, 129, 0.05)",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  securityInfoText: {
    fontSize: 12,
    color: "#6ee7b7",
    flex: 1,
    lineHeight: 16,
  },
  cardInfoSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  cardInfoText: {
    fontSize: 13,
    color: "#3b82f6",
    flex: 1,
  },
  acceptedCardsContainer: {
    marginTop: 4,
    marginBottom: 20,
    paddingVertical: 12,
    alignItems: "center",
  },
  acceptedCardsLabel: {
    fontSize: 11,
    color: "#9ca3af",
    marginBottom: 8,
    fontWeight: "500",
  },
  cardBrands: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  cardBrandBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  newCardConfirmButton: {
    flexDirection: "row",
    backgroundColor: "#8c8a1a",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 12,
  },
  newCardConfirmButtonDisabled: {
    backgroundColor: "#4b5563",
    opacity: 0.5,
  },
  newCardConfirmButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  newCardCancelButton: {
    backgroundColor: "transparent",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4b5563",
  },
  newCardCancelButtonText: {
    color: "#9ca3af",
    fontWeight: "600",
    fontSize: 14,
  },
});
