import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  formatDate,
  formatFullDate,
  formatShortDate,
  formatTime,
} from "../../../utils/UtilsFunctions";
import QRCode from "react-native-qrcode-svg";
import TicketModal from "./TicketModal/TicketModal";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ReservationCardStyles } from "./ReservationCard.style";
import { EventReservation } from "../../HomeScreen/HomeScreen.model";
import TicketEventModal from "./TicketModal/TicketEventModal";

interface ReservationEventCardProps {
  reservationEvent: EventReservation; // Adjust the type according to your reservation event data structure
}

const ReservationEventCard: React.FC<ReservationEventCardProps> = ({
  reservationEvent,
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
        reservationEvent.validated === 0
          ? ReservationCardStyles.cardEvent
          : ReservationCardStyles.cardValidated
      }
    >
      <View style={ReservationCardStyles.columnContainer}>
        <View style={ReservationCardStyles.column30}>
          <View style={ReservationCardStyles.row}>
            <Text style={ReservationCardStyles.cardTextTitleNumber}>
              {reservationEvent.id_platforms_field}
            </Text>
          </View>
          <View style={ReservationCardStyles.row}>
            <Text style={ReservationCardStyles.cardTextTitle}>Cancha</Text>
          </View>
        </View>
        <View style={ReservationCardStyles.verticalLine} />
        <View style={ReservationCardStyles.column50}>
          <View style={ReservationCardStyles.row}>
            <Text style={ReservationCardStyles.cardText}>Fecha:</Text>
            <Text style={ReservationCardStyles.cardTextValue}>
              {formatShortDate(reservationEvent.start_date_time)}
            </Text>
          </View>
          <View style={ReservationCardStyles.row}>
            <Text style={ReservationCardStyles.cardText}>Hora Inicio:</Text>
            <Text style={ReservationCardStyles.cardTextValue}>
              {formatTime(reservationEvent.start_date_time)}
            </Text>
          </View>
          <View style={ReservationCardStyles.row}>
            <Text style={ReservationCardStyles.cardText}>Hora Fin:</Text>
            <Text style={ReservationCardStyles.cardTextValue}>
              {formatTime(reservationEvent.end_date_time)}
            </Text>
          </View>
          {/* Add more rows as needed */}
        </View>
        {reservationEvent.validated === 0 ? (
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
              <Text style={ReservationCardStyles.cardText}>Evento</Text>
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

      <TicketEventModal
        visible={modalVisible}
        onClose={closeTicket}
        reservationEvent={reservationEvent}
      />
    </View>
  );
};

export default ReservationEventCard;
