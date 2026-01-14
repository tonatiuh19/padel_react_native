import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Instructor {
  id: number;
  name: string;
  specialties?: string[];
  bio?: string;
  avatar_url?: string;
}

interface ClassRegistrationSummaryProps {
  instructor: Instructor;
  clubName: string;
  clubImage: string;
  classType: "individual" | "group" | "semi_private";
  classDate: string;
  startTime: string;
  endTime: string;
  numberOfStudents: number;
  totalPrice: number;
  focusAreas?: string[];
  studentLevel?: "beginner" | "intermediate" | "advanced" | "expert" | null;
  feeStructure?:
    | "user_pays_fee"
    | "shared_fee"
    | "club_absorbs_fee"
    | "club_pays";
  serviceFeePercentage?: number;
  // Price breakdown from backend
  bookingPrice?: number;
  serviceFee?: number;
  userPaysServiceFee?: number;
  subtotal?: number;
  iva?: number;
  totalWithIVA?: number;
}

export default function ClassRegistrationSummary({
  instructor,
  clubName,
  clubImage,
  classType,
  classDate,
  startTime,
  endTime,
  numberOfStudents,
  totalPrice,
  focusAreas,
  studentLevel,
  feeStructure = "club_absorbs_fee",
  serviceFeePercentage = 8,
  // Price breakdown from backend
  bookingPrice: propsBookingPrice,
  serviceFee: propsServiceFee,
  userPaysServiceFee: propsUserPaysServiceFee,
  subtotal: propsSubtotal,
  iva: propsIva,
  totalWithIVA: propsTotalWithIVA,
}: ClassRegistrationSummaryProps) {
  // Log all price-related props for debugging
  console.log("🔍 ClassRegistrationSummary - Price Props:", {
    totalPrice,
    feeStructure,
    serviceFeePercentage,
    propsBookingPrice,
    propsServiceFee,
    propsUserPaysServiceFee,
    propsSubtotal,
    propsIva,
    propsTotalWithIVA,
  });

  // Use backend calculation if provided, otherwise calculate locally
  const basePrice = propsBookingPrice ?? totalPrice ?? 0;

  // Ensure serviceFeePercentage is a valid number
  const validServiceFeePercentage =
    typeof serviceFeePercentage === "number" && !isNaN(serviceFeePercentage)
      ? serviceFeePercentage
      : 8;

  // Normalize fee structure naming (backend may use "club_pays" or "club_absorbs_fee")
  const normalizedFeeStructure =
    feeStructure === "club_pays" ? "club_absorbs_fee" : feeStructure;

  // Calculate full service fee for display (always based on base price)
  const fullServiceFee = basePrice * (validServiceFeePercentage / 100);

  console.log(
    "💰 Base Price:",
    basePrice,
    "Service Fee %:",
    validServiceFeePercentage,
    "Full Service Fee:",
    fullServiceFee,
    "Fee Structure:",
    normalizedFeeStructure
  );

  // The actual service fee charged (from backend or calculated)
  const serviceFee = propsServiceFee ?? fullServiceFee;

  let userPaysServiceFee: number;
  if (propsUserPaysServiceFee !== undefined) {
    // Always trust backend calculation
    userPaysServiceFee = propsUserPaysServiceFee;
  } else {
    // Calculate based on fee structure (fallback)
    if (normalizedFeeStructure === "user_pays_fee") {
      userPaysServiceFee = serviceFee;
    } else if (normalizedFeeStructure === "shared_fee") {
      userPaysServiceFee = serviceFee / 2;
    } else {
      // club_absorbs_fee - user doesn't pay
      userPaysServiceFee = 0;
    }
  }

  const subtotal = propsSubtotal ?? basePrice + userPaysServiceFee;
  const iva = propsIva ?? subtotal * 0.16;
  const totalWithIVA = propsTotalWithIVA ?? subtotal + iva;

  console.log("💰 ClassRegistrationSummary - Calculated Values:", {
    basePrice,
    fullServiceFee,
    serviceFee,
    userPaysServiceFee,
    subtotal,
    iva,
    totalWithIVA,
  });

  const classTypeLabels: Record<string, string> = {
    individual: "Clase Individual",
    group: "Clase Grupal",
    semi_private: "Clase Semi-Privada",
  };

  const levelLabels: Record<string, string> = {
    beginner: "Principiante",
    intermediate: "Intermedio",
    advanced: "Avanzado",
    expert: "Experto",
  };

  return (
    <ScrollView style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="school-outline" size={20} color="#10b981" />
        </View>
        <Text style={styles.title}>Resumen de Clase</Text>
      </View>

      {/* Class Type Badge */}
      <View style={styles.badgeContainer}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {classTypeLabels[classType] || classType}
          </Text>
        </View>
      </View>

      {/* Class Title */}
      <View style={styles.titleSection}>
        <Text style={styles.classTitle}>Clase Privada de Pádel</Text>
        <Text style={styles.instructorName}>Con {instructor.name}</Text>
      </View>

      {/* Instructor Info */}
      {instructor.avatar_url && (
        <View style={styles.instructorCard}>
          <Image
            source={{ uri: instructor.avatar_url }}
            style={styles.instructorImage}
          />
          <View style={styles.instructorInfo}>
            <Text style={styles.instructorLabel}>{instructor.name}</Text>
            {instructor.specialties && instructor.specialties.length > 0 && (
              <Text style={styles.specialties}>
                {instructor.specialties.join(", ")}
              </Text>
            )}
          </View>
        </View>
      )}

      {/* Class Details */}
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
            <Text style={styles.detailLabel}>Fecha</Text>
            <Text style={styles.detailValue}>
              {format(new Date(classDate), "EEEE, d 'de' MMMM yyyy", {
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
              {startTime.substring(0, 5)} - {endTime.substring(0, 5)}
            </Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="people-outline" size={20} color="#9ca3af" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Estudiantes</Text>
            <Text style={styles.detailValue}>
              {numberOfStudents}{" "}
              {numberOfStudents === 1 ? "estudiante" : "estudiantes"}
            </Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="person-outline" size={20} color="#9ca3af" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Instructor</Text>
            <Text style={styles.detailValue}>{instructor.name}</Text>
          </View>
        </View>

        {studentLevel && (
          <View style={styles.detailRow}>
            <Ionicons name="school-outline" size={20} color="#9ca3af" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Nivel</Text>
              <Text style={styles.detailValue}>
                {levelLabels[studentLevel] || studentLevel}
              </Text>
            </View>
          </View>
        )}

        {focusAreas && focusAreas.length > 0 && (
          <View style={styles.detailRow}>
            <Ionicons name="fitness-outline" size={20} color="#9ca3af" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Áreas de Enfoque</Text>
              <View style={styles.focusAreasContainer}>
                {focusAreas.map((area, index) => (
                  <View key={index} style={styles.focusAreaBadge}>
                    <Text style={styles.focusAreaText}>{area}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Price */}
      <View style={styles.priceSection}>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Tarifa de Clase</Text>
          <Text style={styles.priceValue}>${basePrice.toFixed(2)}</Text>
        </View>

        {/* Always show service fee amount */}
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>
            Cargo por Servicio ({serviceFeePercentage}%)
            {normalizedFeeStructure === "shared_fee" && " (Compartido)"}
            {normalizedFeeStructure === "club_absorbs_fee" && " (Incluido)"}
          </Text>
          <Text
            style={[
              styles.priceValue,
              normalizedFeeStructure === "club_absorbs_fee" &&
                styles.includedValue,
            ]}
          >
            ${fullServiceFee.toFixed(2)}
          </Text>
        </View>

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
          <Text style={styles.infoTextBold}>Importante:</Text> Llega al menos 10
          minutos antes de tu clase para prepararte y aprovechar al máximo el
          tiempo con tu instructor.
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
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#10b981",
  },
  titleSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  classTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#10b981",
    marginBottom: 4,
  },
  instructorName: {
    fontSize: 14,
    color: "#9ca3af",
  },
  instructorCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)",
    marginBottom: 20,
  },
  instructorImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  instructorInfo: {
    marginLeft: 12,
    flex: 1,
  },
  instructorLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#10b981",
  },
  specialties: {
    fontSize: 12,
    color: "#059669",
    marginTop: 2,
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
  focusAreasContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 4,
  },
  focusAreaBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  focusAreaText: {
    fontSize: 10,
    color: "#10b981",
  },
  priceSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#374151",
    gap: 8,
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
    color: "#10b981",
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
