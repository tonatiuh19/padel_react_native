import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import QRCode from "react-native-qrcode-svg";
import {
  ClassesReservationModel,
  Reservation,
  Reservations,
} from "../../../HomeScreen/HomeScreen.model";
import { formatShortDate, formatTime } from "../../../../utils/UtilsFunctions";
import { TicketModalStyles } from "./TicketModal.style";

interface TicketModalProps {
  visible: boolean;
  onClose: () => void;
  classReservation: ClassesReservationModel;
}

const TicketModal: React.FC<TicketModalProps> = ({
  visible,
  onClose,
  classReservation,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={TicketModalStyles.backdrop}>
        <View style={TicketModalStyles.modalContainer}>
          <Text style={TicketModalStyles.title}>Detalles de la Clase</Text>
          <QRCode
            value={`https://intelipadel.com/validate/${classReservation.id_platforms_fields_classes_users}`}
            backgroundColor="#fff"
            color="#000"
            size={150}
          />
          <View style={TicketModalStyles.detailsContainer}>
            <View style={TicketModalStyles.detailsItem}>
              <Text style={TicketModalStyles.detailTitle}>Clase:</Text>
              <Text style={TicketModalStyles.detailText}>
                {classReservation.event_title}
              </Text>
            </View>
            <View style={TicketModalStyles.detailsItem}>
              <Text style={TicketModalStyles.detailTitle}>Fecha:</Text>
              <Text style={TicketModalStyles.detailText}>
                {formatShortDate(classReservation.platforms_date_time_start)}
              </Text>
            </View>
            <View style={TicketModalStyles.detailsItem}>
              <Text style={TicketModalStyles.detailTitle}>Hora Inicio:</Text>
              <Text style={TicketModalStyles.detailText}>
                {formatTime(classReservation.platforms_date_time_start)}
              </Text>
            </View>
            <View style={TicketModalStyles.detailsItem}>
              <Text style={TicketModalStyles.detailTitle}>Hora Fin:</Text>
              <Text style={TicketModalStyles.detailText}>
                {formatTime(classReservation.platforms_date_time_end)}
              </Text>
            </View>
            <View style={TicketModalStyles.detailsItem}>
              <Text style={TicketModalStyles.detailTitle}>Cancha:</Text>
              <Text style={TicketModalStyles.detailText}>
                {classReservation.cancha}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={TicketModalStyles.closeButton}
            >
              <Text style={TicketModalStyles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TicketModal;
