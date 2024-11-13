import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { ApplicationProvider } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import AppNavigator from "./navigation/AppNavigator/AppNavigator";
import { Provider, useSelector } from "react-redux";
import store, { RootState } from "./store";
import LoadingMask from "./screens/HomeScreen/shared/components/LoadingMask/LoadingMask";
import { StripeProvider } from "@stripe/stripe-react-native";
import * as Font from "expo-font";

const STRIPE_PUBLBISHABLE_KEY =
  "pk_test_51QIiddAC7jSBO0hEcfV17EolUCfKcLJjQZpO1becuuID8oCrI3xT049f4oYvfhynRQpQhGeBiLG34RaAZwA6lxor00S9cwfSny";

const loadFonts = () => {
  return Font.loadAsync({
    "Kanit-Regular": require("./utils/fonts/Kanit-Regular.ttf"),
    "Kanit-Medium": require("./utils/fonts/Kanit-Medium.ttf"),
  });
};

const AppContent = () => {
  const isLoading =
    useSelector((state: RootState) => state.app.isLoading) ?? false;

  return (
    <>
      <ApplicationProvider {...eva} theme={eva.dark}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
        <LoadingMask isLoading={isLoading} />
        <StatusBar style="auto" />
      </ApplicationProvider>
    </>
  );
};

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) {
    return <LoadingMask isLoading={true} />;
  }

  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
