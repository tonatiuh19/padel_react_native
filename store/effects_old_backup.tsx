import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  setLoading,
  setError,
  fetchPlatformFieldsStart,
  fetchPlatformFieldsSuccess,
  fetchPlatformFieldsFailure,
  fetchPlatformsFieldsStart,
  fetchPlatformsFieldsSuccess,
  fetchPlatformsFieldsFailure,
  insertPlatformDateTimeSlotStart,
  insertPlatformDateTimeSlotSuccess,
  insertPlatformDateTimeSlotFailure,
  deletePlatformDateTimeSlotStart,
  deletePlatformDateTimeSlotSuccess,
  deletePlatformDateTimeSlotFailure,
  fetchgetDisabledSlotsStart,
  fetchgetDisabledSlotsSuccess,
  fetchgetDisabledSlotsFailure,
  validateUserSessionStart,
  validateUserSessionSuccess,
  validateUserSessionFailure,
  validateUserByPhoneNumberStart,
  validateUserByPhoneNumberSuccess,
  validateUserByPhoneNumberFailure,
  insertPlatformUserStart,
  insertPlatformUserSuccess,
  insertPlatformUserFailure,
  sendCodeStart,
  sendCodeSuccess,
  sendCodeFailure,
  validateSessionCodeStart,
  validateSessionCodeSuccess,
  validateSessionCodeFailure,
  validateUserByEmailStart,
  validateUserByEmailSuccess,
  validateUserByEmailFailure,
  sendCodeByMailStart,
  sendCodeByMailSuccess,
  sendCodeByMailFailure,
  logoutStart,
  logoutSuccess,
  logoutFailure,
  getUserInfoByIdStart,
  getUserInfoByIdSuccess,
  getUserInfoByIdFailure,
  updatePlatformDateTimeSlotStart,
  updatePlatformDateTimeSlotSuccess,
  updatePlatformDateTimeSlotFailure,
  getReservationsByUserIdStart,
  getReservationsByUserIdSuccess,
  getReservationsByUserIdFailure,
  getAdsByIdStart,
  getAdsByIdSuccess,
  getAdsByIdFailure,
  getPriceByIdAndTimeStart,
  getPriceByIdAndTimeSuccess,
  getPriceByIdAndTimeFailure,
  getEventPricebyDateAndIdPlatformStart,
  getEventPricebyDateAndIdPlatformSuccess,
  getEventPricebyDateAndIdPlatformFailure,
  insertEventUserStart,
  insertEventUserSuccess,
  insertEventUserFailure,
  deleteEventUserByIdStart,
  deleteEventUserByIdSuccess,
  deleteEventUserByIdFailure,
  updateEventUserByIdStart,
  updateEventUserByIdSuccess,
  updateEventUserByIdFailure,
  getClassesByIdPlatformStart,
  getClassesByIdPlatformSuccess,
  getClassesByIdPlatformFailure,
  getClassesByIdFieldStart,
  getClassesByIdFieldSuccess,
  getClassesByIdFieldFailure,
  insertPlatformFieldClassUsersStart,
  insertPlatformFieldClassUsersSuccess,
  insertPlatformFieldClassUsersFailure,
  deletePlatformFieldClassUsersStart,
  deletePlatformFieldClassUsersSuccess,
  deletePlatformFieldClassUsersFailure,
  updatePlatformFieldClassUserByIdStart,
  updatePlatformFieldClassUserByIdSuccess,
  updatePlatformFieldClassUserByIdFailure,
  getClassesByUserIdStart,
  getClassesByUserIdSuccess,
  getClassesByUserIdFailure,
  getPlatformSectionsByIdStart,
  getPlatformSectionsByIdSuccess,
  getPlatformSectionsByIdFailure,
  attachPaymentMethodStart,
  attachPaymentMethodSuccess,
  attachPaymentMethodFailure,
  createSubscriptionStart,
  createSubscriptionSuccess,
  createSubscriptionFailure,
} from "./appSlice";
import {
  DOMAIN,
  EPlatformField,
  PaymentState,
  PlatformField,
} from "../screens/HomeScreen/HomeScreen.model";

