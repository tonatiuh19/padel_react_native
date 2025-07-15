import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { ReservationCardStyles } from "./ReservationCard.style";
import { Reservation, Reservations } from "../../HomeScreen/HomeScreen.model";
import {
  formatDate,
  formatFullDate,
  formatShortDate,
  formatTime,
} from "../../../utils/UtilsFunctions";
import QRCode from "react-native-qrcode-svg";
import TicketModal from "./TicketModal/TicketModal";
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface ReservationCardProps {
  reservation: Reservation; // Adjust the type according to your reservation data structure
}

const ReservationCardList: React.FC<ReservationCardProps> = ({
  reservation,
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
    const reservationEndTime = new Date(reservation.platforms_date_time_end);
    return now > reservationEndTime;
  };

  const getCardStyle = () => {
    if (isExpired()) {
      return ReservationCardStyles.cardExpired;
    } else if (reservation.validated === 1) {
      return ReservationCardStyles.cardValidated;
    } else {
      return ReservationCardStyles.card;
    }
  };

  return (
    <View style={getCardStyle()}>
      <View style={ReservationCardStyles.columnContainer}>
        <View style={ReservationCardStyles.column30}>
          <View style={ReservationCardStyles.row}>
            <Text style={ReservationCardStyles.cardTextTitleNumber}>
              {reservation.id_platforms_field}
            </Text>
          </View>
          <View style={ReservationCardStyles.row}>
            <Text style={ReservationCardStyles.cardTextTitle}>CANCHA</Text>
          </View>
        </View>
        <View style={ReservationCardStyles.verticalLine} />
        <View style={ReservationCardStyles.column50}>
          <View style={ReservationCardStyles.row}>
            <Text style={ReservationCardStyles.cardText}>Fecha:</Text>
            <Text style={ReservationCardStyles.cardTextValue}>
              {formatShortDate(reservation.platforms_date_time_start)}
            </Text>
          </View>
          <View style={ReservationCardStyles.row}>
            <Text style={ReservationCardStyles.cardText}>Hora Inicio:</Text>
            <Text style={ReservationCardStyles.cardTextValue}>
              {formatTime(reservation.platforms_date_time_start)}
            </Text>
          </View>
          <View style={ReservationCardStyles.row}>
            <Text style={ReservationCardStyles.cardText}>Hora Fin:</Text>
            <Text style={ReservationCardStyles.cardTextValue}>
              {formatTime(reservation.platforms_date_time_end)}
            </Text>
          </View>
          {/* Add more rows as needed */}
        </View>
        {isExpired() ? (
          <View style={ReservationCardStyles.column20}>
            <View style={ReservationCardStyles.row}>
              <Text style={ReservationCardStyles.cardTextTitleNumber}>
                <FontAwesome name="clock-o" size={24} color="#e1dd2a" />
              </Text>
            </View>
            <View style={ReservationCardStyles.row}>
              <Text style={ReservationCardStyles.cardText}>Expirado</Text>
            </View>
          </View>
        ) : reservation.validated === 0 ? (
          <TouchableOpacity
            onPress={openTicket}
            style={ReservationCardStyles.column20}
          >
            <View style={ReservationCardStyles.row}>
              <Text style={ReservationCardStyles.cardTextTitleNumber}>
                <QRCode
                  value="https://intelipadel.com/"
                  backgroundColor="#292929"
                  color="#e1dd2a"
                  size={45}
                />
              </Text>
            </View>
            <View style={ReservationCardStyles.row}>
              <Text style={ReservationCardStyles.cardText}>Ver pase</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={ReservationCardStyles.column20}>
            <View style={ReservationCardStyles.row}>
              <Text style={ReservationCardStyles.cardTextTitleNumber}>
                <FontAwesome name="check" size={24} color="#e1dd2a" />
              </Text>
            </View>
            <View style={ReservationCardStyles.row}>
              <Text style={ReservationCardStyles.cardText}>Validado</Text>
            </View>
          </View>
        )}
      </View>

      <TicketModal
        visible={modalVisible}
        onClose={closeTicket}
        reservation={reservation}
      />
    </View>
  );
};

export default ReservationCardList;
