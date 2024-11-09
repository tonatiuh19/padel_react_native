import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const AddSlotModalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: width * 0.8, // 80% of the screen width
    height: height * 0.5, // 50% of the screen height
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },

  containerCard: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    padding: 8,
  },
  cardField: {
    height: 50,
  },
});
