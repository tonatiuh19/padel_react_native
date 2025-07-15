import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ProfileButtonStyles } from "./ProfileButton.style";

const ProfileButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={ProfileButtonStyles.button}>
    <Ionicons name="person-circle-outline" size={34} color="#fff" />
  </TouchableOpacity>
);

export default ProfileButton;
