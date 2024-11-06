import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const TimeSlotItemStyles = StyleSheet.create({
  item: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
    width: width - 40, // Adjust width to take up full space with some padding
  },
  activeItem: {
    backgroundColor: "#d4edda",
  },
  idleItem: {
    backgroundColor: "#f8d7da",
  },
  emptyItem: {
    backgroundColor: "#f0f0f0",
  },
});
