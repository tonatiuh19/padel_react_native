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

export const fetchPaymentIntentClientSecret = async (amount: number) => {
  try {
    const response = await axios.post(
      CREATE_PAYMENT_INTENT,
      {
        items: [{ id: "id" }],
        amount: amount * 100,
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
  (id_platform: number) =>
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
        }
      );
      dispatch(fetchPlatformFieldsSuccess(response.data));
    } catch (error) {
      console.log("Error", error);
      dispatch(fetchPlatformFieldsFailure());
    }
  };

export const fetchPlatformsFields =
  (id_platforms_field: number) =>
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
    active: number
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
    id_platforms: number
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