const GET_PLATFORM_FIELDS_BY_ID = `${DOMAIN}/getPlatformFieldsById.php`;
const GET_PLATFORM_SLOTS_BY_ID = `${DOMAIN}/getPlatformSlotsById.php`;
const CREATE_PAYMENT_INTENT = `${DOMAIN}/createPaymentIntent.php`;
const INSERT_PLATFORM_DATE_TIME_SLOT = `${DOMAIN}/insertPlatformDateTimeSlot.php`;
const DELETE_PLATFORM_DATE_TIME_SLOT = `${DOMAIN}/deletePlatformDateTimeSlot.php`;
const GET_DISABLED_SLOTS = `${DOMAIN}/getDisabledSlots.php`;
const VALIDATE_USER_SESSION = `${DOMAIN}/validateUserSession.php`;
const VALIDATE_USER_BY_PHONE_NUMBER = `${DOMAIN}/validateUserByPhoneNumber.php`;
const INSERT_PLATFORM_USER = `${DOMAIN}/insertPlatformUser.php`;
const SEND_CODE = `${DOMAIN}/sendCode.php`;
const VALIDATE_SESSION_CODE = `${DOMAIN}/validateSessionCode.php`;
const VALIDATE_USER_BY_EMAIL = `${DOMAIN}/validateUserByEmail.php`;
const SEND_CODE_BY_MAIL = `${DOMAIN}/sendCodeByMail.php`;
const LOGOUT = `${DOMAIN}/logout.php`;
const GET_USER_INFO_BY_ID = `${DOMAIN}/getUserInfoById.php`;
const UPDATE_PLATFORM_DATE_TIME_SLOT = `${DOMAIN}/updatePlatformDateTimeSlot.php`;
const GET_RESERVATIONS_BY_USER_ID = `${DOMAIN}/getReservationsByUserId.php`;
const GET_ADS_BY_ID = `${DOMAIN}/getAdsById.php`;
const GET_PRICE_BY_ID = `${DOMAIN}/getPriceByIdAndTime.php`;
const GET_EVENT_PRICE_BY_ID = `${DOMAIN}/getEventPricebyDateAndIdPlatform.php`;
const INSERT_EVENT_USER = `${DOMAIN}/insertEventUser.php`;
const DELETE_EVENT_USER = `${DOMAIN}/deleteEventUserById.php`;
const UPDATE_EVENT_USER = `${DOMAIN}/updateEventUserById.php`;
const GET_CLASSES = `${DOMAIN}/getClassesByIdPlatform.php`;
const GET_CLASSES_BY_FIELD = `${DOMAIN}/getClassesByIdField.php`;
const INSERT_CLASS = `${DOMAIN}/insertPlatformFieldClassUser.php`;
const DELETE_CLASS = `${DOMAIN}/deletePlatformFieldClassUser.php`;
const UPDATE_CLASS_STATUS = `${DOMAIN}/updatePlatformFieldClassUserById.php`;
const GET_CLASSES_RESERVATIONS = `${DOMAIN}/getClassesByUserId.php`;
const GET_SECTIONS = `${DOMAIN}/getPlatformSectionsById.php`;
const ATTACH_PAYMENT_METHOD = `${DOMAIN}/attachPaymentMethod.php`;
const CREATE_SUBSCRIPTION = `${DOMAIN}/createSubscription.php`;

