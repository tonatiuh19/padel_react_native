import { Dimensions, StyleSheet } from "react-native";

const { height, width } = Dimensions.get("window");
export const ReservationCardHeight = (height * 0.8) / 3;
export const ReservationCardWidth = width;

export const ReservationCardStyles = StyleSheet.create({
  card: {
    marginBottom: 8, // Only apply margin to the bottom
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  carouselContainer: {
    height: "70%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  detailsContainer: {
    height: "30%",
    width: "100%",
    padding: 16,
    backgroundColor: "#000", // Optional: Add a background color to make it more visible
  },
  cardTitle: {
    fontSize: 18,
    color: "#000",
    fontWeight: "bold",
    marginBottom: 8,
  },
  carouselImage: {
    width: "100%",
    height: "100%",
  },
});
