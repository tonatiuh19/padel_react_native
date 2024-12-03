import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import store from "./store";
import LoadingMask from "./screens/HomeScreen/shared/components/LoadingMask/LoadingMask";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import AppContent from "./AppContent";

const loadFonts = () => {
  return Font.loadAsync({
    "Kanit-Regular": require("./utils/fonts/Kanit-Regular.ttf"),
    "Kanit-Medium": require("./utils/fonts/Kanit-Medium.ttf"),
  });
};

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    //SplashScreen.preventAutoHideAsync();
    loadFonts().then(() => {
      setFontsLoaded(true);
      //SplashScreen.hideAsync();
    });
  }, []);

  if (!fontsLoaded) {
    return <LoadingMask isLoading={true} />;
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </Provider>
  );
}
