import React, { useEffect, useState } from "react";
import { View, TextInput, Text, TouchableOpacity, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Formik } from "formik";
import * as Yup from "yup";
import { LoginScreenStyles } from "../LoginScreen.style";
import { selectUserInfo } from "../../../store/selectors";
import { useSelector } from "react-redux";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formatDate } from "../../../utils/UtilsFunctions";

const SignInForm: React.FC<any> = ({
  isUserExist,
  handleSignIn,
  setNextSection,
  getFlagImage,
}) => {
  const userInfo = useSelector(selectUserInfo);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  useEffect(() => {
    console.log(isUserExist);
  }, [isUserExist]);

  const onChange = (event: any, selectedDate: any, setFieldValue: any) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    setFieldValue("dateOfBirth", formatDate(currentDate)); // Update dateOfBirth field
  };

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Nombre completo es requerido"),
    age: Yup.number()
      .required("Edad válida es requerida")
      .typeError("Edad válida es requerida"),
    dateOfBirth: Yup.string().required("Fecha de nacimiento es requerida"),
  });

  return (
    <Formik
      initialValues={{
        fullName: "",
        age: "",
        dateOfBirth: "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleSignIn}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        values,
        errors,
        touched,
      }) => (
        <>
          {!isUserExist ? (
            <>
              <TextInput
                style={LoginScreenStyles.input}
                placeholder="Nombre Completo"
                placeholderTextColor="#c7c585"
                onChangeText={handleChange("fullName")}
                onBlur={handleBlur("fullName")}
                value={values.fullName}
              />
              {errors.fullName && touched.fullName && (
                <Text style={LoginScreenStyles.error}>{errors.fullName}</Text>
              )}
              <TextInput
                style={LoginScreenStyles.input}
                placeholder="Edad"
                placeholderTextColor="#c7c585"
                onChangeText={handleChange("age")}
                onBlur={handleBlur("age")}
                value={values.age}
                keyboardType="numeric"
              />
              {errors.age && touched.age && (
                <Text style={LoginScreenStyles.error}>{errors.age}</Text>
              )}
              <TouchableOpacity
                style={LoginScreenStyles.generalContainer}
                onPress={() => setShow(true)}
              >
                <TextInput
                  style={LoginScreenStyles.input}
                  placeholder="Fecha de Nacimiento"
                  placeholderTextColor="#c7c585"
                  value={values.dateOfBirth}
                  editable={false}
                />
              </TouchableOpacity>
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  is24Hour={true}
                  display="default"
                  maximumDate={new Date()}
                  onChange={(event, selectedDate) =>
                    onChange(event, selectedDate, setFieldValue)
                  }
                />
              )}
              {errors.dateOfBirth && touched.dateOfBirth && (
                <Text style={LoginScreenStyles.error}>
                  {errors.dateOfBirth}
                </Text>
              )}
              <View style={LoginScreenStyles.generalContainer}>
                <View style={LoginScreenStyles.phoneFullNumberContainer}>
                  <View style={LoginScreenStyles.phoneZoneContainer}>
                    <Image
                      source={getFlagImage(userInfo.info.phone_number_code)}
                      style={LoginScreenStyles.flagImage}
                    />
                    <Text style={LoginScreenStyles.phoneZoneText}>
                      {userInfo.info.phone_number_code}
                    </Text>
                  </View>
                  <View style={LoginScreenStyles.phoneNumberContainer}>
                    <Text style={LoginScreenStyles.phoneNumberText}>
                      {userInfo.info.phone_number}
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={LoginScreenStyles.button}
                onPress={() => handleSubmit()}
              >
                <Text style={LoginScreenStyles.buttonText}>Registrarse</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={LoginScreenStyles.button}
                onPress={() => setNextSection(false)}
              >
                <Text style={LoginScreenStyles.buttonText}>Volver</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text>Si existe</Text>
          )}
        </>
      )}
    </Formik>
  );
};

export default SignInForm;