import { Dimensions, StyleSheet } from "react-native";

const { height, width } = Dimensions.get("window");
export const HomeScreenHeight = height;
export const HomeScreenWidth = width;

export const HomeScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollView: {
    padding: 16,
  },
  carouselContainer: {
    marginBottom: 20,
  },
  cardTitle: {
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: 22,
    marginLeft: 10,
    color: "#e1dd2a",
    fontFamily: "Kanit-Regular",
  },
  divisorLine: {
    width: "100%",
    height: 2,
    backgroundColor: "#e1dd2a",
    marginVertical: 10,
    borderRadius: 5,
    shadowColor: "#000", // Black shadow
    shadowOffset: {
      width: 0,
      height: 4, // Vertical shadow
    },
    shadowOpacity: 0.3, // Shadow transparency
    shadowRadius: 4.65, // Shadow blur
    elevation: 8, // Android shadow
    padding: 20, // Padding inside the container
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
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
  shadowContainer: {
    backgroundColor: "#000", // Black background
    borderRadius: 22, // Rounded corners
    shadowColor: "#000", // Black shadow
    shadowOffset: {
      width: 0,
      height: 4, // Vertical shadow
    },
    shadowOpacity: 0.3, // Shadow transparency
    shadowRadius: 4.65, // Shadow blur
    elevation: 8, // Android shadow
    padding: 20, // Padding inside the container
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
  },
  cardsGrid: {
    flexDirection: "row", // Arrange items in a row
    flexWrap: "wrap", // Allow wrapping to the next row
    justifyContent: "flex-start", // Align cards to the left
    width: "100%", // Full width
  },
});

export default HomeScreenStyles;
