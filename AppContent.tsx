import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { ApplicationProvider } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import AppNavigator, {
  RootStackParamList,
} from "./navigation/AppNavigator/AppNavigator";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";
import LoadingMask from "./screens/HomeScreen/shared/components/LoadingMask/LoadingMask";
import RetryModal from "./screens/HomeScreen/shared/components/RetryModal/RetryModal";
import { selectIsError } from "./store/selectors";

import {
  CommonActions,
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { clearState } from "./store/appSlice";

const AppContent = () => {
  const dispatch: AppDispatch = useDispatch();
  const isLoading =
    useSelector((state: RootState) => state.app.isLoading) ?? false;
  const isError = useSelector(selectIsError);
  const [retryModalVisible, setRetryModalVisible] = useState(false);
  const [retryMessage, setRetryMessage] = useState("");
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleRetry = () => {
    // Handle retry logic here
    console.log("Retrying...");
    const state = navigation.getState();
    const mainScreenExists = state?.routeNames?.includes("Main");
    dispatch(clearState());
    if (mainScreenExists) {
      navigation.dispatch(
        CommonActions.navigate({
          name: "Main",
        })
      );
    } else {
      console.log("Main screen doesn't exist, navigating to Login");
      //dispatch(clearState());
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Login" }],
        })
      );
    }
    setRetryModalVisible(false);
  };

  const handleClose = () => {
    setRetryModalVisible(false);
  };

  useEffect(() => {
    if (isError) {
      setRetryMessage("Parece que no tienes conexión a internet");
      setRetryModalVisible(true);
    }
  }, [isError]);

  return (
    <>
      <ApplicationProvider {...eva} theme={eva.dark}>
        <AppNavigator />
        <LoadingMask isLoading={isLoading} />
        <RetryModal
          visible={retryModalVisible}
          message={retryMessage}
          onRetry={handleRetry}
          onClose={handleClose}
        />
        <StatusBar style="auto" />
      </ApplicationProvider>
    </>
  );
};

export default AppContent;
