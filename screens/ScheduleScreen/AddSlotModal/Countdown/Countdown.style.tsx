import { StyleSheet, Dimensions } from "react-native";

export const CountdownStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 12,
    paddingVertical: 20,
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    width: "70%",
  },
  timerTextTitle: {
    fontSize: 12,
    fontFamily: "Kanit-Regular",
    color: "#666666",
    marginBottom: 4,
    alignSelf: "center",
  },
  timerText: {
    fontSize: 18,
    fontFamily: "Kanit-Regular",
    fontWeight: "bold",
    color: "#000000",
  },
  timerTextRed: {
    color: "#ff6b6b",
  },
});

export const CountdownLoginStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  timerTextTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
    alignSelf: "center",
  },
  timerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
  },
  timerTextRed: {
    color: "red",
  },
});
