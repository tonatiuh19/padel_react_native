import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AppState,
  EPlatformField,
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
} = appSlice.actions;

export default appSlice.reducer;
