import React, { useEffect, useState } from "react";
import ProfileScreen from "../../screens/ProfileScreen/ProfileScreen"; // Import ProfileScreen component
import TabNavigator from "../TabNavigator/TabNavigator";
import BackButton from "../TabNavigator/shared/components/BackButton/BackButton";
import { createStackNavigator } from "@react-navigation/stack";
import ScheduleScreen from "../../screens/ScheduleScreen/ScheduleScreen";
import { PlatformsField } from "../../screens/HomeScreen/HomeScreen.model";
import { useDispatch, useSelector } from "react-redux";
import { selectUserInfo } from "../../store/selectors";
import { AppDispatch } from "../../store";
import { validateUserSession } from "../../store/effects";
import LoginScreen from "../../screens/LoginScreen/LoginScreen";

export type RootStackParamList = {
  Main: undefined;
  Profile: undefined;
  Login: undefined;
  Schedule: PlatformsField;
};

const { Navigator, Screen } = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const dispatch: AppDispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    dispatch(validateUserSession(userInfo.info?.id_platforms_user ?? 0));
    console.log(userInfo);
    if (userInfo.isSignedIn) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [dispatch, userInfo]);

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