export const fetchPaymentIntentClientSecret = async (
  amount: number,
  customerId: string,
  id_platforms_date_time_slot: number
) => {
  try {
    const response = await axios.post(
      CREATE_PAYMENT_INTENT,
      {
        items: [{ id: id_platforms_date_time_slot, quantity: 1 }],
        amount: amount * 100,
        customer_id: customerId,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    const { clientSecret } = response.data;
    return clientSecret;
  } catch (error) {
    console.error("Error fetching client secret:", error);
    throw error;
  }
};

export const fetchPlatformFields =
  (id_platform: number, id_platforms_user: number) =>
  async (
    dispatch: (arg0: {
      payload: PlatformField | undefined;
      type:
        | "app/fetchPlatformFieldsStart"
        | "app/fetchPlatformFieldsSuccess"
        | "app/fetchPlatformFieldsFailure";
    }) => void
  ) => {
    try {
      dispatch(fetchPlatformFieldsStart());
      const response = await axios.post<PlatformField>(
        GET_PLATFORM_FIELDS_BY_ID,
        {
          id_platform,
          imageDirectory: "../assets/images/carrouselImages",
          id_platforms_user,
        }
      );
      dispatch(fetchPlatformFieldsSuccess(response.data));
    } catch (error) {
      console.log("Error", error);
      dispatch(fetchPlatformFieldsFailure());
    }
  };

export const fetchPlatformsFields =
  (id_platforms_field: number, date: string) =>
  async (
    dispatch: (arg0: {
      payload: EPlatformField | undefined;
      type:
        | "app/fetchPlatformsFieldsStart"
        | "app/fetchPlatformsFieldsSuccess"
        | "app/fetchPlatformsFieldsFailure";
    }) => void
  ) => {
    try {
      dispatch(fetchPlatformsFieldsStart());
      const response = await axios.post<EPlatformField>(
        GET_PLATFORM_SLOTS_BY_ID,
        {
          id_platforms_field,
          date,
        }
      );
      dispatch(fetchPlatformsFieldsSuccess(response.data));
    } catch (error) {
      console.log("Error", error);
      dispatch(fetchPlatformsFieldsFailure());
    }
  };

export const insertPlatformDateTimeSlot =
  (
    id_platforms_field: number,
    platforms_date_time_start: string,
    active: number,
    id_platforms_user: number
  ) =>
  async (
    dispatch: (arg0: {
      payload: PaymentState | undefined;
      type:
        | "app/insertPlatformDateTimeSlotStart"
        | "app/insertPlatformDateTimeSlotSuccess"
        | "app/insertPlatformDateTimeSlotFailure";
    }) => void
  ) => {
    try {
      dispatch(insertPlatformDateTimeSlotStart());
      const response = await axios.post<PaymentState>(
        INSERT_PLATFORM_DATE_TIME_SLOT,
        {
          id_platforms_field,
          platforms_date_time_start,
          active,
          id_platforms_user,
        }
      );
      dispatch(insertPlatformDateTimeSlotSuccess(response.data));
    } catch (error) {
      console.log("Error", error);
      dispatch(insertPlatformDateTimeSlotFailure());
    }
  };

export const deletePlatformDateTimeSlot =
  (id_platforms_date_time_slot: number) =>
  async (
    dispatch: (arg0: {
      payload: any;
      type:
        | "app/deletePlatformDateTimeSlotStart"
        | "app/deletePlatformDateTimeSlotSuccess"
        | "app/deletePlatformDateTimeSlotFailure";
    }) => void
  ) => {
    try {
      dispatch(deletePlatformDateTimeSlotStart());
      const response = await axios.post<any>(DELETE_PLATFORM_DATE_TIME_SLOT, {
        id_platforms_date_time_slot,
      });
      dispatch(deletePlatformDateTimeSlotSuccess(response.data));
    } catch (error) {
      console.log("Error", error);
      dispatch(deletePlatformDateTimeSlotFailure());
    }
  };

export const fetchgetDisabledSlots =
  (date: string, id_platforms_field: number) =>
  async (
    dispatch: (arg0: {
      payload: any;
      type:
        | "app/fetchgetDisabledSlotsStart"
        | "app/fetchgetDisabledSlotsSuccess"
        | "app/fetchgetDisabledSlotsFailure";
    }) => void
  ) => {
    try {
      dispatch(fetchgetDisabledSlotsStart());
      const response = await axios.post<any>(GET_DISABLED_SLOTS, {
        date,
        id_platforms_field,
      });
      dispatch(fetchgetDisabledSlotsSuccess(response.data));
    } catch (error) {
      console.log("Error", error);
      dispatch(fetchgetDisabledSlotsFailure());
    }
  };

export const validateUserSession =
  (id_platforms_user: number) =>
  async (
    dispatch: (arg0: {
      payload: any;
      type:
        | "app/validateUserSessionStart"
        | "app/validateUserSessionSuccess"
        | "app/validateUserSessionFailure";
    }) => void
  ) => {
    try {
      dispatch(validateUserSessionStart());
      const response = await axios.post<any>(VALIDATE_USER_SESSION, {
        id_platforms_user,
      });
      dispatch(validateUserSessionSuccess(response.data));
    } catch (error) {
      console.log("Error", error);
      dispatch(validateUserSessionFailure());
    }
  };

export const validateUserByPhoneNumber =
  (phone_number: string, phone_number_code: string) =>
  async (
    dispatch: (arg0: {
      payload: any;
      type:
        | "app/validateUserByPhoneNumberStart"
        | "app/validateUserByPhoneNumberSuccess"
        | "app/validateUserByPhoneNumberFailure";
    }) => void
  ) => {
    try {
      dispatch(
        validateUserByPhoneNumberStart({ phone_number, phone_number_code })
      );
      const response = await axios.post<any>(VALIDATE_USER_BY_PHONE_NUMBER, {
        phone_number,
      });
      dispatch(validateUserByPhoneNumberSuccess(response.data));
    } catch (error) {
      console.log("Error", error);
      dispatch(validateUserByPhoneNumberFailure());
    }
  };

export const insertPlatformUser =
  (
    full_name: string,
    age: number,
    date_of_birth: string,
    phone_number_code: string,
    phone_number: string,
    type: number,
    id_platforms: number,
    email: string
  ) =>
  async (
    dispatch: (arg0: {
      payload: any;
      type:
        | "app/insertPlatformUserStart"
        | "app/insertPlatformUserSuccess"
        | "app/insertPlatformUserFailure";
    }) => void
  ) => {
    try {
      dispatch(insertPlatformUserStart());
      const response = await axios.post<any>(INSERT_PLATFORM_USER, {
        full_name,
        age,
        date_of_birth,
        phone_number_code,
        phone_number,
        type,
        id_platforms,
        email,
      });
      dispatch(insertPlatformUserSuccess(response.data));
    } catch (error) {
      console.log("Error", error);
      dispatch(insertPlatformUserFailure());
    }
  };

export const sendCode =
  (id_platforms_user: number, id_platforms: number, method: string) =>
  async (
    dispatch: (arg0: {
      payload: any;
      type: "app/sendCodeStart" | "app/sendCodeSuccess" | "app/sendCodeFailure";
    }) => void
  ) => {
    try {
      dispatch(sendCodeStart());
      const response = await axios.post<any>(SEND_CODE, {
        id_platforms_user,
        id_platforms,
        method,
      });
      dispatch(sendCodeSuccess(response.data));
    } catch (error) {
      console.log("Error", error);
      dispatch(sendCodeFailure());
    }
  };

export const validateSessionCode =
  (id_platforms_user: number, id_platforms: number, code: string) =>
  async (
    dispatch: (arg0: {
      payload: any;
      type:
        | "app/validateSessionCodeStart"
        | "app/validateSessionCodeSuccess"
        | "app/validateSessionCodeFailure";
    }) => void
  ) => {
    try {
      dispatch(validateSessionCodeStart());
      const response = await axios.post<any>(VALIDATE_SESSION_CODE, {
        id_platforms_user,
        id_platforms,
        code,
      });
      dispatch(validateSessionCodeSuccess(response.data));
    } catch (error) {
      console.log("Error", error);
      dispatch(validateSessionCodeFailure());
    }
  };

export const validateUserByEmail =
  (email: string) =>
  async (
    dispatch: (arg0: {
      payload: any;
      type:
        | "app/validateUserByEmailStart"
        | "app/validateUserByEmailSuccess"
        | "app/validateUserByEmailFailure";
    }) => void
  ) => {
    try {
      dispatch(validateUserByEmailStart({ email }));
      const response = await axios.post<any>(VALIDATE_USER_BY_EMAIL, {
        email,
      });
      dispatch(validateUserByEmailSuccess(response.data));
    } catch (error) {
      console.log("Error", error);
      dispatch(validateUserByEmailFailure());
    }
  };

export const sendCodeByMail =
  (id_platforms_user: number, id_platforms: number, email: string) =>
  async (
    dispatch: (arg0: {
      payload: any;
      type:
        | "app/sendCodeByMailStart"
        | "app/sendCodeByMailSuccess"
        | "app/sendCodeByMailFailure";
    }) => void
  ) => {
    try {
      dispatch(sendCodeByMailStart());
      const response = await axios.post<any>(SEND_CODE_BY_MAIL, {
        id_platforms_user,
        id_platforms,
        email,
      });
      dispatch(sendCodeByMailSuccess(response.data));
    } catch (error) {
      console.log("Error", error);
      dispatch(sendCodeByMailFailure());
    }
  };

export const logout =
  (id_platforms_user: number, id_platforms: number) =>
  async (
    dispatch: (arg0: {
      payload: any;
      type: "app/logoutStart" | "app/logoutSuccess" | "app/logoutFailure";
    }) => void
  ) => {
    try {
      dispatch(logoutStart());
      const response = await axios.post<any>(LOGOUT, {
        id_platforms_user,
        id_platforms,
      });
      dispatch(logoutSuccess(response.data));
    } catch (error) {
      console.log("Error", error);
      dispatch(logoutFailure());
    }
  };

export const getUserInfoById =
  (id_platforms_user: number) =>
  async (
    dispatch: (arg0: {
      payload: any;
      type:
        | "app/getUserInfoByIdStart"
        | "app/getUserInfoByIdSuccess"
        | "app/getUserInfoByIdFailure";
    }) => void
  ) => {
    try {
      dispatch(getUserInfoByIdStart());
      const response = await axios.post<any>(GET_USER_INFO_BY_ID, {
        id_platforms_user,
      });
      dispatch(getUserInfoByIdSuccess(response.data));
    } catch (error) {
      console.log("Error", error);
      dispatch(getUserInfoByIdFailure());
    }
  };

export const updatePlatformDateTimeSlot =
  (
    id_platforms_date_time_slot: number,
    active: number,
    stripe_id = "",
    priceTotal = 0
  ) =>
  async (
    dispatch: (arg0: {
      payload: any;
      type:
        | "app/updatePlatformDateTimeSlotStart"
        | "app/updatePlatformDateTimeSlotSuccess"
        | "app/updatePlatformDateTimeSlotFailure";
    }) => void
  ) => {
    try {
      dispatch(updatePlatformDateTimeSlotStart());
      const response = await axios.post<any>(UPDATE_PLATFORM_DATE_TIME_SLOT, {
        id_platforms_date_time_slot,
        active,
        stripe_id,
        priceTotal,
      });
      dispatch(updatePlatformDateTimeSlotSuccess(response.data));
    } catch (error) {
      console.log("Error", error);
      dispatch(updatePlatformDateTimeSlotFailure());
    }
  };

export const getReservationsByUserId =
  (id_platforms_user: number) =>
  async (
    dispatch: (arg0: {
      payload: any;
      type:
        | "app/getReservationsByUserIdStart"
        | "app/getReservationsByUserIdSuccess"
        | "app/getReservationsByUserIdFailure";
    }) => void
  ) => {
    try {
      dispatch(getReservationsByUserIdStart());
      const response = await axios.post<any>(GET_RESERVATIONS_BY_USER_ID, {
        id_platforms_user,
      });
      dispatch(getReservationsByUserIdSuccess(response.data));
    } catch (error) {
      console.log("Error", error);
      dispatch(getReservationsByUserIdFailure());
    }
  };

export const getAdsById =
  (id_platform: number) =>
  async (
    dispatch: (arg0: {
      payload: any;
      type:
        | "app/getAdsByIdStart"
        | "app/getAdsByIdSuccess"
        | "app/getAdsByIdFailure";
    }) => void
  ) => {
    try {
      dispatch(getAdsByIdStart());
      const response = await axios.post<any>(GET_ADS_BY_ID, {
        id_platform,
      });
      dispatch(getAdsByIdSuccess(response.data));
    } catch (error) {
      console.log("Error", error);
      dispatch(getAdsByIdFailure());
    }
  };

export const getPriceByIdAndTime =
  (id_platforms: number, time: string) =>
  async (
    dispatch: (arg0: {
      payload: any;
      type:
        | "app/getPriceByIdAndTimeStart"
        | "app/getPriceByIdAndTimeSuccess"
        | "app/getPriceByIdAndTimeFailure";
    }) => void
  ) => {
    try {
      dispatch(getPriceByIdAndTimeStart());
      const response = await axios.post<any>(GET_PRICE_BY_ID, {
        id_platforms,
        time,
      });
      dispatch(getPriceByIdAndTimeSuccess(response.data));
    } catch (error) {
      console.log("Error", error);
      dispatch(getPriceByIdAndTimeFailure());
    }
  };

export const getEventPricebyDateAndIdPlatform =
  (id_platforms_field: number, platforms_fields_price_start_time: string) =>
  async (
    dispatch: (arg0: {
      payload: any;
      type:
        | "app/getEventPricebyDateAndIdPlatformStart"
        | "app/getEventPricebyDateAndIdPlatformSuccess"
        | "app/getEventPricebyDateAndIdPlatformFailure";
    }) => void
  ) => {
    try {
      dispatch(getEventPricebyDateAndIdPlatformStart());
      const response = await axios.post<any>(GET_EVENT_PRICE_BY_ID, {
        id_platforms_field,
        platforms_fields_price_start_time,
      });
      dispatch(getEventPricebyDateAndIdPlatformSuccess(response.data));
    } catch (error) {
      console.log("Error", error);
      dispatch(getEventPricebyDateAndIdPlatformFailure());
    }
  };

export const insertEventUser =
  (
    id_platforms_user: number,
    id_platforms_disabled_date: number,
    active: number,
    priceTotal: number
  ) =>
  async (
    dispatch: (arg0: {
      payload: any;
      type:
        | "app/insertEventUserStart"
        | "app/insertEventUserSuccess"
        | "app/insertEventUserFailure";
    }) => void
  ) => {
    try {
      dispatch(insertEventUserStart());
      const response = await axios.post<any>(INSERT_EVENT_USER, {
        id_platforms_user,
        id_platforms_disabled_date,
        active,
        priceTotal,
      });
      dispatch(insertEventUserSuccess(response.data));
    } catch (error) {
      console.log("Error", error);
      dispatch(insertEventUserFailure());
    }
  };

export const deleteEventUserById =
  (id_platforms_fields_events_users: number) =>
  async (
    dispatch: (arg0: {
      payload: any;
      type:
        | "app/deleteEventUserByIdStart"
        | "app/deleteEventUserByIdSuccess"
        | "app/deleteEventUserByIdFailure";
    }) => void
  ) => {
    try {
      dispatch(deleteEventUserByIdStart());
      const response = await axios.post<any>(DELETE_EVENT_USER, {
        id_platforms_fields_events_users,
      });
      dispatch(deleteEventUserByIdSuccess(response.data));
    } catch (error) {
      console.log("Error", error);
      dispatch(deleteEventUserByIdFailure());
    }
  };

export const updateEventUserById =
  (
    id_platforms_fields_events_users: number,
    active: number,
    stripe_id: string
  ) =>
  async (
    dispatch: (arg0: {
      payload: any;
      type:
        | "app/updateEventUserByIdStart"
        | "app/updateEventUserByIdSuccess"
        | "app/updateEventUserByIdFailure";
    }) => void
  ) => {
    try {
      dispatch(updateEventUserByIdStart());
      const response = await axios.post<any>(UPDATE_EVENT_USER, {
        id_platforms_fields_events_users,
        active,
        stripe_id,
      });
      dispatch(updateEventUserByIdSuccess(response.data));
    } catch (error) {
      console.log("Error", error);
      dispatch(updateEventUserByIdFailure());
    }
  };

export const getClassesByIdPlatform =
  (id_platform: number) =>
  async (
    dispatch: (arg0: {
      payload: any;
      type:
        | "app/getClassesByIdPlatformStart"
        | "app/getClassesByIdPlatformSuccess"
        | "app/getClassesByIdPlatformFailure";
    }) => void
  ) => {
    try {
      dispatch(getClassesByIdPlatformStart());
      const response = await axios.post<any>(GET_CLASSES, {
        id_platform,
      });
      dispatch(getClassesByIdPlatformSuccess(response.data));
    } catch (error) {
      console.log("Error", error);
      dispatch(getClassesByIdPlatformFailure());
    }
  };

export const getClassesByIdField =
  (id_platforms_field: number) =>
  async (
    dispatch: (arg0: {
      payload: any;
      type:
        | "app/getClassesByIdFieldStart"
        | "app/getClassesByIdFieldSuccess"
        | "app/getClassesByIdFieldFailure";
    }) => void
  ) => {
    try {
      dispatch(getClassesByIdFieldStart());
      const response = await axios.post<any>(GET_CLASSES_BY_FIELD, {
        id_platforms_field,
      });
      dispatch(getClassesByIdFieldSuccess(response.data));
    } catch (error) {
      console.log("Error", error);
      dispatch(getClassesByIdFieldFailure());
    }
  };

export const insertPlatformFieldClassUser =
  (
    id_platforms_user: number,
    id_platforms_disabled_date: number,
    platforms_date_time_start: string,
    price: number,
    active: number,
    validated: number
  ) =>
  async (
    dispatch: (arg0: {
      payload: any;
      type:
        | "app/insertPlatformFieldClassUsersStart"
        | "app/insertPlatformFieldClassUsersSuccess"
        | "app/insertPlatformFieldClassUsersFailure";
    }) => void
  ) => {
    try {
      dispatch(insertPlatformFieldClassUsersStart());
      const response = await axios.post<any>(INSERT_CLASS, {
        id_platforms_user,
        id_platforms_disabled_date,
        platforms_date_time_start,
        price,
        active,
        validated,
      });
      dispatch(insertPlatformFieldClassUsersSuccess(response.data));
    } catch (error) {
      console.log("Error", error);
      dispatch(insertPlatformFieldClassUsersFailure());
    }
  };

export const deletePlatformFieldClassUser =
  (id_platforms_fields_classes_users: number) =>
  async (
    dispatch: (arg0: {
      payload: any;
      type:
        | "app/deletePlatformFieldClassUsersStart"
        | "app/deletePlatformFieldClassUsersSuccess"
        | "app/deletePlatformFieldClassUsersFailure";
    }) => void
  ) => {
    try {
      dispatch(deletePlatformFieldClassUsersStart());
      const response = await axios.post<any>(DELETE_CLASS, {
        id_platforms_fields_classes_users,
      });
      dispatch(deletePlatformFieldClassUsersSuccess(response.data));
    } catch (error) {
      console.log("Error", error);
      dispatch(deletePlatformFieldClassUsersFailure());
    }
  };

export const updatePlatformFieldClassUserById =
  (
    id_platforms_fields_classes_users: number,
    active: number,
    stripe_id: string
  ) =>
  async (
    dispatch: (arg0: {
      payload: any;
      type:
        | "app/updatePlatformFieldClassUserByIdStart"
        | "app/updatePlatformFieldClassUserByIdSuccess"
        | "app/updatePlatformFieldClassUserByIdFailure";
    }) => void
  ) => {
    try {
      dispatch(updatePlatformFieldClassUserByIdStart());
      const response = await axios.post<any>(UPDATE_CLASS_STATUS, {
        id_platforms_fields_classes_users,
        active,
        stripe_id,
      });
      dispatch(updatePlatformFieldClassUserByIdSuccess(response.data));
    } catch (error) {
      console.log("Error", error);
      dispatch(updatePlatformFieldClassUserByIdFailure());
    }
  };

export const getClassesByUserId =
  (id_platforms_user: number) =>
  async (
    dispatch: (arg0: {
      payload: any;
      type:
        | "app/getClassesByUserIdStart"
        | "app/getClassesByUserIdSuccess"
        | "app/getClassesByUserIdFailure";
    }) => void
  ) => {
    try {
      dispatch(getClassesByUserIdStart());
      const response = await axios.post<any>(GET_CLASSES_RESERVATIONS, {
        id_platforms_user,
      });
      dispatch(getClassesByUserIdSuccess(response.data));
    } catch (error) {
      console.log("Error", error);
      dispatch(getClassesByUserIdFailure());
    }
  };

export const getPlatformSectionsById =
  (id_platform: number) =>
  async (
    dispatch: (arg0: {
      payload: any;
      type:
        | "app/getPlatformSectionsByIdStart"
        | "app/getPlatformSectionsByIdSuccess"
        | "app/getPlatformSectionsByIdFailure";
    }) => void
  ) => {
    try {
      dispatch(getPlatformSectionsByIdStart());
      const response = await axios.post<any>(GET_SECTIONS, {
        id_platform,
      });
      dispatch(getPlatformSectionsByIdSuccess(response.data));
    } catch (error) {
      console.log("Error", error);
      dispatch(getPlatformSectionsByIdFailure());
    }
  };

export const attachPaymentMethod =
  (
    stripe_customer_id: string,
    payment_method_id: string,
    id_platforms_user: number
  ) =>
  async (
    dispatch: (arg0: {
      payload: any;
      type:
        | "app/attachPaymentMethodStart"
        | "app/attachPaymentMethodSuccess"
        | "app/attachPaymentMethodFailure";
    }) => void
  ) => {
    try {
      dispatch(attachPaymentMethodStart());
      const response = await axios.post<any>(ATTACH_PAYMENT_METHOD, {
        stripe_customer_id,
        payment_method_id,
        id_platforms_user,
      });
      dispatch(attachPaymentMethodSuccess(response.data));
    } catch (error) {
      console.log("Error", error);
      dispatch(attachPaymentMethodFailure());
    }
  };

export const createSubscription =
  (
    customer_id: string,
    price_id: string,
    id_platforms_user: number,
    default_payment_method: string
  ) =>
  async (
    dispatch: (arg0: {
      payload: any;
      type:
        | "app/createSubscriptionStart"
        | "app/createSubscriptionSuccess"
        | "app/createSubscriptionFailure";
    }) => void
  ) => {
    try {
      dispatch(createSubscriptionStart());
      const response = await axios.post<any>(CREATE_SUBSCRIPTION, {
        customer_id,
        price_id,
        id_platforms_user,
        default_payment_method,
      });
      dispatch(createSubscriptionSuccess(response.data));
    } catch (error) {
      console.log("Error", error);
      dispatch(createSubscriptionFailure());
    }
  };
