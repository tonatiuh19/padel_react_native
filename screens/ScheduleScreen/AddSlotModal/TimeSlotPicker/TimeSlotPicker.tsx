import React from "react";
import { View, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { TimeSlotPickerStyles } from "./TimeSlotPicker.style";

interface TimeSlotPickerProps {
  selectedTime: string;
  onTimeChange: (time: string) => void;
  disabledSlots: string[];
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  selectedTime,
  onTimeChange,
  disabledSlots,
}) => {
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 23; hour++) {
      const fullHour = Math.floor(hour);
      const minutes = (hour % 1) * 60;
      const formattedHour = fullHour < 10 ? `0${fullHour}` : fullHour;
      const formattedMinutes = minutes === 0 ? "00" : minutes;
      const time = `${formattedHour}:${formattedMinutes}:00`;
      if (!disabledSlots.includes(time)) {
        slots.push(time);
      }
    }
    return slots;
  };

  const formatTimeLabel = (time: string) => {
    const [hour, minutes] = time.split(":");
    const hourInt = parseInt(hour, 10);
    const ampm = hourInt >= 12 ? "PM" : "AM";
    const formattedHour = hourInt % 12 || 12;
    const formattedTime = `${
      formattedHour < 10 ? `0${formattedHour}` : formattedHour
    }:${minutes} ${ampm}`;
    return formattedTime;
  };

  const timeSlots = generateTimeSlots();

  return (
    <View style={TimeSlotPickerStyles.pickerContainer}>
      <Picker
        selectedValue={selectedTime}
        onValueChange={(itemValue) => onTimeChange(itemValue)}
        style={TimeSlotPickerStyles.picker}
      >
        {timeSlots.map((slot) => (
          <Picker.Item key={slot} label={formatTimeLabel(slot)} value={slot} />
        ))}
      </Picker>
    </View>
  );
};

export default TimeSlotPicker;
