import { Dimensions, StyleSheet } from "react-native";

const { height, width } = Dimensions.get("window");
export const HomeScreenHeight = height;
export const HomeScreenWidth = width;

export const HomeScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  carouselContainer: {
    marginBottom: 20,
  },
  cardReservations: {
    width: HomeScreenWidth - 40,
    height: HomeScreenHeight * 0.2,
    alignItems: "center",
  },
  cardReservationEmpty: {
    width: HomeScreenWidth - 40,
    height: HomeScreenHeight * 0.2,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cardReservationText: {
    fontSize: 18,
    color: "#000",
    fontWeight: "bold",
    marginBottom: 5,
    fontFamily: "Kanit-Regular",
    textAlign: "center",
  },
  cardNoReservationTextContainer: {
    marginBottom: 5,
    textAlign: "center",
    backgroundColor: "#1c1c1c", // Dark gray background
    padding: 20,
    borderWidth: 1,
    borderRadius: 22,
  },
  cardNoReservationText: {
    fontSize: 25,
    color: "#e1dd2a",
    fontWeight: "bold",
    marginBottom: 5,
    fontFamily: "Kanit-Regular",
    textAlign: "center",
  },
  buttonReservation: {
    marginTop: 10,
    width: "60%",
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "#e1dd2a",
    borderRadius: 22,
    alignItems: "center",
  },
  buttonReservationText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "Kanit-Regular",
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 20,
  },
});

export default HomeScreenStyles;
