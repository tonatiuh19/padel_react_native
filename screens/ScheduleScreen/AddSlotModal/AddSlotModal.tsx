import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import { AddSlotModalStyles } from "./AddSlotModal.style";
import TimeSlotPicker from "./TimeSlotPicker/TimeSlotPicker";
import Countdown from "./Countdown/Countdown";
import { FontAwesome6 } from "@expo/vector-icons";
import {
  StripeProvider,
  CardField,
  useConfirmPayment,
  useStripe,
} from "@stripe/stripe-react-native";
import {
  deleteEventUserById,
  deletePlatformDateTimeSlot,
  deletePlatformFieldClassUser,
  fetchPaymentIntentClientSecret,
  getEventPricebyDateAndIdPlatform,
  getPriceByIdAndTime,
  insertEventUser,
  insertPlatformDateTimeSlot,
  insertPlatformFieldClassUser,
  updateEventUserById,
  updatePlatformDateTimeSlot,
  updatePlatformFieldClassUserById,
} from "../../../store/effects";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store";
import {
  selectCardInfo,
  selectDisabledSlots,
  selectEventPrice,
  selectIsLoading,
  selectIsScheduleClass,
  selectPayment,
  selectPaymentClass,
  selectPaymentEvent,
  selectPlatformsFields,
  selectPrice,
  selectSelectedClass,
  selectUserInfo,
} from "../../../store/selectors";
import {
  formatDate,
  generateDateTime,
  formatCurrency,
  formatDateTime,
  formatFullDate,
  formatTime,
  formatTimeFrom24Hour,
} from "../../../utils/UtilsFunctions";
import LoadingSmall from "../../HomeScreen/shared/components/LoadingSmall/LoadingSmall";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../navigation/AppNavigator/AppNavigator";
import { resetPrice } from "../../../store/appSlice";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

interface AddSlotModalProps {
  visible: boolean;
  isEvent: boolean;
  id_platforms_disabled_date?: number;
  onClose: () => void;
}

