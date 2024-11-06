import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const TimeSlotsAgendaStyles = StyleSheet.create({
  agenda: {
    width: width,
  },
  contentContainer: {
    marginTop: 1000,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#e1dd2a",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  fabText: {
    color: "#000",
    fontSize: 16,
    marginLeft: 10,
  },
});
