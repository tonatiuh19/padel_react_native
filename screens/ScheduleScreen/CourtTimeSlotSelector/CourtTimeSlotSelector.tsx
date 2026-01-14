import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Court {
  id: number;
  club_id: number;
  name: string;
  court_type: "indoor" | "outdoor" | "covered";
  surface_type: "glass" | "concrete" | "artificial_grass";
  has_lighting: boolean;
  is_active: boolean;
  display_order: number;
}

interface Event {
  id: number;
  title: string;
  description: string;
  event_type: string;
  event_date: string;
  start_time: string;
  end_time: string;
  registration_fee: number;
  current_participants: number;
  max_participants: number | null;
  skill_level: string;
  prize_pool: number | null;
  status: string;
  courts_used: number[] | string;
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
  availability?: Array<{
    day_of_week: number;
    start_time: string;
    end_time: string;
  }>;
}

interface TimeSlot {
  time: string;
  endTime?: string;
  available: boolean;
  courtId?: number;
  courtName?: string;
}

interface AvailabilityData {
  courts: Court[];
  bookings: any[];
  blockedSlots: any[];
  events: Event[];
  privateClasses: any[];
  schedules: any[];
}

interface CourtTimeSlotSelectorProps {
  selectedDate: Date;
  selectedTime: string;
  selectedCourt: Court | null;
  availability: AvailabilityData | null;
  loading: boolean;
  duration: number;
  onSelectTimeSlot: (court: Court, time: string) => void;
  onEventSelect?: (event: Event) => void;
  onPrivateClassSelect?: (privateClass: any) => void;
  userSubscription?: any;
  instructors?: Instructor[];
  loadingInstructors?: boolean;
  selectedInstructor?: Instructor | null;
  onInstructorSelect?: (instructor: Instructor | null) => void;
  onClassSelect?: (instructor: Instructor, time: string, court: Court) => void;
  calculatedPrice?: number | null;
  originalPrice?: number | null;
  subscriptionDiscount?: number;
  hasDiscount?: boolean;
  onContinueToPayment?: () => void;
  hideCourtBookings?: boolean;
}

