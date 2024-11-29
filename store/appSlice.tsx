import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AppState,
  EPlatformField,
  PaymentState,
  PlatformField,
  Reservations,
  UserInfo,
} from "../screens/HomeScreen/HomeScreen.model";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    isCodeSent: false,
    isIncorrectCode: false,
    isUserValidated: false,
    info: {
      id_platforms_user: 0,
      full_name: "",
      age: 0,
      date_of_birth: "",
      email: "",
      phone_number: "",
      phone_number_code: "",
      stripe_id: "",
      type: 0,
      date_created: "",
      id_platforms: 0,
    },
  },
  reservations: [],
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
        phone_number: string;
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
    insertPlatformUserSuccess(state, action: PayloadAction<UserInfo>) {
      state.userInfo.info = action.payload;
      state.userInfo.isUserExist = true;
      state.isLoading = false;
    },
    insertPlatformUserFailure(state) {
      state.isLoading = false;
      state.isError = true;
    },
    sendCodeStart(state) {
      state.isLoading = true;
      state.isError = false;
    },
    sendCodeSuccess(state, action: PayloadAction<boolean>) {
      if (action.payload) {
        state.userInfo.isCodeSent = true;
      }
      state.isLoading = false;
    },
    sendCodeFailure(state) {
      state.isLoading = false;
      state.isError = true;
    },
    validateSessionCodeStart(state) {
      state.isLoading = true;
      state.isError = false;
    },
    validateSessionCodeSuccess(state, action: PayloadAction<boolean>) {
      console.log("Validate Session Code", action.payload);
      if (action.payload) {
        AsyncStorage.setItem(
          "id_platforms_user",
          state.userInfo.info.id_platforms_user.toString()
        );
      }
      state.userInfo.isSignedIn = action.payload;
      state.userInfo.isIncorrectCode = action.payload ? false : true;
      state.userInfo.isUserValidated = action.payload;
      state.isLoading = false;
    },
    validateSessionCodeFailure(state) {
      state.isLoading = false;
      state.isError = true;
    },
    validateUserByEmailStart(
      state,
      action: PayloadAction<{
        email: string;
      }>
    ) {
      state.userInfo.info.email = action.payload.email;
      state.isLoading = true;
      state.isError = false;
    },
    validateUserByEmailSuccess(state, action: PayloadAction<any>) {
      if (!action.payload) {
        state.userInfo.isUserExist = action.payload;
      } else {
        state.userInfo.info = action.payload;
        state.userInfo.isUserExist = true;
      }

      state.isLoading = false;
    },
    validateUserByEmailFailure(state) {
      state.isLoading = false;
      state.isError = true;
    },
    sendCodeByMailStart(state) {
      state.isLoading = true;
      state.isError = false;
    },
    sendCodeByMailSuccess(state, action: PayloadAction<boolean>) {
      if (action.payload) {
        state.userInfo.isCodeSent = true;
      }
      state.isLoading = false;
    },
    sendCodeByMailFailure(state) {
      state.isLoading = false;
      state.isError = true;
    },
    logoutStart(state) {
      state.isLoading = true;
      state.isError = false;
    },
    logoutSuccess(state) {
      state.userInfo = initialState.userInfo;
      state.isLoading = false;
    },
    logoutFailure(state) {
      state.isLoading = false;
      state.isError = true;
    },
    getUserInfoByIdStart(state) {
      state.isLoading = true;
      state.isError = false;
    },
    getUserInfoByIdSuccess(state, action: PayloadAction<UserInfo>) {
      state.userInfo.info = action.payload;
      state.isLoading = false;
    },
    getUserInfoByIdFailure(state) {
      state.isLoading = false;
      state.isError = true;
    },
    updatePlatformDateTimeSlotStart(state) {
      state.isLoading = true;
      state.isError = false;
    },
    updatePlatformDateTimeSlotSuccess(
      state,
      action: PayloadAction<PaymentState>
    ) {
      state.isLoading = false;
      state.payment = action.payload;
    },
    updatePlatformDateTimeSlotFailure(state) {
      state.isLoading = false;
      state.isError = true;
    },
    getReservationsByUserIdStart(state) {
      state.isLoading = true;
      state.isError = false;
    },
    getReservationsByUserIdSuccess(
      state,
      action: PayloadAction<Reservations[]>
    ) {
      state.isLoading = false;
      state.reservations = action.payload;
    },
    getReservationsByUserIdFailure(state) {
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
} = appSlice.actions;

export default appSlice.reducer;