const AddSlotModal: React.FC<AddSlotModalProps> = ({
  visible,
  onClose,
  isEvent,
  id_platforms_disabled_date,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const userInfo = useSelector(selectUserInfo);
  const isLoading = useSelector(selectIsLoading);
  const platformsFields = useSelector(selectPlatformsFields);
  const disabledSlots = useSelector(selectDisabledSlots);
  const payment = useSelector(selectPayment);
  const price = useSelector(selectPrice);
  const eventPrice = useSelector(selectEventPrice);
  const paymentEvent = useSelector(selectPaymentEvent);
  const isScheduleClass = useSelector(selectIsScheduleClass);
  const selectedClass = useSelector(selectSelectedClass);
  const paymentClass = useSelector(selectPaymentClass);

  const [startTime, setStartTime] = useState("");
  const [showCountdown, setShowCountdown] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const { confirmPayment, loading } = useConfirmPayment();
  const [isPaying, setIsPaying] = useState(false);
  const [isCardComplete, setIsCardComplete] = useState(false);
  const [buttonText, setButtonText] = useState("Reservar");
  const cardInfo = useSelector(selectCardInfo);

  const hasDispatchedInsertEventUser = useRef(false);

  useEffect(() => {
    if (
      eventPrice?.price &&
      !isScheduleClass &&
      !hasDispatchedInsertEventUser.current
    ) {
      dispatch(
        insertEventUser(
          userInfo.info?.id_platforms_user,
          eventPrice.id_platforms_disabled_date,
          2,
          eventPrice.price
        )
      );
      hasDispatchedInsertEventUser.current = true;
    }
  }, [eventPrice, dispatch, userInfo.info?.id_platforms_user]);

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

  const handleEventCountdownComplete = () => {
    cleaningSlotEvent();
  };

  const handlePayPress = async () => {
    if (!startTime) {
      Alert.alert("Algo falta por completar", "Por favor, selecciona una hora");
      return;
    }
    // If user does not have a default payment method, validate card completion
    if (!(cardInfo && cardInfo.default_payment_method) && !isCardComplete) {
      Alert.alert(
        "Algo falta por completar",
        "Por favor, completa los datos de tu tarjeta"
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
      isScheduleClass ? Number(selectedClass?.price ?? 0) : price.price,
      userInfo.info.stripe_id,
      isScheduleClass
        ? paymentClass?.id_platforms_fields_classes_users ?? 0
        : payment.id_platforms_date_time_slot ?? 0
    );
    const billingDetails = {
      email: userInfo.info?.email,
    };
    const { error, paymentIntent } = await confirmPayment(clientSecret, {
      paymentMethodType: "Card",
      paymentMethodData: {
        ...(cardInfo && cardInfo.default_payment_method
          ? {
              paymentMethodId: cardInfo.default_payment_method,
              billingDetails,
            }
          : {
              billingDetails,
            }),
      },
    });

    if (error) {
      setIsPaying(false);
      Alert.alert("El pago no se pudo procesar", "Por favor, intenta de nuevo");
    } else if (paymentIntent) {
      console.log("Success", paymentIntent);
      if (isScheduleClass) {
        dispatch(
          updatePlatformFieldClassUserById(
            paymentClass?.id_platforms_fields_classes_users ?? 0,
            1,
            paymentIntent.id
          )
        );
      } else {
        dispatch(
          updatePlatformDateTimeSlot(
            payment.id_platforms_date_time_slot ?? 0,
            1,
            paymentIntent.id,
            price.price
          )
        );
      }
      dispatch(resetPrice());
      setIsPaying(false);
      setShowCountdown(false);
      setStartTime("");
      onClose();
      if (isScheduleClass) {
        navigation.navigate("Clases");
      } else {
        navigation.navigate("Reservations");
      }
    }
  };

  const handleEventPayPress = async () => {
    if (!isCardComplete) {
      Alert.alert(
        "Algo falta por completar",
        "Por favor, completa los datos de tu tarjeta y selecciona una hora"
      );
      return;
    }

    setIsPaying(true);
    if (!eventPrice?.price) {
      Alert.alert("Error", "El precio no está disponible");
      setIsPaying(false);
      return;
    }
    const clientSecret = await fetchPaymentIntentClientSecret(
      Number(eventPrice?.price),
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
        updateEventUserById(
          paymentEvent.id_platforms_fields_events_users ?? 0,
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
    console.log("Time selected", generateDateTime(disabledSlots.today, time));
    if (isScheduleClass) {
      dispatch(
        insertPlatformFieldClassUser(
          userInfo.info?.id_platforms_user,
          selectedClass?.id_platforms_disabled_date ?? 0,
          generateDateTime(disabledSlots.today, time),
          Number(selectedClass?.price ?? 0),
          2,
          0
        )
      );
    } else {
      dispatch(
        insertPlatformDateTimeSlot(
          platformsFields.id_platforms_field,
          generateDateTime(disabledSlots.today, time),
          2,
          userInfo.info?.id_platforms_user
        )
      );
    }

    setStartTime(time);
  };

  const cleaningSlot = () => {
    console.log("Cleaning slot", paymentClass);
    if (isScheduleClass) {
      dispatch(
        deletePlatformFieldClassUser(
          paymentClass?.id_platforms_fields_classes_users ?? 0
        )
      );
    } else {
      dispatch(
        deletePlatformDateTimeSlot(payment.id_platforms_date_time_slot ?? 0)
      );
    }

    dispatch(resetPrice());
    setShowCountdown(false);
    setStartTime("");
    setShowTimePicker(false);
    onClose();
  };

  const cleaningSlotEvent = () => {
    console.log("Cleaning slot", payment.id_platforms_date_time_slot);
    dispatch(
      deleteEventUserById(paymentEvent.id_platforms_fields_events_users ?? 0)
    );
    dispatch(resetPrice());
    setShowCountdown(false);
    setStartTime("");
    setShowTimePicker(false);
    hasDispatchedInsertEventUser.current = false;
    onClose();
  };

  const closeModal = () => {
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
      animationType="none"
      onRequestClose={() => {}} // Disable hardware back button on Android
    >
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true}
        extraHeight={65}
        extraScrollHeight={65}
      >
        <View style={AddSlotModalStyles.backdrop}>
          <View style={AddSlotModalStyles.modalContainer}>
            {eventPrice && eventPrice.available_slots === 0 ? (
              <View style={AddSlotModalStyles.centeredContainer}>
                <View style={AddSlotModalStyles.priceContainer}>
                  <Text style={AddSlotModalStyles.titleValue}>
                    Este evento ya no tiene lugares disponibles
                  </Text>
                  <TouchableOpacity
                    style={AddSlotModalStyles.buttonCancel}
                    onPress={closeModal}
                  >
                    <Text style={AddSlotModalStyles.buttonCancelText}>
                      Regresar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <>
                {loading ? (
                  <View style={AddSlotModalStyles.centeredContainer}>
                    <LoadingSmall isLoading={true} color="#e1dd2a" />
                    {isScheduleClass ? (
                      <Text style={AddSlotModalStyles.loadingText}>
                        Procesando clase
                      </Text>
                    ) : (
                      <Text style={AddSlotModalStyles.loadingText}>
                        Procesando reserva
                      </Text>
                    )}
                  </View>
                ) : (
                  <>
                    {isEvent ? (
                      <>
                        <View style={AddSlotModalStyles.titleContainer}>
                          <Text style={AddSlotModalStyles.title}>
                            Registro a evento
                          </Text>
                          <Text style={AddSlotModalStyles.titleValue}>
                            {formatFullDate(
                              eventPrice?.platforms_fields_price_start_time ??
                                ""
                            )}
                          </Text>
                          <Text style={AddSlotModalStyles.titleValue}>
                            {formatTime(
                              eventPrice?.platforms_fields_price_start_time ??
                                ""
                            )}{" "}
                            -{" "}
                            {formatTime(
                              eventPrice?.platforms_fields_price_end_time ?? ""
                            )}
                          </Text>
                        </View>

                        <View style={AddSlotModalStyles.separator} />
                        <View style={AddSlotModalStyles.centeredContainer}>
                          <View style={AddSlotModalStyles.priceContainer}>
                            <Text style={AddSlotModalStyles.titleValue}>
                              Quedan {eventPrice?.available_slots} lugares
                            </Text>
                          </View>
                          <View style={AddSlotModalStyles.priceContainer}>
                            <Text style={AddSlotModalStyles.priceText}>
                              {formatCurrency(eventPrice?.price ?? 0)}
                            </Text>
                          </View>
                          <Countdown
                            duration={90}
                            onComplete={handleEventCountdownComplete}
                            isCheckout={true}
                            isEvent={true}
                          />
                        </View>
                        <View style={AddSlotModalStyles.bottomContainer}>
                          <StripeProvider
                            publishableKey={userInfo.info?.publishable_key}
                          >
                            <View style={AddSlotModalStyles.containerCard}>
                              <Text style={AddSlotModalStyles.titleValueCard}>
                                Ingresa los datos de tu tarjeta:
                              </Text>
                              <CardField
                                postalCodeEnabled={false}
                                style={[
                                  AddSlotModalStyles.cardField,
                                  {
                                    borderWidth: 1,
                                    borderColor: "#cccccc",
                                    borderRadius: 22,
                                  },
                                ]}
                                cardStyle={{
                                  textColor: "#000000",
                                  backgroundColor: "#ffffff",
                                }}
                                onCardChange={(cardDetails) => {
                                  setIsCardComplete(cardDetails.complete);
                                }}
                              />
                              <Text style={AddSlotModalStyles.termsText}>
                                Al pagar acepto los{" "}
                                <Text
                                  style={AddSlotModalStyles.termsLink}
                                  onPress={() =>
                                    Linking.openURL(
                                      "https://intelipadel.com/terminosycondiciones/padelroom"
                                    )
                                  }
                                >
                                  términos y condiciones
                                </Text>
                              </Text>
                              <View style={AddSlotModalStyles.buttonContainer}>
                                {!isPaying ? (
                                  <>
                                    <TouchableOpacity
                                      style={AddSlotModalStyles.buttonPay}
                                      onPress={handleEventPayPress}
                                      disabled={isPaying}
                                    >
                                      <FontAwesome6
                                        name="lock"
                                        size={16}
                                        color="#fff"
                                      />
                                      <Text
                                        style={AddSlotModalStyles.buttonPayText}
                                      >
                                        {buttonText}
                                      </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={AddSlotModalStyles.buttonCancel}
                                      onPress={cleaningSlotEvent}
                                      disabled={isPaying}
                                    >
                                      <Text
                                        style={
                                          AddSlotModalStyles.buttonCancelText
                                        }
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
                      </>
                    ) : (
                      <>
                        <View style={AddSlotModalStyles.titleContainer}>
                          <TouchableOpacity
                            style={AddSlotModalStyles.closeButton}
                            onPress={cleaningSlot}
                          >
                            <FontAwesome6
                              name="xmark"
                              size={20}
                              color="#000000"
                            />
                          </TouchableOpacity>
                          {isScheduleClass && (
                            <>
                              <Text style={AddSlotModalStyles.title}>
                                Inscripción a
                              </Text>
                              <Text style={AddSlotModalStyles.title}>
                                {selectedClass?.event_title}
                              </Text>
                            </>
                          )}
                          {!isScheduleClass && (
                            <Text style={AddSlotModalStyles.title}>
                              Reservar cancha
                            </Text>
                          )}
                        </View>

                        <View
                          style={[
                            AddSlotModalStyles.separator,
                            { marginBottom: 20 },
                          ]}
                        />

                        {!showTimePicker && (
                          <View style={AddSlotModalStyles.summaryCard}>
                            <View style={AddSlotModalStyles.summaryHeader}>
                              <Text style={AddSlotModalStyles.summaryTitle}>
                                {isScheduleClass ? "Clase" : "Reserva"}:{" "}
                                {platformsFields.title}
                              </Text>
                              <TouchableOpacity
                                style={AddSlotModalStyles.changeButton}
                                onPress={handleShowTimePicker}
                              >
                                {startTime && (
                                  <FontAwesome6
                                    name="pencil"
                                    size={12}
                                    color="#121212"
                                    style={{ marginRight: 6 }}
                                  />
                                )}
                                <Text
                                  style={AddSlotModalStyles.changeButtonText}
                                >
                                  {startTime
                                    ? `${startTime}`
                                    : "Selecciona la hora"}
                                </Text>
                              </TouchableOpacity>
                            </View>
                            <View style={AddSlotModalStyles.summaryDetails}>
                              <Text style={AddSlotModalStyles.summaryLabel}>
                                {isScheduleClass
                                  ? "Detalles de la Clase"
                                  : "Detalles de la Reserva"}
                              </Text>
                              <Text style={AddSlotModalStyles.summaryValue}>
                                Fecha:{" "}
                                <Text
                                  style={
                                    AddSlotModalStyles.summaryValueHighlighted
                                  }
                                >
                                  {formatDate(new Date(disabledSlots.today))}
                                </Text>
                              </Text>
                              {startTime && (
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginTop: 4,
                                  }}
                                >
                                  <Text style={AddSlotModalStyles.summaryValue}>
                                    Hora:{" "}
                                  </Text>
                                  <Text
                                    style={
                                      AddSlotModalStyles.summaryValueHighlighted
                                    }
                                  >
                                    {formatTimeFrom24Hour(startTime)}
                                  </Text>
                                </View>
                              )}
                            </View>
                            {(price || isScheduleClass) && (
                              <>
                                <View style={AddSlotModalStyles.summaryPrice}>
                                  <Text
                                    style={AddSlotModalStyles.summaryPriceLabel}
                                  >
                                    Precio Total
                                  </Text>
                                  {showCountdown && (
                                    <View
                                      style={
                                        AddSlotModalStyles.summaryPriceRight
                                      }
                                    >
                                      <Countdown
                                        duration={90}
                                        onComplete={handleCountdownComplete}
                                        isCheckout={true}
                                      />
                                    </View>
                                  )}
                                  <View
                                    style={AddSlotModalStyles.summaryPriceRow}
                                  >
                                    <View
                                      style={
                                        AddSlotModalStyles.summaryPriceLeft
                                      }
                                    >
                                      <Text
                                        style={
                                          AddSlotModalStyles.summaryPriceValue
                                        }
                                      >
                                        {isScheduleClass
                                          ? formatCurrency(
                                              Number(selectedClass?.price ?? 0)
                                            )
                                          : formatCurrency(price?.price ?? 0)}
                                      </Text>
                                      <Text
                                        style={
                                          AddSlotModalStyles.summaryPriceSubtext
                                        }
                                      >
                                        Incluye impuestos
                                      </Text>
                                    </View>
                                  </View>
                                </View>
                              </>
                            )}
                          </View>
                        )}
                        <View style={AddSlotModalStyles.centeredContainer}>
                          {showTimePicker && (
                            <TimeSlotPicker
                              selectedTime={startTime}
                              onTimeChange={handleTimeChange}
                              onConfirm={handleConfirmTimePicker}
                              disabled={isLoading}
                            />
                          )}
                        </View>
                        {!showTimePicker && (
                          <View style={AddSlotModalStyles.bottomContainer}>
                            <StripeProvider
                              publishableKey={userInfo.info?.publishable_key}
                            >
                              <View style={AddSlotModalStyles.containerCard}>
                                {cardInfo && cardInfo.default_payment_method ? (
                                  <View
                                    style={AddSlotModalStyles.cardInfoSection}
                                  >
                                    <View
                                      style={AddSlotModalStyles.cardInfoRow}
                                    >
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
                                      <Text
                                        style={AddSlotModalStyles.cardInfoText}
                                      >
                                        {cardInfo.brand?.toUpperCase()} ••••{" "}
                                        {cardInfo.last4}
                                      </Text>
                                    </View>
                                    <Text
                                      style={AddSlotModalStyles.cardInfoLabel}
                                    >
                                      Método de pago predeterminado
                                    </Text>
                                    <TouchableOpacity
                                      style={AddSlotModalStyles.editCardButton}
                                      onPress={() => {
                                        cleaningSlot();
                                        navigation.navigate("Profile");
                                      }}
                                    >
                                      <FontAwesome6
                                        name="pencil"
                                        size={14}
                                        color="#222"
                                      />
                                    </TouchableOpacity>
                                  </View>
                                ) : (
                                  <View style={AddSlotModalStyles.summaryCard}>
                                    <Text
                                      style={AddSlotModalStyles.titleValueCard}
                                    >
                                      Ingresa los datos de tu tarjeta:
                                    </Text>
                                    <CardField
                                      postalCodeEnabled={false}
                                      style={[
                                        AddSlotModalStyles.cardField,
                                        {
                                          backgroundColor: "#ffffff",
                                        },
                                      ]}
                                      cardStyle={{
                                        textColor: "#000000",
                                        backgroundColor: "#ffffff",
                                      }}
                                      onCardChange={(cardDetails) => {
                                        setIsCardComplete(cardDetails.complete);
                                      }}
                                    />
                                  </View>
                                )}
                                <View
                                  style={[
                                    AddSlotModalStyles.separator,
                                    { marginTop: 20, marginBottom: 10 },
                                  ]}
                                />
                                <View
                                  style={AddSlotModalStyles.buttonContainer}
                                >
                                  {!isPaying ? (
                                    <>
                                      <TouchableOpacity
                                        style={AddSlotModalStyles.buttonPay}
                                        onPress={handlePayPress}
                                        disabled={isPaying}
                                      >
                                        <FontAwesome6
                                          name="lock"
                                          size={16}
                                          color="#fff"
                                        />
                                        <Text
                                          style={
                                            AddSlotModalStyles.buttonPayText
                                          }
                                        >
                                          {buttonText}
                                        </Text>
                                      </TouchableOpacity>
                                      <Text
                                        style={AddSlotModalStyles.termsText}
                                      >
                                        Al pagar acepto los{" "}
                                        <Text
                                          style={AddSlotModalStyles.termsLink}
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
                                    </>
                                  ) : (
                                    <LoadingSmall
                                      isLoading={true}
                                      color="#e1dd2a"
                                    />
                                  )}
                                </View>
                              </View>
                            </StripeProvider>
                          </View>
                        )}
                      </>
                    )}
                  </>
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
