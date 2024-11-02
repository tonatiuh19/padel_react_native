import { Dimensions, StyleSheet } from "react-native";

const { height } = Dimensions.get("window");
const marginBottom = height * 0.025;

const BottomTabBarStyles = StyleSheet.create({
  bottomNavigation: {
    marginBottom: marginBottom,
  },
});

export default BottomTabBarStyles;
