import { StyleSheet } from "react-native";

export const ActionCardStyles = StyleSheet.create({
  cardContainer: {
    width: "48%", // Two cards per row with spacing
    backgroundColor: "#1c1c1c",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 16,
    marginBottom: 10,
    marginTop: 10,
    position: "relative", // For floating button
    justifyContent: "space-between", // Push content to top and bottom
  },
  floatingButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1, // Ensure it is above other elements
  },
  iconRow: {
    alignItems: "center", // Center the icon horizontally
    marginBottom: 10, // Add spacing between the icon and the title
  },
  icon: {
    marginBottom: 10, // Add spacing below the icon
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e1dd2a", // Change to your desired text color
    fontFamily: "Kanit-Regular",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#aaa", // Lighter color for the subtitle
    fontFamily: "Kanit-Regular",
    marginTop: 5, // Add spacing between the title and subtitle
  },
  floatingButtonText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000", // Change to your desired text color
    fontFamily: "Kanit-Regular",
  },
});
