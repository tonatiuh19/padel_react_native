import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
} from "react-native";
import { ProfileScreenStyles } from "./ProfileScreen.style";
import { Modal } from "react-native";
import {
  StripeProvider,
  CardField,
  useStripe,
} from "@stripe/stripe-react-native";
import type { CardFieldInput } from "@stripe/stripe-react-native";
//import { attachPaymentMethodToUser } from "../../store/effects";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import { FontAwesome6 } from "@expo/vector-icons";
import { selectCardInfo, selectUserInfo } from "../../store/selectors";
import { attachPaymentMethod, logout } from "../../store/effects";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/AppNavigator/AppNavigator";
import Icon from "react-native-vector-icons/FontAwesome";
import EditProfileForm from "./EditProfileForm/EditProfileForm";
import ConfirmationModal from "./ConfirmationModal/ConfirmationModal";
import LoadingSmall from "../HomeScreen/shared/components/LoadingSmall/LoadingSmall";

export default function ProfileScreen() {
  const dispatch: AppDispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);
  const cardInfo = useSelector(selectCardInfo);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isEditing, setIsEditing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSettingDefaultPaymentMethod, setIsSettingDefaultPaymentMethod] =
    useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [cardDetails, setCardDetails] = useState<CardFieldInput.Details | null>(
    null
  );
  const { createPaymentMethod } = useStripe();

  // Handler to update favorite payment method
  const handleUpdatePaymentMethod = () => {
    setShowCardModal(true);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("id_platforms_user");
    dispatch(
      logout(userInfo.info?.id_platforms_user, userInfo.info?.id_platforms)
    );
    navigation.navigate("Main");
  };

  const handleDeleteAccount = () => {
    // Add your delete account logic here
    setModalVisible(false);
    handleLogout();
    Linking.openURL(
      `https://intelipadel.com/desactivarcuenta/${userInfo.info?.id_platforms_user}`
    );
  };

  useEffect(() => {
    console.log("User Info", cardInfo);
  }, [cardInfo]);

  return (
    <View style={ProfileScreenStyles.container}>
      {/* Profile content after top bar, not centered vertically */}
      {!isEditing ? (
        <View style={{ width: "100%", alignItems: "center", paddingTop: 25 }}>
          <View style={ProfileScreenStyles.gridContainer}>
            <View style={ProfileScreenStyles.gridRow}>
              <Text style={ProfileScreenStyles.gridLabel}>Nombre:</Text>
              <Text style={ProfileScreenStyles.gridValue}>
                {userInfo.info?.full_name}
              </Text>
            </View>
            <View style={ProfileScreenStyles.gridRow}>
              <Text style={ProfileScreenStyles.gridLabel}>Correo:</Text>
              <Text style={ProfileScreenStyles.gridValue}>
                {userInfo.info?.email}
              </Text>
            </View>
            <View style={ProfileScreenStyles.gridRow}>
              <Text style={ProfileScreenStyles.gridLabel}>Edad:</Text>
              <Text style={ProfileScreenStyles.gridValue}>
                {userInfo.info?.age}
              </Text>
            </View>
            <View style={ProfileScreenStyles.gridRow}>
              <Text style={ProfileScreenStyles.gridLabel}>
                Fecha de Nacimiento:
              </Text>
              <Text style={ProfileScreenStyles.gridValue}>
                {userInfo.info?.date_of_birth}
              </Text>
            </View>
            {/* Favorite Payment Method Section */}
            {cardInfo && cardInfo.default_payment_method && (
              <View style={ProfileScreenStyles.cardInfoSection}>
                <View style={ProfileScreenStyles.cardInfoRow}>
                  <FontAwesome6
                    name={
                      cardInfo.brand === "visa"
                        ? "cc-visa"
                        : cardInfo.brand === "mastercard"
                        ? "cc-mastercard"
                        : cardInfo.brand === "amex"
                        ? "cc-amex"
                        : cardInfo.brand === "discover"
                        ? "cc-discover"
                        : "credit-card"
                    }
                    size={28}
                    color="#222"
                    style={{ marginRight: 12 }}
                  />
                  <Text style={ProfileScreenStyles.cardInfoText}>
                    {cardInfo.brand?.toUpperCase()} •••• {cardInfo.last4}
                  </Text>
                </View>
                <Text style={ProfileScreenStyles.cardInfoLabel}>
                  Método de pago predeterminado
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={[ProfileScreenStyles.button, { marginTop: 20 }]}
              onPress={handleUpdatePaymentMethod}
            >
              <Text style={ProfileScreenStyles.buttonText}>
                {cardInfo && cardInfo.default_payment_method
                  ? "Actualizar Método de Pago"
                  : "Añadir Método de Pago"}
              </Text>
            </TouchableOpacity>
            {/*<TouchableOpacity
              style={ProfileScreenStyles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Icon name="pencil" size={20} color="#000" />
            </TouchableOpacity>*/}
          </View>
        </View>
      ) : (
        <EditProfileForm
          initialValues={{
            full_name: userInfo.info?.full_name,
            email: userInfo.info?.email,
            age: userInfo.info?.age,
            date_of_birth: userInfo.info?.date_of_birth,
          }}
          onCancel={() => setIsEditing(false)}
        />
      )}
      <View style={ProfileScreenStyles.divider} />
      {/* Fixed bottom actions */}
      <View style={ProfileScreenStyles.bottomActionsContainer}>
        <TouchableOpacity
          style={ProfileScreenStyles.button}
          onPress={handleLogout}
        >
          <Text style={ProfileScreenStyles.buttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={ProfileScreenStyles.deActivateButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={ProfileScreenStyles.buttonText}>Eliminar mi cuenta</Text>
        </TouchableOpacity>
      </View>
      <ConfirmationModal
        visible={modalVisible}
        onConfirm={handleDeleteAccount}
        onCancel={() => setModalVisible(false)}
      />

      {/* Modal for Stripe CardField as bottom sheet panel */}
      <Modal visible={showCardModal} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "#00000099",
          }}
        >
          <View style={ProfileScreenStyles.cardModalPanel}>
            <View style={ProfileScreenStyles.cardModalHeader}>
              <Text style={ProfileScreenStyles.cardModalTitleCentered}>
                {cardInfo && cardInfo.default_payment_method
                  ? "Actualizar método de pago"
                  : "Agregar método de pago"}
              </Text>
              <TouchableOpacity
                onPress={() => setShowCardModal(false)}
                style={ProfileScreenStyles.cardModalCloseButton}
                accessibilityLabel="Cerrar"
              >
                <Icon name="close" size={22} color="#222" />
              </TouchableOpacity>
            </View>
            <StripeProvider publishableKey={userInfo.info?.publishable_key}>
              <View style={ProfileScreenStyles.containerCard}>
                <View style={ProfileScreenStyles.summaryCard}>
                  <Text style={ProfileScreenStyles.cardFieldLabel}>
                    Ingresa los datos de tu tarjeta:
                  </Text>
                  <CardField
                    postalCodeEnabled={false}
                    style={[
                      ProfileScreenStyles.cardField,
                      {
                        backgroundColor: "#ffffff",
                      },
                    ]}
                    cardStyle={{
                      textColor: "#000000",
                      backgroundColor: "#ffffff",
                    }}
                    onCardChange={(details) => setCardDetails(details)}
                  />
                </View>
              </View>
              <View style={{ alignItems: "center", width: "100%" }}>
                {!isSettingDefaultPaymentMethod ? (
                  <TouchableOpacity
                    style={[ProfileScreenStyles.buttonPay, { width: "100%" }]}
                    onPress={async () => {
                      setIsSettingDefaultPaymentMethod(true);

                      if (!cardDetails?.complete) {
                        setIsSettingDefaultPaymentMethod(false);
                        alert("Por favor, completa los datos de la tarjeta.");
                        return;
                      }
                      const { paymentMethod, error } =
                        await createPaymentMethod({
                          paymentMethodType: "Card",
                          paymentMethodData: {
                            billingDetails: { email: userInfo.info?.email },
                          },
                        });

                      if (error) {
                        setIsSettingDefaultPaymentMethod(false);
                        alert("Error al crear el método de pago");
                        return;
                      }

                      console.log(
                        "Payment Method:",
                        userInfo.info.stripe_id,
                        paymentMethod.id,
                        userInfo.info.id_platforms_user
                      );
                      // Uncomment and implement this when backend is ready
                      dispatch(
                        attachPaymentMethod(
                          userInfo.info.stripe_id,
                          paymentMethod.id,
                          userInfo.info.id_platforms_user
                        )
                      );

                      setIsSettingDefaultPaymentMethod(false);
                      setShowCardModal(false);
                    }}
                  >
                    <Text style={ProfileScreenStyles.buttonPayText}>
                      <FontAwesome6 name="lock" size={16} color="#fff" />{" "}
                      {cardInfo && cardInfo.default_payment_method
                        ? "Actualizar"
                        : "Guardar"}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <LoadingSmall isLoading={true} color="#121212" />
                )}
                <Text style={ProfileScreenStyles.termsText}>
                  Al añadir un método de pago, aceptas nuestros{" "}
                  <Text
                    style={ProfileScreenStyles.termsLink}
                    onPress={() =>
                      Linking.openURL(
                        "https://intelipadel.com/terminosycondiciones/padelroom"
                      )
                    }
                  >
                    términos y condiciones
                  </Text>
                  .
                </Text>
              </View>
            </StripeProvider>
          </View>
        </View>
      </Modal>
    </View>
  );
}
