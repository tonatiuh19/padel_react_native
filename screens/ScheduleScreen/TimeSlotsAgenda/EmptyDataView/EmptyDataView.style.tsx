import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const EmptyDataViewStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: "#808080",
    fontFamily: "Kanit-Regular",
    textAlign: "center",
  },
  button: {
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "#e1dd2a",
    borderRadius: 22,
  },
  buttonClass: {
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "#e1dd2a",
    borderRadius: 22,
    margin: 10,
  },
  buttonSpecial: {
    marginTop: 10,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "#e1dd2a",
    borderRadius: 22,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "Kanit-Regular",
  },
});
