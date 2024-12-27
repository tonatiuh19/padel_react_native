import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../../screens/HomeScreen/HomeScreen";
import ReservationsScreen from "../../screens/ReservationsScreen/ReservationsScreen";
import BottomTabBar from "../BottomTabBar/BottomTabBar";
import ProfileButton from "./ProfileButton/ProfileButton";
import { Image, StyleSheet } from "react-native";

const { Navigator, Screen } = createBottomTabNavigator();

const TabNavigator = () => (
  <Navigator
    initialRouteName="Home"
    tabBar={(props) => <BottomTabBar {...props} />}
    screenOptions={({ navigation }) => ({
      headerRight: () => (
        <ProfileButton onPress={() => navigation.navigate("Profile")} />
      ),
      headerTitleAlign: "center",
    })}
  >
    <Screen
      name="Home"
      component={HomeScreen}
      options={{
        headerTitle: () => (
          <Image
            source={require("../../utils/images/logo_black_horizontal.png")} // Replace with your image path
            style={styles.headerImage}
            resizeMode="contain"
          />
        ),
      }}
    />
    <Screen
      name="Reservations"
      component={ReservationsScreen}
      options={{
        headerTitle: "Mis Reservas",
        headerTitleStyle: {
          fontSize: 30,
          fontFamily: "Kanit-Regular",
          fontWeight: "bold",
          color: "#000", // Customize the color
        },
      }}
    />
  </Navigator>
);

const styles = StyleSheet.create({
  headerImage: {
    width: 250, // Adjust the width as needed
    height: 200, // Adjust the height as needed
  },
});

export default TabNavigator;
