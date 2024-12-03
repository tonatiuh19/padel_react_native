import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { RetryModalStyles } from "./RetryModal.style";

interface RetryModalProps {
  visible: boolean;
  message: string;
  onRetry: () => void;
  onClose: () => void;
}

const RetryModal: React.FC<RetryModalProps> = ({
  visible,
  message,
  onRetry,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={RetryModalStyles.backdrop}>
        <View style={RetryModalStyles.modalContainer}>
          <Text style={RetryModalStyles.message}>{message}</Text>
          <View style={RetryModalStyles.buttonContainer}>
            <TouchableOpacity style={RetryModalStyles.button} onPress={onRetry}>
              <Text style={RetryModalStyles.buttonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RetryModal;
