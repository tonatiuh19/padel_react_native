import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Platform,
  Text,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { TimeSlotPickerStyles } from "./TimeSlotPicker.style";
import {
  formatTimeLabel,
  generateTimeSlots,
} from "../../../../utils/UtilsFunctions";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../../store";
import {
  selectDisabledSlots,
  selectPlatformsFields,
} from "../../../../store/selectors";
import { fetchgetDisabledSlots } from "../../../../store/effects";

interface TimeSlotPickerProps {
  selectedTime: string;
  onTimeChange: (time: string) => void;
  onConfirm: () => void; // Add onConfirm prop
  disabled?: boolean;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  selectedTime,
  onTimeChange,
  onConfirm,
  disabled = false,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const disabledSlots = useSelector(selectDisabledSlots);
  const platformsFields = useSelector(selectPlatformsFields);
  const [tempSelectedTime, setTempSelectedTime] = useState(selectedTime);

  useEffect(() => {
    console.log(
      "Disabled Slots",
      disabledSlots.today,
      disabledSlots.fullToday,
      platformsFields.id_platforms_field
    );
    dispatch(
      fetchgetDisabledSlots(
        disabledSlots.today,
        platformsFields.id_platforms_field
      )
    );
  }, [dispatch]);

  const renderPickerItem = (slot: string) => {
    if (slot === "") {
      return (
        <Picker.Item
          key={slot}
          label={slot}
          value={slot}
          enabled={false}
          style={TimeSlotPickerStyles.pickerItemDisabled}
        />
      );
    } else {
      return (
        <Picker.Item
          key={slot}
          label={slot}
          value={slot}
          style={TimeSlotPickerStyles.pickerItem}
        />
      );
    }
  };

  return (
    <View style={TimeSlotPickerStyles.pickerWrapper}>
      <View
        style={
          disabled
            ? TimeSlotPickerStyles.pickerContainerDisabled
            : TimeSlotPickerStyles.pickerContainer
        }
      >
        <Picker
          selectedValue={tempSelectedTime}
          onValueChange={(itemValue) => setTempSelectedTime(itemValue)}
          style={TimeSlotPickerStyles.picker}
          enabled={!disabled}
        >
          {generateTimeSlots(
            8,
            23,
            1.5,
            disabledSlots.disabledSlots,
            disabledSlots.today
          )
            .filter((_, index) => Platform.OS !== "ios" || index !== 0) // Remove the first item if the platform is iOS
            .map(renderPickerItem)}
        </Picker>
      </View>
      <TouchableOpacity
        style={TimeSlotPickerStyles.confirmButton}
        onPress={() => {
          onTimeChange(tempSelectedTime);
          onConfirm();
        }}
      >
        <Text style={TimeSlotPickerStyles.confirmButtonText}>Confirmar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TimeSlotPicker;