export default function CourtTimeSlotSelector({
  selectedDate,
  selectedTime,
  selectedCourt,
  availability,
  loading,
  duration,
  onSelectTimeSlot,
  onEventSelect,
  onPrivateClassSelect,
  userSubscription,
  instructors = [],
  loadingInstructors = false,
  selectedInstructor = null,
  onInstructorSelect,
  onClassSelect,
  calculatedPrice = null,
  originalPrice = null,
  subscriptionDiscount = 0,
  hasDiscount = false,
  onContinueToPayment,
  hideCourtBookings = false,
}: CourtTimeSlotSelectorProps) {
  const formatDate = (date: Date): string => {
    const months = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];
    return `${date.getDate()} de ${months[date.getMonth()]}`;
  };

  const getEventTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      tournament: "Torneo",
      league: "Liga",
      clinic: "Clínica",
      social: "Social",
      championship: "Campeonato",
    };
    return labels[type] || type;
  };

  const getEventsForDate = (): Event[] => {
    if (!availability?.events) return [];

    const dateStr = selectedDate.toISOString().split("T")[0];
    return availability.events.filter((event) => {
      const eventDate = event.event_date.split("T")[0];
      return eventDate === dateStr && event.status === "open";
    });
  };

  const getInstructorAvailabilitySlots = (instructor: Instructor) => {
    if (!instructor.availability || instructor.availability.length === 0) {
      return [];
    }

    const dayOfWeek = selectedDate.getDay();
    const dateStr = selectedDate.toISOString().split("T")[0];

    // Find availability for the selected day
    const dayAvailability = instructor.availability.filter(
      (avail) => avail.day_of_week === dayOfWeek
    );

    if (dayAvailability.length === 0) return [];

    const slots: Array<{ time: string; endTime: string }> = [];

    dayAvailability.forEach((avail) => {
      const startTime = avail.start_time.substring(0, 5);
      const endTime = avail.end_time.substring(0, 5);

      // Generate 60-minute slots within the availability window
      const startMinutes =
        parseInt(startTime.split(":")[0]) * 60 +
        parseInt(startTime.split(":")[1]);
      const endMinutes =
        parseInt(endTime.split(":")[0]) * 60 + parseInt(endTime.split(":")[1]);

      let currentMinutes = startMinutes;

      while (currentMinutes + 60 <= endMinutes) {
        const hour = Math.floor(currentMinutes / 60);
        const minute = currentMinutes % 60;
        const slotTime = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;

        const slotEndMinutes = currentMinutes + 60;
        const endHour = Math.floor(slotEndMinutes / 60);
        const endMinute = slotEndMinutes % 60;
        const slotEndTime = `${endHour.toString().padStart(2, "0")}:${endMinute
          .toString()
          .padStart(2, "0")}`;

        // Check if slot is already booked
        const isBooked = availability?.privateClasses.some((pc: any) => {
          if (pc.instructor_id !== instructor.id) return false;
          const classDate = pc.class_date.split("T")[0];
          if (classDate !== dateStr) return false;

          const classStart = pc.start_time.substring(0, 5);
          const classEnd = pc.end_time.substring(0, 5);

          return slotTime < classEnd && classStart < slotEndTime;
        });

        if (!isBooked) {
          slots.push({ time: slotTime, endTime: slotEndTime });
        }

        currentMinutes += 60;
      }
    });

    return slots;
  };

  const getCourtName = (courtId: number): string => {
    const court = availability?.courts.find((c) => c.id === courtId);
    return court?.name || `Cancha ${courtId}`;
  };

  const generateTimeSlots = (): TimeSlot[] => {
    if (!availability) return [];

    const dateStr = selectedDate.toISOString().split("T")[0];
    const slots: TimeSlot[] = [];

    // If an instructor is selected, get their availability window for filtering
    let instructorStartTime: string | null = null;
    let instructorEndTime: string | null = null;

    if (
      selectedInstructor?.availability &&
      selectedInstructor.availability.length > 0
    ) {
      const dayOfWeek = selectedDate.getDay();
      const dayAvailability = selectedInstructor.availability.find(
        (avail) => avail.day_of_week === dayOfWeek
      );
      if (dayAvailability) {
        instructorStartTime = dayAvailability.start_time.substring(0, 5);
        instructorEndTime = dayAvailability.end_time.substring(0, 5);
      }
    }

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

    const timeRangesOverlap = (
      start1: string,
      end1: string,
      start2: string,
      end2: string
    ): boolean => {
      return start1 < end2 && start2 < end1;
    };

    const dayOfWeek = selectedDate.getDay();
    const clubSchedule = availability.schedules?.find(
      (s: any) => s.day_of_week === dayOfWeek
    );

    if (clubSchedule && clubSchedule.is_closed) {
      return [];
    }

    const opensAt = clubSchedule
      ? clubSchedule.opens_at.substring(0, 5)
      : "08:00";
    const closesAt = clubSchedule
      ? clubSchedule.closes_at.substring(0, 5)
      : "23:00";

    const startHour = parseInt(opensAt.split(":")[0]);
    const startMinute = parseInt(opensAt.split(":")[1]);
    let currentTimeMinutes = startHour * 60 + startMinute;

    const closesAtMinutes =
      parseInt(closesAt.split(":")[0]) * 60 + parseInt(closesAt.split(":")[1]);

    while (currentTimeMinutes + duration <= closesAtMinutes) {
      const hour = Math.floor(currentTimeMinutes / 60);
      const minute = currentTimeMinutes % 60;
      const time = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      const endTime = calculateEndTime(time, duration);

      // Skip if instructor is selected and this slot is outside their availability
      if (instructorStartTime && instructorEndTime) {
        if (
          !timeRangesOverlap(
            time,
            endTime,
            instructorStartTime,
            instructorEndTime
          )
        ) {
          currentTimeMinutes += duration;
          continue;
        }
      }

      availability.courts.forEach((court) => {
        const isBlocked = availability.blockedSlots.some((slot: any) => {
          const blockDate = slot.block_date.split("T")[0];
          if (blockDate !== dateStr) return false;
          if (slot.court_id && slot.court_id !== court.id) return false;
          if (slot.is_all_day) return true;
          if (slot.start_time && slot.end_time) {
            return timeRangesOverlap(
              time,
              endTime,
              slot.start_time,
              slot.end_time
            );
          }
          return false;
        });

        const isBooked = availability.bookings.some((booking: any) => {
          const bookingDate = booking.booking_date.split("T")[0];
          if (booking.court_id !== court.id || bookingDate !== dateStr)
            return false;
          const bookingStartTime = booking.start_time.substring(0, 5);
          const bookingEndTime = booking.end_time.substring(0, 5);
          return timeRangesOverlap(
            time,
            endTime,
            bookingStartTime,
            bookingEndTime
          );
        });

        const isEventOccupied =
          availability.events?.some((event: any) => {
            const eventDate = event.event_date.split("T")[0];
            if (eventDate !== dateStr) return false;
            if (!event.courts_used) return false;

            const courtsUsed =
              typeof event.courts_used === "string"
                ? JSON.parse(event.courts_used)
                : event.courts_used;

            if (!courtsUsed.includes(court.id)) return false;

            const eventStart = event.start_time.substring(0, 5);
            const eventEnd = event.end_time.substring(0, 5);

            return timeRangesOverlap(time, endTime, eventStart, eventEnd);
          }) || false;

        const isPrivateClassOccupied =
          availability.privateClasses?.some((privateClass: any) => {
            const classDate = privateClass.class_date.split("T")[0];
            if (classDate !== dateStr) return false;
            if (privateClass.court_id !== court.id) return false;

            const classStartTime = privateClass.start_time.substring(0, 5);
            const classEndTime = privateClass.end_time.substring(0, 5);

            return timeRangesOverlap(
              time,
              endTime,
              classStartTime,
              classEndTime
            );
          }) || false;

        slots.push({
          time,
          endTime,
          available:
            !isBlocked &&
            !isBooked &&
            !isEventOccupied &&
            !isPrivateClassOccupied,
          courtId: court.id,
          courtName: court.name,
        });
      });

      currentTimeMinutes += duration;
    }

    return slots;
  };

  const groupedTimeSlots = (): Record<string, TimeSlot[]> => {
    const slots = generateTimeSlots();
    const grouped: Record<string, TimeSlot[]> = {};

    slots.forEach((slot) => {
      if (!grouped[slot.time]) {
        grouped[slot.time] = [];
      }
      grouped[slot.time].push(slot);
    });

    return grouped;
  };

  if (loading) {
    return (
      <View style={styles.card}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8c8a1a" />
          <Text style={styles.loadingText}>Cargando disponibilidad...</Text>
        </View>
      </View>
    );
  }

  if (!availability) {
    return (
      <View style={styles.card}>
        <View style={styles.emptyContainer}>
          <Ionicons name="time-outline" size={48} color="#6b7280" />
          <Text style={styles.emptyText}>
            Selecciona una fecha en el calendario para ver la disponibilidad
          </Text>
        </View>
      </View>
    );
  }

  const eventsForDate = getEventsForDate();
  const timeSlots = groupedTimeSlots();

  // Calculate end time for display
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

  // Check if a booking is selected (court + time for regular bookings, or instructor + time + court for classes)
  const hasSelection = selectedInstructor
    ? selectedInstructor && selectedTime && selectedCourt
    : selectedCourt && selectedTime;

  return (
    <View style={styles.container}>
      {/* Events Section */}
      {eventsForDate.length > 0 && (
        <View style={styles.eventCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="trophy" size={20} color="#8c8a1a" />
            <Text style={styles.sectionTitle}>Eventos Disponibles</Text>
          </View>
          {eventsForDate.map((event) => {
            // Check for event discount in both flattened and nested structure
            const eventDiscountPercent =
              userSubscription?.event_discount_percent ||
              userSubscription?.subscription?.event_discount_percent;

            const hasDiscount =
              eventDiscountPercent && Number(eventDiscountPercent) > 0;
            const originalPrice = Number(event.registration_fee);
            const discountedPrice = hasDiscount
              ? originalPrice * (1 - Number(eventDiscountPercent) / 100)
              : originalPrice;

            console.log("🎟️ Event card render:", {
              eventTitle: event.title,
              userSubscription_event_discount:
                userSubscription?.event_discount_percent,
              userSubscription_nested:
                userSubscription?.subscription?.event_discount_percent,
              eventDiscountPercent,
              hasDiscount,
              originalPrice,
              discountedPrice,
            });

            return (
              <View key={event.id} style={styles.eventItem}>
                <View style={styles.eventHeader}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <View style={styles.eventTypeBadge}>
                    <Text style={styles.eventTypeBadgeText}>
                      {getEventTypeLabel(event.event_type)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.eventDescription}>{event.description}</Text>
                <View style={styles.eventDetails}>
                  <View style={styles.eventDetailRow}>
                    <Ionicons name="time-outline" size={16} color="#9ca3af" />
                    <Text style={styles.eventDetailText}>
                      {event.start_time.substring(0, 5)} -{" "}
                      {event.end_time.substring(0, 5)}
                    </Text>
                  </View>
                  <View style={styles.eventDetailRow}>
                    <Ionicons name="people-outline" size={16} color="#9ca3af" />
                    <Text style={styles.eventDetailText}>
                      {event.current_participants}/
                      {event.max_participants || "∞"}
                    </Text>
                  </View>
                </View>
                <View style={styles.eventFooter}>
                  <View style={styles.priceContainer}>
                    {hasDiscount ? (
                      <View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: 4,
                          }}
                        >
                          <View
                            style={{
                              backgroundColor: "#8c8a1a",
                              paddingHorizontal: 8,
                              paddingVertical: 2,
                              borderRadius: 8,
                              marginRight: 8,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 11,
                                fontWeight: "600",
                                color: "#fff",
                              }}
                            >
                              Membresía -
                              {Number(eventDiscountPercent).toFixed(0)}%
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.originalPrice}>
                          ${originalPrice.toFixed(2)}
                        </Text>
                        <Text style={styles.discountedPrice}>
                          ${discountedPrice.toFixed(2)}
                        </Text>
                      </View>
                    ) : (
                      <Text style={styles.eventPrice}>
                        ${originalPrice.toFixed(2)}
                      </Text>
                    )}
                  </View>
                  {onEventSelect && (
                    <TouchableOpacity
                      style={styles.eventButton}
                      onPress={() => onEventSelect(event)}
                    >
                      <Text style={styles.eventButtonText}>Inscribirse</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Instructor Availability Section */}
      {loadingInstructors ? (
        <View style={styles.instructorCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person" size={20} color="#3b82f6" />
            <Text style={styles.sectionTitle}>
              Clases Privadas - Instructores
            </Text>
          </View>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8c8a1a" />
            <Text style={styles.loadingText}>Cargando instructores...</Text>
          </View>
        </View>
      ) : instructors.length > 0 ? (
        <View style={styles.instructorCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person" size={20} color="#3b82f6" />
            <Text style={styles.sectionTitle}>
              Clases Privadas - Instructores
            </Text>
          </View>
          <ScrollView style={styles.instructorScroll} nestedScrollEnabled>
            {instructors.map((instructor) => {
              const availableSlots = getInstructorAvailabilitySlots(instructor);

              if (availableSlots.length === 0) return null;

              return (
                <TouchableOpacity
                  key={instructor.id}
                  style={[
                    styles.instructorItem,
                    selectedInstructor?.id === instructor.id &&
                      styles.instructorItemSelected,
                  ]}
                  onPress={() => {
                    if (onInstructorSelect) {
                      onInstructorSelect(
                        selectedInstructor?.id === instructor.id
                          ? null
                          : instructor
                      );
                    }
                  }}
                >
                  <View style={styles.instructorHeader}>
                    <View style={styles.instructorInfo}>
                      <Text style={styles.instructorName}>
                        {instructor.name}
                      </Text>
                      {instructor.specialties &&
                        instructor.specialties.length > 0 && (
                          <View style={styles.specialtiesContainer}>
                            {instructor.specialties
                              .slice(0, 2)
                              .map((specialty, index) => (
                                <View key={index} style={styles.specialtyBadge}>
                                  <Text style={styles.specialtyText}>
                                    {specialty}
                                  </Text>
                                </View>
                              ))}
                          </View>
                        )}
                      {typeof instructor.rating === "number" &&
                        typeof instructor.review_count === "number" && (
                          <View style={styles.instructorRating}>
                            <Ionicons name="star" size={14} color="#fbbf24" />
                            <Text style={styles.ratingText}>
                              {instructor.rating.toFixed(1)} (
                              {instructor.review_count})
                            </Text>
                          </View>
                        )}
                    </View>
                    <View style={styles.instructorPrice}>
                      <Text style={styles.priceLabel}>Por hora</Text>
                      <Text style={styles.priceValue}>
                        ${instructor.hourly_rate}
                      </Text>
                    </View>
                  </View>

                  {selectedInstructor?.id === instructor.id && (
                    <View style={styles.instructorSelectedHint}>
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color="#10b981"
                      />
                      <Text style={styles.instructorSelectedHintText}>
                        Selecciona horario y cancha abajo
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      ) : null}

      {/* Time Slots Section - Hidden when hideCourtBookings is true and no instructor selected */}
      {(!hideCourtBookings || selectedInstructor) && (
        <View
          style={[
            styles.timeSlotsCard,
            selectedInstructor && styles.timeSlotsCardWithInstructor,
          ]}
        >
          <View style={styles.sectionHeader}>
            <Ionicons
              name="time-outline"
              size={20}
              color={selectedInstructor ? "#10b981" : "#8c8a1a"}
            />
            <Text style={styles.sectionTitle}>
              {selectedInstructor
                ? `Selecciona Hora y Cancha para Clase con ${selectedInstructor.name}`
                : "Horarios Disponibles"}
            </Text>
            <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
          </View>
          <ScrollView style={styles.timeSlotsScroll} nestedScrollEnabled>
            {Object.entries(timeSlots).map(([time, slots]) => (
              <View key={time} style={styles.timeSlotRow}>
                <View style={styles.timeLabel}>
                  <Text style={styles.timeLabelText}>{time}</Text>
                  {slots[0]?.endTime && (
                    <Text style={styles.timeEndText}>→ {slots[0].endTime}</Text>
                  )}
                </View>
                <View style={styles.courtButtons}>
                  {slots.map((slot) => (
                    <TouchableOpacity
                      key={`${time}-${slot.courtId}`}
                      style={[
                        styles.courtButton,
                        !slot.available && styles.courtButtonDisabled,
                        selectedTime === time &&
                          selectedCourt?.id === slot.courtId &&
                          (selectedInstructor
                            ? styles.courtButtonSelectedInstructor
                            : styles.courtButtonSelected),
                        selectedInstructor &&
                          slot.available &&
                          styles.courtButtonInstructorMode,
                      ]}
                      onPress={() => {
                        if (slot.available && slot.courtId) {
                          const court = availability.courts.find(
                            (c) => c.id === slot.courtId
                          )!;
                          if (selectedInstructor && onClassSelect) {
                            // Instructor mode - book private class
                            onClassSelect(selectedInstructor, time, court);
                          } else {
                            // Regular mode - book court
                            onSelectTimeSlot(court, time);
                          }
                        }
                      }}
                      disabled={!slot.available}
                    >
                      <Text
                        style={[
                          styles.courtButtonText,
                          !slot.available && styles.courtButtonTextDisabled,
                          selectedTime === time &&
                            selectedCourt?.id === slot.courtId &&
                            styles.courtButtonTextSelected,
                        ]}
                      >
                        {slot.courtName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Bottom Price Preview Panel - Shows when court is selected */}
      {hasSelection && (
        <View style={styles.bottomPanel}>
          <View style={styles.bottomPanelContent}>
            <View style={styles.bookingSummary}>
              <View style={styles.summaryRow}>
                <Ionicons name="calendar-outline" size={20} color="#d1d5db" />
                <Text style={styles.summaryText}>
                  {formatDate(selectedDate)} • {selectedTime} -{" "}
                  {calculateEndTime(selectedTime, duration)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Ionicons
                  name={
                    selectedInstructor ? "person-outline" : "tennisball-outline"
                  }
                  size={20}
                  color="#d1d5db"
                />
                <Text style={styles.summaryText}>
                  {selectedInstructor
                    ? `Clase con ${selectedInstructor.name} • ${selectedCourt?.name}`
                    : selectedCourt?.name}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Ionicons name="time-outline" size={20} color="#d1d5db" />
                <Text style={styles.summaryText}>
                  Duración: {duration} minutos
                </Text>
              </View>
              {calculatedPrice !== null && calculatedPrice !== undefined && (
                <View style={styles.bottomPriceSection}>
                  {hasDiscount && (
                    <View style={styles.subscriptionBadge}>
                      <Ionicons name="star" size={14} color="#fbbf24" />
                      <Text style={styles.subscriptionBadgeText}>
                        Membresía -{subscriptionDiscount}%
                      </Text>
                    </View>
                  )}
                  <View style={[styles.summaryRow, styles.priceRow]}>
                    <Ionicons
                      name="cash-outline"
                      size={24}
                      color={selectedInstructor ? "#10b981" : "#8c8a1a"}
                    />
                    <View style={styles.priceTextContainer}>
                      {hasDiscount && originalPrice && (
                        <Text style={styles.originalPriceText}>
                          ${originalPrice.toFixed(2)} MXN
                        </Text>
                      )}
                      <Text
                        style={[
                          styles.priceText,
                          selectedInstructor && styles.priceTextInstructor,
                        ]}
                      >
                        ${calculatedPrice.toFixed(2)} MXN
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
            {onContinueToPayment && (
              <TouchableOpacity
                style={[
                  styles.continueButton,
                  selectedInstructor && styles.continueButtonInstructor,
                ]}
                onPress={onContinueToPayment}
              >
                <Text style={styles.continueButtonText}>Continuar</Text>
                <Ionicons name="arrow-forward" size={20} color="#ffffff" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  card: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#374151",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  loadingText: {
    color: "#d1d5db",
    marginTop: 16,
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyText: {
    color: "#9ca3af",
    marginTop: 16,
    fontSize: 14,
    textAlign: "center",
  },
  eventCard: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#8c8a1a",
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    flex: 1,
  },
  dateText: {
    fontSize: 12,
    color: "#9ca3af",
  },
  eventItem: {
    backgroundColor: "#374151",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  eventHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#8c8a1a",
    flex: 1,
  },
  eventTypeBadge: {
    backgroundColor: "rgba(234, 88, 12, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  eventTypeBadgeText: {
    fontSize: 10,
    color: "#8c8a1a",
    fontWeight: "600",
  },
  eventDescription: {
    fontSize: 12,
    color: "#d1d5db",
    marginBottom: 12,
  },
  eventDetails: {
    gap: 8,
    marginBottom: 12,
  },
  eventDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  eventDetailText: {
    fontSize: 12,
    color: "#9ca3af",
  },
  eventFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  priceContainer: {
    flex: 1,
  },
  eventPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#10b981",
  },
  originalPrice: {
    fontSize: 12,
    color: "#9ca3af",
    textDecorationLine: "line-through",
  },
  discountedPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#10b981",
  },
  eventButton: {
    backgroundColor: "#8c8a1a",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  eventButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
  privateClassCard: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#10b981",
    marginBottom: 16,
  },
  privateClassItem: {
    backgroundColor: "#374151",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  privateClassHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  privateClassTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#10b981",
    flex: 1,
  },
  privateClassTypeBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  privateClassTypeBadgeText: {
    fontSize: 10,
    color: "#10b981",
    fontWeight: "600",
  },
  privateClassDetails: {
    gap: 8,
    marginBottom: 12,
  },
  privateClassDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  privateClassDetailText: {
    fontSize: 12,
    color: "#9ca3af",
  },
  privateClassFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  privateClassPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#10b981",
  },
  privateClassButton: {
    backgroundColor: "#10b981",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  privateClassButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
  timeSlotsCard: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#374151",
  },
  timeSlotsScroll: {
    maxHeight: 400,
  },
  timeSlotRow: {
    flexDirection: "row",
    marginBottom: 12,
    paddingBottom: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  timeLabel: {
    minWidth: 80,
    justifyContent: "center",
  },
  timeLabelText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
  timeEndText: {
    fontSize: 10,
    color: "#9ca3af",
    marginTop: 2,
  },
  courtButtons: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  courtButton: {
    backgroundColor: "#374151",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#4b5563",
    minWidth: 100,
  },
  courtButtonSelected: {
    backgroundColor: "#8c8a1a",
    borderColor: "#8c8a1a",
  },
  courtButtonDisabled: {
    backgroundColor: "#1f2937",
    borderColor: "transparent",
    opacity: 0.4,
  },
  courtButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#d1d5db",
    textAlign: "center",
  },
  courtButtonTextSelected: {
    color: "#ffffff",
  },
  courtButtonTextDisabled: {
    color: "#6b7280",
  },
  instructorCard: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#3b82f6",
    marginBottom: 16,
  },
  instructorScroll: {
    maxHeight: 500,
  },
  instructorItem: {
    backgroundColor: "#374151",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  instructorItemSelected: {
    borderColor: "#10b981",
    backgroundColor: "#064e3b",
  },
  instructorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  instructorInfo: {
    flex: 1,
    gap: 6,
  },
  instructorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3b82f6",
  },
  specialtiesContainer: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
  },
  specialtyBadge: {
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  specialtyText: {
    fontSize: 10,
    color: "#3b82f6",
    fontWeight: "600",
  },
  instructorRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: "#9ca3af",
  },
  instructorPrice: {
    alignItems: "flex-end",
  },
  priceLabel: {
    fontSize: 10,
    color: "#9ca3af",
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3b82f6",
  },
  instructorSelectedHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 8,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    borderRadius: 6,
    marginTop: 8,
  },
  instructorSelectedHintText: {
    fontSize: 12,
    color: "#10b981",
    fontWeight: "600",
  },
  timeSlotsCardWithInstructor: {
    borderColor: "#10b981",
    borderWidth: 2,
  },
  courtButtonInstructorMode: {
    borderColor: "#10b981",
    backgroundColor: "#064e3b",
  },
  courtButtonSelectedInstructor: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },
  bottomPanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1f2937",
    borderTopWidth: 2,
    borderTopColor: "#374151",
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  bottomPanelContent: {
    gap: 12,
  },
  bookingSummary: {
    gap: 10,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  summaryText: {
    fontSize: 14,
    color: "#d1d5db",
    flex: 1,
  },
  priceRow: {
    marginTop: 4,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#374151",
  },
  bottomPriceSection: {
    gap: 8,
  },
  subscriptionBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fef3c7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  subscriptionBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#92400e",
  },
  priceTextContainer: {
    flex: 1,
    gap: 2,
  },
  originalPriceText: {
    fontSize: 14,
    color: "#9ca3af",
    textDecorationLine: "line-through",
  },
  priceText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8c8a1a",
  },
  priceTextInstructor: {
    color: "#10b981",
  },
  continueButton: {
    backgroundColor: "#8c8a1a",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  continueButtonInstructor: {
    backgroundColor: "#10b981",
  },
  continueButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
