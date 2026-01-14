import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
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

type BookingType = "court" | "class" | "event";

interface BookingReviewScreenProps {
  bookingType: BookingType;
  userId: number;
  apiBaseUrl: string;
  priceCalculation: any;

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

  // Callbacks
  onConfirm: (paymentMethodId: string) => void;
  onCancel: () => void;
}

export default function BookingReviewScreen({
  bookingType,
  userId,
  apiBaseUrl,
  priceCalculation,
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
  onConfirm,
  onCancel,
}: BookingReviewScreenProps) {
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<
    string | null
  >(null);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [paymentMethodsLoading, setPaymentMethodsLoading] = useState(true);
  const [paymentMethodsError, setPaymentMethodsError] = useState<string | null>(
    null
  );

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

  const handleAddNewCard = () => {
    Alert.alert(
      "Agregar Tarjeta",
      "La funcionalidad para agregar una nueva tarjeta se implementará próximamente.",
      [{ text: "OK" }]
    );
  };

  const handleConfirm = () => {
    if (!selectedPaymentMethodId) {
      Alert.alert(
        "Método de pago requerido",
        "Por favor selecciona un método de pago para continuar."
      );
      return;
    }
    onConfirm(selectedPaymentMethodId);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onCancel}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Revisar Reserva</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* Summary Section */}
        {bookingType === "court" &&
          club &&
          court &&
          bookingDate &&
          startTime &&
          endTime &&
          duration &&
          priceCalculation && (
            <BookingSummary
              club={club}
              court={court}
              date={bookingDate}
              startTime={startTime}
              endTime={endTime}
              duration={duration}
              totalPrice={priceCalculation.total_with_iva}
              bookingPrice={priceCalculation.booking_price}
              serviceFee={priceCalculation.service_fee}
              userPaysServiceFee={priceCalculation.user_pays_service_fee}
              feeStructure={priceCalculation.fee_structure}
              subtotal={priceCalculation.subtotal}
              iva={priceCalculation.iva}
              totalWithIVA={priceCalculation.total_with_iva}
            />
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
            <ClassRegistrationSummary
              instructor={instructor as any}
              clubName={clubName}
              clubImage={clubImage}
              classType={classType}
              classDate={classDate}
              startTime={startTime}
              endTime={endTime}
              numberOfStudents={numberOfStudents || 1}
              totalPrice={priceCalculation.booking_price}
              focusAreas={focusAreas}
              studentLevel={studentLevel}
              feeStructure={priceCalculation.fee_structure as any}
              serviceFeePercentage={club?.service_fee_percentage || 8}
            />
          )}

        {bookingType === "event" &&
          event &&
          eventClubName &&
          eventClubImage &&
          priceCalculation && (
            <EventRegistrationSummary
              event={event}
              clubName={eventClubName}
              clubImage={eventClubImage}
              totalPrice={priceCalculation.booking_price}
              originalPrice={priceCalculation.original_price}
              discountApplied={priceCalculation.discount_applied}
              feeStructure={priceCalculation.fee_structure as any}
              serviceFeePercentage={club?.service_fee_percentage || 8}
            />
          )}

        {/* Payment Method Section */}
        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Método de Pago</Text>
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

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <Ionicons name="shield-checkmark" size={16} color="#10b981" />
          <Text style={styles.securityNoticeText}>
            Pago seguro procesado por Stripe
          </Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            !selectedPaymentMethodId && styles.confirmButtonDisabled,
          ]}
          onPress={handleConfirm}
          disabled={!selectedPaymentMethodId}
        >
          <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
          <Text style={styles.confirmButtonText}>
            Confirmar y Pagar $
            {priceCalculation?.total_with_iva?.toFixed(2) || "0.00"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#1f2937",
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  backButton: {
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
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  paymentSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
  },
  securityNotice: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 16,
    gap: 8,
  },
  securityNoticeText: {
    fontSize: 12,
    color: "#9ca3af",
  },
  actionsContainer: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: "#1f2937",
    borderTopWidth: 1,
    borderTopColor: "#374151",
    gap: 12,
  },
  confirmButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e1dd2a",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  confirmButtonDisabled: {
    backgroundColor: "#374151",
    opacity: 0.5,
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  cancelButton: {
    alignItems: "center",
    paddingVertical: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#9ca3af",
  },
});
