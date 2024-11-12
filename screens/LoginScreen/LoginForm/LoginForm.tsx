import React from "react";
import { View, TextInput, Text, TouchableOpacity, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { LoginScreenStyles } from "../LoginScreen.style";
import { Formik } from "formik";
import * as Yup from "yup";

const LoginForm: React.FC<any> = ({
  handleLogin,
  pickerVisible,
  setPickerVisible,
  getFlagImage,
}) => {
  const validationSchema = Yup.object().shape({
    /*fullName: Yup.string().required("Nombre completo es requerido"),
    age: Yup.number()
      .required("Edad válida es requerida")
      .typeError("Edad válida es requerida"),
    dateOfBirth: Yup.string().required("Fecha de nacimiento es requerida"),*/
    phoneNumber: Yup.string()
      .required("Número de teléfono es requerido")
      .matches(/^\d{10}$/, "El número de teléfono debe tener 10 dígitos"),
  });

  return (
    <Formik
      initialValues={{
        phoneNumber: "",
        phoneZone: "+52", // Default to Mexico
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
        <>
          <View style={LoginScreenStyles.generalContainer}>
            <View style={LoginScreenStyles.pickerContainer}>
              <TouchableOpacity
                onPress={() => setPickerVisible(true)}
                style={LoginScreenStyles.pickerTouchable}
              >
                <Image
                  source={getFlagImage(values.phoneZone)}
                  style={LoginScreenStyles.flag}
                />
                <Text style={LoginScreenStyles.pickerText}>
                  {values.phoneZone}
                </Text>
              </TouchableOpacity>
              <Picker
                selectedValue={values.phoneZone}
                style={[
                  LoginScreenStyles.hiddenPicker,
                  pickerVisible && { opacity: 1 },
                ]}
                onValueChange={(itemValue) => {
                  handleChange("phoneZone")(itemValue);
                  setPickerVisible(false);
                }}
              >
                <Picker.Item label="+52 (Mexico)" value="+52" />
                <Picker.Item label="+1 (USA)" value="+1" />
              </Picker>
            </View>
            <TextInput
              style={LoginScreenStyles.phoneInput}
              placeholder="Número de Teléfono"
              placeholderTextColor="#c7c585"
              onChangeText={handleChange("phoneNumber")}
              onBlur={handleBlur("phoneNumber")}
              value={values.phoneNumber}
              keyboardType="phone-pad"
            />
          </View>
          {errors.phoneNumber && touched.phoneNumber && (
            <Text style={LoginScreenStyles.error}>{errors.phoneNumber}</Text>
          )}
          <TouchableOpacity
            style={LoginScreenStyles.button}
            onPress={() => handleSubmit()}
          >
            <Text style={LoginScreenStyles.buttonText}>Continuar</Text>
          </TouchableOpacity>
        </>
      )}
    </Formik>
  );
};

export default LoginForm;