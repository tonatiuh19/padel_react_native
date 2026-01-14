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
import CustomDatePicker from "../../../components/CustomDatePicker/CustomDatePicker";
import { formatDate } from "../../../utils/UtilsFunctions";
import CodeValidationForm from "../CodeValidationForm/CodeValidationForm";
import Feather from "@expo/vector-icons/Feather";

const SignInForm: React.FC<any> = ({
  isUserExist,
  handleSignIn,
  setNextSection,
  getFlagImage,
  setUserExists,
  inactiveAccountMessage,
}) => {
  const userInfo = useSelector(selectUserInfo);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  useEffect(() => {
    console.log("🟣 [SIGNIN FORM] useEffect triggered");
    console.log("🟣 [SIGNIN FORM] isUserExist:", isUserExist);
    console.log(
      "🟣 [SIGNIN FORM] userInfo.info.active (normalized):",
      userInfo.info.active
    );
    console.log("🟣 [SIGNIN FORM] userInfo.info.email:", userInfo.info.email);
    console.log("🟣 [SIGNIN FORM] userInfo.info.error:", userInfo.info.error);
    console.log("🟣 [SIGNIN FORM] userInfo.info.exists:", userInfo.info.exists);
    console.log(
      "🟣 [SIGNIN FORM] inactiveAccountMessage:",
      inactiveAccountMessage
    );
    setUserExists(isUserExist); // Update the parent state when isUserExist changes
  }, [isUserExist, setUserExists, userInfo, inactiveAccountMessage]);

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("Nombre es requerido"),
    lastName: Yup.string().required("Apellido es requerido"),
    phone: Yup.string().required("Teléfono es requerido"),
    dateOfBirth: Yup.string(), // Optional
  });

  return (
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        phone: "",
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
              {inactiveAccountMessage && (
                <View
                  style={{
                    backgroundColor: "#fff3cd",
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 16,
                    borderLeftWidth: 4,
                    borderLeftColor: "#ffc107",
                  }}
                >
                  <Text style={{ color: "#856404", fontSize: 14 }}>
                    ℹ️ {inactiveAccountMessage}
                  </Text>
                </View>
              )}
              {!show && (
                <>
                  <TextInput
                    style={
                      errors.firstName && touched.firstName
                        ? LoginScreenStyles.inputError
                        : LoginScreenStyles.input
                    }
                    placeholder="Nombre"
                    placeholderTextColor="#c7c585"
                    onChangeText={handleChange("firstName")}
                    onBlur={handleBlur("firstName")}
                    value={values.firstName}
                  />
                  {errors.firstName && touched.firstName && (
                    <Text style={LoginScreenStyles.error}>
                      {errors.firstName}
                    </Text>
                  )}
                  <TextInput
                    style={
                      errors.lastName && touched.lastName
                        ? LoginScreenStyles.inputError
                        : LoginScreenStyles.input
                    }
                    placeholder="Apellido"
                    placeholderTextColor="#c7c585"
                    onChangeText={handleChange("lastName")}
                    onBlur={handleBlur("lastName")}
                    value={values.lastName}
                  />
                  {errors.lastName && touched.lastName && (
                    <Text style={LoginScreenStyles.error}>
                      {errors.lastName}
                    </Text>
                  )}
                  <TextInput
                    style={
                      errors.phone && touched.phone
                        ? LoginScreenStyles.inputError
                        : LoginScreenStyles.input
                    }
                    placeholder="Teléfono"
                    placeholderTextColor="#c7c585"
                    keyboardType="phone-pad"
                    onChangeText={handleChange("phone")}
                    onBlur={handleBlur("phone")}
                    value={values.phone}
                  />
                  {errors.phone && touched.phone && (
                    <Text style={LoginScreenStyles.error}>{errors.phone}</Text>
                  )}
                  <TouchableOpacity
                    style={LoginScreenStyles.generalContainer}
                    onPress={() => setShow(true)}
                  >
                    <TextInput
                      style={LoginScreenStyles.input}
                      placeholder="Fecha de Nacimiento (opcional)"
                      placeholderTextColor="#c7c585"
                      value={values.dateOfBirth}
                      editable={false}
                      pointerEvents="none"
                    />
                  </TouchableOpacity>
                </>
              )}
              {show && (
                <CustomDatePicker
                  value={date}
                  onChange={(selectedDate) => {
                    setDate(selectedDate);
                    setFieldValue("dateOfBirth", formatDate(selectedDate));
                    setShow(false);
                  }}
                  onClose={() => setShow(false)}
                />
              )}

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
            <>
              {userInfo.info.active === 1 ? (
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
