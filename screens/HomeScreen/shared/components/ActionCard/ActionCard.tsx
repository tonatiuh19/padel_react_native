import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ActionCardStyles } from "./ActionCard.style";
import TicketModal from "../../../../ReservationsScreen/ReservationCard/TicketModal/TicketModal";
import { Reservation, SubscriptionModel } from "../../../HomeScreen.model";

interface ActionCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  isTicketModal?: boolean;
  reservation?: Reservation;
  subscription?: SubscriptionModel; // <-- Add this prop
  onPressButton: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({
  icon,
  title,
  subtitle,
  isTicketModal = false,
  reservation,
  subscription, // <-- Accept subscription info
  onPressButton,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const openTicket = () => {
    setModalVisible(true);
  };

  const closeTicket = () => {
    setModalVisible(false);
  };

  return (
    <>
      <View style={ActionCardStyles.cardContainer}>
        {/* Floating Button */}
        <TouchableOpacity
          style={ActionCardStyles.floatingButton}
          onPress={isTicketModal ? openTicket : onPressButton}
          activeOpacity={0.7}
        >
          <Text style={ActionCardStyles.floatingButtonText}>
            {subscription ? "Abrir" : "Ver mas"}
          </Text>
        </TouchableOpacity>

        {/* Icon Row */}
        <View style={ActionCardStyles.icon}>
          <Ionicons name={icon} size={30} color="#fff" />
        </View>

        {/* Title Row */}
        <View>
          <Text style={ActionCardStyles.cardTitle}>{title}</Text>
          {subtitle && (
            <Text style={ActionCardStyles.cardSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      {reservation && (
        <TicketModal
          visible={modalVisible}
          onClose={closeTicket}
          reservation={reservation}
        />
      )}

      {subscription && (
        <TicketModal
          visible={modalVisible}
          onClose={closeTicket}
          subscription={subscription}
        />
      )}
    </>
  );
};

export default ActionCard;
