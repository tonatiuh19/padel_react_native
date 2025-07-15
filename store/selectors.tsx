import { RootState } from "./index";

export const selectIsLoading = (state: RootState) => state.app.isLoading;
export const selectIsError = (state: RootState) => state.app.isError;
export const selectPlatformFields = (state: RootState) =>
  state.app.platformFields.platforms_fields;

export const selectPlatformsFields = (state: RootState) =>
  state.app.platformsFields;

export const selectIsDayEmpty = (state: RootState) =>
  state.app.schedule.isDayEmpty;

export const selectMarkedActiveDay = (state: RootState) =>
  state.app.schedule.markedActiveDay;

export const selectPayment = (state: RootState) => state.app.payment;

export const selectDisabledSlots = (state: RootState) =>
  state.app.disabledSlots;

export const selectUserInfo = (state: RootState) => state.app.userInfo;

export const selectIsUserExist = (state: RootState) =>
  state.app.userInfo.isUserExist;

export const selectReservations = (state: RootState) =>
  state.app.reservations.reservations;

export const selectEventReservations = (state: RootState) =>
  state.app.reservations.eventReservations;

export const selectAds = (state: RootState) => state.app.ads;

export const selectLastReservation = (state: RootState) =>
  state.app.last_reservation;

export const selectLastClass = (state: RootState) => state.app.last_class;

export const selectPrice = (state: RootState) => state.app.price;

export const selectEventPrice = (state: RootState) => state.app.eventPrice;

export const selectPaymentEvent = (state: RootState) => state.app.paymentEvent;

export const selectClasses = (state: RootState) => state.app.classes;

export const selectIsScheduleClass = (state: RootState) =>
  state.app.isScheduleClass;

export const selectSelectedClass = (state: RootState) =>
  state.app.selectedClass;

export const selectPaymentClass = (state: RootState) => state.app.paymentClass;

export const selectClassesReservations = (state: RootState) =>
  state.app.classesReservations;

export const selectHomeClasses = (state: RootState) => state.app.homeClasses;

export const selectSections = (state: RootState) => state.app.sections;
