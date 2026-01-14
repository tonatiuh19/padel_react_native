import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { selectUserInfo } from "../../store/selectors";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesome6 } from "@expo/vector-icons";
import { AppDispatch } from "../../store";
import {
  getUserSubscription,
  cancelUserSubscription,
  fetchPaymentMethods,
} from "../../store/effects";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import type {
  ClubSubscription,
  UserSubscriptionData,
  PaymentMethod,
} from "../../types/subscription";

const API_BASE_URL = "https://intelipadel.vercel.app/api";

const MembresiasScreen: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigation = useNavigation();
  const userInfo = useSelector(selectUserInfo);

  const [loading, setLoading] = useState(true);
  const [userSubscription, setUserSubscription] =
    useState<UserSubscriptionData | null>(null);
  const [availablePlans, setAvailablePlans] = useState<ClubSubscription[]>([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelConfirmText, setCancelConfirmText] = useState("");
  const [randomCancelText, setRandomCancelText] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [hasDefaultPayment, setHasDefaultPayment] = useState(false);

  const scaleAnim = new Animated.Value(1);

  useEffect(() => {
    fetchData();
  }, []);

  // Refresh data when screen gains focus (e.g., after adding payment method)
  useFocusEffect(
    React.useCallback(() => {
      console.log("MembresiasScreen focused, refreshing data");
      fetchData();
    }, [])
  );

  useEffect(() => {
    // Pulse animation for active subscription badge
    if (userSubscription) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [userSubscription]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const storedUserId = await AsyncStorage.getItem("id_platforms_user");

      console.log("User ID:", storedUserId);
      console.log("UserInfo:", userInfo);
      console.log("Club ID:", userInfo?.info?.id_platforms);

      if (!storedUserId) {
        console.error("No user ID found");
        Alert.alert(
          "Error",
          "Usuario no encontrado. Por favor inicia sesión nuevamente."
        );
        setLoading(false);
        return;
      }

      if (!userInfo?.info?.id_platforms) {
        console.error("No club ID found in userInfo");
        Alert.alert("Error", "No se pudo obtener la información del club.");
        setLoading(false);
        return;
      }

      // Fetch user's current subscription
      console.log("Fetching user subscription...");
      const userSub = await dispatch(getUserSubscription(Number(storedUserId)));
      console.log("User subscription:", userSub);
      setUserSubscription(userSub as any);

      // Fetch available plans for the club
      const clubId = userInfo.info.id_platforms;
      console.log(`Fetching plans for club ${clubId}...`);
      const plansResponse = await axios.get(
        `${API_BASE_URL}/subscriptions/active/${clubId}`
      );
      console.log("Plans response:", plansResponse.data);
      setAvailablePlans(plansResponse.data || []);

      // Check if user has default payment method (non-blocking)
      try {
        console.log("Fetching payment methods...");
        const paymentMethods = await dispatch(
          fetchPaymentMethods(Number(storedUserId))
        );
        console.log("Payment methods:", paymentMethods);
        const defaultMethod = paymentMethods?.find((pm: any) => pm.is_default);
        setHasDefaultPayment(!!defaultMethod);
      } catch (pmError: any) {
        console.warn("Payment methods not available:", pmError.message);
        setHasDefaultPayment(false);
      }
    } catch (error: any) {
      console.error("Failed to fetch data:", error);
      console.error("Error details:", error.response?.data);
      console.error("Error message:", error.message);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "No se pudieron cargar las membresías";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = async (plan: ClubSubscription) => {
    // Check if user has default payment method
    if (!hasDefaultPayment) {
      Alert.alert(
        "Método de Pago Requerido",
        "Necesitas configurar un método de pago predeterminado antes de suscribirte. ¿Deseas ir a tu perfil ahora?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Ir a Perfil",
            onPress: () => navigation.navigate("Profile" as never),
          },
        ]
      );
      return;
    }

    // If user already has subscription, show upgrade/downgrade confirmation
    if (userSubscription) {
      const currentPrice = userSubscription.subscription.price_monthly;
      const newPrice = plan.price_monthly;
      const isUpgrade = newPrice > currentPrice;

      Alert.alert(
        isUpgrade ? "Mejorar Plan" : "Cambiar Plan",
        `¿Deseas ${isUpgrade ? "mejorar" : "cambiar"} tu plan a ${
          plan.name
        }?\n\nPrecio: $${plan.price_monthly} ${plan.currency}/mes`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Confirmar",
            onPress: () => handleSubscribe(plan),
          },
        ]
      );
    } else {
      // New subscription
      Alert.alert(
        "Confirmar Suscripción",
        `¿Deseas suscribirte al plan ${plan.name}?\n\nPrecio: $${plan.price_monthly} ${plan.currency}/mes`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Suscribirse",
            onPress: () => handleSubscribe(plan),
          },
        ]
      );
    }
  };

  const handleSubscribe = async (plan: ClubSubscription) => {
    try {
      setLoading(true);
      const storedUserId = await AsyncStorage.getItem("id_platforms_user");

      if (!storedUserId) {
        Alert.alert("Error", "Usuario no encontrado");
        return;
      }

      // Get default payment method
      const paymentMethods = await dispatch(
        fetchPaymentMethods(Number(storedUserId))
      );
      const defaultMethod = paymentMethods?.find((pm: any) => pm.is_default);

      if (!defaultMethod) {
        Alert.alert("Error", "No se encontró método de pago predeterminado");
        return;
      }

      // Subscribe
      const response = await axios.post(
        `${API_BASE_URL}/subscriptions/subscribe`,
        {
          user_id: Number(storedUserId),
          subscription_id: plan.id,
          payment_method_id: defaultMethod.id,
        }
      );

      if (response.data.success) {
        Alert.alert(
          "¡Suscripción Exitosa!",
          "Tu suscripción ha sido activada exitosamente",
          [{ text: "OK", onPress: fetchData }]
        );
      }
    } catch (error: any) {
      console.error("Subscription error:", error);
      Alert.alert(
        "Error",
        error.response?.data?.error || "No se pudo completar la suscripción"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = () => {
    // Generate complex random text with mixed characters for confirmation
    const chars =
      "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$%&";
    let randomText = "";
    for (let i = 0; i < 8; i++) {
      randomText += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setRandomCancelText(randomText);
    setCancelConfirmText("");
    setShowCancelModal(true);
  };

  const confirmCancellation = async () => {
    if (cancelConfirmText !== randomCancelText) {
      Alert.alert("Error", "El texto ingresado no coincide");
      return;
    }

    try {
      setCancelling(true);
      const storedUserId = await AsyncStorage.getItem("id_platforms_user");

      if (!storedUserId || !userSubscription) {
        Alert.alert("Error", "No se pudo cancelar la suscripción");
        return;
      }

      const response = await dispatch(
        cancelUserSubscription({
          user_id: Number(storedUserId),
          subscription_id: userSubscription.subscription_id,
        })
      );

      if (response) {
        setShowCancelModal(false);
        Alert.alert(
          "Suscripción Cancelada",
          "Tu suscripción ha sido cancelada. Seguirás teniendo acceso hasta el final del período actual.",
          [{ text: "OK", onPress: fetchData }]
        );
      }
    } catch (error: any) {
      console.error("Cancel error:", error);
      Alert.alert("Error", "No se pudo cancelar la suscripción");
    } finally {
      setCancelling(false);
    }
  };

  const renderPlanCard = (
    plan: ClubSubscription,
    isCurrent: boolean = false
  ) => {
    const isUpgrade =
      userSubscription &&
      plan.price_monthly > userSubscription.subscription.price_monthly;
    const isDowngrade =
      userSubscription &&
      plan.price_monthly < userSubscription.subscription.price_monthly;

    return (
      <TouchableOpacity
        key={plan.id}
        onPress={() => !isCurrent && handleSelectPlan(plan)}
        disabled={isCurrent}
        style={{ marginBottom: 16 }}
      >
        <LinearGradient
          colors={
            isCurrent
              ? ["##111827", "#111827"]
              : isUpgrade
              ? ["#111827", "#111827"]
              : ["#1f2937", "#111827"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 16,
            padding: 20,
            borderWidth: isCurrent ? 3 : 0,
            borderColor: "#e1dd2a",
          }}
        >
          {isCurrent && (
            <Animated.View
              style={{
                transform: [{ scale: scaleAnim }],
                alignSelf: "flex-start",
                backgroundColor: "#e1dd2a",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
                marginBottom: 12,
              }}
            >
              <Text style={{ color: "#000", fontWeight: "bold", fontSize: 12 }}>
                ⭐ PLAN ACTUAL
              </Text>
            </Animated.View>
          )}

          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 36, fontWeight: "bold", color: "#fff" }}>
              ${plan.price_monthly}
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#d1d5db",
                marginLeft: 8,
                marginBottom: 8,
              }}
            >
              {plan.currency}/mes
            </Text>
          </View>

          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#fff",
              marginBottom: 8,
            }}
          >
            {plan.name}
          </Text>

          {plan.description && (
            <Text style={{ fontSize: 14, color: "#d1d5db", marginBottom: 16 }}>
              {plan.description}
            </Text>
          )}

          {/* Benefits */}
          <View style={{ marginBottom: 16 }}>
            {(plan.booking_discount_percent ?? 0) > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <FontAwesome6
                  name="circle-check"
                  size={16}
                  color="#84cc16"
                  solid
                />
                <Text style={{ color: "#fff", marginLeft: 10, fontSize: 14 }}>
                  {plan.booking_discount_percent}% descuento en reservas
                </Text>
              </View>
            )}
            {(plan.booking_credits_monthly ?? 0) > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <FontAwesome6
                  name="circle-check"
                  size={16}
                  color="#84cc16"
                  solid
                />
                <Text style={{ color: "#fff", marginLeft: 10, fontSize: 14 }}>
                  {plan.booking_credits_monthly} créditos mensuales
                </Text>
              </View>
            )}
            {(plan.bar_discount_percent ?? 0) > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <FontAwesome6
                  name="circle-check"
                  size={16}
                  color="#84cc16"
                  solid
                />
                <Text style={{ color: "#fff", marginLeft: 10, fontSize: 14 }}>
                  {plan.bar_discount_percent}% descuento en bar
                </Text>
              </View>
            )}
            {(plan.event_discount_percent ?? 0) > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <FontAwesome6
                  name="circle-check"
                  size={16}
                  color="#84cc16"
                  solid
                />
                <Text style={{ color: "#fff", marginLeft: 10, fontSize: 14 }}>
                  {plan.event_discount_percent}% descuento en eventos
                </Text>
              </View>
            )}
            {(plan.class_discount_percent ?? 0) > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <FontAwesome6
                  name="circle-check"
                  size={16}
                  color="#84cc16"
                  solid
                />
                <Text style={{ color: "#fff", marginLeft: 10, fontSize: 14 }}>
                  {plan.class_discount_percent}% descuento en clases
                </Text>
              </View>
            )}
            {plan.extras &&
              plan.extras.length > 0 &&
              plan.extras.map((extra: any, idx: number) => (
                <View
                  key={idx}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <FontAwesome6
                    name="circle-check"
                    size={16}
                    color="#84cc16"
                    solid
                  />
                  <Text style={{ color: "#fff", marginLeft: 10, fontSize: 14 }}>
                    {extra.description || extra}
                  </Text>
                </View>
              ))}
          </View>

          {!isCurrent && (
            <View
              style={{
                backgroundColor: isUpgrade ? "#8c8a1a" : "#374151",
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: isUpgrade ? "#ffffff" : "#8c8a1a",
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                {isUpgrade
                  ? "Mejorar Plan"
                  : isDowngrade
                  ? "Cambiar Plan"
                  : "Suscribirse"}
              </Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#000",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#e1dd2a" />
        <Text style={{ color: "#fff", marginTop: 16, fontSize: 16 }}>
          Cargando membresías...
        </Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        style={{ flex: 1, backgroundColor: "#000" }}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Subscription Section */}
        {userSubscription && (
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#fff",
                marginBottom: 16,
              }}
              å
            >
              Tu Plan Actual
            </Text>
            {renderPlanCard(userSubscription.subscription, true)}

            {userSubscription.status === "cancelled" && (
              <View
                style={{
                  backgroundColor: "#fef3c7",
                  padding: 12,
                  borderRadius: 8,
                  marginTop: 12,
                  borderLeftWidth: 4,
                  borderLeftColor: "#f59e0b",
                }}
              >
                <Text style={{ color: "#92400e", fontSize: 14 }}>
                  ⚠️ Tu suscripción está cancelada. Tendrás acceso hasta el{" "}
                  {new Date(
                    userSubscription.current_period_end
                  ).toLocaleDateString("es-ES")}
                </Text>
              </View>
            )}

            {/* Cancel Button - Subtle */}
            {userSubscription.status !== "cancelled" && (
              <TouchableOpacity
                onPress={handleCancelSubscription}
                style={{
                  alignSelf: "center",
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  marginTop: 24,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: "#6b7280",
                    textDecorationLine: "underline",
                  }}
                >
                  Cancelar mi suscripción
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Available Plans Section */}
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#fff",
              marginBottom: 16,
            }}
          >
            {userSubscription
              ? "Otros Planes Disponibles"
              : "Planes Disponibles"}
          </Text>

          {availablePlans.length === 0 ? (
            <View
              style={{
                backgroundColor: "#1f2937",
                padding: 20,
                borderRadius: 12,
                alignItems: "center",
              }}
            >
              <FontAwesome6 name="circle-info" size={32} color="#6b7280" />
              <Text
                style={{ color: "#9ca3af", marginTop: 12, textAlign: "center" }}
              >
                No hay planes disponibles en este momento
              </Text>
            </View>
          ) : (
            availablePlans
              .filter(
                (plan) =>
                  !userSubscription ||
                  plan.id !== userSubscription.subscription.id
              )
              .map((plan) => renderPlanCard(plan))
          )}
        </View>
      </ScrollView>

      {/* Cancel Confirmation Modal */}
      <Modal
        visible={showCancelModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.8)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "#1f2937",
              borderRadius: 16,
              padding: 24,
              width: "100%",
              maxWidth: 400,
            }}
          >
            <View style={{ alignItems: "center", marginBottom: 20 }}>
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: "#991b1b",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <FontAwesome6
                  name="triangle-exclamation"
                  size={28}
                  color="#fff"
                />
              </View>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  color: "#fff",
                  marginBottom: 8,
                }}
              >
                Confirmar Cancelación
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#9ca3af",
                  textAlign: "center",
                  marginBottom: 8,
                }}
              >
                Esta acción cancelará tu suscripción al final del período actual
              </Text>
              <View
                style={{
                  backgroundColor: "#374151",
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                  marginTop: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    color: "#d1d5db",
                    textAlign: "center",
                    fontStyle: "italic",
                  }}
                >
                  🔒 Por seguridad, debes confirmar esta acción
                </Text>
              </View>
            </View>

            <View
              style={{
                backgroundColor: "#374151",
                padding: 16,
                borderRadius: 12,
                marginBottom: 20,
              }}
            >
              <Text
                style={{ color: "#d1d5db", fontSize: 14, marginBottom: 12 }}
              >
                Para confirmar, escribe el siguiente texto:
              </Text>
              <View
                style={{
                  backgroundColor: "#1f2937",
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "#e1dd2a",
                    textAlign: "center",
                    letterSpacing: 2,
                  }}
                >
                  {randomCancelText}
                </Text>
              </View>
              <TextInput
                value={cancelConfirmText}
                onChangeText={setCancelConfirmText}
                placeholder="Escribe el texto aquí"
                placeholderTextColor="#6b7280"
                style={{
                  backgroundColor: "#1f2937",
                  color: "#fff",
                  padding: 14,
                  borderRadius: 8,
                  fontSize: 16,
                  borderWidth: 1,
                  borderColor:
                    cancelConfirmText === randomCancelText
                      ? "#84cc16"
                      : "#374151",
                }}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                onPress={() => setShowCancelModal(false)}
                style={{
                  flex: 1,
                  backgroundColor: "#374151",
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: "center",
                }}
                disabled={cancelling}
              >
                <Text
                  style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}
                >
                  Volver
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={confirmCancellation}
                disabled={cancelConfirmText !== randomCancelText || cancelling}
                style={{
                  flex: 1,
                  backgroundColor:
                    cancelConfirmText === randomCancelText && !cancelling
                      ? "#991b1b"
                      : "#4b5563",
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: "center",
                }}
              >
                {cancelling ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text
                    style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}
                  >
                    Cancelar Plan
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default MembresiasScreen;
