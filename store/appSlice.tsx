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
    isUserExist: false,
    info: {
      id_platforms_user: 0,
      full_name: "",
      phone_number: 0,
      phone_number_code: "",
    },
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
      state = initialState;
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
    validateUserSessionSuccess(state, action: PayloadAction<boolean>) {
      state.userInfo.isSignedIn = action.payload;
      state.isLoading = false;
    },
    validateUserSessionFailure(state) {
      state.isLoading = false;
      state.isError = true;
    },
    validateUserByPhoneNumberStart(
      state,
      action: PayloadAction<{
        phone_number: number;
        phone_number_code: string;
      }>
    ) {
      state.userInfo.info.phone_number = action.payload.phone_number;
      state.userInfo.info.phone_number_code = action.payload.phone_number_code;
      state.isLoading = true;
      state.isError = false;
    },
    validateUserByPhoneNumberSuccess(state, action: PayloadAction<boolean>) {
      state.userInfo.isUserExist = action.payload;
      state.isLoading = false;
    },
    validateUserByPhoneNumberFailure(state) {
      state.isLoading = false;
      state.isError = true;
    },
    insertPlatformUserStart(state) {
      state.isLoading = true;
      state.isError = false;
    },
    insertPlatformUserSuccess(state, action: PayloadAction<any>) {
      state.userInfo.info = action.payload;
      state.isLoading = false;
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
  validateUserByPhoneNumberStart,
  validateUserByPhoneNumberSuccess,
  validateUserByPhoneNumberFailure,
} = appSlice.actions;

export default appSlice.reducer;
