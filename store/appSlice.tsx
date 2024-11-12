import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AppState,
  EPlatformField,
  PaymentState,
  PlatformField,
} from "../screens/HomeScreen/HomeScreen.model";

const initialState: AppState = {
  platformFields: {
    title: "",
    today: "",
    start_time: "",
    end_time: "",
    platforms_fields: [],
  },
  platformsFields: {
    id_platforms_field: 0,
    title: "",
    today: "",
    markedDates: {},
    slots: {},
  },
  schedule: {
    isDayEmpty: false,
    markedActiveDay: 0,
  },
  payment: {
    id_platforms_date_time_slot: 0,
    id_platforms_field: 0,
    platforms_date_time_start: "",
    platforms_date_time_end: "",
    active: 0,
    stripe_id: "",
  },
  disabledSlots: {
    disabledSlots: [],
    today: "",
  },
  userInfo: {
    isSignedIn: false,
  },
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<boolean>) {
      state.isError = action.payload;
    },
    clearState(state) {
      state.isLoading = false;
      state.isError = false;
      state.platformFields = {
        title: "",
        today: "",
        start_time: "",
        end_time: "",
        platforms_fields: [],
      };
      state.platformsFields = {
        id_platforms_field: 0,
        title: "",
        today: "",
        markedDates: {},
        slots: {},
      };
      state.schedule = {
        isDayEmpty: false,
        markedActiveDay: 0,
      };
      state.payment = {
        id_platforms_date_time_slot: 0,
        id_platforms_field: 0,
        platforms_date_time_start: "",
        platforms_date_time_end: "",
        active: 0,
        stripe_id: "",
      };
      state.disabledSlots = {
        disabledSlots: [],
        today: "",
      };
      state.userInfo = {
        isSignedIn: false,
      };
    },
    fetchPlatformFieldsStart(state) {
      state.isLoading = true;
      state.isError = false;
    },
    fetchPlatformFieldsSuccess(state, action: PayloadAction<PlatformField>) {
      state.isLoading = false;
      state.platformFields = action.payload;
    },
    fetchPlatformFieldsFailure(state) {
      state.isLoading = false;
      state.isError = true;
    },
    fetchPlatformsFieldsStart(state) {
      state.isLoading = true;
      state.isError = false;
    },
    fetchPlatformsFieldsSuccess(state, action: PayloadAction<EPlatformField>) {
      state.isLoading = false;
      state.platformsFields = action.payload;
    },
    fetchPlatformsFieldsFailure(state) {
      state.isLoading = false;
      state.isError = true;
    },
    setIsDayEmpty(state, action: PayloadAction<boolean>) {
      state.schedule.isDayEmpty = action.payload;
    },
    setMarkedActiveDay(state, action: PayloadAction<number>) {
      state.schedule.markedActiveDay = action.payload;
    },
    insertPlatformDateTimeSlotStart(state) {
      state.isLoading = true;
      state.isError = false;
    },
    insertPlatformDateTimeSlotSuccess(
      state,
      action: PayloadAction<PaymentState>
    ) {
      state.isLoading = false;
      state.payment = action.payload;
    },
    insertPlatformDateTimeSlotFailure(state) {
      state.isLoading = false;
      state.isError = true;
    },
    deletePlatformDateTimeSlotStart(state) {
      state.isLoading = true;
      state.isError = false;
    },
    deletePlatformDateTimeSlotSuccess(state) {
      state.isLoading = false;
      state.payment = {
        id_platforms_date_time_slot: 0,
        id_platforms_field: 0,
        platforms_date_time_start: "",
        platforms_date_time_end: "",
        active: 0,
        stripe_id: "",
      };
    },
    deletePlatformDateTimeSlotFailure(state) {
      state.isLoading = false;
      state.isError = true;
    },
    fetchgetDisabledSlotsStart(state) {
      state.isLoading = true;
      state.isError = false;
    },
    fetchgetDisabledSlotsSuccess(state, action: PayloadAction<string[]>) {
      state.isLoading = false;
      state.disabledSlots.disabledSlots = action.payload;
    },
    fetchgetDisabledSlotsFailure(state) {
      state.isLoading = false;
      state.isError = true;
    },
    setSelectedDay(state, action: PayloadAction<string>) {
      state.disabledSlots.today = action.payload;
    },
    validateUserSessionStart(state) {
      state.isLoading = true;
      state.isError = false;
    },
    validateUserSessionSuccess(state) {
      state.userInfo.isSignedIn = true;
      state.isLoading = false;
    },
    validateUserSessionFailure(state) {
      state.isLoading = false;
      state.isError = true;
    },
  },
});

export const {
  setLoading,
  setError,
  clearState,
  fetchPlatformFieldsStart,
  fetchPlatformFieldsSuccess,
  fetchPlatformFieldsFailure,
  fetchPlatformsFieldsStart,
  fetchPlatformsFieldsSuccess,
  fetchPlatformsFieldsFailure,
  setIsDayEmpty,
  setMarkedActiveDay,
  insertPlatformDateTimeSlotStart,
  insertPlatformDateTimeSlotSuccess,
  insertPlatformDateTimeSlotFailure,
  deletePlatformDateTimeSlotStart,
  deletePlatformDateTimeSlotSuccess,
  deletePlatformDateTimeSlotFailure,
  fetchgetDisabledSlotsStart,
  fetchgetDisabledSlotsSuccess,
  fetchgetDisabledSlotsFailure,
  setSelectedDay,
  validateUserSessionStart,
  validateUserSessionSuccess,
  validateUserSessionFailure,
} = appSlice.actions;

export default appSlice.reducer;
