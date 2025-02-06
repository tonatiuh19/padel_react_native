import React, { useEffect, useState } from "react";
import { View, Platform, Text, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { TimeSlotPickerStyles } from "./TimeSlotPicker.style";
import { generateTimeSlots } from "../../../../utils/UtilsFunctions";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../../store";
import {
  selectDisabledSlots,
  selectPlatformsFields,
} from "../../../../store/selectors";
import { fetchgetDisabledSlots } from "../../../../store/effects";
import LoadingSmall from "../../../HomeScreen/shared/components/LoadingSmall/LoadingSmall";

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

  const timeSlots = generateTimeSlots(
    8,
    22,
    1.5,
    disabledSlots.disabledSlots,
    disabledSlots.today
  ).filter((_, index) => Platform.OS !== "ios" || index !== 0); // Remove the first item if the platform is iOS

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
    <>
      {disabled ? (
        <LoadingSmall isLoading={true} />
      ) : (
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
              {timeSlots.map(renderPickerItem)}
            </Picker>
          </View>
          <TouchableOpacity
            style={TimeSlotPickerStyles.confirmButton}
            onPress={() => {
              const selectedTime = tempSelectedTime || timeSlots[0];
              onTimeChange(selectedTime);
              onConfirm();
            }}
          >
            <Text style={TimeSlotPickerStyles.confirmButtonText}>
              Confirmar
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default TimeSlotPicker;
