import React, { useEffect, useState } from "react";
import { View, StyleSheet, Modal, TextInput, Button, Text } from "react-native";
import { AddSlotModalStyles } from "./AddSlotModal.style";
import TimeSlotPicker from "./TimeSlotPicker/TimeSlotPicker";
import Countdown from "./Countdown/Countdown";
import {
  StripeProvider,
  CardField,
  useConfirmPayment,
} from "@stripe/stripe-react-native";
import {
  deletePlatformDateTimeSlot,
  fetchPaymentIntentClientSecret,
  insertPlatformDateTimeSlot,
} from "../../../store/effects";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store";
import { selectPayment, selectPlatformsFields } from "../../../store/selectors";
import { generateDateTime } from "../../../utils/UtilsFunctions";

interface AddSlotModalProps {
  visible: boolean;
  onClose: () => void;
}

const AddSlotModal: React.FC<AddSlotModalProps> = ({ visible, onClose }) => {
  const dispatch: AppDispatch = useDispatch();
  const platformsFields = useSelector(selectPlatformsFields);
  const payment = useSelector(selectPayment);

  const [startTime, setStartTime] = useState("");
  const [showCountdown, setShowCountdown] = useState(false);
  const { confirmPayment, loading } = useConfirmPayment();

  const handleCountdownComplete = () => {
    cleaningSlot();
  };

  const handlePayPress = async () => {
    const clientSecret = await fetchPaymentIntentClientSecret(550);
    const billingDetails = {
      email: "email@stripe.com",
      phone: "+48888000888",
      addressCity: "Houston",
      addressCountry: "US",
      addressLine1: "1459  Circle Drive",
      addressLine2: "Texas",
      addressPostalCode: "77063",
    };
    const { error, paymentIntent } = await confirmPayment(clientSecret, {
      paymentMethodType: "Card",
      paymentMethodData: {
        billingDetails,
      },
    });

    if (error) {
      console.log("Payment confirmation error", error);
    } else if (paymentIntent) {
      console.log("Success", paymentIntent);
    }
  };

  const handleTimeChange = (time: string) => {
    setShowCountdown(true);
    dispatch(
      insertPlatformDateTimeSlot(
        platformsFields.id_platforms_field,
        generateDateTime(platformsFields.today, time),
        2
      )
    );
    setStartTime(time);
  };

  const cleaningSlot = () => {
    dispatch(
      deletePlatformDateTimeSlot(payment.id_platforms_date_time_slot ?? 0)
    );
    setShowCountdown(false);
    setStartTime("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={AddSlotModalStyles.backdrop}>
        <View style={AddSlotModalStyles.modalContainer}>
          <Text style={AddSlotModalStyles.title}>Add New Slottt</Text>
          {showCountdown && (
            <Countdown duration={90} onComplete={handleCountdownComplete} />
          )}
          <TimeSlotPicker
            selectedTime={startTime}
            onTimeChange={handleTimeChange}
          />
          <StripeProvider publishableKey="pk_test_51QIiddAC7jSBO0hEcfV17EolUCfKcLJjQZpO1becuuID8oCrI3xT049f4oYvfhynRQpQhGeBiLG34RaAZwA6lxor00S9cwfSny">
            <View style={AddSlotModalStyles.containerCard}>
              <CardField
                postalCodeEnabled={false}
                style={AddSlotModalStyles.cardField}
                cardStyle={{
                  textColor: "#1c1c1c",
                }}
              />
              {loading ? (
                <Text>Pagando</Text>
              ) : (
                <View style={AddSlotModalStyles.buttonContainer}>
                  <Button
                    title="Cancel"
                    onPress={() => {
                      cleaningSlot();
                    }}
                    color="red"
                  />
                  <Button
                    title="Pay"
                    onPress={() => {
                      handlePayPress();
                    }}
                  />
                </View>
              )}
            </View>
          </StripeProvider>
        </View>
      </View>
    </Modal>
  );
};

export default AddSlotModal;
