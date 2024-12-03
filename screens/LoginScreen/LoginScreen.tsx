import React, { useEffect, useState, useCallback } from "react";
import { View, Image, Text } from "react-native";
import { LoginScreenStyles } from "./LoginScreen.style";
import { AppDispatch } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { selectIsUserExist, selectUserInfo } from "../../store/selectors";
import { insertPlatformUser, validateUserByEmail } from "../../store/effects";
import SignInForm from "./SignInForm/SignInForm";
import LoginForm from "./LoginForm/LoginForm";
import { getFlagImage } from "../../utils/UtilsFunctions";
import { useFocusEffect } from "@react-navigation/native";

const LoginScreen: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const isUserExist = useSelector(selectIsUserExist);
  const userInfo = useSelector(selectUserInfo);
  const [nextSection, setNextSection] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [userExists, setUserExists] = useState(false);

  useEffect(() => {
    //console.log("User Info", userInfo);
  }, [userInfo]);

  useFocusEffect(
    useCallback(() => {
      // Refresh logic here
      console.log("Focused");
      setNextSection(false);
      setPickerVisible(false);
    }, [])
  );

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
      <View style={LoginScreenStyles.logoContainer}>
        <Image
          source={require("../../utils/images/by.png")} // Replace with your image path
          style={LoginScreenStyles.logo}
        />
      </View>
      <View style={LoginScreenStyles.cardContainer}>
        {nextSection ? (
          <SignInForm
            isUserExist={isUserExist}
            handleSignIn={handleSignIn}
            setNextSection={setNextSection}
            pickerVisible={pickerVisible}
            setPickerVisible={setPickerVisible}
            getFlagImage={getFlagImage}
            setUserExists={setUserExists}
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
