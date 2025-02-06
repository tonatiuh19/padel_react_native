import React from "react";
import { Modal, View, Image, TouchableOpacity, Text } from "react-native";
import { AdImageModalStyles } from "./AdImageModal.style";

interface AdImageModalProps {
  visible: boolean;
  onClose: () => void;
  imageUrl: string;
}

const AdImageModal: React.FC<AdImageModalProps> = ({
  visible,
  onClose,
  imageUrl,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={AdImageModalStyles.backdrop}>
        <View style={AdImageModalStyles.modalContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={AdImageModalStyles.image}
            resizeMode="contain"
          />
          <TouchableOpacity
            onPress={onClose}
            style={AdImageModalStyles.closeButton}
          >
            <Text style={AdImageModalStyles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AdImageModal;
