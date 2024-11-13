import React from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { LoginScreenStyles } from "../LoginScreen.style";

const CodeValidationForm: React.FC<any> = ({ handleCodeValidation }) => {
  const validationSchema = Yup.object().shape({
    code: Yup.string()
      .required("El código es requerido")
      .matches(/^\d{6}$/, "El código debe tener 6 dígitos"),
  });

  return (
    <Formik
      initialValues={{ code: "" }}
      validationSchema={validationSchema}
      onSubmit={handleCodeValidation}
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
          <Text style={LoginScreenStyles.label}>
            Hemos enviado un código de 6 dígitos a tu número de teléfono, por
            favor ingrésalo a continuación:
          </Text>
          <TextInput
            style={
              errors.code && touched.code
                ? LoginScreenStyles.inputError
                : LoginScreenStyles.input
            }
            placeholder="Código de 6 dígitos"
            placeholderTextColor="#c7c585"
            onChangeText={handleChange("code")}
            onBlur={handleBlur("code")}
            value={values.code}
            keyboardType="numeric"
          />
          {errors.code && touched.code && (
            <Text style={LoginScreenStyles.error}>{errors.code}</Text>
          )}
          <TouchableOpacity
            style={LoginScreenStyles.button}
            onPress={() => handleSubmit()}
          >
            <Text style={LoginScreenStyles.buttonText}>Validar Código</Text>
          </TouchableOpacity>
        </>
      )}
    </Formik>
  );
};

export default CodeValidationForm;
