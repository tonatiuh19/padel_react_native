import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const EmptyDataViewStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginBottom: 20,
    fontSize: 16,
    color: "#808080",
  },
  button: {
    padding: 10,
    backgroundColor: "#e1dd2a",
    borderRadius: 10,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
  },
});
