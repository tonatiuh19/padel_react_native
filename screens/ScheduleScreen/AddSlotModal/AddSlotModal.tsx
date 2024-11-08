import React, { useState } from "react";
import { View, StyleSheet, Modal, TextInput, Button, Text } from "react-native";
import { AddSlotModalStyles } from "./AddSlotModal.style";
import TimeSlotPicker from "./TimeSlotPicker/TimeSlotPicker";
import Countdown from "./Countdown/Countdown";

interface AddSlotModalProps {
  visible: boolean;
  onClose: () => void;
}

const AddSlotModal: React.FC<AddSlotModalProps> = ({ visible, onClose }) => {
  const [startTime, setStartTime] = useState("");

  const disabledSlots = ["12:00:00", "13:00:00"];

  const handleCountdownComplete = () => {
    console.log("Countdown complete!");
    // Trigger any function you want here
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={AddSlotModalStyles.backdrop}>
        <View style={AddSlotModalStyles.modalContainer}>
          <Text style={AddSlotModalStyles.title}>Add New Slot</Text>
          <Countdown duration={90} onComplete={handleCountdownComplete} />
          <TimeSlotPicker
            selectedTime={startTime}
            onTimeChange={setStartTime}
            disabledSlots={disabledSlots}
          />
          <View style={AddSlotModalStyles.buttonContainer}>
            <Button title="Cancel" onPress={onClose} color="red" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddSlotModal;
