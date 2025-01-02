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
  getPriceByIdAndTime,
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
  selectPrice,
  selectUserInfo,
} from "../../../store/selectors";
import {
  formatDate,
  generateDateTime,
  formatCurrency,
} from "../../../utils/UtilsFunctions";
import LoadingSmall from "../../HomeScreen/shared/components/LoadingSmall/LoadingSmall";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../navigation/AppNavigator/AppNavigator";
import { resetPrice } from "../../../store/appSlice";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

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
  const price = useSelector(selectPrice);

  const [startTime, setStartTime] = useState("");
  const [showCountdown, setShowCountdown] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const { confirmPayment, loading } = useConfirmPayment();
  const [isPaying, setIsPaying] = useState(false);
  const [isCardComplete, setIsCardComplete] = useState(false);
  const [buttonText, setButtonText] = useState("Reservar");

  useEffect(() => {
    console.log("PRICE", userInfo);
  }, [userInfo]);

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
    if (!price?.price) {
      Alert.alert("Error", "El precio no está disponible");
      setIsPaying(false);
      return;
    }
    const clientSecret = await fetchPaymentIntentClientSecret(
      price.price,
      userInfo.info.stripe_id,
      payment.id_platforms_date_time_slot ?? 0
    );
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
        updatePlatformDateTimeSlot(
          payment.id_platforms_date_time_slot ?? 0,
          1,
          paymentIntent.id
        )
      );
      dispatch(resetPrice());
      setIsPaying(false);
      setShowCountdown(false);
      setStartTime("");
      onClose();
      navigation.navigate("Reservations");
    }
  };

  const handleTimeChange = (time: string) => {
    console.log(
      "Time selected",
      userInfo.info?.id_platforms,
      generateDateTime(disabledSlots.today, time)
    );
    dispatch(
      getPriceByIdAndTime(
        userInfo.info?.id_platforms,
        generateDateTime(disabledSlots.today, time)
      )
    );
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
    dispatch(resetPrice());
    setShowCountdown(false);
    setStartTime("");
    setShowTimePicker(false);
    onClose();
  };

  const handleShowTimePicker = () => {
    setShowCountdown(false);
    setStartTime("");
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
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true}
        extraHeight={65}
        extraScrollHeight={65}
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
                  {!showTimePicker && (
                    <>
                      {price && (
                        <View style={AddSlotModalStyles.priceContainer}>
                          <Text style={AddSlotModalStyles.priceText}>
                            {formatCurrency(price.price)}
                          </Text>
                        </View>
                      )}
                    </>
                  )}
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
                    <StripeProvider
                      publishableKey={userInfo.info?.publishable_key}
                    >
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
                              borderColor: "#fff", // Change this to your desired border color
                              borderRadius: 22, // Change this to your desired border radius
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
                                <Text
                                  style={AddSlotModalStyles.buttonCancelText}
                                >
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
      </KeyboardAwareScrollView>
    </Modal>
  );
};

export default AddSlotModal;
