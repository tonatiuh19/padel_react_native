import React, { useEffect, useState } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { LoginScreenStyles } from "../LoginScreen.style";
import Icon from "react-native-vector-icons/FontAwesome";
import { useDispatch, useSelector } from "react-redux";
import { selectUserInfo } from "../../../store/selectors";
import { AppDispatch } from "../../../store";
import { sendCode, validateSessionCode } from "../../../store/effects";
import Countdown from "../../ScheduleScreen/AddSlotModal/Countdown/Countdown";

const CodeValidationForm: React.FC<any> = ({}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSendCode, setIsSendCode] = useState(false);
  const [disabledResend, setDisabledResend] = useState(true);
  const [codeInvalid, setCodeInvalid] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);

  useEffect(() => {
    if (userInfo.isIncorrectCode) {
      setDisabledResend(false);
      setCodeInvalid(true);
    } else {
      setCodeInvalid(false);
    }
  }, [userInfo]);

  const validationSchema = Yup.object().shape({
    code: Yup.string()
      .required("El código es requerido")
      .matches(/^\d{6}$/, "El código debe tener 6 dígitos"),
  });

  const sendCoding = () => {
    setIsSendCode(true);
    dispatch(
      sendCode(
        userInfo.info.id_platforms_user,
        userInfo.info.id_platforms,
        selectedOption ? selectedOption : "sms"
      )
    );
  };

  const resendCode = (resetForm: () => void) => {
    setDisabledResend(true);
    setIsSendCode(false);
    setSelectedOption(null);
    resetForm(); // Reset the form
  };

  const handleCodeValidation = (values: any) => {
    console.log("Code Validation", values);
    dispatch(
      validateSessionCode(
        userInfo.info.id_platforms_user,
        userInfo.info.id_platforms,
        values.code
      )
    );
  };

  const countDownComplete = (resetForm: () => void) => {
    setDisabledResend(false);
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
            Para garantizar la seguridad de tu cuenta, hemos enviado un código
            de seis dígitos a tu correo. Insértalo a continuación:
          </Text>
          {selectedOption !== null && (
            <>
              {!isSendCode ? (
                <TouchableOpacity
                  style={LoginScreenStyles.button}
                  onPress={() => sendCoding()}
                  disabled={selectedOption === null} // Disable button until one option is selected
                >
                  <Text style={LoginScreenStyles.buttonText}>
                    Enviar Código
                  </Text>
                </TouchableOpacity>
              ) : (
                <>
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
                    editable={selectedOption !== null} // Disable until one option is selected
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
                    disabled={selectedOption === null} // Disable button until one option is selected
                  >
                    <Text style={LoginScreenStyles.buttonText}>
                      Validar Código
                    </Text>
                  </TouchableOpacity>
                  {disabledResend ? (
                    <>
                      <Text style={LoginScreenStyles.timerResendText}>
                        1:30 minutos para reenviar nuevo código
                      </Text>
                      <Countdown
                        style={{
                          timerText: LoginScreenStyles.timerCodeText,
                          timerTextRed: LoginScreenStyles.timerCodeTextRed,
                        }}
                        duration={90}
                        onComplete={() => countDownComplete(resetForm)}
                      />
                    </>
                  ) : (
                    <TouchableOpacity
                      style={LoginScreenStyles.secondaryButton}
                      onPress={() => resendCode(resetForm)}
                    >
                      <Text style={LoginScreenStyles.buttonLinkText}>
                        Reenviar Código
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </Formik>
  );
};

export default CodeValidationForm;
