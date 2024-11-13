import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { KnobButtonStyles } from "./KnobButton.style";

export const KnobButton = () => {
  return (
    <TouchableOpacity style={KnobButtonStyles.knobButton}>
      <AntDesign
        name="down"
        style={KnobButtonStyles.knobButtonText}
        size={24}
        color="#000"
      />
    </TouchableOpacity>
  );
};
