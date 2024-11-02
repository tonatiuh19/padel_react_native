import { Dimensions, StyleSheet } from "react-native";

const { height } = Dimensions.get("window");
const marginBottom = height * 0.025;

const BottomTabBarStyles = StyleSheet.create({
  bottomNavigation: {
    paddingBottom: marginBottom,
    backgroundColor: "#000", // Change to your desired background color
  },
  bottomNavigationTab: {
    // Add your custom styles here
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  iconSelected: {
    color: "#FF6347", // Change to your desired selected color
  },
  iconUnselected: {
    color: "#808080", // Change to your desired unselected color
  },
  titleSelected: {
    color: "#FF6347", // Change to your desired selected color
  },
  titleUnselected: {
    color: "#808080", // Change to your desired unselected color
  },
  indicatorStyle: {
    backgroundColor: "#FFAA00", // Change to your desired selected color
    height: 4,
  },
});

export default BottomTabBarStyles;
