import React, { useEffect, useState } from "react";
import { View, Modal, Text, TouchableOpacity, Alert } from "react-native";
import { AddSlotModalStyles } from "./AddSlotModal.style";
import TimeSlotPicker from "./TimeSlotPicker/TimeSlotPicker";
import Countdown from "./Countdown/Countdown";
import {
  StripeProvider,
  CardField,
  useConfirmPayment,
  useStripe,
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
import { formatDate, generateDateTime } from "../../../utils/UtilsFunctions";
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
  const [showTimePicker, setShowTimePicker] = useState(false);
  const { confirmPayment, loading } = useConfirmPayment();
  const [isPaying, setIsPaying] = useState(false);
  const [isCardComplete, setIsCardComplete] = useState(false);
  const [buttonText, setButtonText] = useState("Reservar");

  useEffect(() => {
    setShowTimePicker(false); // Reset showTimePicker to false when the component mounts
  }, []);

  useEffect(() => {
    if (isPaying) {
      let dots = "";
      const interval = setInterval(() => {
        dots = dots.length < 3 ? dots + "." : "";
        setButtonText(`Reservando${dots}`);
      }, 500);
      return () => clearInterval(interval);
    } else {
      setButtonText("Reservar");
    }
  }, [isPaying]);

  const handleCountdownComplete = () => {
    cleaningSlot();
  };

  const handlePayPress = async () => {
    if (!isCardComplete || !startTime) {
      Alert.alert(
        "Algo falta por completar",
        "Por favor, completa los datos de tu tarjeta y selecciona una hora"
      );
      return;
    }

    setIsPaying(true);
    const clientSecret = await fetchPaymentIntentClientSecret(550);
    const billingDetails = {
      email: userInfo.info?.email,
    };
    const { error, paymentIntent } = await confirmPayment(clientSecret, {
      paymentMethodType: "Card",
      paymentMethodData: {
        billingDetails,
      },
    });

    if (error) {
      setIsPaying(false);
      Alert.alert("El pago no se pudo procesar", "Por favor, intenta de nuevo");
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
    console.log("Cleaning slot", payment.id_platforms_date_time_slot);
    dispatch(
      deletePlatformDateTimeSlot(payment.id_platforms_date_time_slot ?? 0)
    );
    setShowCountdown(false);
    setStartTime("");
    setShowTimePicker(false);
    onClose();
  };

  const handleShowTimePicker = () => {
    setShowTimePicker(true);
    dispatch(
      deletePlatformDateTimeSlot(payment.id_platforms_date_time_slot ?? 0)
    );
  };

  const handleConfirmTimePicker = () => {
    setShowTimePicker(false);
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
              <Text style={AddSlotModalStyles.loadingText}>
                Procesando reserva
              </Text>
            </View>
          ) : (
            <>
              <View style={AddSlotModalStyles.titleContainer}>
                <Text style={AddSlotModalStyles.title}>Reservar cancha</Text>
                <Text style={AddSlotModalStyles.titleValue}>
                  {formatDate(new Date(disabledSlots.today))}
                </Text>
              </View>
              <View style={AddSlotModalStyles.centeredContainer}>
                {showCountdown && (
                  <Countdown
                    duration={90}
                    onComplete={handleCountdownComplete}
                    isCheckout={true}
                  />
                )}
                {!showCountdown && (
                  <Text style={AddSlotModalStyles.titleValue}>
                    {startTime ? `Hora seleccionada:` : ""}
                  </Text>
                )}
                <>
                  {!showTimePicker && (
                    <TouchableOpacity
                      style={AddSlotModalStyles.timePickerButton}
                      onPress={handleShowTimePicker}
                    >
                      <Text style={AddSlotModalStyles.timePickerButtonText}>
                        {startTime ? `${startTime}` : "Selecciona la hora"}
                      </Text>
                    </TouchableOpacity>
                  )}
                  {showTimePicker && (
                    <TimeSlotPicker
                      selectedTime={startTime}
                      onTimeChange={handleTimeChange}
                      onConfirm={handleConfirmTimePicker}
                      disabled={isLoading}
                    />
                  )}
                </>
              </View>
              {!showTimePicker && (
                <View style={AddSlotModalStyles.bottomContainer}>
                  <StripeProvider publishableKey="pk_test_51QIiddAC7jSBO0hEcfV17EolUCfKcLJjQZpO1becuuID8oCrI3xT049f4oYvfhynRQpQhGeBiLG34RaAZwA6lxor00S9cwfSny">
                    <View style={AddSlotModalStyles.containerCard}>
                      {showCountdown && (
                        <Text style={AddSlotModalStyles.titleValueCard}>
                          Ingresa los datos de tu tarjeta:
                        </Text>
                      )}
                      <CardField
                        postalCodeEnabled={false}
                        style={[
                          AddSlotModalStyles.cardField,
                          {
                            borderWidth: 1,
                            borderColor: "#000", // Change this to your desired border color
                            borderRadius: 10, // Change this to your desired border radius
                          },
                        ]}
                        cardStyle={{
                          textColor: "#1c1c1c",
                        }}
                        onCardChange={(cardDetails) => {
                          setIsCardComplete(cardDetails.complete);
                        }}
                      />
                      <View style={AddSlotModalStyles.buttonContainer}>
                        {!isPaying ? (
                          <>
                            <TouchableOpacity
                              style={AddSlotModalStyles.buttonPay}
                              onPress={handlePayPress}
                              disabled={isPaying}
                            >
                              <Text style={AddSlotModalStyles.buttonPayText}>
                                {buttonText}
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={AddSlotModalStyles.buttonCancel}
                              onPress={cleaningSlot}
                              disabled={isPaying}
                            >
                              <Text style={AddSlotModalStyles.buttonCancelText}>
                                Cancelar
                              </Text>
                            </TouchableOpacity>
                          </>
                        ) : (
                          <LoadingSmall isLoading={true} color="#000" />
                        )}
                      </View>
                    </View>
                  </StripeProvider>
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default AddSlotModal;
