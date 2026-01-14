import React, { useState, useEffect, useCallback } from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { StripeProvider } from "@stripe/stripe-react-native";
import store from "./store";
import LoadingMask from "./screens/HomeScreen/shared/components/LoadingMask/LoadingMask";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import AppContent from "./AppContent";

// Your Stripe publishable key (from Stripe Dashboard)
const STRIPE_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
  "pk_test_51SifQHCDsJ3n85lgKPd95YIHKqBtTzit9nekjSUd2sNtDRclIvjLwFQoxo1cWWj8kwMcApRB5WpYumL9AK3dlmuO00OemnnPHQ";

SplashScreen.preventAutoHideAsync();

const loadFonts = () => {
  return Font.loadAsync({
    "Kanit-Regular": require("./utils/fonts/Kanit-Regular.ttf"),
    "Kanit-Medium": require("./utils/fonts/Kanit-Medium.ttf"),
  });
};

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await loadFonts();
      } catch (e) {
        console.warn(e);
      } finally {
        setFontsLoaded(true);
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!fontsLoaded) {
    return <LoadingMask isLoading={true} />;
  }

  return (
    <Provider store={store}>
      <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
        <NavigationContainer>
          <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
            <AppContent />
          </View>
        </NavigationContainer>
      </StripeProvider>
    </Provider>
  );
}
