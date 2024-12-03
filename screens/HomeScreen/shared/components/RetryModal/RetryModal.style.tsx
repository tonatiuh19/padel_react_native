import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const RetryModalStyles = StyleSheet.create({
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
  message: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: "#e1dd2a",
    borderRadius: 22,
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "Kanit-Regular",
    color: "#000",
    fontSize: 16,
  },
});
