import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { LoginScreenStyles } from "./LoginScreen.style";
import { AppDispatch } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { selectIsUserExist } from "../../store/selectors";
import { validateUserByPhoneNumber } from "../../store/effects";

import SignInForm from "./SignInForm/SignInForm";
import LoginForm from "./LoginForm/LoginForm";
import { getFlagImage } from "../../utils/UtilsFunctions";

const LoginScreen: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const isUserExist = useSelector(selectIsUserExist);
  const [nextSection, setNextSection] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);

  const handleSignUp = (values: any) => {
    console.log("Sign Up", values);
    // Handle sign up logic here
  };

  const handleLogin = (values: any) => {
    console.log("Log In", values);
    setNextSection(true);
    dispatch(
      validateUserByPhoneNumber(Number(values.phoneNumber), values.phoneZone)
    );
  };

  return (
    <View style={LoginScreenStyles.container}>
      <View style={LoginScreenStyles.cardContainer}>
        {nextSection ? (
          <SignInForm
            isUserExist={isUserExist}
            handleSignUp={handleSignUp}
            setNextSection={setNextSection}
            pickerVisible={pickerVisible}
            setPickerVisible={setPickerVisible}
            getFlagImage={getFlagImage}
          />
        ) : (
          <LoginForm
            handleLogin={handleLogin}
            setNextSection={setNextSection}
            pickerVisible={pickerVisible}
            setPickerVisible={setPickerVisible}
            getFlagImage={getFlagImage}
          />
        )}
      </View>
    </View>
  );
};

export default LoginScreen;
