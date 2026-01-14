import React, { useEffect, useState } from "react";
import { View, TextInput, Text, TouchableOpacity, Linking } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { LoginScreenStyles } from "../LoginScreen.style";
import Icon from "react-native-vector-icons/FontAwesome";
import { useDispatch, useSelector } from "react-redux";
import { selectUserInfo } from "../../../store/selectors";
import { AppDispatch } from "../../../store";
import { sendVerificationCode, verifyCode } from "../../../store/effects";
import {
  CommonActions,
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { RootStackParamList } from "../../../navigation/AppNavigator/AppNavigator";

const CodeValidationForm: React.FC<any> = ({ setNextSection }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSendCode, setIsSendCode] = useState(false);
  const [disabledResend, setDisabledResend] = useState(true);
  const [codeInvalid, setCodeInvalid] = useState(false);
  const [countdown, setCountdown] = useState(90);
  const dispatch: AppDispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);
  const navigation = useNavigation();

  // Countdown timer effect
  useEffect(() => {
    if (isSendCode && disabledResend && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setDisabledResend(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isSendCode, disabledResend, countdown]);

  useEffect(() => {
    if (userInfo.isIncorrectCode) {
      setDisabledResend(false);
      setCodeInvalid(true);
    } else {
      setCodeInvalid(false);
    }

    if (userInfo.isUserValidated) {
    }
  }, [userInfo, navigation]);

  const validationSchema = Yup.object().shape({
    code: Yup.string()
      .required("El código es requerido")
      .matches(/^\d{6}$/, "El código debe tener 6 dígitos"),
  });

  const sendCoding = () => {
    console.log("📧 [SEND CODING] Email:", userInfo.info.email);
    console.log("📧 [SEND CODING] User ID:", userInfo.info.id_platforms_user);
    setIsSendCode(true);
    setDisabledResend(true);
    setCountdown(90);
    dispatch(
      sendVerificationCode(userInfo.info.email, userInfo.info.id_platforms_user)
    );
  };

  const resendCode = (resetForm: () => void) => {
    setCodeInvalid(false);
    setDisabledResend(true);
    setIsSendCode(false);
    setSelectedOption(null);
    setCountdown(90);
    resetForm(); // Reset the form
  };

  const handleCodeValidation = (values: any) => {
    console.log("Code Validation", values);
    console.log("🔑 [VALIDATE CODE] Email:", userInfo.info.email);
    console.log("🔑 [VALIDATE CODE] User ID:", userInfo.info.id_platforms_user);
    dispatch(
      verifyCode(
        userInfo.info.email,
        values.code,
        userInfo.info.id_platforms_user
      )
    );
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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
        resetForm,
      }) => (
        <>
          <Text style={LoginScreenStyles.label}>
            Para garantizar la seguridad de tu cuenta, enviaremos un código de
            seis dígitos a tu correo. Insértalo a continuación:
          </Text>
          {true && (
            <>
              {!isSendCode ? (
                <>
                  <TouchableOpacity
                    style={LoginScreenStyles.button}
                    onPress={() => sendCoding()}
                  >
                    <Text style={LoginScreenStyles.buttonText}>
                      Enviar Código
                    </Text>
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
                  <TextInput
                    style={[
                      errors.code && touched.code
                        ? LoginScreenStyles.inputError
                        : LoginScreenStyles.input,
                      { textAlign: "center" }, // Center the text
                    ]}
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
                  {codeInvalid && (
                    <Text style={LoginScreenStyles.error}>
                      El codigo es incorrecto
                    </Text>
                  )}
                  <TouchableOpacity
                    style={LoginScreenStyles.button}
                    onPress={() => handleSubmit()}
                  >
                    <Text style={LoginScreenStyles.buttonText}>
                      Validar Código
                    </Text>
                  </TouchableOpacity>
                  {disabledResend ? (
                    <>
                      <Text style={LoginScreenStyles.timerResendText}>
                        {formatTime(countdown)} para reenviar nuevo código
                      </Text>
                      <Text
                        style={
                          countdown > 10
                            ? LoginScreenStyles.timerCodeText
                            : LoginScreenStyles.timerCodeTextRed
                        }
                      >
                        {formatTime(countdown)}
                      </Text>
                    </>
                  ) : (
                    <>
                      <TouchableOpacity
                        style={LoginScreenStyles.secondaryButton}
                        onPress={() => resendCode(resetForm)}
                      >
                        <Text style={LoginScreenStyles.buttonLinkText}>
                          Reenviar Código
                        </Text>
                      </TouchableOpacity>
                      <Text
                        style={
                          (LoginScreenStyles.termsText,
                          {
                            color: "#ff0000", // Red text color
                            textAlign: "center",
                          })
                        }
                      >
                        Revisa tu carpeta de spam si no encuentras el correo
                      </Text>
                    </>
                  )}
                </>
              )}
            </>
          )}
          <Text style={LoginScreenStyles.termsText}>
            Al registrarte o iniciar sesión, aceptas nuestros{" "}
            <Text
              style={LoginScreenStyles.linkText}
              onPress={() =>
                Linking.openURL(
                  "https://intelipadel.com/terminosycondiciones/padelroom"
                )
              }
            >
              Términos y Condiciones
            </Text>{" "}
            y{" "}
            <Text
              style={LoginScreenStyles.linkText}
              onPress={() =>
                Linking.openURL(
                  "https://intelipadel.com/avisodeprivacidad/padelroom"
                )
              }
            >
              Política de Privacidad
            </Text>
            .
          </Text>
        </>
      )}
    </Formik>
  );
};

export default CodeValidationForm;
