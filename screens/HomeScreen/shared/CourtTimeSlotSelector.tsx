import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import type {
  Court,
  Instructor,
  AvailabilityData,
  Event,
} from "../../../store/effects";

// Simple date formatting helper (no external dependency)
const formatDate = (date: Date, formatStr: string): string => {
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

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  if (formatStr === "yyyy-MM-dd") {
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  }

  // Default: "dd 'de' MMMM"
  return `${day} de ${month}`;
};

interface TimeSlot {
  time: string;
  endTime?: string;
  available: boolean;
  courtId?: number;
  courtName?: string;
}

interface CourtTimeSlotSelectorProps {
  selectedDate: Date;
  selectedTime: string;
  selectedCourt: Court | null;
  availability: AvailabilityData | null;
  loading: boolean;
  duration: number;
  calculatedPrice: number | null;
  onSelectTimeSlot: (court: Court, time: string) => void;
  onEventSelect?: (event: Event) => void;
  onClassSelect?: (instructor: Instructor, time: string, court?: Court) => void;
  processingEventId?: number | null;
  instructors?: Instructor[];
  loadingInstructors?: boolean;
  selectedInstructor?: Instructor | null;
  onInstructorSelect?: (instructor: Instructor | null) => void;
  userSubscription?: any;
}

export default function CourtTimeSlotSelector({
  selectedDate,
  selectedTime,
  selectedCourt,
  availability,
  loading,
  duration,
  calculatedPrice,
  onSelectTimeSlot,
  onEventSelect,
  onClassSelect,
  processingEventId,
  instructors = [],
  loadingInstructors = false,
  selectedInstructor = null,
  onInstructorSelect,
  userSubscription,
}: CourtTimeSlotSelectorProps) {
  // Filter events for the selected date
  const getEventsForDate = () => {
    if (!availability?.events) return [];

    const dateStr = formatDate(selectedDate, "yyyy-MM-dd");
    return availability.events.filter((event) => {
      const eventDate = event.event_date.split("T")[0];
      return eventDate === dateStr && event.status === "open";
    });
  };

  const getEventTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      tournament: "Torneo",
      league: "Liga",
      clinic: "Clínica",
      social: "Social",
      championship: "Campeonato",
    };
    return labels[type] || type;
  };

  // Get court names for an event
  const getEventCourtInfo = (event: Event) => {
    const dateStr = formatDate(selectedDate, "yyyy-MM-dd");

    // Check if event has granular court schedules
    const eventSchedules = availability?.eventCourtSchedules?.filter(
      (schedule) => {
        const scheduleDate = schedule.event_date.split("T")[0];
        return scheduleDate === dateStr && schedule.event_id === event.id;
      }
    );

    if (eventSchedules && eventSchedules.length > 0) {
      // Group schedules by court
      const courtScheduleMap = new Map();
      eventSchedules.forEach((schedule) => {
        const court = availability?.courts.find(
          (c) => c.id === schedule.court_id
        );
        if (court) {
          if (!courtScheduleMap.has(court.name)) {
            courtScheduleMap.set(court.name, []);
          }
          courtScheduleMap.get(court.name).push({
            start: schedule.start_time.substring(0, 5),
            end: schedule.end_time.substring(0, 5),
          });
        }
      });

      // Format: "Cancha 1 (08:00-12:00), Cancha 2 (14:00-16:00)"
      return Array.from(courtScheduleMap.entries())
        .map(([courtName, times]) => {
          const timeRanges = (times as any[])
            .map((t: any) => `${t.start}-${t.end}`)
            .join(", ");
          return `${courtName} (${timeRanges})`;
        })
        .join(", ");
    }

    // Fall back to courts_used
    if (event.courts_used && event.courts_used.length > 0) {
      const courtsUsed =
        typeof event.courts_used === "string"
          ? JSON.parse(event.courts_used)
          : event.courts_used;

      const courtNames = courtsUsed
        .map((courtId: number) => {
          const court = availability?.courts.find((c) => c.id === courtId);
          return court?.name;
        })
        .filter(Boolean);

      return courtNames.length > 0 ? `Canchas: ${courtNames.join(", ")}` : null;
    }

    return null;
  };

  const generateTimeSlots = (): TimeSlot[] => {
    if (!availability) return [];

    const dateStr = formatDate(selectedDate, "yyyy-MM-dd");
    const slots: TimeSlot[] = [];

    // If an instructor is selected, get their availability window
    let instructorStartTime: string | null = null;
    let instructorEndTime: string | null = null;

    if (
      selectedInstructor?.availability &&
      selectedInstructor.availability.length > 0
    ) {
      instructorStartTime =
        selectedInstructor.availability[0].start_time.substring(0, 5);
      instructorEndTime = selectedInstructor.availability[0].end_time.substring(
        0,
        5
      );
    }

    // Helper to calculate end time
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

    // Helper to check time overlap
    const timeRangesOverlap = (
      start1: string,
      end1: string,
      start2: string,
      end2: string
    ): boolean => {
      return start1 < end2 && start2 < end1;
    };

    // Check club schedule
    const dayOfWeek = selectedDate.getDay();
    const clubSchedule = availability.schedules?.find(
      (s) => s.day_of_week === dayOfWeek
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

    // Generate slots
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

      // Skip if outside instructor availability
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
        // Check if blocked
        const isBlocked = availability.blockedSlots.some((slot) => {
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

        // Check if booked
        const isBooked = availability.bookings.some((booking) => {
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

        // Check events
        const courtHasSchedule = availability.eventCourtSchedules?.some(
          (schedule) => {
            const scheduleDate = schedule.event_date.split("T")[0];
            return scheduleDate === dateStr && schedule.court_id === court.id;
          }
        );

        const isEventOccupied = courtHasSchedule
          ? availability.eventCourtSchedules?.some((schedule) => {
              const scheduleDate = schedule.event_date.split("T")[0];
              if (scheduleDate !== dateStr || schedule.court_id !== court.id)
                return false;

              const scheduleStart = schedule.start_time.substring(0, 5);
              const scheduleEnd = schedule.end_time.substring(0, 5);

              return timeRangesOverlap(
                time,
                endTime,
                scheduleStart,
                scheduleEnd
              );
            }) || false
          : availability.events?.some((event) => {
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

        // Check private classes
        const isPrivateClassOccupied =
          availability.privateClasses?.some((privateClass) => {
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando disponibilidad...</Text>
      </View>
    );
  }

  if (!availability) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Selecciona una fecha en el calendario para ver la disponibilidad
        </Text>
      </View>
    );
  }

  const eventsForDate = getEventsForDate();

  return (
    <ScrollView style={styles.container}>
      {/* Events Section */}
      {eventsForDate.length > 0 && (
        <View style={styles.eventsContainer}>
          <Text style={styles.sectionTitle}>🏆 Eventos Disponibles</Text>
          {eventsForDate.map((event) => (
            <View key={event.id} style={styles.eventCard}>
              <View style={styles.eventHeader}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventType}>
                  {getEventTypeLabel(event.event_type)}
                </Text>
              </View>
              <Text style={styles.eventDescription}>{event.description}</Text>
              <View style={styles.eventInfo}>
                <Text style={styles.eventInfoText}>
                  ⏰ {event.start_time.substring(0, 5)} -{" "}
                  {event.end_time.substring(0, 5)}
                </Text>
                <Text style={styles.eventInfoText}>
                  👥 {event.current_participants}/
                  {event.max_participants || "∞"}
                </Text>
                <Text style={styles.eventInfoText}>
                  💰 ${Number(event.registration_fee).toFixed(2)}
                </Text>
              </View>
              {getEventCourtInfo(event) && (
                <Text style={styles.eventCourts}>
                  {getEventCourtInfo(event)}
                </Text>
              )}
              {onEventSelect && (
                <TouchableOpacity
                  style={[
                    styles.eventButton,
                    processingEventId === event.id && styles.buttonDisabled,
                  ]}
                  onPress={() => onEventSelect(event)}
                  disabled={processingEventId === event.id}
                >
                  <Text style={styles.eventButtonText}>
                    {processingEventId === event.id
                      ? "Procesando..."
                      : "Inscribirse"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Private Classes Section */}
      {instructors.length > 0 && onClassSelect && (
        <View style={styles.instructorsContainer}>
          <Text style={styles.sectionTitle}>
            🎓 Clases Privadas Disponibles
          </Text>
          {loadingInstructors ? (
            <ActivityIndicator size="small" color="#10b981" />
          ) : (
            instructors.map((instructor) => {
              const isSelected = selectedInstructor?.id === instructor.id;
              return (
                <TouchableOpacity
                  key={instructor.id}
                  style={[
                    styles.instructorCard,
                    isSelected && styles.instructorCardSelected,
                  ]}
                  onPress={() =>
                    onInstructorSelect &&
                    onInstructorSelect(isSelected ? null : instructor)
                  }
                >
                  <Text style={styles.instructorName}>{instructor.name}</Text>
                  {instructor.bio && (
                    <Text style={styles.instructorBio}>{instructor.bio}</Text>
                  )}
                  <Text style={styles.instructorRate}>
                    ${instructor.hourly_rate}/hr
                  </Text>
                  {isSelected && (
                    <Text style={styles.instructorSelectedText}>
                      Selecciona horario y cancha abajo
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })
          )}
        </View>
      )}

      {/* Court Time Slots */}
      <View
        style={[
          styles.slotsContainer,
          selectedInstructor && styles.slotsContainerHighlight,
        ]}
      >
        <Text style={styles.sectionTitle}>
          {selectedInstructor
            ? `🎾 Selecciona Hora y Cancha para ${selectedInstructor.name}`
            : "🎾 Selecciona Hora y Cancha"}
        </Text>
        <Text style={styles.dateText}>
          {formatDate(selectedDate, "dd 'de' MMMM")}
        </Text>
        <ScrollView style={styles.timeSlotsScroll}>
          {Object.entries(groupedTimeSlots()).map(([time, slots]) => (
            <View key={time} style={styles.timeSlotRow}>
              <View style={styles.timeColumn}>
                <Text style={styles.timeText}>{time}</Text>
                {slots[0]?.endTime && (
                  <Text style={styles.endTimeText}>→ {slots[0].endTime}</Text>
                )}
              </View>
              <View style={styles.courtsRow}>
                {slots.map((slot) => (
                  <TouchableOpacity
                    key={`${time}-${slot.courtId}`}
                    style={[
                      styles.courtButton,
                      !slot.available && styles.courtButtonDisabled,
                      selectedTime === time &&
                        selectedCourt?.id === slot.courtId &&
                        styles.courtButtonSelected,
                      selectedInstructor && styles.courtButtonInstructor,
                    ]}
                    onPress={() => {
                      if (slot.available && slot.courtId) {
                        const court = availability!.courts.find(
                          (c) => c.id === slot.courtId
                        )!;
                        if (selectedInstructor && onClassSelect) {
                          onClassSelect(selectedInstructor, time, court);
                        } else {
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 16,
    color: "#666",
    fontSize: 16,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    color: "#666",
    fontSize: 16,
    textAlign: "center",
  },
  eventsContainer: {
    padding: 16,
    backgroundColor: "#f0f9ff",
    borderRadius: 12,
    marginBottom: 16,
  },
  instructorsContainer: {
    padding: 16,
    backgroundColor: "#f0fdf4",
    borderRadius: 12,
    marginBottom: 16,
  },
  slotsContainer: {
    padding: 16,
  },
  slotsContainerHighlight: {
    backgroundColor: "#f0fdf4",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#10b981",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  dateText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  eventCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#3b82f6",
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3b82f6",
    flex: 1,
  },
  eventType: {
    fontSize: 12,
    backgroundColor: "#dbeafe",
    color: "#3b82f6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontWeight: "600",
  },
  eventDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  eventInfo: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 8,
  },
  eventInfoText: {
    fontSize: 14,
    color: "#333",
  },
  eventCourts: {
    fontSize: 12,
    color: "#666",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 8,
    marginTop: 8,
  },
  eventButton: {
    backgroundColor: "#3b82f6",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  eventButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  instructorCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#d1d5db",
  },
  instructorCardSelected: {
    borderColor: "#10b981",
    backgroundColor: "#f0fdf4",
  },
  instructorName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  instructorBio: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  instructorRate: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10b981",
  },
  instructorSelectedText: {
    fontSize: 12,
    color: "#10b981",
    marginTop: 8,
    fontWeight: "600",
  },
  timeSlotsScroll: {
    maxHeight: 400,
  },
  timeSlotRow: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "center",
  },
  timeColumn: {
    width: 100,
    marginRight: 12,
  },
  timeText: {
    fontSize: 14,
    fontWeight: "600",
  },
  endTimeText: {
    fontSize: 12,
    color: "#666",
  },
  courtsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    flex: 1,
  },
  courtButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minWidth: 80,
  },
  courtButtonDisabled: {
    opacity: 0.4,
    backgroundColor: "#f3f4f6",
  },
  courtButtonSelected: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  courtButtonInstructor: {
    borderColor: "#10b981",
  },
  courtButtonText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  courtButtonTextDisabled: {
    color: "#9ca3af",
  },
  courtButtonTextSelected: {
    color: "#fff",
  },
});
