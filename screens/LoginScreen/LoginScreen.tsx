import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { LoginScreenStyles } from "./LoginScreen.style";
import { AppDispatch } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { selectIsUserExist, selectUserInfo } from "../../store/selectors";
import {
  insertPlatformUser,
  validateUserByEmail,
  validateUserByPhoneNumber,
} from "../../store/effects";

import SignInForm from "./SignInForm/SignInForm";
import LoginForm from "./LoginForm/LoginForm";
import { getFlagImage } from "../../utils/UtilsFunctions";

const LoginScreen: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const isUserExist = useSelector(selectIsUserExist);
  const userInfo = useSelector(selectUserInfo);
  const [nextSection, setNextSection] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);

  useEffect(() => {
    //console.log("User Info", userInfo);
  }, [userInfo]);

  const handleSignIn = (values: any) => {
    dispatch(
      insertPlatformUser(
        values.fullName,
        values.age,
        values.dateOfBirth,
        userInfo.info.phone_number_code,
        userInfo.info.phone_number,
        1,
        1,
        userInfo.info.email
      )
    );
    // Handle sign in logic here
  };

  const handleLogin = (values: any) => {
    setNextSection(true);
    dispatch(validateUserByEmail(values.email));
  };

  return (
    <View style={LoginScreenStyles.container}>
      <View style={LoginScreenStyles.cardContainer}>
        {nextSection ? (
          <SignInForm
            isUserExist={isUserExist}
            handleSignIn={handleSignIn}
            setNextSection={setNextSection}
            pickerVisible={pickerVisible}
            setPickerVisible={setPickerVisible}
            getFlagImage={getFlagImage}
          />
        ) : (
          <LoginForm
            handleLogin={handleLogin}
            setNextSection={setNextSection}
          />
        )}
      </View>
    </View>
  );
};

export default LoginScreen;
