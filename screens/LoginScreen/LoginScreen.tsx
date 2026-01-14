import React, { useEffect, useState, useCallback } from "react";
import { View, Image, Text } from "react-native";
import { LoginScreenStyles } from "./LoginScreen.style";
import { AppDispatch } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { selectIsUserExist, selectUserInfo } from "../../store/selectors";
import { createUser, checkUserExists } from "../../store/effects";
import SignInForm from "./SignInForm/SignInForm";
import LoginForm from "./LoginForm/LoginForm";
import { getFlagImage } from "../../utils/UtilsFunctions";
import { useFocusEffect } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const LoginScreen: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const isUserExist = useSelector(selectIsUserExist);
  const userInfo = useSelector(selectUserInfo);
  const [nextSection, setNextSection] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const [inactiveAccountMessage, setInactiveAccountMessage] = useState<
    string | null
  >(null);

  useEffect(() => {
    //console.log("User Info", userInfo);
  }, [userInfo]);

  useEffect(() => {
    console.log("🔄 [LOGIN SCREEN] isUserExist changed:", isUserExist);
  }, [isUserExist]);

  useFocusEffect(
    useCallback(() => {
      // Refresh logic here
      console.log("Focused");
      setNextSection(false);
      setPickerVisible(false);
      setInactiveAccountMessage(null);
    }, [])
  );

  const handleSignIn = async (values: any) => {
    try {
      console.log("🟢 [LOGIN SCREEN] handleSignIn - Creating user...");
      const result = await dispatch(
        createUser(
          userInfo.info.email,
          values.firstName,
          values.lastName,
          values.phone,
          values.dateOfBirth,
          1 // club_id
        )
      );

      console.log("🟢 [LOGIN SCREEN] User created:", result);

      // After successful user creation, send verification code
      if (result?.data?.id) {
        console.log(
          "🟢 [LOGIN SCREEN] Sending verification code to user ID:",
          result.data.id
        );
        // The app should now show the code verification screen
        // because isUserExist is set to true in insertPlatformUserSuccess
      }
    } catch (error) {
      console.error("❌ [LOGIN SCREEN] Error creating user:", error);
    }
  };

  const handleLogin = async (values: any) => {
    console.log(
      "🟢 [LOGIN SCREEN] handleLogin called with email:",
      values.email
    );
    setNextSection(true);
    setInactiveAccountMessage(null);

    console.log("🟢 [LOGIN SCREEN] Dispatching checkUserExists...");
    const result = await dispatch(checkUserExists(values.email, 1)); // club_id = 1

    console.log(
      "🟢 [LOGIN SCREEN] checkUserExists result:",
      JSON.stringify(result, null, 2)
    );
    console.log("🟢 [LOGIN SCREEN] result.error:", result?.error);
    console.log("🟢 [LOGIN SCREEN] result.exists:", result?.exists);

    // Check if the response has an error (inactive account)
    if (result?.error) {
      console.log("⚠️ [LOGIN SCREEN] Error detected, setting inactive message");
      setInactiveAccountMessage(
        "Tu cuenta anterior fue desactivada. Puedes crear una nueva cuenta con este correo."
      );
    } else {
      console.log("✅ [LOGIN SCREEN] No error in result");
    }

    console.log(
      "🟢 [LOGIN SCREEN] Current isUserExist from Redux:",
      isUserExist
    );
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1, backgroundColor: "#000000" }}
      enableOnAndroid={true}
      extraHeight={65}
      extraScrollHeight={65}
      scrollEnabled={false}
    >
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
              inactiveAccountMessage={inactiveAccountMessage}
            />
          ) : (
            <LoginForm
              handleLogin={handleLogin}
              setNextSection={setNextSection}
            />
          )}
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default LoginScreen;
