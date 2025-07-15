import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
export const ReservationsScreenHeight = height;
export const ReservationsScreenWidth = width;

export const ReservationsScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#000",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
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
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  cardText: {
    fontSize: 18,
  },
  cardReservationEmpty: {
    width: ReservationsScreenWidth - 40,
    height: ReservationsScreenHeight * 0.2,
    alignItems: "center",
    justifyContent: "center",
  },
  cardReservationText: {
    fontSize: 18,
    color: "#000",
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
  buttonReservationText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "Kanit-Regular",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
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
  actionButtonText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "Kanit-Regular",
    textAlign: "center",
  },
});
