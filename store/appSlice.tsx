import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AppState,
  ClassesModel,
  ClassesReservationModel,
  EPlatformField,
  PaymentClassModel,
  PaymentEventState,
  PaymentState,
  PlatformField,
  PriceEventModel,
  PriceModel,
  Reservation,
  ReservationCardAdsProps,
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
    classes: {},
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
    fullToday: "",
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
      active: 0,
      type: 0,
      date_created: "",
      id_platforms: 0,
      publishable_key: "",
      card_info: null,
      subscription: null,
    },
  },
  reservations: {
    reservations: [],
    eventReservations: [],
  },
  ads: [],
  last_reservation: null,
  last_class: null,
  price: null,
  eventPrice: null,
  paymentEvent: {
    id_platforms_fields_events_users: 0,
    id_platforms_user: 0,
    id_platforms_disabled_date: 0,
    active: 0,
    platforms_fields_events_users_inserted: "",
  },
  classes: [],
  homeClasses: [],
  isScheduleClass: false,
  selectedClass: null,
  paymentClass: null,
  classesReservations: [],
  sections: [],
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
    fetchPlatformFieldsSuccess(state, action: PayloadAction<any>) {
      console.log("Action Payload", action.payload);
      state.isLoading = false;
      state.last_reservation = action.payload.last_reservation;
      state.last_class = action.payload.last_class;
      state.platformFields = action.payload;
      state.homeClasses = action.payload.classes;
    },
    fetchPlatformFieldsFailure(state) {
      state.isLoading = false;
      state.isError = true;
    },
    fetchPlatformsFieldsStart(state) {
      state.isLoading = true;
      state.isError = false;
    },
    fetchPlatformsFieldsSuccess(state, action: PayloadAction<any>) {
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
    getReservationsByUserIdSuccess(state, action: PayloadAction<Reservations>) {
      state.isLoading = false;
      state.reservations = action.payload;
    },
    getReservationsByUserIdFailure(state) {
      state.isLoading = false;
      state.isError = true;
    },
    getAdsByIdStart(state) {
      state.isLoading = true;
      state.isError = false;
    },
    getAdsByIdSuccess(state, action: PayloadAction<ReservationCardAdsProps[]>) {
      state.isLoading = false;
      state.ads = action.payload;
    },
    getAdsByIdFailure(state) {
      state.isLoading = false;
      state.isError = true;
    },
    getPriceByIdAndTimeStart(state) {
      state.isLoading = true;
      state.isError = false;
    },
    getPriceByIdAndTimeSuccess(state, action: PayloadAction<PriceModel>) {
      state.isLoading = false;
      state.price = action.payload;
    },
    getPriceByIdAndTimeFailure(state) {
      state.isLoading = false;
      state.isError = true;
    },
    resetPrice(state) {
      state.price = null;
      state.eventPrice = null;
      state.selectedClass = null;
    },
    getEventPricebyDateAndIdPlatformStart(state) {
      state.isLoading = true;
      state.isError = false;
    },
    getEventPricebyDateAndIdPlatformSuccess(
      state,
      action: PayloadAction<PriceEventModel>
    ) {
      state.isLoading = false;
      state.eventPrice = action.payload;
    },
    getEventPricebyDateAndIdPlatformFailure(state) {
      state.isLoading = false;
      state.isError = true;
    },
    insertEventUserStart(state) {
      state.isLoading = true;
      state.isError = false;
    },
    insertEventUserSuccess(state, action: PayloadAction<PaymentEventState>) {
      state.isLoading = false;
      state.paymentEvent = action.payload;
    },
    insertEventUserFailure(state) {
      state.isLoading = false;
      state.isError = true;
    },
    deleteEventUserByIdStart(state) {
      state.isLoading = true;
      state.isError = false;
    },
    deleteEventUserByIdSuccess(state, action: PayloadAction<any>) {
      console.log("Action Payload", action.payload);
      state.isLoading = false;
      state.paymentEvent = {
        id_platforms_fields_events_users: 0,
        id_platforms_user: 0,
        id_platforms_disabled_date: 0,
        active: 0,
        platforms_fields_events_users_inserted: "",
      };
    },
    deleteEventUserByIdFailure(state) {
      state.isLoading = false;
      state.isError = true;
    },
    updateEventUserByIdStart(state) {
      state.isLoading = true;
      state.isError = false;
    },
    updateEventUserByIdSuccess(
      state,
      action: PayloadAction<PaymentEventState>
    ) {
      state.isLoading = false;
      state.paymentEvent = action.payload;
    },
    updateEventUserByIdFailure(state) {
      state.isLoading = false;
      state.isError = true;
    },
    getClassesByIdPlatformStart(state) {
      state.isLoading = true;
      state.isError = false;
    },
    getClassesByIdPlatformSuccess(
      state,
      action: PayloadAction<ClassesModel[]>
    ) {
      state.isLoading = false;
      state.classes = action.payload;
    },
    getClassesByIdPlatformFailure(state) {
      state.isLoading = false;
      state.isError = true;
    },
    setisScheduleClass(state, action: PayloadAction<boolean>) {
      state.isScheduleClass = action.payload;
    },
    getClassesByIdFieldStart(state) {
      state.isLoading = true;
      state.isError = false;
    },
    getClassesByIdFieldSuccess(state, action: PayloadAction<ClassesModel[]>) {
      state.isLoading = false;
      state.classes = action.payload;
    },
    getClassesByIdFieldFailure(state) {
      state.isLoading = false;
      state.isError = true;
    },
    setSelectedClass(state, action: PayloadAction<ClassesModel | null>) {
      state.selectedClass = action.payload;
    },
    insertPlatformFieldClassUsersStart(state) {
      state.isLoading = true;
      state.isError = false;
    },
    insertPlatformFieldClassUsersSuccess(
      state,
      action: PayloadAction<PaymentClassModel>
    ) {
      state.isLoading = false;
      state.paymentClass = action.payload;
    },
    insertPlatformFieldClassUsersFailure(state) {
      state.isLoading = false;
      state.isError = true;
    },
    deletePlatformFieldClassUsersStart(state) {
      state.isLoading = true;
      state.isError = false;
    },
    deletePlatformFieldClassUsersSuccess(state) {
      state.isLoading = false;
      state.paymentClass = null;
    },
    deletePlatformFieldClassUsersFailure(state) {
      state.isLoading = false;
      state.isError = true;
    },
    updatePlatformFieldClassUserByIdStart(state) {
      state.isLoading = true;
      state.isError = false;
    },
    updatePlatformFieldClassUserByIdSuccess(
      state,
      action: PayloadAction<PaymentClassModel>
    ) {
      state.isLoading = false;
    },
    updatePlatformFieldClassUserByIdFailure(state) {
      state.isLoading = false;
      state.isError = true;
    },
    getClassesByUserIdStart(state) {
      state.isLoading = true;
      state.isError = false;
    },
    getClassesByUserIdSuccess(
      state,
      action: PayloadAction<ClassesReservationModel[]>
    ) {
      state.isLoading = false;
      state.classesReservations = action.payload;
    },
    getClassesByUserIdFailure(state) {
      state.isLoading = false;
      state.isError = true;
    },
    getPlatformSectionsByIdStart(state) {
      state.isLoading = true;
      state.isError = false;
    },
    getPlatformSectionsByIdSuccess(state, action: PayloadAction<any[]>) {
      state.isLoading = false;
      state.sections = action.payload;
    },
    getPlatformSectionsByIdFailure(state) {
      state.isLoading = false;
      state.isError = true;
    },
    attachPaymentMethodStart(state) {
      state.isLoading = true;
      state.isError = false;
    },
    attachPaymentMethodSuccess(state, action: PayloadAction<any>) {
      if (action.payload !== false) {
        state.userInfo.info = action.payload;
        state.isLoading = false;
      }
    },
    attachPaymentMethodFailure(state) {
      state.isLoading = false;
      state.isError = true;
    },
    createSubscriptionStart(state) {
      state.isLoading = true;
      state.isError = false;
    },
    createSubscriptionSuccess(state, action: PayloadAction<any>) {
      if (action.payload !== false) {
        state.userInfo.info = action.payload;
        state.isLoading = false;
      }
    },
    createSubscriptionFailure(state) {
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
  getAdsByIdStart,
  getAdsByIdSuccess,
  getAdsByIdFailure,
  getPriceByIdAndTimeStart,
  getPriceByIdAndTimeSuccess,
  getPriceByIdAndTimeFailure,
  resetPrice,
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
  setisScheduleClass,
  getClassesByIdFieldStart,
  getClassesByIdFieldSuccess,
  getClassesByIdFieldFailure,
  setSelectedClass,
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
} = appSlice.actions;

export default appSlice.reducer;
