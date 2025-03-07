import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { ConfirmationModalStyles } from "./ConfirmationModal.style";

interface ConfirmationModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={ConfirmationModalStyles.backdrop}>
        <View style={ConfirmationModalStyles.modalContainer}>
          <Text style={ConfirmationModalStyles.title}>Confirmación</Text>
          <Text style={ConfirmationModalStyles.message}>
            ¿Estás seguro de que deseas eliminar tu cuenta?
          </Text>
          <View style={ConfirmationModalStyles.buttonContainer}>
            <TouchableOpacity
              style={ConfirmationModalStyles.confirmButton}
              onPress={onConfirm}
            >
              <Text style={ConfirmationModalStyles.buttonText}>Sí</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={ConfirmationModalStyles.cancelButton}
              onPress={onCancel}
            >
              <Text style={ConfirmationModalStyles.buttonText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationModal;
