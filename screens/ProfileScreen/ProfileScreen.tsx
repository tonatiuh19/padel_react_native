import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { ProfileScreenStyles } from "./ProfileScreen.style";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import { selectUserInfo } from "../../store/selectors";
import { logout } from "../../store/effects";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/AppNavigator/AppNavigator";

export default function ProfileScreen() {
  const dispatch: AppDispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("id_platforms_user");
    dispatch(
      logout(userInfo.info?.id_platforms_user, userInfo.info?.id_platforms)
    );
    navigation.navigate("Main");
  };

  return (
    <View style={ProfileScreenStyles.container}>
      <View style={ProfileScreenStyles.profileSection}>
        <Text style={ProfileScreenStyles.profileText}>
          Información del Perfil
        </Text>
        {/* Agrega más información del perfil aquí */}
      </View>
      <View style={ProfileScreenStyles.divider} />
      <View style={ProfileScreenStyles.buttonSection}>
        <TouchableOpacity style={ProfileScreenStyles.button} onPress={() => {}}>
          <Text style={ProfileScreenStyles.buttonText}>Mi Pago</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={ProfileScreenStyles.button}
          onPress={handleLogout}
        >
          <Text style={ProfileScreenStyles.buttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
