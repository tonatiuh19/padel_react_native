import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { TicketModalStyles } from "./TicketModal.style";
import { Reservations } from "../../../HomeScreen/HomeScreen.model";
import { formatShortDate, formatTime } from "../../../../utils/UtilsFunctions";

interface TicketModalProps {
  visible: boolean;
  onClose: () => void;
  reservation: Reservations;
}

const TicketModal: React.FC<TicketModalProps> = ({
  visible,
  onClose,
  reservation,
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
          <Text style={TicketModalStyles.title}>Detalles de la Reserva</Text>
          <QRCode
            value={`https://intelipadel.com/validate/${reservation.id_platforms_date_time_slot}`}
            backgroundColor="#fff"
            color="#000"
            size={150}
          />
          <View style={TicketModalStyles.detailsContainer}>
            <View style={TicketModalStyles.detailsItem}>
              <Text style={TicketModalStyles.detailTitle}>Cancha:</Text>
              <Text style={TicketModalStyles.detailText}>
                {reservation.id_platforms_field}
              </Text>
            </View>
            <View style={TicketModalStyles.detailsItem}>
              <Text style={TicketModalStyles.detailTitle}>Fecha:</Text>
              <Text style={TicketModalStyles.detailText}>
                {formatShortDate(reservation.platforms_date_time_start)}
              </Text>
            </View>
            <View style={TicketModalStyles.detailsItem}>
              <Text style={TicketModalStyles.detailTitle}>Hora Inicio:</Text>
              <Text style={TicketModalStyles.detailText}>
                {formatTime(reservation.platforms_date_time_start)}
              </Text>
            </View>
            <View style={TicketModalStyles.detailsItem}>
              <Text style={TicketModalStyles.detailTitle}>Hora Fin:</Text>
              <Text style={TicketModalStyles.detailText}>
                {formatTime(reservation.platforms_date_time_end)}
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
