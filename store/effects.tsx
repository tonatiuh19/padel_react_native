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
} from "./appSlice";
import {
  DOMAIN,
  EPlatformField,
  PlatformField,
} from "../screens/HomeScreen/HomeScreen.model";

const GET_PLATFORM_FIELDS_BY_ID = `${DOMAIN}/getPlatformFieldsById.php`;
const GET_PLATFORM_SLOTS_BY_ID = `${DOMAIN}/getPlatformSlotsById.php`;

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
