import React, { useEffect, useState } from "react";
import ProfileScreen from "../../screens/ProfileScreen/ProfileScreen"; // Import ProfileScreen component
import TabNavigator from "../TabNavigator/TabNavigator";
import BackButton from "../TabNavigator/shared/components/BackButton/BackButton";
import { createStackNavigator } from "@react-navigation/stack";
import ScheduleScreen from "../../screens/ScheduleScreen/ScheduleScreen";
import { useDispatch, useSelector } from "react-redux";
import { selectUserInfo } from "../../store/selectors";
import { AppDispatch } from "../../store";
import LoginScreen from "../../screens/LoginScreen/LoginScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type RootStackParamList = {
  Main: { screen?: string } | undefined;
  Reservations: undefined;
  Profile: undefined;
  Login: undefined;
  Schedule: { bookingType?: "court" | "class" } | undefined;
  Clases: undefined;
};

const { Navigator, Screen } = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const dispatch: AppDispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    const checkUserSession = async () => {
      console.log(userInfo);
      try {
        const storedUserId = await AsyncStorage.getItem("id_platforms_user");
        console.log("Stored user id", storedUserId);
        if (storedUserId !== "0" && storedUserId !== null) {
          console.log("Setting user session", userInfo.info?.id_platforms_user);
          setIsAuthenticated(true);
        } else {
          console.log("Validating user session", storedUserId);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Failed to load user session", error);
      }
    };

    checkUserSession();
  }, [userInfo]);

  return (
    <Navigator>
      {isAuthenticated ? (
        <>
          <Screen
            name="Main"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          <Screen
            name="Profile"
            component={ProfileScreen}
            options={({ navigation }) => ({
              headerTitle: "Mi Perfil",
              headerTitleStyle: {
                fontSize: 30,
                fontFamily: "Kanit-Regular",
                fontWeight: "bold",
                color: "#fff", // Customize the color
              },
              headerStyle: {
                backgroundColor: "#121212",
                shadowColor: "transparent",
                elevation: 0,
                borderBottomWidth: 1,
                borderBottomColor: "#ffd700",
              },
              headerLeft: () => (
                <BackButton onPress={() => navigation.goBack()} />
              ),
            })}
          />
          <Screen
            name="Schedule"
            component={ScheduleScreen}
            options={({ navigation }) => ({
              headerTitle: "Agendar",
              headerTitleStyle: {
                fontSize: 30,
                fontFamily: "Kanit-Regular",
                fontWeight: "bold",
                color: "#fff", // Customize the color
              },
              headerStyle: {
                backgroundColor: "#121212",
                shadowColor: "transparent",
                elevation: 0,
                borderBottomWidth: 1,
                borderBottomColor: "#ffd700",
              },
              headerLeft: () => (
                <BackButton onPress={() => navigation.goBack()} />
              ),
            })}
          />
        </>
      ) : (
        <Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      )}
    </Navigator>
  );
};

export default AppNavigator;
