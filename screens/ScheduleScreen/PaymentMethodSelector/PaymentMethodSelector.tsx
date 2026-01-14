import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

interface PaymentMethod {
  id: string;
  brand?: string;
  last4?: string;
  exp_month?: number;
  exp_year?: number;
  is_default: boolean;
}

interface PaymentMethodSelectorProps {
  paymentMethods: PaymentMethod[];
  loading: boolean;
  error: string | null;
  onSelectPaymentMethod: (paymentMethodId: string | null) => void;
  onAddNewCard: () => void;
  onRetry: () => void;
  selectedPaymentMethodId?: string | null;
  context?: "checkout" | "profile"; // checkout = one-time payment, profile = save card
}

export default function PaymentMethodSelector({
  paymentMethods,
  loading,
  error,
  onSelectPaymentMethod,
  onAddNewCard,
  onRetry,
  selectedPaymentMethodId,
  context = "checkout", // Default to checkout context
}: PaymentMethodSelectorProps) {
  console.log("🎬 PaymentMethodSelector - Component rendered");
  console.log("   Props:");
  console.log("   - paymentMethods:", paymentMethods?.length || 0, "methods");
  console.log("   - loading:", loading);
  console.log("   - error:", error);
  console.log("   - selectedPaymentMethodId:", selectedPaymentMethodId);

  // Auto-select default payment method when data loads
  useEffect(() => {
    if (
      !loading &&
      !error &&
      paymentMethods.length > 0 &&
      !selectedPaymentMethodId
    ) {
      const defaultMethod = paymentMethods.find((pm) => pm.is_default);
      if (defaultMethod) {
        console.log(
          "🎯 Auto-selecting default payment method:",
          defaultMethod.id
        );
        onSelectPaymentMethod(defaultMethod.id);
      }
    }
  }, [paymentMethods, loading, error, selectedPaymentMethodId]);

  const getCardBrandIcon = (brand?: string): string => {
    if (!brand) return "card";
    const brandMap: Record<string, string> = {
      visa: "card",
      mastercard: "card",
      amex: "card",
      discover: "card",
      diners: "card",
      jcb: "card",
      unionpay: "card",
    };
    return brandMap[brand.toLowerCase()] || "card";
  };

  const getCardBrandColor = (brand?: string): string => {
    if (!brand) return "#6b7280";
    const colorMap: Record<string, string> = {
      visa: "#8c8a1a",
      mastercard: "#EB001B",
      amex: "#006FCF",
      discover: "#FF6000",
    };
    return colorMap[brand.toLowerCase()] || "#6b7280";
  };

  if (loading) {
    return (
      <View style={styles.card}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e1dd2a" />
          <Text style={styles.loadingText}>Cargando métodos de pago...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.card}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#ef4444" />
          <Text style={styles.errorTitle}>Error al cargar métodos de pago</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="card-outline" size={20} color="#e1dd2a" />
        <Text style={styles.title}>Método de Pago</Text>
      </View>

      <ScrollView style={styles.methodsScroll} nestedScrollEnabled>
        {paymentMethods.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="card-outline" size={48} color="#6b7280" />
            <Text style={styles.emptyText}>
              No tienes métodos de pago guardados
            </Text>
            <Text style={styles.emptySubtext}>
              Agrega una tarjeta para continuar
            </Text>
          </View>
        ) : (
          paymentMethods.map((method) => {
            const isSelected = selectedPaymentMethodId === method.id;
            const brandColor = getCardBrandColor(method.brand);

            return (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.methodItem,
                  isSelected && styles.methodItemSelected,
                ]}
                onPress={() => onSelectPaymentMethod(method.id)}
              >
                <View style={styles.methodContent}>
                  <View
                    style={[
                      styles.cardIconContainer,
                      { backgroundColor: `${brandColor}20` },
                    ]}
                  >
                    <Ionicons
                      name={getCardBrandIcon(method.brand) as any}
                      size={24}
                      color={brandColor}
                    />
                  </View>

                  <View style={styles.methodDetails}>
                    <View style={styles.methodHeader}>
                      <Text style={styles.cardBrand}>
                        {method.brand?.toUpperCase() || "CARD"}
                      </Text>
                      {method.is_default ? (
                        <View style={styles.defaultBadge}>
                          <Text style={styles.defaultBadgeText}>
                            Predeterminada
                          </Text>
                        </View>
                      ) : null}
                    </View>
                    <Text style={styles.cardNumber}>
                      •••• •••• •••• {method.last4 || "****"}
                    </Text>
                    <Text style={styles.cardExpiry}>
                      {method.exp_month && method.exp_year
                        ? `Vence ${method.exp_month
                            .toString()
                            .padStart(2, "0")}/${method.exp_year
                            .toString()
                            .slice(-2)}`
                        : " "}
                    </Text>
                  </View>

                  {isSelected && (
                    <View style={styles.selectedIcon}>
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color="#10b981"
                      />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        )}

        <TouchableOpacity style={styles.addNewButton} onPress={onAddNewCard}>
          <Ionicons
            name={context === "profile" ? "add-circle-outline" : "card-outline"}
            size={24}
            color="#e1dd2a"
          />
          <Text style={styles.addNewButtonText}>
            {context === "profile"
              ? "Agregar Nueva Tarjeta"
              : "Pagar con Otra Tarjeta"}
          </Text>
        </TouchableOpacity>

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <Ionicons name="shield-checkmark" size={16} color="#10b981" />
          <Text style={styles.securityNoticeText}>
            Tus datos están protegidos con la más alta seguridad
          </Text>
        </View>

        {/* Accepted Cards */}
        <View style={styles.acceptedCardsContainer}>
          <Text style={styles.acceptedCardsLabel}>Aceptamos</Text>
          <View style={styles.cardBrands}>
            <View
              style={[styles.cardBrandBadge, { backgroundColor: "#8c8a1a" }]}
            >
              <FontAwesome name="cc-visa" size={32} color="#ffffff" />
            </View>
            <View
              style={[styles.cardBrandBadge, { backgroundColor: "#EB001B" }]}
            >
              <FontAwesome name="cc-mastercard" size={32} color="#ffffff" />
            </View>
            <View
              style={[styles.cardBrandBadge, { backgroundColor: "#006FCF" }]}
            >
              <FontAwesome name="cc-amex" size={32} color="#ffffff" />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#374151",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  loadingText: {
    color: "#d1d5db",
    marginTop: 16,
    fontSize: 14,
  },
  errorContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  errorTitle: {
    color: "#ef4444",
    marginTop: 16,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  errorText: {
    color: "#ef4444",
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#e1dd2a",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
  methodsScroll: {
    maxHeight: 400,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyText: {
    color: "#9ca3af",
    marginTop: 16,
    fontSize: 16,
    fontWeight: "600",
  },
  emptySubtext: {
    color: "#6b7280",
    marginTop: 8,
    fontSize: 14,
  },
  methodItem: {
    backgroundColor: "#374151",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  methodItemSelected: {
    borderColor: "#10b981",
    backgroundColor: "#064e3b",
  },
  methodContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  methodDetails: {
    flex: 1,
    gap: 4,
  },
  methodHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardBrand: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffffff",
  },
  defaultBadge: {
    backgroundColor: "rgba(234, 88, 12, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  defaultBadgeText: {
    fontSize: 10,
    color: "#e1dd2a",
    fontWeight: "600",
  },
  cardNumber: {
    fontSize: 14,
    color: "#d1d5db",
    fontFamily: "monospace",
  },
  cardExpiry: {
    fontSize: 12,
    color: "#9ca3af",
  },
  selectedIcon: {
    marginLeft: 8,
  },
  addNewButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(234, 88, 12, 0.1)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "#e1dd2a",
    borderStyle: "dashed",
    marginTop: 8,
  },
  addNewButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e1dd2a",
  },
  securityNotice: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "rgba(16, 185, 129, 0.05)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.2)",
  },
  securityNoticeText: {
    fontSize: 12,
    color: "#6ee7b7",
    fontWeight: "500",
  },
  acceptedCardsContainer: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  acceptedCardsLabel: {
    fontSize: 11,
    color: "#9ca3af",
    marginBottom: 8,
    fontWeight: "500",
  },
  cardBrands: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  cardBrandBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});
