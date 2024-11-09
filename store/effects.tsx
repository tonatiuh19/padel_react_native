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
