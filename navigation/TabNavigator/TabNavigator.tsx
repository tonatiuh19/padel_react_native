import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../../screens/HomeScreen/HomeScreen";
import ReservationsScreen from "../../screens/ReservationsScreen/ReservationsScreen";
import BottomTabBar from "../BottomTabBar/BottomTabBar";
import ProfileButton from "./ProfileButton/ProfileButton";
const { Navigator, Screen } = createBottomTabNavigator();

const TabNavigator = () => (
  <Navigator
    initialRouteName="Home"
    tabBar={(props) => <BottomTabBar {...props} />}
    screenOptions={({ navigation }) => ({
      headerRight: () => (
        <ProfileButton onPress={() => navigation.navigate("Profile")} />
      ),
      headerTitle: "", // Remove the title
    })}
  >
    <Screen name="Home" component={HomeScreen} />
    <Screen name="Reservations" component={ReservationsScreen} />
  </Navigator>
);

export default TabNavigator;
