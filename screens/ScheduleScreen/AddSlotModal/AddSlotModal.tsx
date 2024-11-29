import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TextInput,
  Button,
  Text,
  TouchableOpacity,
} from "react-native";
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
  updatePlatformDateTimeSlot,
} from "../../../store/effects";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store";
import {
  selectDisabledSlots,
  selectIsLoading,
  selectPayment,
  selectPlatformsFields,
  selectUserInfo,
} from "../../../store/selectors";
import { generateDateTime } from "../../../utils/UtilsFunctions";
import LoadingSmall from "../../HomeScreen/shared/components/LoadingSmall/LoadingSmall";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../navigation/AppNavigator/AppNavigator";

interface AddSlotModalProps {
  visible: boolean;
  onClose: () => void;
}

const AddSlotModal: React.FC<AddSlotModalProps> = ({ visible, onClose }) => {
  const dispatch: AppDispatch = useDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const userInfo = useSelector(selectUserInfo);
  const isLoading = useSelector(selectIsLoading);
  const platformsFields = useSelector(selectPlatformsFields);
  const disabledSlots = useSelector(selectDisabledSlots);
  const payment = useSelector(selectPayment);

  const [startTime, setStartTime] = useState("");
  const [showCountdown, setShowCountdown] = useState(false);
  const { confirmPayment, loading } = useConfirmPayment();
  const [isPaying, setIsPaying] = useState(false);

  const handleCountdownComplete = () => {
    cleaningSlot();
  };

  const handlePayPress = async () => {
    setIsPaying(true);
    const clientSecret = await fetchPaymentIntentClientSecret(550);
    const billingDetails = {
      email: userInfo.info?.email,
      /*phone: "+48888000888",
      addressCity: "Houston",
      addressCountry: "US",
      addressLine1: "1459  Circle Drive",
      addressLine2: "Texas",
      addressPostalCode: "77063",*/
    };
    const { error, paymentIntent } = await confirmPayment(clientSecret, {
      paymentMethodType: "Card",
      paymentMethodData: {
        billingDetails,
      },
    });

    if (error) {
      setIsPaying(false);
      console.log("Payment confirmation error", error);
    } else if (paymentIntent) {
      console.log("Success", paymentIntent);
      dispatch(
        updatePlatformDateTimeSlot(payment.id_platforms_date_time_slot ?? 0, 1)
      );
      setIsPaying(false);
      setShowCountdown(false);
      setStartTime("");
      onClose();
      navigation.navigate("Reservations");
    }
  };

  const handleTimeChange = (time: string) => {
    setShowCountdown(true);
    dispatch(
      insertPlatformDateTimeSlot(
        platformsFields.id_platforms_field,
        generateDateTime(disabledSlots.today, time),
        2,
        userInfo.info?.id_platforms_user
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
          {loading ? (
            <View style={AddSlotModalStyles.loadingContainer}>
              <LoadingSmall isLoading={true} color="#000" />
              <Text style={AddSlotModalStyles.loadingText}>Cargando</Text>
            </View>
          ) : (
            <>
              <Text style={AddSlotModalStyles.title}>Add New Slottt</Text>
              {showCountdown && (
                <Countdown duration={90} onComplete={handleCountdownComplete} />
              )}
              <TimeSlotPicker
                selectedTime={startTime}
                onTimeChange={handleTimeChange}
                disabled={isLoading}
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
                  <View style={AddSlotModalStyles.buttonContainer}>
                    <TouchableOpacity
                      style={AddSlotModalStyles.buttonPay}
                      onPress={() => {
                        handlePayPress();
                      }}
                      disabled={isPaying}
                    >
                      <Text style={AddSlotModalStyles.buttonPayText}>
                        Pagar
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={AddSlotModalStyles.buttonCancel}
                      onPress={() => {
                        cleaningSlot();
                      }}
                      disabled={isPaying}
                    >
                      <Text style={AddSlotModalStyles.buttonCancelText}>
                        Cancelar
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </StripeProvider>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default AddSlotModal;
