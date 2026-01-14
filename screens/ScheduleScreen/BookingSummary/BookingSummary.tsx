import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Club {
  id: number;
  name: string;
  image_url: string;
  city: string;
}

interface Court {
  id: number;
  name: string;
  court_type: string;
}

interface BookingSummaryProps {
  club: Club;
  court: Court;
  date: Date;
  startTime: string;
  endTime: string;
  duration: number;
  totalPrice: number;
  bookingPrice?: number;
  serviceFee?: number;
  userPaysServiceFee?: number;
  feeStructure?: string;
  subtotal?: number;
  iva?: number;
  totalWithIVA?: number;
}

export default function BookingSummary({
  club,
  court,
  date,
  startTime,
  endTime,
  duration,
  totalPrice,
  bookingPrice,
  serviceFee,
  userPaysServiceFee,
  feeStructure,
  subtotal,
  iva,
  totalWithIVA,
}: BookingSummaryProps) {
  const getFeeStructureLabel = () => {
    switch (feeStructure) {
      case "shared_fee":
        return "Comisión compartida 50/50";
      case "club_absorbs_fee":
        return "Incluida en el precio";
      case "user_pays_fee":
      default:
        return "Comisión de servicio";
    }
  };

  const displayTotal = totalWithIVA ?? totalPrice;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Resumen de Reserva</Text>
      </View>

      {/* Club Info */}
      <View style={styles.clubSection}>
        <Image source={{ uri: club.image_url }} style={styles.clubImage} />
        <View style={styles.clubInfo}>
          <Text style={styles.clubName}>{club.name}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color="#9ca3af" />
            <Text style={styles.clubCity}>{club.city}</Text>
          </View>
        </View>
      </View>

      {/* Booking Details */}
      <View style={styles.detailsSection}>
        <View style={styles.detailRow}>
          <View style={styles.iconCircle}>
            <Ionicons name="calendar-outline" size={20} color="#e1dd2a" />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Fecha</Text>
            <Text style={styles.detailValue}>
              {format(date, "dd 'de' MMMM 'de' yyyy", { locale: es })}
            </Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.iconCircle}>
            <Ionicons name="time-outline" size={20} color="#e1dd2a" />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Horario</Text>
            <Text style={styles.detailValue}>
              {startTime} - {endTime}
            </Text>
            <Text style={styles.detailSubtext}>
              {duration === 60 ? "1 hora" : `${duration / 60} horas`}
            </Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.iconCircle}>
            <Ionicons name="business-outline" size={20} color="#e1dd2a" />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Cancha</Text>
            <Text style={styles.detailValue}>{court.name}</Text>
            <Text style={styles.detailSubtext}>{court.court_type}</Text>
          </View>
        </View>
      </View>

      {/* Price Breakdown */}
      <View style={styles.priceSection}>
        {bookingPrice !== undefined ? (
          <>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Precio de reserva</Text>
              <Text style={styles.priceValue}>${bookingPrice.toFixed(2)}</Text>
            </View>

            {userPaysServiceFee !== undefined && userPaysServiceFee > 0 && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>{getFeeStructureLabel()}</Text>
                <Text style={styles.priceValue}>
                  ${userPaysServiceFee.toFixed(2)}
                </Text>
              </View>
            )}

            {feeStructure === "club_absorbs_fee" && (
              <View style={styles.includedFeeRow}>
                <Text style={styles.includedFeeText}>✓ Comisión incluida</Text>
              </View>
            )}

            {subtotal !== undefined && (
              <View style={[styles.priceRow, styles.subtotalRow]}>
                <Text style={styles.priceLabel}>Subtotal</Text>
                <Text style={styles.priceValue}>${subtotal.toFixed(2)}</Text>
              </View>
            )}

            {iva !== undefined && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>IVA (16%)</Text>
                <Text style={styles.priceValue}>${iva.toFixed(2)}</Text>
              </View>
            )}

            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total a pagar</Text>
              <Text style={styles.totalValue}>${displayTotal.toFixed(2)}</Text>
            </View>
          </>
        ) : (
          <>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Precio por hora</Text>
              <Text style={styles.priceValue}>
                ${(club as any).price_per_hour?.toFixed(2)}
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Duración</Text>
              <Text style={styles.priceValue}>{duration / 60}h</Text>
            </View>
            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${totalPrice.toFixed(2)}</Text>
            </View>
          </>
        )}
      </View>
    </View>
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
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  clubSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  clubImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  clubInfo: {
    marginLeft: 16,
    flex: 1,
  },
  clubName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  clubCity: {
    fontSize: 14,
    color: "#9ca3af",
  },
  detailsSection: {
    gap: 16,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(234, 88, 12, 0.1)",
    alignItems: "center",
    justifyContent: "center",
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
    fontWeight: "600",
    color: "#ffffff",
  },
  detailSubtext: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 2,
  },
  priceSection: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#374151",
    gap: 12,
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
  includedFeeRow: {
    marginTop: -8,
  },
  includedFeeText: {
    fontSize: 12,
    color: "#10b981",
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
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  totalValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#e1dd2a",
  },
});
