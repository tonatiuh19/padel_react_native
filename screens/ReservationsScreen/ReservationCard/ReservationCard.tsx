import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { ReservationCardStyles } from "./ReservationCard.style";
import { Reservations } from "../../HomeScreen/HomeScreen.model";
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
  reservation: Reservations; // Adjust the type according to your reservation data structure
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

  return (
    <View
      style={
        reservation.validated === 0
          ? ReservationCardStyles.card
          : ReservationCardStyles.cardValidated
      }
    >
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
        {reservation.validated === 0 ? (
          <TouchableOpacity
            onPress={openTicket}
            style={ReservationCardStyles.column20}
          >
            <View style={ReservationCardStyles.row}>
              <Text style={ReservationCardStyles.cardTextTitleNumber}>
                <QRCode
                  value="https://intelipadel.com/"
                  backgroundColor="#000"
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
