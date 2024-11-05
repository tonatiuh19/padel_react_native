import React from "react";
import ProfileScreen from "../../screens/ProfileScreen/ProfileScreen"; // Import ProfileScreen component
import TabNavigator from "../TabNavigator/TabNavigator";
import BackButton from "../TabNavigator/shared/components/BackButton/BackButton";
import { createStackNavigator } from "@react-navigation/stack";
import ScheduleScreen from "../../screens/ScheduleScreen/ScheduleScreen";

export type RootStackParamList = {
  Main: undefined;
  Profile: undefined;
  Schedule: { id_platforms_field: number };
};

const { Navigator, Screen } = createStackNavigator<RootStackParamList>();

const AppNavigator = () => (
  <Navigator>
    <Screen
      name="Main"
      component={TabNavigator}
      options={{ headerShown: false }} // Hide header for the tab navigator
    />
    <Screen
      name="Profile"
      component={ProfileScreen}
      options={({ navigation }) => ({
        headerTitle: "Mi Perfil",
        headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
      })}
    />
    <Screen
      name="Schedule"
      component={ScheduleScreen}
      options={({ navigation }) => ({
        headerTitle: "Agendar",
        headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
      })}
    />
  </Navigator>
);

export default AppNavigator;
