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
