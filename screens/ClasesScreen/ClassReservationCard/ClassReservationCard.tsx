import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
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
  classReservation: ClassesReservationModel; // Adjust the type according to your reservation data structure
}

const ClassReservationCard: React.FC<ClassReservationProps> = ({
  classReservation,
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
        classReservation.validated === 0
          ? ClassReservationStyles.card
          : ClassReservationStyles.cardValidated
      }
    >
      <View style={ClassReservationStyles.columnContainer}>
        <View style={ClassReservationStyles.column30}>
          <View style={ClassReservationStyles.row}>
            <Text style={ClassReservationStyles.cardTextTitleNumber}>
              {classReservation.event_title}
            </Text>
          </View>
        </View>
        <View style={ClassReservationStyles.verticalLine} />
        <View style={ClassReservationStyles.column50}>
          <View style={ClassReservationStyles.row}>
            <Text style={ClassReservationStyles.cardText}>Fecha:</Text>
            <Text style={ClassReservationStyles.cardTextValue}>
              {formatShortDate(classReservation.platforms_date_time_start)}
            </Text>
          </View>
          <View style={ClassReservationStyles.row}>
            <Text style={ClassReservationStyles.cardText}>Hora Inicio:</Text>
            <Text style={ClassReservationStyles.cardTextValue}>
              {formatTime(classReservation.platforms_date_time_start)}
            </Text>
          </View>
          <View style={ClassReservationStyles.row}>
            <Text style={ClassReservationStyles.cardText}>Hora Fin:</Text>
            <Text style={ClassReservationStyles.cardTextValue}>
              {formatTime(classReservation.platforms_date_time_end)}
            </Text>
          </View>
          <View style={ClassReservationStyles.row}>
            <Text style={ClassReservationStyles.cardText}>Lugar:</Text>
            <Text style={ClassReservationStyles.cardTextValue}>
              {classReservation.cancha}
            </Text>
          </View>
          {/* Add more rows as needed */}
        </View>
        {classReservation.validated === 0 ? (
          <TouchableOpacity
            onPress={openTicket}
            style={ClassReservationStyles.column20}
          >
            <View style={ClassReservationStyles.row}>
              <Text style={ClassReservationStyles.cardTextTitleNumber}>
                <QRCode
                  value="https://intelipadel.com/"
                  backgroundColor="#000"
                  color="#e1dd2a"
                  size={45}
                />
              </Text>
            </View>
            <View style={ClassReservationStyles.row}>
              <Text style={ClassReservationStyles.cardText}>Ver pase</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={ClassReservationStyles.column20}>
            <View style={ClassReservationStyles.row}>
              <Text style={ClassReservationStyles.cardTextTitleNumber}>
                <FontAwesome name="check" size={24} color="#e1dd2a" />
              </Text>
            </View>
            <View style={ClassReservationStyles.row}>
              <Text style={ClassReservationStyles.cardText}>Validado</Text>
            </View>
          </View>
        )}
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
