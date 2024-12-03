import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
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
  disabled?: boolean; // Add disabled prop
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  selectedTime,
  onTimeChange,
  disabled = false,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const disabledSlots = useSelector(selectDisabledSlots);
  const platformsFields = useSelector(selectPlatformsFields);

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
    <View
      style={
        disabled
          ? TimeSlotPickerStyles.pickerContainerDisabled
          : TimeSlotPickerStyles.pickerContainer
      }
    >
      <Picker
        selectedValue={selectedTime}
        onValueChange={(itemValue) => onTimeChange(itemValue)}
        style={TimeSlotPickerStyles.picker}
        enabled={!disabled}
      >
        {generateTimeSlots(
          8,
          23,
          1.5,
          disabledSlots.disabledSlots,
          disabledSlots.today
        ).map(renderPickerItem)}
      </Picker>
    </View>
  );
};

export default TimeSlotPicker;
