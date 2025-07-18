import { Dimensions, StyleSheet } from "react-native";

const { height, width } = Dimensions.get("window");
export const ReservationCardHeight = (height * 0.8) / 3;
export const ReservationCardWidth = width;

export const ReservationCardStyles = StyleSheet.create({
  card: {
    marginBottom: 8,
    width: "100%",
    borderRadius: 22,
    overflow: "hidden",
    // Remove border
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    // Add shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6, // For Android
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
    flexDirection: "row",
  },
  columnLeftDetailsContainer: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    alignContent: "center",
  },
  columnLeftDetailsText: {
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: 22,
    color: "#e1dd2a",
    fontFamily: "Kanit-Regular",
  },
  columnCenterDetailsContainer: {
    flex: 1,
    alignItems: "center",
  },
  columnRightDetailsContainer: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
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
