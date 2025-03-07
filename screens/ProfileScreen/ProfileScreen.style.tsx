import { Dimensions, StyleSheet } from "react-native";

const { height, width } = Dimensions.get("window");
export const ProfileScreenHeight = height;
export const ProfileScreenWidth = width;

export const ProfileScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  profileSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  gridContainer: {
    flexDirection: "column",
    width: ProfileScreenWidth * 0.8,
    justifyContent: "center",
    alignItems: "center",
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  gridLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  gridValue: {
    fontSize: 16,
  },
  editButton: {
    alignSelf: "flex-end",
    marginTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 20,
  },
  buttonSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginTop: 10,
    width: ProfileScreenWidth * 0.8,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "#e1dd2a",
    borderRadius: 22,
  },
  deActivateButton: {
    marginTop: 10,
    width: ProfileScreenWidth * 0.8,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "#fff",
    borderRadius: 22,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "Kanit-Regular",
    alignSelf: "center",
  },
  secondaryButton: {
    backgroundColor: "#000",
    color: "#e1dd2a",
    padding: 10,
    borderRadius: 22,
    borderColor: "#e1dd2a",
    borderWidth: 1,
    marginTop: 10,
    width: ProfileScreenWidth * 0.8,
    alignItems: "center",
  },
  secodnaryButtonText: {
    color: "#e1dd2a",
    fontFamily: "Kanit-Regular",
  },
  input: {
    height: 50,
    borderColor: "#e1dd2a",
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: "#000000",
    color: "#e1dd2a",
    fontFamily: "Kanit-Regular",
    width: "100%",
    padding: 15,
    paddingLeft: 25,
    paddingRight: 25,
  },
  inputError: {
    height: 50,
    borderColor: "#e1dd2a",
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 10,
    backgroundColor: "#000000",
    color: "#e1dd2a",
    fontFamily: "Kanit-Regular",
    width: "100%",
    padding: 15,
    paddingLeft: 25,
    paddingRight: 25,
  },
  error: {
    color: "#ff0000",
    fontFamily: "Kanit-Regular",
    marginTop: 5,
    marginBottom: 20,
    alignSelf: "center",
  },
});
