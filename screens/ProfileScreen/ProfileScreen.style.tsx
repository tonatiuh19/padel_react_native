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
  },
  divider: {
    height: 10,
    backgroundColor: "red",
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
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "Kanit-Regular",
    alignSelf: "center",
  },
});
