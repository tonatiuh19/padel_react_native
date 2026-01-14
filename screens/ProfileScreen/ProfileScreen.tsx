import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  RefreshControl,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { selectCardInfo, selectUserInfo } from "../../store/selectors";
import {
  logout,
  updateUserProfile,
  fetchPaymentMethods,
  setDefaultPaymentMethod,
  getUserInfo,
} from "../../store/effects";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  NavigationProp,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/AppNavigator/AppNavigator";
import PaymentMethodModal from "./PaymentMethodModal";
import ConfirmationModal from "./ConfirmationModal/ConfirmationModal";

export default function ProfileScreen() {
  const dispatch: AppDispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);
  const cardInfo = useSelector(selectCardInfo);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [editedName, setEditedName] = useState(userInfo?.info?.full_name || "");
  const [editedPhone, setEditedPhone] = useState(
    userInfo?.info?.phone_number || ""
  );
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    phone?: string;
  }>({});

  // Fetch payment methods on mount and when modal closes
  const loadPaymentMethods = useCallback(async () => {
    try {
      // Try to get userId from Redux first, then from AsyncStorage
      let userId: number | null = userInfo?.info?.id_platforms_user || null;
      if (!userId) {
        const storedUserId = await AsyncStorage.getItem("id_platforms_user");
        userId = storedUserId ? Number(storedUserId) : null;
      }

      if (userId) {
        console.log("Loading payment methods for user:", userId);
        const methods = await dispatch(fetchPaymentMethods(userId));
        console.log("Payment methods loaded:", methods);
        setPaymentMethods(methods || []);
      }
    } catch (error) {
      console.error("Error loading payment methods:", error);
    }
  }, [dispatch, userInfo?.info?.id_platforms_user]);

  // Refresh user info to prevent data loss
  const loadUserInfo = useCallback(async () => {
    try {
      // Try to get userId from Redux first, then from AsyncStorage
      let userId: number | null = userInfo?.info?.id_platforms_user || null;
      if (!userId) {
        const storedUserId = await AsyncStorage.getItem("id_platforms_user");
        userId = storedUserId ? Number(storedUserId) : null;
      }

      if (userId) {
        console.log("Refreshing user info for user:", userId);
        await dispatch(getUserInfo(userId));
        console.log("User info refreshed");
      }
    } catch (error) {
      console.error("Error refreshing user info:", error);
    }
  }, [dispatch, userInfo?.info?.id_platforms_user]);

  useEffect(() => {
    loadPaymentMethods();
  }, [loadPaymentMethods]);

  // Refresh payment methods and user info when screen gains focus
  useFocusEffect(
    useCallback(() => {
      console.log("ProfileScreen focused, refreshing data");
      loadUserInfo();
      loadPaymentMethods();
    }, [loadUserInfo, loadPaymentMethods])
  );

  // Handle pull-to-refresh
  const handleRefresh = useCallback(async () => {
    console.log("Pull-to-refresh triggered");
    setRefreshing(true);
    try {
      await Promise.all([loadUserInfo(), loadPaymentMethods()]);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  }, [loadUserInfo, loadPaymentMethods]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("id_platforms_user");
    const userId = userInfo?.info?.id_platforms_user;
    if (userId) {
      dispatch(logout(userId));
    }
    navigation.navigate("Main");
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    handleLogout();
    const userId = userInfo?.info?.id_platforms_user;
    if (userId) {
      Linking.openURL(`https://intelipadel.com/desactivarcuenta/${userId}`);
    }
  };

  const validateForm = () => {
    const errors: { name?: string; phone?: string } = {};

    if (!editedName.trim()) {
      errors.name = "El nombre es requerido";
    } else if (editedName.trim().length < 2) {
      errors.name = "El nombre debe tener al menos 2 caracteres";
    }

    if (editedPhone && editedPhone.length > 0) {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(editedPhone.replace(/\s/g, ""))) {
        errors.phone = "El teléfono debe tener 10 dígitos";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (validateForm()) {
      const userId = userInfo?.info?.id_platforms_user;
      if (!userId) {
        Alert.alert("Error", "No se pudo identificar el usuario");
        return;
      }

      try {
        await dispatch(
          updateUserProfile(userId, {
            name: editedName.trim(),
            phone: editedPhone.trim(),
          })
        );
        Alert.alert("Éxito", "Perfil actualizado correctamente");
        setShowEditModal(false);
      } catch (error) {
        console.error("Error updating profile:", error);
        Alert.alert(
          "Error",
          "No se pudo actualizar el perfil. Por favor, intenta de nuevo."
        );
      }
    }
  };

  const openEditModal = () => {
    setEditedName(userInfo?.info?.full_name || "");
    setEditedPhone(userInfo?.info?.phone_number || "");
    setValidationErrors({});
    setShowEditModal(true);
  };

  const handleSetDefaultPayment = async (paymentMethodId: string) => {
    const userId = userInfo?.info?.id_platforms_user;
    if (!userId) return;

    try {
      await dispatch(setDefaultPaymentMethod(userId, paymentMethodId));
      // Refresh payment methods
      const methods = await dispatch(fetchPaymentMethods(userId));
      setPaymentMethods(methods || []);
      Alert.alert("Éxito", "Método de pago predeterminado actualizado");
    } catch (error) {
      console.error("Error setting default payment method:", error);
      Alert.alert(
        "Error",
        "No se pudo actualizar el método de pago. Por favor, intenta de nuevo."
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#8c8a1a"
            colors={["#8c8a1a"]}
          />
        }
      >
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={48} color="#8c8a1a" />
            </View>
            <View style={styles.statusBadge}>
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            </View>
          </View>
          <Text style={styles.name}>
            {userInfo?.info?.full_name || "Usuario"}
          </Text>
          <Text style={styles.email}>{userInfo?.info?.email || ""}</Text>
        </View>

        {/* Info Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>

          <TouchableOpacity style={styles.card} onPress={openEditModal}>
            <View style={styles.cardIconContainer}>
              <Ionicons name="person-outline" size={24} color="#8c8a1a" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>Nombre Completo</Text>
              <Text style={styles.cardValue}>
                {userInfo?.info?.full_name || "No registrado"}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={openEditModal}>
            <View style={styles.cardIconContainer}>
              <Ionicons name="call-outline" size={24} color="#8c8a1a" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>Teléfono</Text>
              <Text style={styles.cardValue}>
                {userInfo?.info?.phone_number || "No registrado"}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <View style={styles.card}>
            <View style={styles.cardIconContainer}>
              <Ionicons name="mail-outline" size={24} color="#8c8a1a" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>Correo Electrónico</Text>
              <Text style={styles.cardValue}>
                {userInfo?.info?.email || ""}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Method Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Métodos de Pago</Text>
            <TouchableOpacity onPress={() => setShowCardModal(true)}>
              <View style={styles.addButtonSmall}>
                <Ionicons name="add" size={20} color="#8c8a1a" />
              </View>
            </TouchableOpacity>
          </View>

          {paymentMethods.length > 0 ? (
            paymentMethods.map((method, index) => (
              <View key={method.id || index} style={styles.paymentCard}>
                <View style={styles.paymentCardLeft}>
                  <View style={styles.cardBrandIcon}>
                    <FontAwesome6
                      name={
                        method.brand === "visa"
                          ? "cc-visa"
                          : method.brand === "mastercard"
                          ? "cc-mastercard"
                          : method.brand === "amex"
                          ? "cc-amex"
                          : method.brand === "discover"
                          ? "cc-discover"
                          : "credit-card"
                      }
                      size={32}
                      color="#1f2937"
                    />
                  </View>
                  <View style={styles.paymentCardContent}>
                    <Text style={styles.paymentCardBrand}>
                      {method.brand?.toUpperCase() || "TARJETA"}
                    </Text>
                    <Text style={styles.paymentCardNumber}>
                      •••• •••• •••• {method.last4 || "****"}
                    </Text>
                    {method.is_default ? (
                      <View style={styles.defaultBadge}>
                        <Ionicons
                          name="shield-checkmark"
                          size={12}
                          color="#10b981"
                        />
                        <Text style={styles.defaultBadgeText}>
                          Predeterminado
                        </Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.setDefaultButton}
                        onPress={() => handleSetDefaultPayment(method.id)}
                      >
                        <Ionicons
                          name="shield-outline"
                          size={12}
                          color="#8c8a1a"
                        />
                        <Text style={styles.setDefaultButtonText}>
                          Establecer como predeterminado
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            ))
          ) : (
            <TouchableOpacity
              style={styles.addPaymentCard}
              onPress={() => setShowCardModal(true)}
            >
              <View style={styles.addPaymentIcon}>
                <Ionicons name="add" size={28} color="#8c8a1a" />
              </View>
              <View style={styles.addPaymentContent}>
                <Text style={styles.addPaymentTitle}>
                  Agregar Método de Pago
                </Text>
                <Text style={styles.addPaymentSubtitle}>
                  Agrega tu tarjeta para reservar más rápido o suscribirte a
                  membresías
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Actions Section */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
            <View style={styles.actionIconContainer}>
              <Ionicons name="log-out-outline" size={24} color="#8c8a1a" />
            </View>
            <Text style={styles.actionButtonText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>

        {/* Delete Account - Hidden/Subtle */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => setShowDeleteModal(true)}
        >
          <Text style={styles.deleteButtonText}>Eliminar mi cuenta</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Perfil</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Ionicons name="close" size={28} color="#1f2937" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nombre Completo *</Text>
                <TextInput
                  style={[
                    styles.input,
                    validationErrors.name && styles.inputError,
                  ]}
                  value={editedName}
                  onChangeText={setEditedName}
                  placeholder="Tu nombre completo"
                  placeholderTextColor="#9ca3af"
                />
                {validationErrors.name && (
                  <Text style={styles.errorText}>{validationErrors.name}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Teléfono</Text>
                <TextInput
                  style={[
                    styles.input,
                    validationErrors.phone && styles.inputError,
                  ]}
                  value={editedPhone}
                  onChangeText={setEditedPhone}
                  placeholder="10 dígitos"
                  placeholderTextColor="#9ca3af"
                  keyboardType="phone-pad"
                  maxLength={10}
                />
                {validationErrors.phone && (
                  <Text style={styles.errorText}>{validationErrors.phone}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Correo Electrónico</Text>
                <View style={styles.inputDisabled}>
                  <Text style={styles.inputDisabledText}>
                    {userInfo?.info?.email || ""}
                  </Text>
                </View>
                <Text style={styles.helperText}>
                  El correo no se puede modificar
                </Text>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handleSaveProfile}
              >
                <Text style={styles.modalSaveButtonText}>Guardar Cambios</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        visible={showDeleteModal}
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteModal(false)}
      />

      {/* Payment Method Modal */}
      <PaymentMethodModal
        visible={showCardModal}
        onClose={() => {
          console.log("Payment modal closed, refreshing data");
          setShowCardModal(false);
          // Refresh both user info and payment methods when modal closes
          loadUserInfo();
          loadPaymentMethods();
        }}
        isSubscription={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#8c8a1a",
  },
  statusBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 2,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#6b7280",
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    paddingBottom: 8,
  },
  addButtonSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#8c8a1a",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#f9fafb",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  paymentCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  paymentCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  cardBrandIcon: {
    width: 56,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#f9fafb",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  paymentCardContent: {
    flex: 1,
  },
  paymentCardBrand: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 2,
  },
  paymentCardNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
    letterSpacing: 1,
    marginBottom: 6,
  },
  defaultBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#d1fae5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  defaultBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#065f46",
    marginLeft: 4,
  },
  setDefaultButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#f0fdf4",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#8c8a1a",
  },
  setDefaultButtonText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#65a30d",
    marginLeft: 4,
  },
  addPaymentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderStyle: "dashed",
  },
  addPaymentIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#f0fdf4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  addPaymentContent: {
    flex: 1,
  },
  addPaymentTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 4,
  },
  addPaymentSubtitle: {
    fontSize: 13,
    color: "#6b7280",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#f0fdf4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  deleteButton: {
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 24,
  },
  deleteButtonText: {
    fontSize: 13,
    color: "#9ca3af",
    textDecorationLine: "underline",
  },
  bottomSpacer: {
    height: 20,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
  },
  modalContent: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#1f2937",
  },
  inputError: {
    borderColor: "#ef4444",
  },
  inputDisabled: {
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 14,
  },
  inputDisabledText: {
    fontSize: 16,
    color: "#9ca3af",
  },
  errorText: {
    fontSize: 12,
    color: "#ef4444",
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  modalActions: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  modalCancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
  },
  modalSaveButton: {
    flex: 1,
    backgroundColor: "#8c8a1a",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  modalSaveButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
});
