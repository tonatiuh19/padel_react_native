import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
export const TimeSlotPickeWidth = width;

export const TimeSlotPickerStyles = StyleSheet.create({
  pickerContainer: {
    width: TimeSlotPickeWidth * 0.6,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "#e1dd2a",
    borderRadius: 22,
    marginBottom: 10,
  },
  pickerContainerDisabled: {
    width: TimeSlotPickeWidth * 0.6,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "#555555",
    borderRadius: 22,
    marginBottom: 10,
  },
  picker: {
    width: "100%",
  },
  pickerItem: {
    fontSize: 16,
    fontFamily: "Kanit-Regular",
    color: "#000",
  },
  pickerItemDisabled: {
    fontSize: 16,
    fontFamily: "Kanit-Regular",
    color: "#999999",
  },
  pickerWrapper: {
    position: "relative",
    alignItems: "center",
  },
  confirmButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#e1dd2a",
    borderRadius: 22,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "Kanit-Regular",
  },
});
