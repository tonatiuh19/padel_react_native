import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  setLoading,
  setError,
  fetchPlatformFieldsStart,
  fetchPlatformFieldsSuccess,
  fetchPlatformFieldsFailure,
} from "./appSlice";
import { DOMAIN, PlatformField } from "../screens/HomeScreen/HomeScreen.model";

const GET_PLATFORM_FIELDS_BY_ID = `${DOMAIN}/getPlatformFieldsById.php`;

export const fetchPlatformFields =
  (id_platform: number) =>
  async (
    dispatch: (arg0: {
      payload: PlatformField[] | undefined;
      type:
        | "app/fetchPlatformFieldsStart"
        | "app/fetchPlatformFieldsSuccess"
        | "app/fetchPlatformFieldsFailure";
    }) => void
  ) => {
    try {
      dispatch(fetchPlatformFieldsStart());
      const response = await axios.post<PlatformField[]>(
        GET_PLATFORM_FIELDS_BY_ID,
        {
          id_platform,
        }
      );
      dispatch(fetchPlatformFieldsSuccess(response.data));
    } catch (error) {
      console.log("Error", error);
      dispatch(fetchPlatformFieldsFailure());
    }
  };
