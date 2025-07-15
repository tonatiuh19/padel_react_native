import React from "react";
import { StyleSheet, Text } from "react-native";
import { BottomNavigation, BottomNavigationTab } from "@ui-kitten/components";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import BottomTabBarStyles from "./BottomTabBar.style";
import { useSelector } from "react-redux";
import { selectSections } from "../../store/selectors";

const BottomTabBar = ({ navigation, state }: BottomTabBarProps) => {
  const sections = useSelector(selectSections);

  const sectionMap = {
    Reservations: "reservations",
    Clases: "classes",
    Membresias: "memberships",
  };

  const activeRouteNames = state.routeNames.filter((route) => {
    if (route === "Home") return true;
    if (route in sectionMap) {
      const sectionKey = sectionMap[route as keyof typeof sectionMap];
      const section = sections.find((s) => s.section === sectionKey);
      return section ? section.active : false;
    }
    return false;
  });

  return (
    <BottomNavigation
      selectedIndex={activeRouteNames.indexOf(state.routeNames[state.index])}
      onSelect={(index) => {
        navigation.navigate(activeRouteNames[index]);
      }}
      style={BottomTabBarStyles.bottomNavigation}
      indicatorStyle={BottomTabBarStyles.indicatorStyle}
    >
      {activeRouteNames.map((route, index) => {
        let iconName: keyof typeof Ionicons.glyphMap;

        if (route === "Home") {
          iconName =
            state.index === index ? "tennisball" : "tennisball-outline";
        } else if (route === "Reservations") {
          iconName = state.index === index ? "calendar" : "calendar-outline";
        } else if (route === "Clases") {
          iconName = state.index === index ? "school" : "school-outline";
        } else if (route === "Membresias") {
          iconName = state.index === index ? "card" : "card-outline";
        } else {
          iconName = "home"; // default icon name
        }

        const iconStyle =
          state.index === index
            ? BottomTabBarStyles.iconSelected
            : BottomTabBarStyles.iconUnselected;

        const titleStyle =
          state.index === index
            ? [BottomTabBarStyles.titleSelected, styles.centeredText]
            : [BottomTabBarStyles.titleUnselected, styles.centeredText];

        return (
          <BottomNavigationTab
            key={route}
            title={(props) => (
              <Text style={titleStyle}>
                {route === "Home"
                  ? "Inicio"
                  : route === "Reservations"
                  ? "Reservas"
                  : route === "Clases"
                  ? "Clases"
                  : "Membresías (Próximamente)"}
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
};

const styles = StyleSheet.create({
  centeredText: {
    textAlign: "center", // Center the text horizontally
  },
});

export default BottomTabBar;
