import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ClasesScreenStyles from "./ClasesScreen.style";
import { AppDispatch } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import {
  selectClasses,
  selectClassesReservations,
  selectPlatformFields,
} from "../../store/selectors";
import type {
  ClassesModel,
  ClassesReservationModel,
  PlatformsField,
} from "../HomeScreen/HomeScreen.model";
import {
  getEvents,
  getUserPrivateClasses,
  getUserEventRegistrations,
} from "../../store/effects";
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/AppNavigator/AppNavigator";
import { setisScheduleClass } from "../../store/appSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ClassReservationCard from "./ClassReservationCard/ClassReservationCard";

const ClasesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();
  const classes = useSelector(selectClasses);
  const platformFields = useSelector(selectPlatformFields);
  const classesReservations = useSelector(selectClassesReservations);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedClassReservation, setSelectedClassReservation] =
    useState<ClassesReservationModel | null>(null);

  const fetchClasses = useCallback(async () => {
    try {
      dispatch(setisScheduleClass(true));
      await dispatch(getEvents(1));
    } catch (error) {
      console.error("Failed to refresh reservations", error);
    }
  }, [dispatch]);

  const fetchClassesReservations = useCallback(async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("id_platforms_user");
      if (storedUserId) {
        await dispatch(getUserPrivateClasses(Number(storedUserId)));
        await dispatch(getUserEventRegistrations(Number(storedUserId)));
      }
    } catch (error) {
      console.error("Failed to refresh reservations", error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchClasses();
    fetchClassesReservations();
  }, [fetchClasses, fetchClassesReservations]);

  useFocusEffect(
    useCallback(() => {
      fetchClasses();
      fetchClassesReservations();
    }, [fetchClasses, fetchClassesReservations])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchClassesReservations();
    Promise.resolve(dispatch(getEvents(1))).finally(() => {
      setRefreshing(false);
    });
  };

  const handleSchedulePress = () => {
    navigation.navigate("Schedule", { bookingType: "class" });
  };

  const sortClassReservations = (
    classReservations: ClassesReservationModel[]
  ): ClassesReservationModel[] => {
    return [...classReservations].sort(
      (a: ClassesReservationModel, b: ClassesReservationModel) => {
        const now = new Date();
        // Combine class_date and end_time to create full datetime
        const aEndTime = new Date(`${a.class_date}T${a.end_time}`);
        const bEndTime = new Date(`${b.class_date}T${b.end_time}`);

        const aExpired = now > aEndTime;
        const bExpired = now > bEndTime;

        if (aExpired && !bExpired) return 1;
        if (!aExpired && bExpired) return -1;

        return bEndTime.getTime() - aEndTime.getTime();
      }
    );
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
        {/* Header with Schedule Button */}
        <View style={ClasesScreenStyles.header}>
          <TouchableOpacity
            style={ClasesScreenStyles.scheduleButton}
            onPress={handleSchedulePress}
          >
            <View style={ClasesScreenStyles.scheduleButtonIcon}>
              <Ionicons name="add-circle" size={32} color="#e1dd2a" />
            </View>
            <View style={ClasesScreenStyles.scheduleButtonTextContainer}>
              <Text style={ClasesScreenStyles.scheduleButtonText}>
                Agendar Clase
              </Text>
              <Text style={ClasesScreenStyles.scheduleButtonSubtext}>
                Reserva una clase ahora
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {classesReservations.length === 0 ? (
          <View style={ClasesScreenStyles.emptyStateContainer}>
            <Ionicons name="calendar-outline" size={64} color="#6b7280" />
            <Text style={ClasesScreenStyles.emptyStateTitle}>
              No tienes clases reservadas
            </Text>
            <Text style={ClasesScreenStyles.emptyStateSubtitle}>
              Tus clases aparecerán aquí una vez que hagas tu primera reserva
            </Text>
            <TouchableOpacity
              style={ClasesScreenStyles.emptyStateButton}
              onPress={handleSchedulePress}
            >
              <Ionicons name="add-circle-outline" size={24} color="#ffffff" />
              <Text style={ClasesScreenStyles.emptyStateButtonText}>
                Agendar Clase
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={ClasesScreenStyles.sectionTitle}>Mis Clases</Text>
            {sortClassReservations(classesReservations).map(
              (classReservation: ClassesReservationModel, index: number) => (
                <ClassReservationCard
                  key={index}
                  classReservation={classReservation}
                  onViewDetails={() =>
                    setSelectedClassReservation(classReservation)
                  }
                />
              )
            )}
          </>
        )}
      </ScrollView>

      {/* Class Details Modal */}
      {selectedClassReservation && (
        <View style={ClasesScreenStyles.modalOverlay}>
          <View style={ClasesScreenStyles.modalContent}>
            <View style={ClasesScreenStyles.modalHeader}>
              <Text style={ClasesScreenStyles.modalTitle}>
                Detalles de Clase
              </Text>
              <TouchableOpacity
                onPress={() => setSelectedClassReservation(null)}
              >
                <Ionicons name="close-circle" size={32} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={ClasesScreenStyles.modalBody}>
              <View style={ClasesScreenStyles.modalSection}>
                <Text style={ClasesScreenStyles.modalSectionTitle}>
                  Información General
                </Text>
                <View style={ClasesScreenStyles.modalDetailRow}>
                  <Text style={ClasesScreenStyles.modalDetailLabel}>
                    Instructor
                  </Text>
                  <Text style={ClasesScreenStyles.modalDetailValue}>
                    {selectedClassReservation.instructor_name ||
                      "Por confirmar"}
                  </Text>
                </View>
                <View style={ClasesScreenStyles.modalDetailRow}>
                  <Text style={ClasesScreenStyles.modalDetailLabel}>
                    Cancha
                  </Text>
                  <Text style={ClasesScreenStyles.modalDetailValue}>
                    {selectedClassReservation.court_name || "Por confirmar"}
                  </Text>
                </View>
                <View style={ClasesScreenStyles.modalDetailRow}>
                  <Text style={ClasesScreenStyles.modalDetailLabel}>
                    Estado
                  </Text>
                  <View
                    style={[
                      ClasesScreenStyles.statusBadge,
                      {
                        backgroundColor: (() => {
                          const now = new Date();
                          const dateOnly =
                            selectedClassReservation.class_date.split("T")[0];
                          const classEndTime = new Date(
                            `${dateOnly}T${selectedClassReservation.end_time}`
                          );
                          if (now > classEndTime) return "#6b7280";
                          if (selectedClassReservation.status === "confirmed")
                            return "#10b981";
                          return "#f59e0b";
                        })(),
                      },
                    ]}
                  >
                    <Text style={ClasesScreenStyles.statusBadgeText}>
                      {(() => {
                        const now = new Date();
                        const dateOnly =
                          selectedClassReservation.class_date.split("T")[0];
                        const classEndTime = new Date(
                          `${dateOnly}T${selectedClassReservation.end_time}`
                        );
                        if (now > classEndTime) return "Expirada";
                        if (selectedClassReservation.status === "confirmed")
                          return "Confirmada";
                        return "Pendiente";
                      })()}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={ClasesScreenStyles.modalSection}>
                <Text style={ClasesScreenStyles.modalSectionTitle}>
                  Fecha y Hora
                </Text>
                <View style={ClasesScreenStyles.modalDetailRow}>
                  <Text style={ClasesScreenStyles.modalDetailLabel}>Fecha</Text>
                  <Text style={ClasesScreenStyles.modalDetailValue}>
                    {new Date(
                      selectedClassReservation.class_date.split("T")[0]
                    ).toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                </View>
                <View style={ClasesScreenStyles.modalDetailRow}>
                  <Text style={ClasesScreenStyles.modalDetailLabel}>
                    Hora de inicio
                  </Text>
                  <Text style={ClasesScreenStyles.modalDetailValue}>
                    {selectedClassReservation.start_time.substring(0, 5)}
                  </Text>
                </View>
                <View style={ClasesScreenStyles.modalDetailRow}>
                  <Text style={ClasesScreenStyles.modalDetailLabel}>
                    Hora de fin
                  </Text>
                  <Text style={ClasesScreenStyles.modalDetailValue}>
                    {selectedClassReservation.end_time.substring(0, 5)}
                  </Text>
                </View>
                <View style={ClasesScreenStyles.modalDetailRow}>
                  <Text style={ClasesScreenStyles.modalDetailLabel}>
                    Duración
                  </Text>
                  <Text style={ClasesScreenStyles.modalDetailValue}>
                    {selectedClassReservation.duration_minutes || 90} minutos
                  </Text>
                </View>
              </View>

              <View style={ClasesScreenStyles.modalSection}>
                <Text style={ClasesScreenStyles.modalSectionTitle}>Pago</Text>
                <View style={ClasesScreenStyles.modalDetailRow}>
                  <Text style={ClasesScreenStyles.modalDetailLabel}>Total</Text>
                  <Text style={ClasesScreenStyles.modalPriceValue}>
                    ${selectedClassReservation.total_price || "0"}
                  </Text>
                </View>
                <View style={ClasesScreenStyles.modalDetailRow}>
                  <Text style={ClasesScreenStyles.modalDetailLabel}>
                    Método de pago
                  </Text>
                  <Text style={ClasesScreenStyles.modalDetailValue}>
                    Tarjeta
                  </Text>
                </View>
                <View style={ClasesScreenStyles.modalDetailRow}>
                  <Text style={ClasesScreenStyles.modalDetailLabel}>
                    Estado de pago
                  </Text>
                  <Text
                    style={[
                      ClasesScreenStyles.modalDetailValue,
                      {
                        color:
                          selectedClassReservation.payment_status === "paid"
                            ? "#10b981"
                            : "#f59e0b",
                      },
                    ]}
                  >
                    {selectedClassReservation.payment_status === "paid"
                      ? "Pagado"
                      : "Pendiente"}
                  </Text>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={ClasesScreenStyles.modalCloseButton}
              onPress={() => setSelectedClassReservation(null)}
            >
              <Text style={ClasesScreenStyles.modalCloseButtonText}>
                Cerrar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default ClasesScreen;
