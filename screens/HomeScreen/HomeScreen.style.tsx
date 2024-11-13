import { Dimensions, StyleSheet } from "react-native";

const { height, width } = Dimensions.get("window");
export const HomeScreenHeight = height;
export const HomeScreenWidth = width;

export const HomeScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
});
