import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MembresiasScreenStyles from "./MembresiasScreen.style";

const MembresiasScreen: React.FC = () => {
  return (
    <View style={MembresiasScreenStyles.container}>
      <Text style={MembresiasScreenStyles.text}>Membresías Screen</Text>
    </View>
  );
};

export default MembresiasScreen;
