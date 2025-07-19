import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../../screens/HomeScreen/HomeScreen";
import ReservationsScreen from "../../screens/ReservationsScreen/ReservationsScreen";
import BottomTabBar from "../BottomTabBar/BottomTabBar";
import ProfileButton from "./ProfileButton/ProfileButton";
import { Image, StyleSheet } from "react-native";
import ClasesScreen from "../../screens/ClasesScreen/ClasesScreen";
import MembresiasScreen from "../../screens/MembresiasScreen/MembresiasScreen";
import { useDispatch, useSelector } from "react-redux";
import { selectSections } from "../../store/selectors";
import { AppDispatch } from "../../store";
import { getPlatformSectionsById } from "../../store/effects";

const { Navigator, Screen } = createBottomTabNavigator();

const TabNavigator = () => {
  const sections = useSelector(selectSections);

  const sectionMap = {
    reservations: "Reservations",
    classes: "Clases",
    memberships: "Membresias",
  };

  const activeTabs = [
    { name: "Home", component: HomeScreen },
    ...(Array.isArray(sections)
      ? sections
          .filter((s) => s.active)
          .map((s) => {
            const sectionKey = s.section as keyof typeof sectionMap;
            return {
              name: sectionMap[sectionKey],
              component:
                sectionMap[sectionKey] === "Reservations"
                  ? ReservationsScreen
                  : sectionMap[sectionKey] === "Clases"
                  ? ClasesScreen
                  : MembresiasScreen,
            };
          })
      : []),
  ];

  return (
    <Navigator
      initialRouteName="Home"
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={({ navigation }) => ({
        headerRight: () => (
          <ProfileButton onPress={() => navigation.navigate("Profile")} />
        ),
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: "#121212",
          shadowColor: "transparent",
          elevation: 0,
          borderBottomWidth: 1, // Add line thickness
          borderBottomColor: "#fff", // Add line color (gold)
        },
        headerTitleStyle: {
          color: "#fff", // Move the color here for the title text
          fontFamily: "Kanit-Regular", // Optional: set font family
          fontSize: 18, // Optional: set font size
          fontWeight: "bold", // Optional: set font weight
        },
      })}
    >
      {activeTabs.map((tab) => (
        <Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={
            tab.name === "Reservations"
              ? {
                  headerTitle: "Reservaciones", // <-- Change here
                }
              : tab.name === "Home"
              ? {
                  headerTitle: () => (
                    <Image
                      source={require("../../utils/images/logo_normal.png")}
                      style={styles.headerImage}
                      resizeMode="contain"
                    />
                  ),
                }
              : undefined
          }
        />
      ))}
    </Navigator>
  );
};

const styles = StyleSheet.create({
  headerImage: {
    width: 250,
    height: 200,
  },
});

export default TabNavigator;
