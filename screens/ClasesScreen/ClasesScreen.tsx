import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import ClasesScreenStyles from "./ClasesScreen.style";
import { AppDispatch } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import {
  selectClasses,
  selectClassesReservations,
  selectDisabledSlots,
  selectPlatformFields,
} from "../../store/selectors";
import {
  getClassesByIdPlatform,
  getClassesByUserId,
} from "../../store/effects";
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { PlatformsField } from "../HomeScreen/HomeScreen.model";
import { RootStackParamList } from "../../navigation/AppNavigator/AppNavigator";
import ReservationEventCard from "../ReservationsScreen/ReservationCard/ReservationEventCard";
import { setisScheduleClass } from "../../store/appSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ClassReservationCard from "./ClassReservationCard/ClassReservationCard";

const ClasesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch: AppDispatch = useDispatch();
  const classes = useSelector(selectClasses);
  const disabledSlots = useSelector(selectDisabledSlots);
  const platformFields = useSelector(selectPlatformFields);
  const classesReservations = useSelector(selectClassesReservations);
  const [refreshing, setRefreshing] = useState(false);
  const [isThereAnyClass, setIsThereAnyClass] = useState(false);

  const fetchClasses = async () => {
    try {
      dispatch(setisScheduleClass(true));
      await dispatch(getClassesByIdPlatform(1));
    } catch (error) {
      console.error("Failed to refresh reservations", error);
    }
  };

  const fetchClassesReservations = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("id_platforms_user");
      if (storedUserId) {
        await dispatch(getClassesByUserId(Number(storedUserId)));
      }
    } catch (error) {
      console.error("Failed to refresh reservations", error);
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchClassesReservations();
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      fetchClasses();
      fetchClassesReservations();
    }, [])
  );

  useEffect(() => {
    if (classes.length > 0) {
      setIsThereAnyClass(true);
    } else {
      setIsThereAnyClass(false);
    }
  }, [classes]);

  const onRefresh = async () => {
    console.log("Refreshing", disabledSlots.today);
    setRefreshing(true);
    await fetchClassesReservations();
    dispatch(getClassesByIdPlatform(1)).finally(() => {
      setRefreshing(false);
    });
  };

  const handlePress = (field: PlatformsField) => {
    navigation.navigate("Schedule", field);
  };

  const isFieldInClasses = (fieldId: number) => {
    const currentDateTime = new Date();
    return classes.some((cls) => {
      const classDateTime = new Date(cls.start_date_time); // Parse the class start date and time
      return (
        cls.id_platforms_field === fieldId && classDateTime >= currentDateTime
      );
    });
  };

  return (
    <View style={ClasesScreenStyles.container}>
      <ScrollView
        contentContainerStyle={
          classesReservations.length === 0
            ? ClasesScreenStyles.scrollContainerEmpty
            : ClasesScreenStyles.scrollContainer
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {classesReservations.length === 0 ? (
          <View style={ClasesScreenStyles.cardReservationEmpty}>
            <Text style={ClasesScreenStyles.cardReservationText}>
              Aún no tienes clases reservadas
            </Text>
            {platformFields.map((field: PlatformsField) => {
              const isDisabled = isFieldInClasses(field.id_platforms_field);
              return (
                <TouchableOpacity
                  key={field.id_platforms_field}
                  style={[
                    ClasesScreenStyles.buttonReservation,
                    isDisabled && ClasesScreenStyles.buttonDisabled, // Apply disabled style
                  ]}
                  onPress={() => handlePress(field)} // Pass isClass as true
                  disabled={isDisabled} // Disable the button if not in classes
                >
                  <Text
                    style={[
                      ClasesScreenStyles.buttonReservationText,
                      isDisabled && ClasesScreenStyles.textDisabled, // Apply disabled text style
                    ]}
                  >
                    Reservar en Cancha {field.id_platforms_field}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <>
            {classesReservations.map((classReservation, index) => (
              <ClassReservationCard
                key={index}
                classReservation={classReservation}
              />
            ))}
          </>
        )}
      </ScrollView>
      {classesReservations.length > 0 && (
        <View style={ClasesScreenStyles.buttonContainer}>
          {platformFields.map((field: PlatformsField) => {
            const isDisabled = isFieldInClasses(field.id_platforms_field);
            return (
              <TouchableOpacity
                key={field.id_platforms_field}
                style={[
                  ClasesScreenStyles.actionButton,
                  isDisabled && ClasesScreenStyles.actionButtondisabled, // Apply disabled style
                ]}
                onPress={() => handlePress(field)}
                disabled={isDisabled}
              >
                <Text
                  style={[
                    ClasesScreenStyles.actionButtonText,
                    isDisabled && ClasesScreenStyles.actionButtonTextDisabled, // Apply disabled text style
                  ]}
                >
                  Reservar en Cancha {field.id_platforms_field}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default ClasesScreen;
