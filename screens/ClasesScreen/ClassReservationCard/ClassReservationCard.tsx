import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  ClassesReservationModel,
  Reservation,
  Reservations,
} from "../../HomeScreen/HomeScreen.model";
import {
  formatDate,
  formatFullDate,
  formatShortDate,
  formatTime,
} from "../../../utils/UtilsFunctions";
import QRCode from "react-native-qrcode-svg";
import TicketModal from "./TicketModal/TicketModal";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ClassReservationStyles } from "./ClassReservationCard.style";

interface ClassReservationProps {
  classReservation: ClassesReservationModel;
  onViewDetails?: () => void;
}

const ClassReservationCard: React.FC<ClassReservationProps> = ({
  classReservation,
  onViewDetails,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const openTicket = () => {
    setModalVisible(true);
  };

  const closeTicket = () => {
    setModalVisible(false);
  };

  const isExpired = () => {
    const now = new Date();
    // Extract date part from ISO string and combine with end_time
    const dateOnly = classReservation.class_date.split("T")[0];
    const classEndTime = new Date(`${dateOnly}T${classReservation.end_time}`);
    return now > classEndTime;
  };

  const getCardStyle = () => {
    if (isExpired()) {
      return ClassReservationStyles.cardExpired;
    } else if (classReservation.validated === 1) {
      return ClassReservationStyles.cardValidated;
    } else {
      return ClassReservationStyles.card;
    }
  };

  const getStatusColor = () => {
    if (isExpired()) return "#6b7280";
    if (
      classReservation.status === "confirmed" &&
      classReservation.payment_status === "paid"
    )
      return "#10b981";
    return "#f59e0b";
  };

  const getStatusText = () => {
    if (isExpired()) return "Expirada";
    if (classReservation.status === "confirmed") return "Confirmada";
    if (classReservation.payment_status === "paid") return "Pagada";
    return "Pendiente";
  };

  return (
    <View style={getCardStyle()}>
      <View style={ClassReservationStyles.header}>
        <View style={ClassReservationStyles.iconContainer}>
          <Ionicons name="school" size={24} color="#e1dd2a" />
        </View>
        <View style={ClassReservationStyles.headerInfo}>
          <Text style={ClassReservationStyles.className}>
            Clase con {classReservation.instructor_name || "Instructor"}
          </Text>
          <Text style={ClassReservationStyles.classInstructor}>
            {classReservation.court_name || "Cancha por confirmar"}
          </Text>
        </View>
        <View
          style={[
            ClassReservationStyles.statusBadge,
            { backgroundColor: getStatusColor() },
          ]}
        >
          <Text style={ClassReservationStyles.statusBadgeText}>
            {getStatusText()}
          </Text>
        </View>
      </View>

      <View style={ClassReservationStyles.details}>
        <View style={ClassReservationStyles.detailRow}>
          <Ionicons name="calendar-outline" size={18} color="#9ca3af" />
          <Text style={ClassReservationStyles.detailText}>
            {formatShortDate(classReservation.class_date.split("T")[0])}
          </Text>
        </View>
        <View style={ClassReservationStyles.detailRow}>
          <Ionicons name="time-outline" size={18} color="#9ca3af" />
          <Text style={ClassReservationStyles.detailText}>
            {(() => {
              const dateOnly = classReservation.class_date.split("T")[0];
              return `${formatTime(
                `${dateOnly}T${classReservation.start_time}`
              )}`;
            })()}
          </Text>
        </View>
        <View style={ClassReservationStyles.detailRow}>
          <Ionicons name="location-outline" size={18} color="#9ca3af" />
          <Text style={ClassReservationStyles.detailText}>
            {classReservation.court_name || "Por confirmar"}
          </Text>
        </View>
      </View>

      <View style={ClassReservationStyles.footer}>
        <View style={ClassReservationStyles.priceContainer}>
          <Text style={ClassReservationStyles.priceLabel}>Total</Text>
          <Text style={ClassReservationStyles.priceAmount}>
            ${classReservation.total_price || "0"}
          </Text>
        </View>
        <TouchableOpacity
          onPress={onViewDetails}
          style={ClassReservationStyles.actionButton}
        >
          <Text style={ClassReservationStyles.actionButtonText}>
            Ver detalles
          </Text>
          <Ionicons name="chevron-forward" size={16} color="#e1dd2a" />
        </TouchableOpacity>
      </View>

      <TicketModal
        visible={modalVisible}
        onClose={closeTicket}
        classReservation={classReservation}
      />
    </View>
  );
};

export default ClassReservationCard;
