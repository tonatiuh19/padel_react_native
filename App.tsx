import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { ApplicationProvider } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import TabNavigator from "./navigation/TabNavigator/TabNavigator";

export default function App() {
  return (
    <ApplicationProvider {...eva} theme={eva.dark}>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
      <StatusBar style="auto" />
    </ApplicationProvider>
  );
}
