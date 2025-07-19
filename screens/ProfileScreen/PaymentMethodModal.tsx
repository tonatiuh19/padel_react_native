import React, { useEffect, useState } from "react";
import { View, Text, Modal, TouchableOpacity, Linking } from "react-native";
import {
  StripeProvider,
  CardField,
  useStripe,
} from "@stripe/stripe-react-native";
import type { CardFieldInput } from "@stripe/stripe-react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { FontAwesome6 } from "@expo/vector-icons";
import LoadingSmall from "../HomeScreen/shared/components/LoadingSmall/LoadingSmall";
import { ProfileScreenStyles } from "./ProfileScreen.style";
import { selectCardInfo, selectUserInfo } from "../../store/selectors";
import { useDispatch, useSelector } from "react-redux";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/AppNavigator/AppNavigator";
import { AppDispatch } from "../../store";
import { attachPaymentMethod, createSubscription } from "../../store/effects";

interface PaymentMethodModalProps {
  visible: boolean;
  onClose: () => void;
  isSubscription: boolean;
}

const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({
  visible,
  onClose,
  isSubscription,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const userInfo = useSelector(selectUserInfo);
  const cardInfo = useSelector(selectCardInfo);
  const [isSettingDefaultPaymentMethod, setIsSettingDefaultPaymentMethod] =
    useState(false);
  const [cardDetails, setCardDetails] = useState<CardFieldInput.Details | null>(
    null
  );
  const { createPaymentMethod } = useStripe();

  useEffect(() => {
    console.log("User Info", userInfo);
  }, [cardInfo]);

  return (
    <Modal visible={visible} transparent animationType="slide">
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
              {isSubscription
                ? "Confirmar suscripción"
                : cardInfo && cardInfo.default_payment_method
                ? "Actualizar método de pago"
                : "Agregar método de pago"}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={ProfileScreenStyles.cardModalCloseButton}
              accessibilityLabel="Cerrar"
            >
              <Icon name="close" size={22} color="#222" />
            </TouchableOpacity>
          </View>
          <StripeProvider publishableKey={userInfo.info?.publishable_key}>
            <View style={ProfileScreenStyles.containerCard}>
              {cardInfo && cardInfo.default_payment_method ? (
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
                  <TouchableOpacity
                    style={ProfileScreenStyles.editCardButton}
                    onPress={() => {
                      onClose();
                      navigation.navigate("Profile");
                    }}
                  >
                    <FontAwesome6 name="pencil" size={14} color="#222" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={ProfileScreenStyles.summaryCard}>
                  <Text style={ProfileScreenStyles.cardFieldLabel}>
                    Ingresa los datos de tu tarjeta:
                  </Text>
                  <CardField
                    postalCodeEnabled={false}
                    style={[
                      ProfileScreenStyles.cardField,
                      { backgroundColor: "#ffffff" },
                    ]}
                    cardStyle={{
                      textColor: "#000000",
                      backgroundColor: "#ffffff",
                    }}
                    onCardChange={setCardDetails}
                  />
                </View>
              )}
            </View>
            <View style={{ alignItems: "center", width: "100%" }}>
              {!isSettingDefaultPaymentMethod ? (
                <TouchableOpacity
                  style={[ProfileScreenStyles.buttonPay, { width: "100%" }]}
                  onPress={async () => {
                    setIsSettingDefaultPaymentMethod(true);

                    // If it's a subscription, check for default payment method
                    if (isSubscription) {
                      let paymentMethodId = cardInfo?.default_payment_method;

                      // If no default, create one from CardField
                      if (!paymentMethodId) {
                        if (!cardDetails || !cardDetails.complete) {
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
                        paymentMethodId = paymentMethod.id;
                        // Optionally, you can dispatch attachPaymentMethod here if you want to save it as default
                      }

                      // Dispatch subscription creation
                      await dispatch(
                        createSubscription(
                          userInfo.info.stripe_id,
                          // Pass the price_id from your subscription object (you may need to pass it as prop)
                          "price_1Rlf2bFlBExilNDG1qK58Hny", // <-- Replace with dynamic value if needed
                          userInfo.info.id_platforms_user,
                          paymentMethodId
                        )
                      );
                      setIsSettingDefaultPaymentMethod(false);
                      onClose();
                    } else {
                      // Regular payment method flow
                      if (!cardDetails || !cardDetails.complete) {
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
                      dispatch(
                        attachPaymentMethod(
                          userInfo.info.stripe_id,
                          paymentMethod.id,
                          userInfo.info.id_platforms_user
                        )
                      );
                      setIsSettingDefaultPaymentMethod(false);
                      onClose();
                    }
                  }}
                >
                  <Text style={ProfileScreenStyles.buttonPayText}>
                    <FontAwesome6 name="lock" size={16} color="#fff" />{" "}
                    {isSubscription
                      ? "Confirmar suscripción"
                      : cardInfo && cardInfo.default_payment_method
                      ? "Actualizar"
                      : "Guardar"}
                  </Text>
                </TouchableOpacity>
              ) : (
                <LoadingSmall isLoading={true} color="#121212" />
              )}
              <Text style={ProfileScreenStyles.termsText}>
                {isSubscription
                  ? "Al confirmar tu suscripción, aceptas nuestros "
                  : "Al añadir un método de pago, aceptas nuestros "}
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
  );
};

export default PaymentMethodModal;
