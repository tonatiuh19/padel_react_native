import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");
export const ReservationsScreenHeight = height;
export const ReservationsScreenWidth = width;

const ClasesScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#121212",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#ffffff",
  },
  scrollContainer: {
    alignItems: "center",
  },
  scrollContainerEmpty: {
    padding: 20,
    flexGrow: 1,
    justifyContent: "center",
  },
  card: {
    width: "90%",
    padding: 20,
    marginVertical: 10,
    backgroundColor: "#292929",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  cardText: {
    fontSize: 18,
    color: "#ffffff",
  },
  cardReservationEmpty: {
    width: ReservationsScreenWidth - 40,
    height: ReservationsScreenHeight * 0.2,
    alignItems: "center",
    justifyContent: "center",
  },
  cardReservationText: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "bold",
    marginBottom: 5,
    fontFamily: "Kanit-Regular",
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
  buttonDisabled: {
    backgroundColor: "#4a4a4a", // Dark gray background for disabled buttons
  },
  buttonReservationText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "Kanit-Regular",
  },
  textDisabled: {
    color: "#888", // Gray text for disabled buttons
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#1e1e1e",
    borderTopWidth: 1,
    borderTopColor: "#333333",
  },
  actionButton: {
    backgroundColor: "#e1dd2a",
    padding: 10,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  actionButtondisabled: {
    backgroundColor: "#4a4a4a",
  },
  actionButtonText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "Kanit-Regular",
    textAlign: "center",
  },
  actionButtonTextDisabled: {
    color: "#888",
  },
});

export default ClasesScreenStyles;
