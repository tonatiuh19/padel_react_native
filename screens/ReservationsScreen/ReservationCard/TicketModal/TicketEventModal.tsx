import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { formatShortDate, formatTime } from "../../../../utils/UtilsFunctions";
import { TicketModalStyles } from "./TicketModal.style";
import { EventReservation } from "../../../HomeScreen/HomeScreen.model";

interface TicketEventModalProps {
  visible: boolean;
  onClose: () => void;
  reservationEvent: EventReservation;
}

const TicketEventModal: React.FC<TicketEventModalProps> = ({
  visible,
  onClose,
  reservationEvent,
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
          <Text style={TicketModalStyles.title}>Detalles del Evento</Text>
          <QRCode
            value={`https://intelipadel.com/validate/${reservationEvent.id_platforms_fields_events_users}`}
            backgroundColor="#fff"
            color="#000"
            size={150}
          />
          <View style={TicketModalStyles.detailsContainer}>
            <View style={TicketModalStyles.detailsItem}>
              <Text style={TicketModalStyles.detailTitle}>Fecha:</Text>
              <Text style={TicketModalStyles.detailText}>
                {formatShortDate(reservationEvent.start_date_time)}
              </Text>
            </View>
            <View style={TicketModalStyles.detailsItem}>
              <Text style={TicketModalStyles.detailTitle}>Hora Inicio:</Text>
              <Text style={TicketModalStyles.detailText}>
                {formatTime(reservationEvent.start_date_time)}
              </Text>
            </View>
            <View style={TicketModalStyles.detailsItem}>
              <Text style={TicketModalStyles.detailTitle}>Hora Fin:</Text>
              <Text style={TicketModalStyles.detailText}>
                {formatTime(reservationEvent.end_date_time)}
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

export default TicketEventModal;
