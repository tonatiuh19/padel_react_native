import React from "react";
import { StyleSheet, Text } from "react-native";
import { BottomNavigation, BottomNavigationTab } from "@ui-kitten/components";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import BottomTabBarStyles from "./BottomTabBar.style";

const BottomTabBar = ({ navigation, state }: BottomTabBarProps) => (
  <BottomNavigation
    selectedIndex={state.index}
    onSelect={(index) => navigation.navigate(state.routeNames[index])}
    style={BottomTabBarStyles.bottomNavigation}
    indicatorStyle={BottomTabBarStyles.indicatorStyle}
  >
    {state.routeNames.map((route, index) => {
      let iconName: keyof typeof Ionicons.glyphMap;

      if (route === "Home") {
        iconName = state.index === index ? "tennisball" : "tennisball-outline";
      } else if (route === "Reservations") {
        iconName = state.index === index ? "calendar" : "calendar-outline";
      } else {
        iconName = "home"; // default icon name
      }

      const iconStyle =
        state.index === index
          ? BottomTabBarStyles.iconSelected
          : BottomTabBarStyles.iconUnselected;

      const titleStyle =
        state.index === index
          ? BottomTabBarStyles.titleSelected
          : BottomTabBarStyles.titleUnselected;

      return (
        <BottomNavigationTab
          key={route}
          title={(props) => (
            <Text style={titleStyle}>
              {route === "Home" ? "Inicio" : "Mis Reservas"}
            </Text>
          )}
          icon={(props: any) => (
            <Ionicons
              name={iconName}
              size={props?.style?.width}
              style={iconStyle}
            />
          )}
          style={BottomTabBarStyles.bottomNavigationTab}
        />
      );
    })}
  </BottomNavigation>
);

export default BottomTabBar;
