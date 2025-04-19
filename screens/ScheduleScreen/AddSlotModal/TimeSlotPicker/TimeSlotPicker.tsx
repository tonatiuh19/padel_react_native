import React, { useEffect, useState } from "react";
import { View, Platform, Text, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { TimeSlotPickerStyles } from "./TimeSlotPicker.style";
import {
  generateFilteredTimeSlots,
  generateTimeSlots,
  getEndHour,
} from "../../../../utils/UtilsFunctions";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../../store";
import {
  selectDisabledSlots,
  selectIsScheduleClass,
  selectPlatformsFields,
  selectSelectedClass,
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
  const isScheduleClass = useSelector(selectIsScheduleClass);
  const selectedClass = useSelector(selectSelectedClass);
  const [tempSelectedTime, setTempSelectedTime] = useState(selectedTime);

  useEffect(() => {
    console.log(
      "Disabled Slots",
      getEndHour(selectedClass?.end_date_time || "")
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
    isScheduleClass ? getEndHour(selectedClass?.end_date_time || "") : 22,
    1.5,
    disabledSlots.disabledSlots,
    disabledSlots.today
  ).filter((_, index) => Platform.OS !== "ios" || index !== 0);

  const timeSlotsTemp = generateFilteredTimeSlots(
    8,
    isScheduleClass ? getEndHour(selectedClass?.end_date_time || "") : 22,
    1.5,
    disabledSlots.disabledSlots,
    disabledSlots.today
  ).filter((_, index) => Platform.OS !== "ios" || index !== 0);

  const timeClassesSlots = generateFilteredTimeSlots(
    8,
    getEndHour(selectedClass?.end_date_time || ""),
    1,
    disabledSlots.disabledSlots,
    disabledSlots.today
  ).filter((_, index) => Platform.OS !== "ios" || index !== 0);

  const minTimeSlot = timeSlotsTemp.length > 0 ? timeSlotsTemp[0] : null;

  const mergedTimeClassesSlots = minTimeSlot
    ? timeClassesSlots.filter((time) => time >= minTimeSlot)
    : timeClassesSlots;

  const mergedSlots = isScheduleClass ? mergedTimeClassesSlots : timeSlotsTemp;

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
              {mergedSlots.map(renderPickerItem)}
            </Picker>
          </View>
          <TouchableOpacity
            style={TimeSlotPickerStyles.confirmButton}
            onPress={() => {
              const selectedTime =
                tempSelectedTime ||
                (isScheduleClass
                  ? mergedTimeClassesSlots[0]
                  : timeSlotsTemp[0]);
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
