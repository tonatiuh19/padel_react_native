import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Formik } from "formik";
import * as Yup from "yup";
import { LoginScreenStyles } from "../LoginScreen.style";
import { selectUserInfo } from "../../../store/selectors";
import { useSelector } from "react-redux";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formatDate } from "../../../utils/UtilsFunctions";
import CodeValidationForm from "../CodeValidationForm/CodeValidationForm";
import Feather from "@expo/vector-icons/Feather";

const SignInForm: React.FC<any> = ({
  isUserExist,
  handleSignIn,
  setNextSection,
  getFlagImage,
  setUserExists,
}) => {
  const userInfo = useSelector(selectUserInfo);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [isSettingDateOfBirth, setIsSettingDateOfBirth] = useState(false);

  useEffect(() => {
    console.log("isUserExist", isUserExist);
    console.log("userInfo", userInfo.info.active);
    setUserExists(isUserExist); // Update the parent state when isUserExist changes
  }, [isUserExist, setUserExists]);

  const onChange = (event: any, selectedDate: any, setFieldValue: any) => {
    const currentDate = selectedDate || date;
    if (Platform.OS !== "ios") {
      console.log(
        "Current Date",
        currentDate.setDate(currentDate.getDate() - 1)
      );
      setShow(false);
    }
    setDate(currentDate);
    setFieldValue("dateOfBirth", formatDate(currentDate)); // Update dateOfBirth field
  };

  const handleDateOfBirth = () => {
    setIsSettingDateOfBirth(false);
    setShow(false);
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
              {!isSettingDateOfBirth && Platform.OS !== "ios" && (
                <>
                  <TextInput
                    style={
                      errors.fullName && touched.fullName
                        ? LoginScreenStyles.inputError
                        : LoginScreenStyles.input
                    }
                    placeholder="Nombre Completo"
                    placeholderTextColor="#c7c585"
                    onChangeText={handleChange("fullName")}
                    onBlur={handleBlur("fullName")}
                    value={values.fullName}
                  />
                  {errors.fullName && touched.fullName && (
                    <Text style={LoginScreenStyles.error}>
                      {errors.fullName}
                    </Text>
                  )}
                  <TextInput
                    style={
                      errors.age && touched.age
                        ? LoginScreenStyles.inputError
                        : LoginScreenStyles.input
                    }
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
                </>
              )}
              {!show && (
                <TouchableOpacity
                  style={
                    errors.dateOfBirth && touched.dateOfBirth
                      ? LoginScreenStyles.generalContainerError
                      : LoginScreenStyles.generalContainer
                  }
                  onPress={() => {
                    setShow(true);
                    if (Platform.OS === "ios") {
                      return setIsSettingDateOfBirth(true);
                    }
                  }}
                >
                  <TextInput
                    style={
                      errors.dateOfBirth && touched.dateOfBirth
                        ? LoginScreenStyles.inputError
                        : LoginScreenStyles.input
                    }
                    placeholder="Fecha de Nacimiento"
                    placeholderTextColor="#c7c585"
                    value={values.dateOfBirth}
                    editable={false}
                    pointerEvents="none"
                  />
                </TouchableOpacity>
              )}
              {show && (
                <View
                  style={[
                    LoginScreenStyles.datePickerContainer,
                    { alignItems: "center" },
                  ]}
                >
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    textColor="#e1dd2a"
                    is24Hour={true}
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    maximumDate={new Date()}
                    onChange={(event, selectedDate) =>
                      onChange(event, selectedDate, setFieldValue)
                    }
                  />
                </View>
              )}
              {errors.dateOfBirth && touched.dateOfBirth && (
                <Text style={LoginScreenStyles.error}>
                  {errors.dateOfBirth}
                </Text>
              )}

              {!isSettingDateOfBirth ? (
                <>
                  <View style={LoginScreenStyles.generalContainer}>
                    <View style={LoginScreenStyles.phoneFullNumberContainer}>
                      <View style={LoginScreenStyles.phoneZoneContainer}>
                        <Feather name="mail" size={18} color="#e1dd2a" />
                      </View>
                      <View style={LoginScreenStyles.phoneNumberContainer}>
                        <Text style={LoginScreenStyles.phoneNumberText}>
                          {userInfo.info.email}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={LoginScreenStyles.button}
                    onPress={() => handleSubmit()}
                  >
                    <Text style={LoginScreenStyles.buttonText}>Continuar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={LoginScreenStyles.secondaryButton}
                    onPress={() => setNextSection(false)}
                  >
                    <Text style={LoginScreenStyles.secodnaryButtonText}>
                      Volver
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={LoginScreenStyles.button}
                  onPress={() => handleDateOfBirth()}
                >
                  <Text style={LoginScreenStyles.buttonText}>Aceptar</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <>
              {userInfo.info.active === 0 ? (
                <CodeValidationForm setNextSection={setNextSection} />
              ) : (
                <View style={LoginScreenStyles.generalContainer}>
                  <Text style={LoginScreenStyles.phoneNumberText}>
                    Tu cuenta ha sido eliminada. Por favor, contacta a soporte.
                  </Text>
                </View>
              )}
            </>
          )}
        </>
      )}
    </Formik>
  );
};

export default SignInForm;
