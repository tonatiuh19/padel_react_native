import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { styles } from "./ReservationsScreen.style.new";
import { AppDispatch } from "../../store";
import { useDispatch } from "react-redux";
import {
  getUserBookings,
  getUserEventRegistrations,
  Booking,
} from "../../store/effects";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  NavigationProp,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/AppNavigator/AppNavigator";
import { Ionicons } from "@expo/vector-icons";

// Event registration interface
interface EventRegistration {
  registration_id: number;
  registration_date: string;
  payment_status: string;
  status: string;
  event_id: number;
  title: string;
  description: string;
  event_type: string;
  event_date: string;
  start_time: string;
  end_time: string;
  registration_fee: number;
  prize_pool?: number;
  skill_level?: string;
  club_id: number;
  club_name: string;
  club_address: string;
  payment_amount?: number;
  paid_at?: string;
}

export default function ReservationsScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch: AppDispatch = useDispatch();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [eventRegistrations, setEventRegistrations] = useState<
    EventRegistration[]
  >([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const fetchReservations = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("id_platforms_user");
      if (storedUserId) {
        // Fetch both bookings and event registrations
        const [bookingsData, eventsData] = await Promise.all([
          dispatch(getUserBookings(Number(storedUserId), 1)),
          dispatch(getUserEventRegistrations(Number(storedUserId))),
        ]);

        console.log("[ReservationsScreen] Bookings:", bookingsData);
        console.log("[ReservationsScreen] Event Registrations:", eventsData);

        setBookings(bookingsData || []);
        setEventRegistrations(eventsData || []);
      }
    } catch (error) {
      console.error("Failed to refresh reservations", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchReservations();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchReservations();
    setRefreshing(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":");
    return `${hours}:${minutes}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "#10b981";
      case "completed":
        return "#6b7280";
      case "cancelled":
        return "#ef4444";
      case "pending":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmada";
      case "completed":
        return "Completada";
      case "cancelled":
        return "Cancelada";
      case "pending":
        return "Pendiente";
      case "no_show":
        return "No Asistió";
      default:
        return status;
    }
  };

  const sortBookings = (bookings: Booking[]) => {
    return bookings.sort((a, b) => {
      const dateA = new Date(`${a.booking_date}T${a.start_time}`);
      const dateB = new Date(`${b.booking_date}T${b.start_time}`);
      return dateB.getTime() - dateA.getTime(); // Newest first
    });
  };

  const sortEventRegistrations = (events: EventRegistration[]) => {
    return events.sort((a, b) => {
      const dateA = new Date(`${a.event_date}T${a.start_time}`);
      const dateB = new Date(`${b.event_date}T${b.start_time}`);
      return dateB.getTime() - dateA.getTime(); // Newest first
    });
  };

  const getEventTypeLabel = (eventType: string) => {
    const labels: { [key: string]: string } = {
      tournament: "Torneo",
      league: "Liga",
      clinic: "Clínica",
      social: "Social",
      championship: "Campeonato",
    };
    return labels[eventType] || eventType;
  };

  const getEventStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "#10b981";
      case "cancelled":
        return "#ef4444";
      case "pending":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e1dd2a" />
          <Text style={styles.loadingText}>Cargando reservas...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={
          bookings.length === 0
            ? styles.scrollContainerEmpty
            : styles.scrollContainer
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* New Booking Button */}
        <TouchableOpacity
          style={styles.newBookingButton}
          onPress={() => navigation.navigate("Schedule" as any)}
        >
          <View style={styles.newBookingIconContainer}>
            <Ionicons name="add-circle" size={32} color="#e1dd2a" />
          </View>
          <View style={styles.newBookingTextContainer}>
            <Text style={styles.newBookingTitle}>Nueva Reserva</Text>
            <Text style={styles.newBookingSubtitle}>
              Reserva una cancha o inscríbete a eventos
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#6b7280" />
        </TouchableOpacity>

        {bookings.length === 0 && eventRegistrations.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color="#6b7280" />
            <Text style={styles.emptyStateTitle}>No tienes reservas</Text>
            <Text style={styles.emptyStateText}>
              Tus reservas y eventos aparecerán aquí una vez que hagas tu
              primera reserva
            </Text>
          </View>
        ) : (
          <>
            {/* Court Bookings Section */}
            {bookings.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Reservas de Cancha</Text>
                {sortBookings([...bookings]).map((booking) => (
                  <TouchableOpacity
                    key={booking.id}
                    style={styles.bookingCard}
                    onPress={() => setSelectedBooking(booking)}
                  >
                    <View style={styles.bookingHeader}>
                      <View style={styles.bookingIconContainer}>
                        <Ionicons name="tennisball" size={24} color="#e1dd2a" />
                      </View>
                      <View style={styles.bookingHeaderInfo}>
                        <Text style={styles.bookingCourtName}>
                          {booking.court_name}
                        </Text>
                        <Text style={styles.bookingNumber}>
                          #{booking.booking_number}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: getStatusColor(booking.status) },
                        ]}
                      >
                        <Text style={styles.statusBadgeText}>
                          {getStatusText(booking.status)}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.bookingDetails}>
                      <View style={styles.bookingDetailRow}>
                        <Ionicons
                          name="calendar-outline"
                          size={18}
                          color="#9ca3af"
                        />
                        <Text style={styles.bookingDetailText}>
                          {formatDate(booking.booking_date)}
                        </Text>
                      </View>
                      <View style={styles.bookingDetailRow}>
                        <Ionicons
                          name="time-outline"
                          size={18}
                          color="#9ca3af"
                        />
                        <Text style={styles.bookingDetailText}>
                          {formatTime(booking.start_time)} -{" "}
                          {formatTime(booking.end_time)}
                        </Text>
                      </View>
                      <View style={styles.bookingDetailRow}>
                        <Ionicons
                          name="hourglass-outline"
                          size={18}
                          color="#9ca3af"
                        />
                        <Text style={styles.bookingDetailText}>
                          {booking.duration_minutes} minutos
                        </Text>
                      </View>
                    </View>

                    <View style={styles.bookingFooter}>
                      <View style={styles.priceContainer}>
                        <Text style={styles.priceLabel}>Total</Text>
                        <Text style={styles.priceAmount}>
                          ${booking.total_price}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.detailsButton}
                        onPress={() => setSelectedBooking(booking)}
                      >
                        <Text style={styles.detailsButtonText}>
                          Ver detalles
                        </Text>
                        <Ionicons
                          name="chevron-forward"
                          size={16}
                          color="#e1dd2a"
                        />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            )}

            {/* Event Registrations Section */}
            {eventRegistrations.length > 0 && (
              <>
                {/* Divider */}
                {bookings.length > 0 && (
                  <View style={styles.sectionDivider}>
                    <View style={styles.dividerLine} />
                    <Ionicons name="trophy" size={24} color="#e1dd2a" />
                    <View style={styles.dividerLine} />
                  </View>
                )}

                <Text style={styles.sectionTitle}>Eventos Registrados</Text>
                {sortEventRegistrations([...eventRegistrations]).map(
                  (event) => (
                    <View
                      key={event.registration_id}
                      style={styles.bookingCard}
                    >
                      <View style={styles.bookingHeader}>
                        <View style={styles.bookingIconContainer}>
                          <Ionicons name="trophy" size={24} color="#fb923c" />
                        </View>
                        <View style={styles.bookingHeaderInfo}>
                          <Text style={styles.bookingCourtName}>
                            {event.title}
                          </Text>
                          <Text style={styles.bookingNumber}>
                            {getEventTypeLabel(event.event_type)}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.statusBadge,
                            {
                              backgroundColor: getEventStatusColor(
                                event.status
                              ),
                            },
                          ]}
                        >
                          <Text style={styles.statusBadgeText}>
                            {getStatusText(event.status)}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.bookingDetails}>
                        <View style={styles.bookingDetailRow}>
                          <Ionicons
                            name="location-outline"
                            size={18}
                            color="#9ca3af"
                          />
                          <Text style={styles.bookingDetailText}>
                            {event.club_name}
                          </Text>
                        </View>
                        <View style={styles.bookingDetailRow}>
                          <Ionicons
                            name="calendar-outline"
                            size={18}
                            color="#9ca3af"
                          />
                          <Text style={styles.bookingDetailText}>
                            {formatDate(event.event_date)}
                          </Text>
                        </View>
                        <View style={styles.bookingDetailRow}>
                          <Ionicons
                            name="time-outline"
                            size={18}
                            color="#9ca3af"
                          />
                          <Text style={styles.bookingDetailText}>
                            {formatTime(event.start_time)} -{" "}
                            {formatTime(event.end_time)}
                          </Text>
                        </View>
                        {event.skill_level && (
                          <View style={styles.bookingDetailRow}>
                            <Ionicons
                              name="bar-chart-outline"
                              size={18}
                              color="#9ca3af"
                            />
                            <Text style={styles.bookingDetailText}>
                              Nivel: {event.skill_level}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  )
                )}
              </>
            )}
          </>
        )}
      </ScrollView>

      {/* Booking Details Modal (Simple overlay for now) */}
      {selectedBooking && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalles de Reserva</Text>
              <TouchableOpacity onPress={() => setSelectedBooking(null)}>
                <Ionicons name="close-circle" size={32} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>
                  Información General
                </Text>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>Número de Reserva</Text>
                  <Text style={styles.modalDetailValue}>
                    #{selectedBooking.booking_number}
                  </Text>
                </View>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>Cancha</Text>
                  <Text style={styles.modalDetailValue}>
                    {selectedBooking.court_name}
                  </Text>
                </View>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>Estado</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: getStatusColor(selectedBooking.status),
                      },
                    ]}
                  >
                    <Text style={styles.statusBadgeText}>
                      {getStatusText(selectedBooking.status)}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Fecha y Hora</Text>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>Fecha</Text>
                  <Text style={styles.modalDetailValue}>
                    {formatDate(selectedBooking.booking_date)}
                  </Text>
                </View>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>Hora de inicio</Text>
                  <Text style={styles.modalDetailValue}>
                    {formatTime(selectedBooking.start_time)}
                  </Text>
                </View>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>Hora de fin</Text>
                  <Text style={styles.modalDetailValue}>
                    {formatTime(selectedBooking.end_time)}
                  </Text>
                </View>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>Duración</Text>
                  <Text style={styles.modalDetailValue}>
                    {selectedBooking.duration_minutes} minutos
                  </Text>
                </View>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Pago</Text>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>Total</Text>
                  <Text style={styles.modalPriceValue}>
                    ${selectedBooking.total_price}
                  </Text>
                </View>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>Método de pago</Text>
                  <Text style={styles.modalDetailValue}>
                    {selectedBooking.payment_method || "Tarjeta"}
                  </Text>
                </View>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>Estado de pago</Text>
                  <Text
                    style={[
                      styles.modalDetailValue,
                      {
                        color:
                          selectedBooking.payment_status === "paid"
                            ? "#10b981"
                            : "#f59e0b",
                      },
                    ]}
                  >
                    {selectedBooking.payment_status === "paid"
                      ? "Pagado"
                      : "Pendiente"}
                  </Text>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setSelectedBooking(null)}
            >
              <Text style={styles.modalCloseButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
