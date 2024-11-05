import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AppState,
  PlatformField,
} from "../screens/HomeScreen/HomeScreen.model";

const initialState: AppState = {
  platformFields: [],
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
      state.platformFields = [];
    },
    fetchPlatformFieldsStart(state) {
      state.isLoading = true;
      state.isError = false;
    },
    fetchPlatformFieldsSuccess(state, action: PayloadAction<PlatformField[]>) {
      state.isLoading = false;
      state.platformFields = action.payload;
    },
    fetchPlatformFieldsFailure(state) {
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
} = appSlice.actions;

export default appSlice.reducer;
