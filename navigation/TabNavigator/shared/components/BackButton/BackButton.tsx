import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const BackButton: React.FC<{ onPress: () => void }> = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={{ marginLeft: 16 }}>
    <Ionicons name="arrow-back" size={24} color="black" />
  </TouchableOpacity>
);

export default BackButton;
