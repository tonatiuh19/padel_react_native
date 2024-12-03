import React from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { ProfileScreenStyles } from "../ProfileScreen.style";

const EditProfileForm: React.FC<any> = ({ initialValues, onCancel }) => {
  const validationSchema = Yup.object().shape({
    full_name: Yup.string().required("Nombre completo es requerido"),
    age: Yup.number()
      .required("Edad válida es requerida")
      .typeError("Edad válida es requerida"),
    date_of_birth: Yup.string().required("Fecha de nacimiento es requerida"),
  });

  const handleSubmit = (values: any) => {
    console.log("Updated Values", values);
    // Handle form submission logic here
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <View>
          <TextInput
            style={
              errors.full_name && touched.full_name
                ? ProfileScreenStyles.inputError
                : ProfileScreenStyles.input
            }
            placeholder="Nombre Completo"
            placeholderTextColor="#c7c585"
            onChangeText={handleChange("full_name")}
            onBlur={handleBlur("full_name")}
            value={values.full_name}
          />
          {errors.full_name && touched.full_name && (
            <Text style={ProfileScreenStyles.error}>Ingresa tu nombre</Text>
          )}
          <TextInput
            style={ProfileScreenStyles.input}
            placeholder="Correo"
            placeholderTextColor="#c7c585"
            value={values.email}
            editable={false}
          />
          <TextInput
            style={
              errors.age && touched.age
                ? ProfileScreenStyles.inputError
                : ProfileScreenStyles.input
            }
            placeholder="Edad"
            placeholderTextColor="#c7c585"
            onChangeText={handleChange("age")}
            onBlur={handleBlur("age")}
            value={values.age.toString()}
            keyboardType="numeric"
          />
          {errors.age && touched.age && (
            <Text style={ProfileScreenStyles.error}>Ingresa tu edad</Text>
          )}
          <TextInput
            style={
              errors.date_of_birth && touched.date_of_birth
                ? ProfileScreenStyles.inputError
                : ProfileScreenStyles.input
            }
            placeholder="Fecha de Nacimiento"
            placeholderTextColor="#c7c585"
            onChangeText={handleChange("date_of_birth")}
            onBlur={handleBlur("date_of_birth")}
            value={values.date_of_birth}
          />
          {errors.date_of_birth && touched.date_of_birth && (
            <Text style={ProfileScreenStyles.error}>
              Ingresa tu fecha de nacimiento
            </Text>
          )}
          <TouchableOpacity
            style={ProfileScreenStyles.button}
            onPress={() => handleSubmit()}
          >
            <Text style={ProfileScreenStyles.buttonText}>Guardar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={ProfileScreenStyles.secondaryButton}
            onPress={onCancel}
          >
            <Text style={ProfileScreenStyles.secodnaryButtonText}>
              Cancelar
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
};

export default EditProfileForm;
