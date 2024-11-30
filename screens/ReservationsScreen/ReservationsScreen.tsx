import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { ReservationsScreenStyles } from "./ReservationsScreen.style";
import { AppDispatch } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import {
  selectPlatformFields,
  selectReservations,
} from "../../store/selectors";
import { getReservationsByUserId } from "../../store/effects";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ReservationCardList from "./ReservationCard/ReservationCard";
import { PlatformsField } from "../HomeScreen/HomeScreen.model";
import {
  NavigationProp,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/AppNavigator/AppNavigator";

export default function ReservationsScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch: AppDispatch = useDispatch();
  const platformFields = useSelector(selectPlatformFields);
  const reservations = useSelector(selectReservations);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReservations = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("id_platforms_user");
      if (storedUserId) {
        await dispatch(getReservationsByUserId(Number(storedUserId)));
      }
    } catch (error) {
      console.error("Failed to refresh reservations", error);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      fetchReservations();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchReservations();
    setRefreshing(false);
  };

  const handlePress = (field: PlatformsField) => {
    navigation.navigate("Schedule", field);
  };

  return (
    <View style={ReservationsScreenStyles.container}>
      <ScrollView
        contentContainerStyle={
          reservations.length === 0
            ? ReservationsScreenStyles.scrollContainerEmpty
            : ReservationsScreenStyles.scrollContainer
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {reservations.length === 0 ? (
          <View style={ReservationsScreenStyles.cardReservationEmpty}>
            <Text style={ReservationsScreenStyles.cardReservationText}>
              Aún no tienes reservas
            </Text>
            {platformFields.map((field: PlatformsField) => (
              <TouchableOpacity
                key={field.id_platforms_field}
                style={ReservationsScreenStyles.buttonReservation}
                onPress={() => handlePress(field)}
              >
                <Text style={ReservationsScreenStyles.buttonReservationText}>
                  Reservar Cancha {field.id_platforms_field}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <>
            {reservations.map((reservation, index) => (
              <ReservationCardList key={index} reservation={reservation} />
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}
