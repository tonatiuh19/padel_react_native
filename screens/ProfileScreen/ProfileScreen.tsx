import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { ProfileScreenStyles } from "./ProfileScreen.style";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import { selectUserInfo } from "../../store/selectors";
import { logout } from "../../store/effects";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/AppNavigator/AppNavigator";
import Icon from "react-native-vector-icons/FontAwesome";
import EditProfileForm from "./EditProfileForm/EditProfileForm";

export default function ProfileScreen() {
  const dispatch: AppDispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isEditing, setIsEditing] = useState(false);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("id_platforms_user");
    dispatch(
      logout(userInfo.info?.id_platforms_user, userInfo.info?.id_platforms)
    );
    navigation.navigate("Main");
  };

  useEffect(() => {
    console.log(userInfo);
  }, [userInfo]);

  return (
    <View style={ProfileScreenStyles.container}>
      <View style={ProfileScreenStyles.profileSection}>
        {!isEditing ? (
          <View style={ProfileScreenStyles.gridContainer}>
            <View style={ProfileScreenStyles.gridRow}>
              <Text style={ProfileScreenStyles.gridLabel}>Nombre:</Text>
              <Text style={ProfileScreenStyles.gridValue}>
                {userInfo.info?.full_name}
              </Text>
            </View>
            <View style={ProfileScreenStyles.gridRow}>
              <Text style={ProfileScreenStyles.gridLabel}>Correo:</Text>
              <Text style={ProfileScreenStyles.gridValue}>
                {userInfo.info?.email}
              </Text>
            </View>
            <View style={ProfileScreenStyles.gridRow}>
              <Text style={ProfileScreenStyles.gridLabel}>Edad:</Text>
              <Text style={ProfileScreenStyles.gridValue}>
                {userInfo.info?.age}
              </Text>
            </View>
            <View style={ProfileScreenStyles.gridRow}>
              <Text style={ProfileScreenStyles.gridLabel}>
                Fecha de Nacimiento:
              </Text>
              <Text style={ProfileScreenStyles.gridValue}>
                {userInfo.info?.date_of_birth}
              </Text>
            </View>
            {/*<TouchableOpacity
              style={ProfileScreenStyles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Icon name="pencil" size={20} color="#000" />
            </TouchableOpacity>*/}
          </View>
        ) : (
          <EditProfileForm
            initialValues={{
              full_name: userInfo.info?.full_name,
              email: userInfo.info?.email,
              age: userInfo.info?.age,
              date_of_birth: userInfo.info?.date_of_birth,
            }}
            onCancel={() => setIsEditing(false)}
          />
        )}
      </View>
      <View style={ProfileScreenStyles.divider} />
      <View style={ProfileScreenStyles.buttonSection}>
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
