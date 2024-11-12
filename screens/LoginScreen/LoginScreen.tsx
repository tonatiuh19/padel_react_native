import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { LoginScreenStyles } from "./LoginScreen.style";

const LoginScreen: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneZone, setPhoneZone] = useState("+52"); // Default to Mexico
  const [pickerVisible, setPickerVisible] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateSignUpForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!fullName) newErrors.fullName = "Nombre completo es requerido";
    if (!age || isNaN(Number(age))) newErrors.age = "Edad válida es requerida";
    if (!dateOfBirth)
      newErrors.dateOfBirth = "Fecha de nacimiento es requerida";
    if (!phoneNumber) newErrors.phoneNumber = "Número de teléfono es requerido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = () => {
    if (validateSignUpForm()) {
      console.log("Sign Up", {
        fullName,
        age,
        dateOfBirth,
        phoneZone,
        phoneNumber,
      });
      // Handle sign up logic here
    }
  };

  const handleLogin = () => {
    console.log("Log In", { phoneZone, phoneNumber });
    // Handle login logic here
  };

  const getFlagImage = (zone: string) => {
    switch (zone) {
      case "+52":
        return { uri: "https://garbrix.com/padel/assets/images/mx.png" };
      case "+1":
        return { uri: "https://garbrix.com/padel/assets/images/us.png" };
      default:
        return { uri: "https://garbrix.com/padel/assets/images/mx.png" };
    }
  };

  return (
    <View style={LoginScreenStyles.container}>
      <View style={LoginScreenStyles.cardContainer}>
        {isSignUp ? (
          <>
            <TextInput
              style={LoginScreenStyles.input}
              placeholder="Nombre Completo"
              placeholderTextColor="#888888"
              value={fullName}
              onChangeText={setFullName}
            />
            {errors.fullName && (
              <Text style={LoginScreenStyles.error}>{errors.fullName}</Text>
            )}
            <TextInput
              style={LoginScreenStyles.input}
              placeholder="Edad"
              placeholderTextColor="#888888"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />
            {errors.age && (
              <Text style={LoginScreenStyles.error}>{errors.age}</Text>
            )}
            <TextInput
              style={LoginScreenStyles.input}
              placeholder="Fecha de Nacimiento"
              placeholderTextColor="#888888"
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
            />
            {errors.dateOfBirth && (
              <Text style={LoginScreenStyles.error}>{errors.dateOfBirth}</Text>
            )}
            <View style={LoginScreenStyles.phoneContainer}>
              <Image
                source={getFlagImage(phoneZone)}
                style={LoginScreenStyles.flag}
              />
              <View style={LoginScreenStyles.pickerContainer}>
                <TouchableOpacity
                  onPress={() => setPickerVisible(true)}
                  style={LoginScreenStyles.pickerTouchable}
                >
                  <Text style={LoginScreenStyles.pickerText}>{phoneZone}</Text>
                </TouchableOpacity>
                <Picker
                  selectedValue={phoneZone}
                  style={[
                    LoginScreenStyles.hiddenPicker,
                    pickerVisible && { opacity: 1 },
                  ]}
                  onValueChange={(itemValue) => {
                    setPhoneZone(itemValue);
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
                placeholderTextColor="#888888"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>
            {errors.phoneNumber && (
              <Text style={LoginScreenStyles.error}>{errors.phoneNumber}</Text>
            )}
            <TouchableOpacity
              style={LoginScreenStyles.button}
              onPress={handleSignUp}
            >
              <Text style={LoginScreenStyles.buttonText}>Registrarse</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={LoginScreenStyles.button}
              onPress={() => setIsSignUp(false)}
            >
              <Text style={LoginScreenStyles.buttonText}>Volver</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={LoginScreenStyles.phoneContainer}>
              <View style={LoginScreenStyles.pickerContainer}>
                <TouchableOpacity
                  onPress={() => setPickerVisible(true)}
                  style={LoginScreenStyles.pickerTouchable}
                >
                  <Image
                    source={getFlagImage(phoneZone)}
                    style={LoginScreenStyles.flag}
                  />
                  <Text style={LoginScreenStyles.pickerText}>{phoneZone}</Text>
                </TouchableOpacity>
                <Picker
                  selectedValue={phoneZone}
                  style={[
                    LoginScreenStyles.hiddenPicker,
                    pickerVisible && { opacity: 1 },
                  ]}
                  onValueChange={(itemValue) => {
                    setPhoneZone(itemValue);
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
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>
            <TouchableOpacity
              style={LoginScreenStyles.button}
              onPress={handleLogin}
            >
              <Text style={LoginScreenStyles.buttonText}>Continuar</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export default LoginScreen;
