import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type ConfirmationType = "court" | "class" | "event";

interface PaymentConfirmationScreenProps {
  type: ConfirmationType;
  confirmationNumber: string;
  bookingData: any;
  onDone: () => void;
  onAddToCalendar?: () => void;
}

export default function PaymentConfirmationScreen({
  type,
  confirmationNumber,
  bookingData,
  onDone,
  onAddToCalendar,
}: PaymentConfirmationScreenProps) {
  const getTitle = (): string => {
    switch (type) {
      case "court":
        return "¡Reserva Confirmada!";
      case "class":
        return "¡Clase Reservada!";
      case "event":
        return "¡Inscripción Confirmada!";
      default:
        return "¡Confirmado!";
    }
  };

  const getMessage = (): string => {
    switch (type) {
      case "court":
        return "Tu cancha ha sido reservada exitosamente. Recibirás un correo electrónico con los detalles.";
      case "class":
        return "Tu clase privada ha sido reservada. El instructor te contactará pronto.";
      case "event":
        return "Tu inscripción al evento ha sido confirmada. Te esperamos!";
      default:
        return "Tu reserva ha sido confirmada exitosamente.";
    }
  };

  const formatDateTime = (
    date: string,
    startTime: string,
    endTime?: string
  ): string => {
    try {
      const dateObj = new Date(date);
      const days = [
        "domingo",
        "lunes",
        "martes",
        "miércoles",
        "jueves",
        "viernes",
        "sábado",
      ];
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

      const dayName = days[dateObj.getDay()];
      const day = dateObj.getDate();
      const monthName = months[dateObj.getMonth()];
      const year = dateObj.getFullYear();

      const formattedDate = `${dayName}, ${day} de ${monthName} ${year}`;
      const timeRange = endTime
        ? `${startTime.substring(0, 5)} - ${endTime.substring(0, 5)}`
        : startTime.substring(0, 5);
      return `${formattedDate} • ${timeRange}`;
    } catch {
      return `${date} • ${startTime.substring(0, 5)}`;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={64} color="#10b981" />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>{getTitle()}</Text>
        <Text style={styles.message}>{getMessage()}</Text>

        {/* Confirmation Number */}
        <View style={styles.confirmationCard}>
          <Text style={styles.confirmationLabel}>Número de Confirmación</Text>
          <Text style={styles.confirmationNumber}>{confirmationNumber}</Text>
        </View>

        {/* Booking Details */}
        <View style={styles.detailsCard}>
          {type === "court" && bookingData && (
            <>
              {bookingData.club_name && (
                <View style={styles.detailRow}>
                  <Ionicons name="location" size={20} color="#8c8a1a" />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Club</Text>
                    <Text style={styles.detailValue}>
                      {bookingData.club_name}
                    </Text>
                  </View>
                </View>
              )}

              {bookingData.court_name && (
                <View style={styles.detailRow}>
                  <Ionicons name="tennisball" size={20} color="#8c8a1a" />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Cancha</Text>
                    <Text style={styles.detailValue}>
                      {bookingData.court_name}
                    </Text>
                  </View>
                </View>
              )}

              {bookingData.booking_date && bookingData.start_time && (
                <View style={styles.detailRow}>
                  <Ionicons name="calendar" size={20} color="#8c8a1a" />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Fecha y Hora</Text>
                    <Text style={styles.detailValue}>
                      {formatDateTime(
                        bookingData.booking_date,
                        bookingData.start_time,
                        bookingData.end_time
                      )}
                    </Text>
                  </View>
                </View>
              )}

              {bookingData.total_price && (
                <View style={[styles.detailRow, styles.priceRow]}>
                  <Ionicons name="cash" size={20} color="#10b981" />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Total Pagado</Text>
                    <Text style={styles.priceValue}>
                      ${parseFloat(bookingData.total_price).toFixed(2)} MXN
                    </Text>
                  </View>
                </View>
              )}
            </>
          )}

          {type === "class" && bookingData && (
            <>
              {bookingData.club_name && (
                <View style={styles.detailRow}>
                  <Ionicons name="location" size={20} color="#10b981" />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Club</Text>
                    <Text style={styles.detailValue}>
                      {bookingData.club_name}
                    </Text>
                  </View>
                </View>
              )}

              {bookingData.instructor_name && (
                <View style={styles.detailRow}>
                  <Ionicons name="person" size={20} color="#10b981" />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Instructor</Text>
                    <Text style={styles.detailValue}>
                      {bookingData.instructor_name}
                    </Text>
                  </View>
                </View>
              )}

              {bookingData.class_date && bookingData.start_time && (
                <View style={styles.detailRow}>
                  <Ionicons name="calendar" size={20} color="#10b981" />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Fecha y Hora</Text>
                    <Text style={styles.detailValue}>
                      {formatDateTime(
                        bookingData.class_date,
                        bookingData.start_time,
                        bookingData.end_time
                      )}
                    </Text>
                  </View>
                </View>
              )}

              {bookingData.class_type && (
                <View style={styles.detailRow}>
                  <Ionicons name="people" size={20} color="#10b981" />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Tipo de Clase</Text>
                    <Text style={styles.detailValue}>
                      {bookingData.class_type === "individual"
                        ? "Individual"
                        : bookingData.class_type === "group"
                        ? "Grupal"
                        : "Semi-Privada"}
                    </Text>
                  </View>
                </View>
              )}

              {bookingData.total_price && (
                <View style={[styles.detailRow, styles.priceRow]}>
                  <Ionicons name="cash" size={20} color="#10b981" />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Total Pagado</Text>
                    <Text style={styles.priceValue}>
                      ${parseFloat(bookingData.total_price).toFixed(2)} MXN
                    </Text>
                  </View>
                </View>
              )}
            </>
          )}

          {type === "event" && bookingData && (
            <>
              {bookingData.event_title && (
                <View style={styles.detailRow}>
                  <Ionicons name="trophy" size={20} color="#8c8a1a" />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Evento</Text>
                    <Text style={styles.detailValue}>
                      {bookingData.event_title}
                    </Text>
                  </View>
                </View>
              )}

              {bookingData.club_name && (
                <View style={styles.detailRow}>
                  <Ionicons name="location" size={20} color="#8c8a1a" />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Club</Text>
                    <Text style={styles.detailValue}>
                      {bookingData.club_name}
                    </Text>
                  </View>
                </View>
              )}

              {bookingData.event_date && bookingData.start_time && (
                <View style={styles.detailRow}>
                  <Ionicons name="calendar" size={20} color="#8c8a1a" />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Fecha y Hora</Text>
                    <Text style={styles.detailValue}>
                      {formatDateTime(
                        bookingData.event_date,
                        bookingData.start_time,
                        bookingData.end_time
                      )}
                    </Text>
                  </View>
                </View>
              )}

              {bookingData.total_price && (
                <View style={[styles.detailRow, styles.priceRow]}>
                  <Ionicons name="cash" size={20} color="#10b981" />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Total Pagado</Text>
                    <Text style={styles.priceValue}>
                      ${parseFloat(bookingData.total_price).toFixed(2)} MXN
                    </Text>
                  </View>
                </View>
              )}
            </>
          )}
        </View>

        {/* Important Info */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color="#8c8a1a" />
          <Text style={styles.infoText}>
            {type === "court" &&
              "Recuerda llegar 10 minutos antes de tu reserva. Presenta tu número de confirmación en recepción."}
            {type === "class" &&
              "Llega 15 minutos antes de tu clase. El instructor te estará esperando en la cancha asignada."}
            {type === "event" &&
              "Llega 15 minutos antes del inicio del evento para el registro. No olvides traer tu equipo."}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {onAddToCalendar && (
            <TouchableOpacity
              style={styles.calendarButton}
              onPress={onAddToCalendar}
            >
              <Ionicons name="calendar-outline" size={20} color="#8c8a1a" />
              <Text style={styles.calendarButtonText}>
                Agregar al Calendario
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.doneButton} onPress={onDone}>
            <Text style={styles.doneButtonText}>Finalizar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  iconContainer: {
    marginVertical: 32,
  },
  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#10b981",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  confirmationCard: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: "#10b981",
    width: "100%",
    alignItems: "center",
    marginBottom: 24,
  },
  confirmationLabel: {
    fontSize: 14,
    color: "#9ca3af",
    marginBottom: 8,
  },
  confirmationNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#10b981",
    letterSpacing: 2,
  },
  detailsCard: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#374151",
    width: "100%",
    marginBottom: 24,
    gap: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "500",
  },
  priceRow: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#374151",
  },
  priceValue: {
    fontSize: 20,
    color: "#10b981",
    fontWeight: "bold",
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.3)",
    width: "100%",
    marginBottom: 32,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#93c5fd",
    lineHeight: 20,
  },
  actionsContainer: {
    width: "100%",
    gap: 12,
  },
  calendarButton: {
    flexDirection: "row",
    backgroundColor: "rgba(234, 88, 12, 0.1)",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#8c8a1a",
  },
  calendarButtonText: {
    color: "#8c8a1a",
    fontWeight: "600",
    fontSize: 16,
  },
  doneButton: {
    backgroundColor: "#8c8a1a",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  doneButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
