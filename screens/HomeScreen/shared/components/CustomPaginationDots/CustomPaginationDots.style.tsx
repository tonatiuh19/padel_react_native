import { Dimensions, StyleSheet } from "react-native";

const { height, width } = Dimensions.get("window");
export const CustomPaginationDotsHeight = (height * 0.8) / 3;
export const CustomPaginationDotsWidth = width;

export const CustomPaginationDotsStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#e1dd2a", // Active dot color
  },
  inactiveDot: {
    backgroundColor: "#808080", // Inactive dot color
  },
});
