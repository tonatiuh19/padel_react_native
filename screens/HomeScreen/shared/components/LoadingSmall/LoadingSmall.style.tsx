import { Dimensions, StyleSheet } from "react-native";

export const LoadingSmallStyles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    zIndex: 1000, // Ensure it appears above everything
    elevation: 10, // For Android shadow
  },
});
