import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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

interface EventRegistrationSummaryProps {
  event: Event;
  clubName: string;
  clubImage: string;
  totalPrice: number;
  originalPrice?: number;
  discountApplied?: number;
  feeStructure?: "user_pays_fee" | "shared_fee" | "club_absorbs_fee";
  serviceFeePercentage?: number;
}

export default function EventRegistrationSummary({
  event,
  clubName,
  clubImage,
  totalPrice,
  originalPrice,
  discountApplied,
  feeStructure = "club_absorbs_fee",
  serviceFeePercentage = 8,
}: EventRegistrationSummaryProps) {
  // Calculate service fees
  const serviceFee = totalPrice * (serviceFeePercentage / 100);
  let userPaysServiceFee = 0;
  const basePrice = totalPrice;

  if (feeStructure === "user_pays_fee") {
    userPaysServiceFee = serviceFee;
  } else if (feeStructure === "shared_fee") {
    userPaysServiceFee = serviceFee / 2;
  }

  const subtotal = basePrice + userPaysServiceFee;
  const iva = subtotal * 0.16;
  const totalWithIVA = subtotal + iva;

  const eventTypeLabels: Record<string, string> = {
    tournament: "Torneo",
    league: "Liga",
    clinic: "Clínica",
    social: "Social",
    championship: "Campeonato",
  };

  const skillLevelLabels: Record<string, string> = {
    all: "Todos los Niveles",
    beginner: "Principiante",
    intermediate: "Intermedio",
    advanced: "Avanzado",
    expert: "Experto",
  };

  return (
    <ScrollView style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="trophy-outline" size={20} color="#e1dd2a" />
        </View>
        <Text style={styles.title}>Resumen de Inscripción</Text>
      </View>

      {/* Event Badge */}
      <View style={styles.badgeContainer}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {eventTypeLabels[event.event_type] || event.event_type}
          </Text>
        </View>
      </View>

      {/* Event Title */}
      <View style={styles.titleSection}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        {event.description && (
          <Text style={styles.eventDescription}>{event.description}</Text>
        )}
      </View>

      {/* Event Details */}
      <View style={styles.detailsSection}>
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={20} color="#9ca3af" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Club</Text>
            <Text style={styles.detailValue}>{clubName}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={20} color="#9ca3af" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Fecha del Evento</Text>
            <Text style={styles.detailValue}>
              {format(new Date(event.event_date), "EEEE, d 'de' MMMM yyyy", {
                locale: es,
              })}
            </Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={20} color="#9ca3af" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Horario</Text>
            <Text style={styles.detailValue}>
              {event.start_time.substring(0, 5)} -{" "}
              {event.end_time.substring(0, 5)}
            </Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="people-outline" size={20} color="#9ca3af" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Participantes</Text>
            <Text style={styles.detailValue}>
              {event.current_participants}/{event.max_participants || "∞"}{" "}
              inscritos
            </Text>
          </View>
        </View>

        {event.skill_level && event.skill_level !== "all" && (
          <View style={styles.detailRow}>
            <Ionicons name="trophy-outline" size={20} color="#9ca3af" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Nivel</Text>
              <Text style={styles.detailValue}>
                {skillLevelLabels[event.skill_level] || event.skill_level}
              </Text>
            </View>
          </View>
        )}

        {event.prize_pool && parseFloat(String(event.prize_pool)) > 0 && (
          <View style={styles.prizeBox}>
            <Text style={styles.prizeLabel}>Premio del Evento</Text>
            <Text style={styles.prizeValue}>
              ${parseFloat(String(event.prize_pool)).toFixed(2)} MXN
            </Text>
          </View>
        )}
      </View>

      {/* Price */}
      <View style={styles.priceSection}>
        {discountApplied && discountApplied > 0 && (
          <View style={styles.discountBox}>
            <View style={styles.discountHeader}>
              <Ionicons name="pricetag" size={16} color="#f59e0b" />
              <Text style={styles.discountTitle}>Descuento de Membresía</Text>
            </View>
            <View style={styles.discountRow}>
              <Text style={styles.discountPercentage}>
                {originalPrice &&
                  ((discountApplied / originalPrice) * 100).toFixed(0)}
                % de descuento
              </Text>
              <Text style={styles.discountAmount}>
                -${discountApplied.toFixed(2)}
              </Text>
            </View>
          </View>
        )}

        {originalPrice && discountApplied && discountApplied > 0 ? (
          <>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Cuota Original</Text>
              <Text style={styles.originalPrice}>
                ${originalPrice.toFixed(2)}
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Cuota con Descuento</Text>
              <Text style={styles.discountedPrice}>
                ${totalPrice.toFixed(2)}
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Cuota de Inscripción</Text>
            <Text style={styles.priceValue}>${totalPrice.toFixed(2)}</Text>
          </View>
        )}

        <View style={[styles.priceRow, styles.subtotalRow]}>
          <Text style={styles.priceLabel}>Cuota de Inscripción</Text>
          <Text style={styles.priceValue}>${basePrice.toFixed(2)}</Text>
        </View>

        {userPaysServiceFee > 0 && (
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              Cargo por Servicio ({serviceFeePercentage}%
              {feeStructure === "shared_fee" ? " ÷ 2" : ""})
            </Text>
            <Text style={styles.priceValue}>
              ${userPaysServiceFee.toFixed(2)}
            </Text>
          </View>
        )}

        {feeStructure === "club_absorbs_fee" && (
          <View style={styles.includedRow}>
            <Text style={styles.includedText}>Cargo por Servicio</Text>
            <Text style={styles.includedValue}>Incluido</Text>
          </View>
        )}

        <View style={[styles.priceRow, styles.subtotalRow]}>
          <Text style={styles.priceLabel}>Subtotal</Text>
          <Text style={styles.priceValue}>${subtotal.toFixed(2)}</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>IVA (16%)</Text>
          <Text style={styles.priceValue}>${iva.toFixed(2)}</Text>
        </View>

        <View style={[styles.priceRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total a Pagar</Text>
          <Text style={styles.totalValue}>${totalWithIVA.toFixed(2)}</Text>
        </View>
      </View>

      {/* Info Box */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          <Text style={styles.infoTextBold}>Importante:</Text> Llega al menos 15
          minutos antes del inicio del evento para el registro.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#374151",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  clubImage: {
    width: "100%",
    height: 160,
    borderRadius: 8,
    marginBottom: 16,
  },
  badgeContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  badge: {
    backgroundColor: "rgba(234, 88, 12, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#e1dd2a",
  },
  titleSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e1dd2a",
    textAlign: "center",
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
  },
  detailsSection: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#374151",
    gap: 12,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
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
    fontSize: 14,
    color: "#ffffff",
  },
  prizeBox: {
    backgroundColor: "rgba(234, 88, 12, 0.1)",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(234, 88, 12, 0.3)",
  },
  prizeLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#e1dd2a",
    marginBottom: 4,
  },
  prizeValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fb923c",
  },
  priceSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#374151",
    gap: 8,
  },
  discountBox: {
    backgroundColor: "rgba(251, 191, 36, 0.1)",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(251, 191, 36, 0.3)",
    marginBottom: 12,
  },
  discountHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  discountTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#f59e0b",
  },
  discountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  discountPercentage: {
    fontSize: 14,
    color: "#f59e0b",
  },
  discountAmount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f59e0b",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 14,
    color: "#9ca3af",
  },
  priceValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#ffffff",
  },
  originalPrice: {
    fontSize: 14,
    color: "#9ca3af",
    textDecorationLine: "line-through",
  },
  discountedPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#10b981",
  },
  includedRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  includedText: {
    fontSize: 12,
    color: "#9ca3af",
    fontStyle: "italic",
  },
  includedValue: {
    fontSize: 12,
    color: "#9ca3af",
    fontStyle: "italic",
  },
  subtotalRow: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#374151",
  },
  totalRow: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#374151",
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
  totalValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#e1dd2a",
  },
  infoBox: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.3)",
  },
  infoText: {
    fontSize: 12,
    color: "#93c5fd",
  },
  infoTextBold: {
    fontWeight: "bold",
  },
});
