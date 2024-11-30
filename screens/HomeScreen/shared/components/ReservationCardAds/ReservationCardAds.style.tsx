import { Dimensions, StyleSheet } from "react-native";

const { height, width } = Dimensions.get("window");
export const ReservationCardAdsHeight = (height * 0.8) / 3;
export const ReservationCardAdsWidth = width;

export const ReservationCardAdsStyles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 22,
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
  cardTitle: {
    fontSize: 18,
    color: "#000",
    fontWeight: "bold",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
  },
});
