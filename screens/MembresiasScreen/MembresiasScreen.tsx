import React, { useState } from "react";
import PaymentMethodModal from "../ProfileScreen/PaymentMethodModal";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import MembresiasScreenStyles from "./MembresiasScreen.style";
import { selectSubscription } from "../../store/selectors";
import { useSelector } from "react-redux";
import { FontAwesome6 } from "@expo/vector-icons";

const subscriptions = [
  {
    name: "Padel Room plus",
    price: 300,
    benefits: [
      { label: "Descuento renta de cancha (cualquier horario)", value: "15%" },
      { label: "Descuento inscripción torneo", value: "20%" },
      { label: "Descuento Bar/Snacks", value: "10%" },
    ],
    stripeProductId: "prod_Sh38t99JA0NsjW",
    stripePriceId: "price_1Rlf2bFlBExilNDG1qK58Hny",
  },
];

const MembresiasScreen: React.FC = () => {
  const subscription = useSelector(selectSubscription);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const subscriptionInfo = subscriptions[0];

  return (
    <>
      <ScrollView
        style={MembresiasScreenStyles.scroll}
        contentContainerStyle={MembresiasScreenStyles.container}
        showsVerticalScrollIndicator={false}
      >
        {subscription ? (
          <View style={MembresiasScreenStyles.card}>
            <View style={MembresiasScreenStyles.priceRow}>
              <Text style={MembresiasScreenStyles.price}>
                ${subscriptionInfo.price}
              </Text>
              <Text style={MembresiasScreenStyles.period}>por mes</Text>
            </View>
            <Text style={MembresiasScreenStyles.title}>
              {subscriptionInfo.name}
            </Text>
            <View style={MembresiasScreenStyles.benefits}>
              {subscriptionInfo.benefits.map((benefit: any, i: number) => (
                <View key={i} style={MembresiasScreenStyles.benefitRow}>
                  <View style={MembresiasScreenStyles.bullet} />
                  <Text style={MembresiasScreenStyles.benefitLabel}>
                    {benefit.label}
                  </Text>
                  <Text style={MembresiasScreenStyles.benefitValue}>
                    {benefit.value}
                  </Text>
                </View>
              ))}
            </View>
            <Text
              style={{ color: "#e1dd2a", fontWeight: "bold", marginTop: 16 }}
            >
              ¡Ya tienes tu membresía activa!
            </Text>
            {/*<TouchableOpacity
              style={[
                MembresiasScreenStyles.button,
                {
                  marginTop: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
              onPress={() => {
                // TODO: Implement export to wallet logic here
              }}
            >
              <FontAwesome6
                name="wallet"
                size={20}
                color="#232323"
                style={{ marginRight: 8 }}
              />
              <Text style={MembresiasScreenStyles.buttonText}>
                Agregar a Wallet
              </Text>
            </TouchableOpacity>*/}
          </View>
        ) : (
          subscriptions.map((sub) => (
            <View key={sub.stripeProductId} style={MembresiasScreenStyles.card}>
              <View style={MembresiasScreenStyles.priceRow}>
                <Text style={MembresiasScreenStyles.price}>${sub.price}</Text>
                <Text style={MembresiasScreenStyles.period}>por mes</Text>
              </View>
              <Text style={MembresiasScreenStyles.title}>{sub.name}</Text>
              <View style={MembresiasScreenStyles.benefits}>
                {sub.benefits.map((benefit, i) => (
                  <View key={i} style={MembresiasScreenStyles.benefitRow}>
                    <View style={MembresiasScreenStyles.bullet} />
                    <Text style={MembresiasScreenStyles.benefitLabel}>
                      {benefit.label}
                    </Text>
                    <Text style={MembresiasScreenStyles.benefitValue}>
                      {benefit.value}
                    </Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity
                style={MembresiasScreenStyles.button}
                onPress={() => setShowPaymentModal(true)}
              >
                <Text style={MembresiasScreenStyles.buttonText}>
                  Suscribirme
                </Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
      <PaymentMethodModal
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        isSubscription={true}
      />
    </>
  );
};

export default MembresiasScreen;
