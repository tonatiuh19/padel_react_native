import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
} from "react-native";
import { ReservationsScreenStyles } from "./ReservationsScreen.style";
import { AppDispatch } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { selectReservations } from "../../store/selectors";
import { getReservationsByUserId } from "../../store/effects";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ReservationCard from "./ReservationCard/ReservationCard";

export default function ReservationsScreen() {
  const dispatch: AppDispatch = useDispatch();
  const reservations = useSelector(selectReservations);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("id_platforms_user");
        if (storedUserId) {
          dispatch(getReservationsByUserId(Number(storedUserId)));
        }
      } catch (error) {
        console.error("Failed to load user session", error);
      }
    };

    getUserInfo();
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const storedUserId = await AsyncStorage.getItem("id_platforms_user");
      if (storedUserId) {
        await dispatch(getReservationsByUserId(Number(storedUserId)));
      }
    } catch (error) {
      console.error("Failed to refresh reservations", error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View style={ReservationsScreenStyles.container}>
      <ScrollView
        contentContainerStyle={ReservationsScreenStyles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {reservations.map((reservation, index) => (
          <ReservationCard key={index} reservation={reservation} />
        ))}
      </ScrollView>
    </View>
  );
}
