import React, { useEffect, useState } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { LoginScreenStyles } from "../LoginScreen.style";
import Icon from "react-native-vector-icons/FontAwesome";
import { useDispatch, useSelector } from "react-redux";
import { selectUserInfo } from "../../../store/selectors";
import { AppDispatch } from "../../../store";
import { sendCode } from "../../../store/effects";
import Countdown from "../../ScheduleScreen/AddSlotModal/Countdown/Countdown";

const CodeValidationForm: React.FC<any> = ({}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSendCode, setIsSendCode] = useState(false);
  const [disabledResend, setDisabledResend] = useState(true);
  const dispatch: AppDispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);

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
  };

  const countDownComplete = (resetForm: () => void) => {
    console.log("Countdown completed");
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
            Para garantizar la seguridad de tu cuenta, selecciona cómo deseas
            recibir un código de verificación de seis dígitos e insértalo a
            continuación:
          </Text>
          {!isSendCode && (
            <View style={LoginScreenStyles.radioContainer}>
              <TouchableOpacity
                style={LoginScreenStyles.radioOption}
                onPress={() => setSelectedOption("sms")}
              >
                <Icon
                  name={selectedOption === "sms" ? "check-circle" : "circle-o"}
                  size={24}
                  color="#ffffff"
                />
                <Text style={LoginScreenStyles.radioText}>SMS</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={LoginScreenStyles.radioOption}
                onPress={() => setSelectedOption("whatsapp")}
              >
                <Icon
                  name={
                    selectedOption === "whatsapp" ? "check-circle" : "circle-o"
                  }
                  size={24}
                  color="#ffffff"
                />
                <Text style={LoginScreenStyles.radioText}>Whatsapp</Text>
              </TouchableOpacity>
            </View>
          )}
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
