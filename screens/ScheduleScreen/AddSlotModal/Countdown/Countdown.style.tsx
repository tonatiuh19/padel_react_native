import { StyleSheet, Dimensions } from "react-native";

export const CountdownStyles = StyleSheet.create({
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
