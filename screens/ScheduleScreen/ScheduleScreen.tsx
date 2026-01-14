import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Modal,
} from "react-native";
import {
  NavigationProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/AppNavigator/AppNavigator";
import { AppDispatch } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import CalendarSelector from "./CalendarSelector/CalendarSelector";
import CourtTimeSlotSelector from "./CourtTimeSlotSelector/CourtTimeSlotSelector";
import PaymentProcessingScreen from "./PaymentProcessingScreen/PaymentProcessingScreen";
import { styles } from "./ScheduleScreen.styles";
import {
  getAvailability,
  getUserSubscription,
  getInstructorsAvailability,
  calculatePrice as calculatePriceAction,
  type Court,
  type Instructor,
} from "../../store/effects";
import { selectUserInfo } from "../../store/selectors";

// API Base URL configuration
const API_BASE_URL = __DEV__
  ? "http://localhost:8080"
  : "https://intelipadel.com";

const ScheduleScreen: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<any>();
  const userInfo = useSelector(selectUserInfo);

  // Get bookingType from route params (default to 'court' for backward compatibility)
  const bookingType = route.params?.bookingType || "court";
  const isClassBooking = bookingType === "class";

  const [userId, setUserId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [availability, setAvailability] = useState<any>(null);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [userSubscription, setUserSubscription] = useState<any>(null);
  const [duration] = useState<number>(90); // 90 minutes default
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loadingInstructors, setLoadingInstructors] = useState(false);
  const [selectedInstructor, setSelectedInstructor] =
    useState<Instructor | null>(null);
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [originalPrice, setOriginalPrice] = useState<number | null>(null);
  const [subscriptionDiscount, setSubscriptionDiscount] = useState<number>(0);
  const [hasDiscount, setHasDiscount] = useState<boolean>(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [priceCalculationData, setPriceCalculationData] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  useEffect(() => {
    loadUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      loadUserSubscription();
    }
  }, [userId]);

  const loadUserId = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("id_platforms_user");
      if (storedUserId) {
        setUserId(Number(storedUserId));
      }
    } catch (error) {
      console.error("Failed to load user ID", error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserSubscription = async () => {
    if (!userId) return;
    try {
      const subscription = await dispatch(getUserSubscription(userId));
      console.log(
        "📋 Raw subscription data:",
        JSON.stringify(subscription, null, 2)
      );

      // Flatten nested subscription structure for easier access
      let flattenedSubscription: any = subscription;

      if (subscription && typeof subscription === "object") {
        const subObj = subscription as any;
        // Check if subscription data is nested under subscription.subscription
        if (subObj.subscription && typeof subObj.subscription === "object") {
          const nestedSub = subObj.subscription;
          flattenedSubscription = {
            ...subObj,
            // Extract discount properties from nested structure
            booking_discount_percent:
              nestedSub.booking_discount_percent ||
              subObj.booking_discount_percent,
            class_discount_percent:
              nestedSub.class_discount_percent || subObj.class_discount_percent,
            event_discount_percent:
              nestedSub.event_discount_percent || subObj.event_discount_percent,
            bar_discount_percent:
              nestedSub.bar_discount_percent || subObj.bar_discount_percent,
          };
          console.log("✅ Flattened subscription with discounts:", {
            booking_discount: flattenedSubscription.booking_discount_percent,
            class_discount: flattenedSubscription.class_discount_percent,
            event_discount: flattenedSubscription.event_discount_percent,
            bar_discount: flattenedSubscription.bar_discount_percent,
          });
        }
      }

      setUserSubscription(flattenedSubscription);
      console.log("🎯 Setting userSubscription state with:", {
        event_discount: flattenedSubscription?.event_discount_percent,
        booking_discount: flattenedSubscription?.booking_discount_percent,
        class_discount: flattenedSubscription?.class_discount_percent,
      });
    } catch (error) {
      console.error("Failed to load user subscription", error);
    }
  };

  const fetchAvailability = async (date: Date) => {
    setLoadingAvailability(true);
    setLoadingInstructors(true);
    try {
      const clubId = 1; // Default club ID
      const dateStr = date.toISOString().split("T")[0];

      // Fetch both availability and instructors in parallel
      const [availabilityData, instructorsData] = await Promise.all([
        dispatch(getAvailability(clubId, dateStr, duration)),
        dispatch(getInstructorsAvailability(clubId, dateStr)),
      ]);

      setAvailability(availabilityData);
      setInstructors(instructorsData);

      // Log events data for debugging
      if (availabilityData?.events && Array.isArray(availabilityData.events)) {
        console.log("📅 Events found for date:", {
          count: availabilityData.events.length,
          events: availabilityData.events.map((e: any) => ({
            title: e.title,
            registration_fee: e.registration_fee,
          })),
        });
      }
    } catch (error) {
      console.error("Failed to fetch availability", error);
    } finally {
      setLoadingAvailability(false);
      setLoadingInstructors(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (selectedDate) {
      await fetchAvailability(selectedDate);
    }
    setRefreshing(false);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime("");
    setSelectedCourt(null);
    setSelectedInstructor(null); // Reset instructor when date changes
    setCalculatedPrice(null); // Reset calculated price
    setOriginalPrice(null);
    setSubscriptionDiscount(0);
    setHasDiscount(false);
    fetchAvailability(date);
  };

  const handleTimeSlotSelect = async (court: Court, time: string) => {
    setSelectedCourt(court);
    setSelectedTime(time);

    // Calculate price immediately when court and time are selected
    await calculatePrice(court, time, selectedDate);
  };

  const calculatePrice = async (court: Court, time: string, date: Date) => {
    const clubId = 1; // Default club ID
    setIsCalculating(true);

    try {
      const dateStr = date.toISOString().split("T")[0];

      console.log("📤 Calculating price via store:", {
        club_id: clubId,
        court_id: court.id,
        date: dateStr,
        start_time: time,
        duration_minutes: duration,
        user_id: userId,
      });

      const result = await dispatch(
        calculatePriceAction(
          clubId,
          court.id,
          dateStr,
          time,
          duration,
          userId || 0
        )
      );

      console.log("💰 Price response:", result);

      if (result?.success) {
        const totalPrice =
          result.data?.total_with_iva || result.data?.total_price;
        const bookingPrice = result.data?.booking_price;
        const discount = result.data?.subscription_discount || 0;
        const hasSubscriptionDiscount = result.data?.has_discount || false;

        if (totalPrice !== undefined && totalPrice !== null) {
          setCalculatedPrice(totalPrice);
          // Store full price calculation data for PaymentProcessingScreen
          setPriceCalculationData(result.data);

          // Calculate original price before discount
          if (hasSubscriptionDiscount && bookingPrice && discount > 0) {
            // Original price = booking price + (booking price without discount)
            const originalBookingPrice = bookingPrice / (1 - discount / 100);
            // Add IVA to original price
            const originalWithIVA = originalBookingPrice * 1.16;
            setOriginalPrice(originalWithIVA);
            setSubscriptionDiscount(discount);
            setHasDiscount(true);
          } else {
            setOriginalPrice(null);
            setSubscriptionDiscount(0);
            setHasDiscount(false);
          }

          console.log("✅ Price set:", totalPrice);
          if (hasSubscriptionDiscount) {
            console.log(`🎉 Subscription discount applied: ${discount}%`);
          }
        } else {
          throw new Error("No price returned from API");
        }
      } else {
        throw new Error(result?.message || "Failed to calculate price");
      }
    } catch (error) {
      console.error("❌ Failed to calculate price:", error);
      console.error(
        "Error details:",
        error instanceof Error ? error.message : String(error)
      );
      // Fallback to base price
      setCalculatedPrice(200);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleInstructorSelect = (instructor: Instructor | null) => {
    setSelectedInstructor(instructor);
    setSelectedTime("");
    setSelectedCourt(null);
    setCalculatedPrice(null); // Reset calculated price
    setOriginalPrice(null);
    setSubscriptionDiscount(0);
    setHasDiscount(false);
  };

  const handleClassSelect = async (
    instructor: Instructor,
    time: string,
    court: Court
  ) => {
    setSelectedInstructor(instructor);
    setSelectedTime(time);
    setSelectedCourt(court);

    // Calculate price for private class based on instructor hourly rate
    await calculateClassPrice(instructor, time, selectedDate);
  };

  const calculateClassPrice = async (
    instructor: Instructor,
    time: string,
    date: Date
  ) => {
    setIsCalculating(true);

    try {
      // Calculate price based on instructor hourly rate and duration
      const durationHours = duration / 60;
      let basePrice = instructor.hourly_rate * durationHours;

      console.log("📤 Calculating class price:", {
        instructor: instructor.name,
        hourly_rate: instructor.hourly_rate,
        duration_minutes: duration,
        duration_hours: durationHours,
        base_price: basePrice,
      });

      // Apply subscription discount if user has one
      let subscriptionDiscount = 0;
      let hasSubscriptionDiscount = false;

      if (userId) {
        const subscription = await dispatch(getUserSubscription(userId));
        console.log("📋 Subscription data:", subscription);

        // Handle both direct property and nested subscription property
        const classDiscountPercent =
          (subscription as any)?.class_discount_percent ||
          subscription?.subscription?.class_discount_percent;

        if (classDiscountPercent) {
          subscriptionDiscount = Number(classDiscountPercent);
          hasSubscriptionDiscount = true;
          const discountAmount = basePrice * (subscriptionDiscount / 100);
          basePrice = basePrice - discountAmount;
          console.log(
            `🎉 Class discount applied: ${subscriptionDiscount}% = -$${discountAmount.toFixed(
              2
            )}`
          );
        } else {
          console.log("ℹ️ No class discount available for this user");
        }
      }

      // Add IVA (16% Mexican tax)
      const IVA_RATE = 0.16;
      const SERVICE_FEE_RATE = 0.08; // 8% service fee

      // Calculate service fee and subtotal
      const serviceFee = basePrice * SERVICE_FEE_RATE;
      const subtotal = basePrice + serviceFee;

      // Calculate IVA on subtotal (base + service fee)
      const iva = subtotal * IVA_RATE;
      const totalWithIVA = subtotal + iva;

      setCalculatedPrice(totalWithIVA);

      // Store price calculation data for payment screen
      setPriceCalculationData({
        booking_price: basePrice,
        service_fee: serviceFee,
        user_pays_service_fee: serviceFee,
        subtotal: subtotal,
        iva: iva,
        total_with_iva: totalWithIVA,
        instructor_hourly_rate: instructor.hourly_rate,
        duration_hours: durationHours,
        has_discount: hasSubscriptionDiscount,
        subscription_discount: subscriptionDiscount,
        fee_structure: "user_pays_fee",
      });

      if (hasSubscriptionDiscount) {
        const originalWithIVA =
          instructor.hourly_rate * durationHours * (1 + IVA_RATE);
        setOriginalPrice(originalWithIVA);
        setSubscriptionDiscount(subscriptionDiscount);
        setHasDiscount(true);
        console.log("💰 Discount UI data set:", {
          originalPrice: originalWithIVA,
          discountedPrice: totalWithIVA,
          discountPercent: subscriptionDiscount,
        });
      } else {
        setOriginalPrice(null);
        setSubscriptionDiscount(0);
        setHasDiscount(false);
      }

      console.log("✅ Class price calculated:", {
        base: basePrice,
        iva: iva,
        total: totalWithIVA,
        has_discount: hasSubscriptionDiscount,
      });
    } catch (error) {
      console.error("❌ Failed to calculate class price:", error);
      // Fallback to instructor hourly rate
      const fallbackPrice = instructor.hourly_rate * (duration / 60) * 1.16;
      setCalculatedPrice(fallbackPrice);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleEventSelect = async (event: any) => {
    setSelectedEvent(event);
    setIsCalculating(true);

    try {
      // Get event base price
      let basePrice = Number(event.registration_fee) || 0;
      const originalEventPrice = basePrice;

      console.log("📤 Calculating event price:", {
        event: event.title,
        registration_fee: event.registration_fee,
        base_price: basePrice,
      });

      // Apply subscription discount if user has one
      let subscriptionDiscount = 0;
      let hasSubscriptionDiscount = false;

      if (userId) {
        const subscription = await dispatch(getUserSubscription(userId));
        console.log(
          "📋 Full subscription response for event:",
          JSON.stringify(subscription, null, 2)
        );

        // Try multiple paths to access event_discount_percent with type safety
        let eventDiscountPercent: string | number | undefined;

        if (subscription && typeof subscription === "object") {
          // Check direct property
          eventDiscountPercent = (subscription as any).event_discount_percent;

          // If not found, check nested subscription property
          if (!eventDiscountPercent && (subscription as any).subscription) {
            eventDiscountPercent = (subscription as any).subscription
              .event_discount_percent;
          }
        }

        console.log("🔍 Event discount search:", {
          direct: (subscription as any)?.event_discount_percent,
          nested: (subscription as any)?.subscription?.event_discount_percent,
          found: eventDiscountPercent,
          type: typeof eventDiscountPercent,
        });

        if (eventDiscountPercent) {
          const discountValue = Number(eventDiscountPercent);
          if (!isNaN(discountValue) && discountValue > 0) {
            subscriptionDiscount = discountValue;
            hasSubscriptionDiscount = true;
            const discountAmount = basePrice * (subscriptionDiscount / 100);
            basePrice = basePrice - discountAmount;
            console.log(
              `🎉 Event discount applied: ${subscriptionDiscount}% = -$${discountAmount.toFixed(
                2
              )}`
            );
          } else {
            console.log("⚠️ Event discount is 0% or invalid");
          }
        } else {
          console.log("❌ No event_discount_percent found in subscription");
        }
      }

      // Add IVA (16% Mexican tax)
      const IVA_RATE = 0.16;
      const SERVICE_FEE_RATE = 0.08; // 8% service fee

      // Calculate service fee and subtotal
      const serviceFee = basePrice * SERVICE_FEE_RATE;
      const subtotal = basePrice + serviceFee;

      // Calculate IVA on subtotal (base + service fee)
      const iva = subtotal * IVA_RATE;
      const totalWithIVA = subtotal + iva;

      setCalculatedPrice(totalWithIVA);

      // Store price calculation data for payment screen
      setPriceCalculationData({
        booking_price: basePrice,
        service_fee: serviceFee,
        user_pays_service_fee: serviceFee,
        subtotal: subtotal,
        iva: iva,
        total_with_iva: totalWithIVA,
        original_price: originalEventPrice,
        has_discount: hasSubscriptionDiscount,
        subscription_discount: subscriptionDiscount,
        discount_applied: hasSubscriptionDiscount,
        fee_structure: "user_pays_fee",
      });

      if (hasSubscriptionDiscount) {
        const originalWithIVA = originalEventPrice * (1 + IVA_RATE);
        setOriginalPrice(originalWithIVA);
        setSubscriptionDiscount(subscriptionDiscount);
        setHasDiscount(true);
        console.log("💰 Event discount UI data set:", {
          originalPrice: originalWithIVA,
          discountedPrice: totalWithIVA,
          discountPercent: subscriptionDiscount,
        });
      } else {
        setOriginalPrice(null);
        setSubscriptionDiscount(0);
        setHasDiscount(false);
      }

      console.log("✅ Event price calculated:", {
        base: basePrice,
        iva: iva,
        total: totalWithIVA,
        has_discount: hasSubscriptionDiscount,
      });

      // Show payment modal
      setShowPaymentModal(true);
    } catch (error) {
      console.error("❌ Failed to calculate event price:", error);
      // Fallback to event registration fee
      const fallbackPrice = Number(event.registration_fee) * 1.16;
      setCalculatedPrice(fallbackPrice);
      setShowPaymentModal(true);
    } finally {
      setIsCalculating(false);
    }
  };

  const handlePrivateClassSelect = (privateClass: any) => {
    // TODO: Navigate to private class booking/confirmation screen
    console.log("Selected private class:", privateClass);
  };

  const handleContinueToPayment = () => {
    console.log("Continue to payment:", {
      court: selectedCourt,
      time: selectedTime,
      date: selectedDate,
      price: calculatedPrice,
      instructor: selectedInstructor,
      originalPrice,
      discount: subscriptionDiscount,
      hasDiscount,
    });
    setShowPaymentModal(true);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e1dd2a" />
          <Text style={styles.loadingText}>Cargando calendario...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {isClassBooking ? "Buscar clase" : "Reservar Cancha"}
          </Text>
        </View>

        {/* Calendar Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selecciona una Fecha</Text>
          <CalendarSelector
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            onPreviousMonth={goToPreviousMonth}
            onNextMonth={goToNextMonth}
          />
        </View>

        {/* Class Booking Info Banner - only show when looking for classes */}
        {isClassBooking && (
          <View
            style={[
              styles.section,
              {
                backgroundColor: "#fef3c7",
                borderRadius: 12,
                padding: 16,
                marginHorizontal: 16,
                marginBottom: 8,
              },
            ]}
          >
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
              <Ionicons
                name="information-circle"
                size={24}
                color="#f59e0b"
                style={{ marginRight: 12, marginTop: 2 }}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#92400e",
                    marginBottom: 4,
                  }}
                >
                  Clases Disponibles
                </Text>
                <Text
                  style={{ fontSize: 14, color: "#78350f", lineHeight: 20 }}
                >
                  Consulta las noticias del club para conocer los horarios en
                  que los instructores ofrecen clases y podrás reservar tu clase
                  aquí.
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Event Info Banner - only show for court bookings */}
        {!isClassBooking && (
          <View
            style={[
              styles.section,
              {
                backgroundColor: "#ffffff",
                borderRadius: 12,
                padding: 16,
                marginHorizontal: 16,
                marginBottom: 8,
              },
            ]}
          >
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
              <Ionicons
                name="trophy"
                size={24}
                color="#000000"
                style={{ marginRight: 12, marginTop: 2 }}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#000000",
                    marginBottom: 4,
                  }}
                >
                  Eventos del Club
                </Text>
                <Text
                  style={{ fontSize: 14, color: "#000000", lineHeight: 20 }}
                >
                  Si el club anuncia algún evento para la fecha seleccionada,
                  aparecerá aquí para que puedas inscribirte.
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Time Slots Section */}
        <View style={styles.section}>
          {isClassBooking ? (
            // When looking for classes, only show instructor availability
            loadingInstructors ? (
              <View style={{ padding: 32, alignItems: "center" }}>
                <ActivityIndicator size="large" color="#e1dd2a" />
                <Text style={{ marginTop: 16, color: "#6b7280", fontSize: 16 }}>
                  Buscando clases...
                </Text>
              </View>
            ) : instructors && instructors.length > 0 ? (
              <CourtTimeSlotSelector
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                selectedCourt={selectedCourt}
                availability={availability}
                loading={loadingAvailability}
                duration={duration}
                onSelectTimeSlot={handleTimeSlotSelect}
                onEventSelect={handleEventSelect}
                onPrivateClassSelect={handlePrivateClassSelect}
                userSubscription={userSubscription}
                instructors={instructors}
                loadingInstructors={loadingInstructors}
                selectedInstructor={selectedInstructor}
                onInstructorSelect={handleInstructorSelect}
                onClassSelect={handleClassSelect}
                calculatedPrice={calculatedPrice}
                originalPrice={originalPrice}
                subscriptionDiscount={subscriptionDiscount}
                hasDiscount={hasDiscount}
                onContinueToPayment={handleContinueToPayment}
                hideCourtBookings={true}
              />
            ) : (
              <View style={{ padding: 32, alignItems: "center" }}>
                <Ionicons name="calendar-outline" size={64} color="#d1d5db" />
                <Text
                  style={{
                    marginTop: 16,
                    fontSize: 18,
                    fontWeight: "600",
                    color: "#374151",
                    textAlign: "center",
                  }}
                >
                  No hay clases disponibles
                </Text>
                <Text
                  style={{
                    marginTop: 8,
                    fontSize: 14,
                    color: "#6b7280",
                    textAlign: "center",
                    paddingHorizontal: 32,
                  }}
                >
                  No se encontraron clases con instructores para el día
                  seleccionado. Intenta con otra fecha o consulta las noticias
                  del club.
                </Text>
              </View>
            )
          ) : (
            // Normal court booking view
            <CourtTimeSlotSelector
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              selectedCourt={selectedCourt}
              availability={availability}
              loading={loadingAvailability}
              duration={duration}
              onSelectTimeSlot={handleTimeSlotSelect}
              onEventSelect={handleEventSelect}
              onPrivateClassSelect={handlePrivateClassSelect}
              userSubscription={(() => {
                console.log(
                  "📤 Passing userSubscription to CourtTimeSlotSelector:",
                  {
                    hasSubscription: !!userSubscription,
                    event_discount: userSubscription?.event_discount_percent,
                    booking_discount:
                      userSubscription?.booking_discount_percent,
                    class_discount: userSubscription?.class_discount_percent,
                    full: userSubscription,
                  }
                );
                return userSubscription;
              })()}
              instructors={instructors}
              loadingInstructors={loadingInstructors}
              selectedInstructor={selectedInstructor}
              onInstructorSelect={handleInstructorSelect}
              onClassSelect={handleClassSelect}
              calculatedPrice={calculatedPrice}
              originalPrice={originalPrice}
              subscriptionDiscount={subscriptionDiscount}
              hasDiscount={hasDiscount}
              onContinueToPayment={handleContinueToPayment}
              hideCourtBookings={false}
            />
          )}
        </View>
      </ScrollView>

      {/* Payment Processing Modal */}
      <Modal
        visible={showPaymentModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        {userId && calculatedPrice && (selectedCourt || selectedEvent) && (
          <PaymentProcessingScreen
            bookingType={
              selectedInstructor ? "class" : selectedEvent ? "event" : "court"
            }
            userId={userId}
            apiBaseUrl={API_BASE_URL}
            club={{
              id: 1,
              name: "Club Padel",
              image_url: "",
              city: "Mexico City",
              fee_structure: "user_pays_fee",
              service_fee_percentage: 8,
            }}
            court={selectedCourt || undefined}
            bookingDate={selectedDate}
            startTime={selectedTime}
            endTime={calculateEndTime(selectedTime, duration)}
            duration={duration}
            instructor={selectedInstructor || undefined}
            clubName="Club Padel"
            clubImage="https://via.placeholder.com/150"
            classType="individual"
            classDate={selectedDate.toISOString().split("T")[0]}
            event={selectedEvent || undefined}
            eventClubName={selectedEvent ? "Club Padel" : undefined}
            eventClubImage={
              selectedEvent ? "https://via.placeholder.com/150" : undefined
            }
            priceCalculation={priceCalculationData}
            onCancel={() => {
              setShowPaymentModal(false);
            }}
            onPaymentSuccess={() => {
              setShowPaymentModal(false);
              // Reset booking state after payment
              setSelectedTime("");
              setSelectedCourt(null);
              setSelectedInstructor(null);
              setSelectedEvent(null);
              setCalculatedPrice(null);
              setOriginalPrice(null);
              setSubscriptionDiscount(0);
              setHasDiscount(false);
              setPriceCalculationData(null);
              // Navigate to appropriate screen based on booking type
              if (selectedInstructor) {
                navigation.navigate("Clases");
              } else if (selectedEvent) {
                navigation.navigate("Home" as any);
              } else {
                navigation.navigate("Reservations");
              }
            }}
          />
        )}
      </Modal>
    </View>
  );
};

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

export default ScheduleScreen;
