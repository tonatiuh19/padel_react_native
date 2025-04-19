import { StyleSheet } from "react-native";

export const TicketModalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  detailsContainer: {
    marginVertical: 20,
    marginTop: 15,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "Kanit-Regular",
  },
  detailsItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  detailTitle: {
    fontSize: 16,
    fontFamily: "Kanit-Regular",
  },
  detailText: {
    fontSize: 16,
    marginVertical: 5,
    marginLeft: 5,
    fontWeight: "900",
    fontFamily: "Kanit-Regular",
  },
  closeButton: {
    marginTop: 20,
    width: 80,
    alignItems: "center",
    padding: 10,
    backgroundColor: "#e1dd2a", // Dark gray button background
    color: "#000", // White button text
    borderRadius: 22,
  },
  closeButtonText: {
    fontSize: 16,
    color: "#000",
    fontFamily: "Kanit-Regular",
  },
});
