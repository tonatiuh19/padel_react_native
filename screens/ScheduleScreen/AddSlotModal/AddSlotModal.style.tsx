import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
export const AddSlotModalWidth = width;

export const AddSlotModalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: width * 0.8, // 80% of the screen width
    height: height * 0.68, // 50% of the screen height
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontFamily: "Kanit-Regular",
  },
  titleValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "Kanit-Regular",
  },
  titleValueCard: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    fontFamily: "Kanit-Regular",
    alignSelf: "center",
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  containerCard: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    padding: 8,
  },
  cardField: {
    height: 60,
    borderRadius: 22,
    borderColor: "red", // Add border color
    borderWidth: 1,
  },
  buttonPay: {
    marginTop: 15,
    width: AddSlotModalWidth * 0.6,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "#47914a",
    borderRadius: 22,
  },
  buttonPayText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Kanit-Regular",
    alignSelf: "center",
  },
  buttonCancel: {
    marginTop: 10,
    width: AddSlotModalWidth * 0.6,
    padding: 8,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "#fff",
    borderRadius: 22,
    borderColor: "red", // Add border color
    borderWidth: 1,
  },
  buttonCancelText: {
    color: "red",
    fontSize: 12,
    fontFamily: "Kanit-Regular",
    alignSelf: "center",
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, fontSize: 16, fontFamily: "Kanit-Regular" },
});
