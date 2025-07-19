import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { TicketModalStyles } from "./TicketModal.style";
import {
  Reservation,
  SubscriptionModel,
} from "../../../HomeScreen/HomeScreen.model";
import { formatShortDate, formatTime } from "../../../../utils/UtilsFunctions";

interface TicketModalProps {
  visible: boolean;
  onClose: () => void;
  reservation?: Reservation;
  subscription?: SubscriptionModel;
}

const TicketModal: React.FC<TicketModalProps> = ({
  visible,
  onClose,
  reservation,
  subscription,
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
          <Text style={TicketModalStyles.title}>
            {reservation
              ? "Detalles de la Reserva"
              : "Detalles de la Membresía"}
          </Text>
          {reservation && (
            <QRCode
              value={`https://intelipadel.com/validate/${reservation.id_platforms_date_time_slot}`}
              backgroundColor="#fff"
              color="#000"
              size={150}
            />
          )}
          {subscription && (
            <QRCode
              value={`https://intelipadel.com/membresia/${subscription.id}`}
              backgroundColor="#fff"
              color="#000"
              size={150}
            />
          )}
          <View style={TicketModalStyles.detailsContainer}>
            {reservation && (
              <>
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
                  <Text style={TicketModalStyles.detailTitle}>
                    Hora Inicio:
                  </Text>
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
              </>
            )}
            {subscription && (
              <>
                <View style={TicketModalStyles.detailsItem}>
                  <Text style={TicketModalStyles.detailTitle}>
                    ID Membresía:
                  </Text>
                  <Text style={TicketModalStyles.detailText}>
                    {subscription.id}
                  </Text>
                </View>
                <View style={TicketModalStyles.detailsItem}>
                  <Text style={TicketModalStyles.detailTitle}>Estado:</Text>
                  <Text style={TicketModalStyles.detailText}>
                    {subscription.active ? "Activa" : "Inactiva"}
                  </Text>
                </View>
                <View style={TicketModalStyles.detailsItem}>
                  <Text style={TicketModalStyles.detailTitle}>
                    Fecha de creación:
                  </Text>
                  <Text style={TicketModalStyles.detailText}>
                    {subscription.created
                      ? new Date(subscription.created).toLocaleDateString()
                      : ""}
                  </Text>
                </View>
              </>
            )}
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
