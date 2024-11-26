import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { ProfileScreenStyles } from "./ProfileScreen.style";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import { selectUserInfo } from "../../store/selectors";
import { logout } from "../../store/effects";

export default function ProfileScreen() {
  const dispatch: AppDispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);

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
          onPress={() => {
            dispatch(
              logout(
                userInfo.info?.id_platforms_user,
                userInfo.info?.id_platforms
              )
            );
          }}
        >
          <Text style={ProfileScreenStyles.buttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
