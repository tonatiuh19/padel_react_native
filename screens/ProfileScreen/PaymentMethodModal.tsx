import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Dimensions,
  Animated,
  ScrollView,
} from "react-native";
import {
  StripeProvider,
  CardField,
  useStripe,
} from "@stripe/stripe-react-native";
import type { CardFieldInput } from "@stripe/stripe-react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import LoadingSmall from "../HomeScreen/shared/components/LoadingSmall/LoadingSmall";
import { ProfileScreenStyles } from "./ProfileScreen.style";
import { selectCardInfo, selectUserInfo } from "../../store/selectors";
import { useDispatch, useSelector } from "react-redux";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/AppNavigator/AppNavigator";
import { AppDispatch } from "../../store";
import { attachPaymentMethod } from "../../store/effects";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

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

  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    console.log("User Info", userInfo);
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [cardInfo, visible]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        }}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.gradientPanel}>
            {/* Header with solid background */}
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <View style={styles.headerIcon}>
                  <Ionicons name="card" size={28} color="#ffffff" />
                </View>
                <Text style={styles.headerTitle}>
                  {cardInfo && cardInfo.default_payment_method
                    ? "Actualizar método de pago"
                    : "Agregar método de pago"}
                </Text>
              </View>
              <TouchableOpacity
                onPress={onClose}
                style={styles.closeButton}
                accessibilityLabel="Cerrar"
              >
                <Ionicons name="close-circle" size={32} color="#ffffff" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <StripeProvider publishableKey={userInfo.info?.publishable_key}>
                <View style={styles.containerCard}>
                  {cardInfo && cardInfo.default_payment_method ? (
                    <View style={styles.cardInfoSection}>
                      <View style={styles.currentCardBadge}>
                        <Ionicons
                          name="shield-checkmark"
                          size={16}
                          color="#8c8a1a"
                        />
                        <Text style={styles.currentCardBadgeText}>
                          Método actual
                        </Text>
                      </View>

                      <View style={styles.cardDisplay}>
                        <View style={styles.cardGradient}>
                          <View style={styles.cardTop}>
                            <Text style={styles.cardLabel}>
                              Tarjeta registrada
                            </Text>
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
                              size={40}
                              color="#ffffff"
                            />
                          </View>
                          <Text style={styles.cardNumber}>
                            •••• •••• •••• {cardInfo.last4}
                          </Text>
                          <View style={styles.cardBottom}>
                            <Text style={styles.cardBrand}>
                              {cardInfo.brand?.toUpperCase()}
                            </Text>
                            <View style={styles.secureIcon}>
                              <Ionicons
                                name="lock-closed"
                                size={14}
                                color="#8c8a1a"
                              />
                            </View>
                          </View>
                        </View>
                      </View>

                      <Text style={styles.updateHint}>
                        Agrega una nueva tarjeta abajo para cambiar tu método de
                        pago
                      </Text>
                    </View>
                  ) : null}

                  {/* Add new card section - always show */}
                  <View style={styles.addCardSection}>
                    <View style={styles.addCardHeader}>
                      <Ionicons name="add-circle" size={24} color="#8c8a1a" />
                      <Text style={styles.addCardTitle}>
                        {cardInfo && cardInfo.default_payment_method
                          ? "Agregar nueva tarjeta"
                          : "Ingresa los datos de tu tarjeta"}
                      </Text>
                    </View>

                    <View style={styles.cardFieldWrapper}>
                      <CardField
                        postalCodeEnabled={false}
                        style={styles.cardField}
                        cardStyle={{
                          textColor: "#ffffff",
                          backgroundColor: "#374151",
                          borderRadius: 12,
                          borderWidth: 2,
                          borderColor: "#8c8a1a",
                        }}
                        onCardChange={setCardDetails}
                      />
                    </View>

                    <View style={styles.securityFeatures}>
                      <View style={styles.securityItem}>
                        <Ionicons
                          name="shield-checkmark"
                          size={18}
                          color="#8c8a1a"
                        />
                        <Text style={styles.securityText}>Pago seguro</Text>
                      </View>
                      <View style={styles.securityItem}>
                        <Ionicons
                          name="lock-closed"
                          size={18}
                          color="#8c8a1a"
                        />
                        <Text style={styles.securityText}>
                          Encriptado 256-bit
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Action Button */}
                <View style={styles.actionContainer}>
                  {!isSettingDefaultPaymentMethod ? (
                    <TouchableOpacity
                      style={styles.actionButtonWrapper}
                      onPress={async () => {
                        setIsSettingDefaultPaymentMethod(true);

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
                        try {
                          await dispatch(
                            attachPaymentMethod(
                              userInfo.info.stripe_id,
                              paymentMethod.id,
                              userInfo.info.id_platforms_user
                            )
                          );
                          setIsSettingDefaultPaymentMethod(false);
                          // Close modal and trigger refresh
                          onClose();
                        } catch (attachError) {
                          setIsSettingDefaultPaymentMethod(false);
                          console.error(
                            "Error attaching payment method:",
                            attachError
                          );
                          alert(
                            "Error al guardar el método de pago. Por favor, intenta de nuevo."
                          );
                        }
                      }}
                    >
                      <View style={styles.actionButton}>
                        <Ionicons
                          name="lock-closed"
                          size={20}
                          color="#ffffff"
                        />
                        <Text style={styles.actionButtonText}>
                          {cardInfo && cardInfo.default_payment_method
                            ? "Actualizar método de pago"
                            : "Guardar tarjeta"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.loadingContainer}>
                      <LoadingSmall isLoading={true} color="#8c8a1a" />
                      <Text style={styles.loadingText}>Procesando...</Text>
                    </View>
                  )}

                  <Text style={styles.termsText}>
                    Al añadir un método de pago, aceptas nuestros{" "}
                    <Text
                      style={styles.termsLink}
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
            </ScrollView>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  gradientPanel: {
    backgroundColor: "#111827",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: screenHeight * 0.85,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  header: {
    backgroundColor: "#111827",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 30,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  scrollContent: {
    maxHeight: screenHeight * 0.65,
  },
  containerCard: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  cardInfoSection: {
    backgroundColor: "#1f2937",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#111827",
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  currentCardBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  currentCardBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#8c8a1a",
    marginLeft: 6,
  },
  cardDisplay: {
    marginBottom: 16,
  },
  cardGradient: {
    backgroundColor: "#0f172a",
    borderRadius: 16,
    padding: 20,
    height: 180,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardLabel: {
    fontSize: 12,
    color: "#9ca3af",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  cardNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 2,
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardBrand: {
    fontSize: 14,
    fontWeight: "700",
    color: "#e5e7eb",
  },
  secureIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(132, 204, 22, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  updateHint: {
    fontSize: 13,
    color: "#9ca3af",
    textAlign: "center",
    fontStyle: "italic",
  },
  addCardSection: {
    backgroundColor: "#1f2937",
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: "#111827",
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  addCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  addCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
    marginLeft: 10,
    flex: 1,
  },
  cardFieldWrapper: {
    marginBottom: 16,
  },
  cardField: {
    height: 50,
    borderRadius: 12,
  },
  securityFeatures: {
    flexDirection: "row",
    justifyContent: "center",
  },
  securityItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  securityText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8c8a1a",
    marginLeft: 6,
  },
  actionContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 30,
  },
  actionButtonWrapper: {
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: "#8c8a1a",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: "#8c8a1a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
    marginLeft: 8,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9ca3af",
    marginLeft: 12,
  },
  termsText: {
    fontSize: 11,
    color: "#9ca3af",
    textAlign: "center",
    lineHeight: 16,
  },
  termsLink: {
    color: "#8c8a1a",
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});

export default PaymentMethodModal;
