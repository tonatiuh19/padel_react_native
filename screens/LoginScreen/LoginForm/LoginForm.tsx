import React, { useEffect, useRef } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { LoginScreenStyles } from "../LoginScreen.style";
import { Formik } from "formik";
import * as Yup from "yup";
import Feather from "@expo/vector-icons/Feather";

const LoginForm: React.FC<any> = ({ handleLogin }) => {
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("El Correo electrónico no es válido")
      .required("Tu Correo electrónico es requerido"),
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Formik
      initialValues={{
        email: "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleLogin}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <Animated.View style={{ opacity: fadeAnim, width: "100%" }}>
          <View
            style={
              errors.email && touched.email
                ? LoginScreenStyles.generalContainerError
                : LoginScreenStyles.generalContainer
            }
          >
            <View style={LoginScreenStyles.pickerContainer}>
              <View style={LoginScreenStyles.pickerTouchable}>
                <Feather name="mail" size={18} color="#e1dd2a" />
              </View>
            </View>
            <TextInput
              style={LoginScreenStyles.phoneInput}
              placeholder="Tu correo electrónico"
              placeholderTextColor="#c7c585"
              onChangeText={(text) => handleChange("email")(text.toLowerCase())}
              onBlur={handleBlur("email")}
              value={values.email}
              keyboardType="email-address"
            />
          </View>
          {errors.email && touched.email && (
            <Text style={LoginScreenStyles.error}>{errors.email}</Text>
          )}
          <TouchableOpacity
            style={LoginScreenStyles.button}
            onPress={() => handleSubmit()}
          >
            <Text style={LoginScreenStyles.buttonText}>Continuar</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </Formik>
  );
};

export default LoginForm;
