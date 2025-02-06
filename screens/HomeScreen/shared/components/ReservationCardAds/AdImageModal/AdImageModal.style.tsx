import { StyleSheet } from "react-native";

export const AdImageModalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    width: "80%",
  },
  image: {
    width: "100%",
    height: 300,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#e1dd2a",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});
