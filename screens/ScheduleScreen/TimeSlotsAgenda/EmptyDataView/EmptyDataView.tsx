import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import { EmptyDataViewStyles } from "./EmptyDataView.style";
import { AppDispatch } from "../../../../store";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsDayEmpty,
  setMarkedActiveDay,
  setSelectedClass,
} from "../../../../store/appSlice";
import {
  selectClasses,
  selectMarkedActiveDay,
} from "../../../../store/selectors";
import { getClassesByIdPlatform } from "../../../../store/effects";
import { isEmptyObject } from "../../../../utils/UtilsFunctions";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../../navigation/AppNavigator/AppNavigator";
import { ClassesModel } from "../../../HomeScreen/HomeScreen.model";

interface EmptyDataViewProps {
  onAddSlot: (isSpecialEvent: boolean) => void;
  isScheduleClass?: boolean;
  onRefresh: () => void;
  refreshing: boolean;
}

const EmptyDataView: React.FC<EmptyDataViewProps> = ({
  onAddSlot,
  isScheduleClass,
  onRefresh,
  refreshing,
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch: AppDispatch = useDispatch();
  const markedActiveDay = useSelector(selectMarkedActiveDay);
  const classes = useSelector(selectClasses);

  useEffect(() => {
    dispatch(setIsDayEmpty(true));

    return () => {
      // Cleanup function to reset the state when the component is unmounted
      dispatch(setIsDayEmpty(false));
      dispatch(setMarkedActiveDay(0));
    };
  }, [dispatch]);

  /*useEffect(() => {
    if (isEmptyObject(classes)) {
      navigation.navigate("Main");
    }
  }, [classes, navigation]);*/

  useEffect(() => {
    console.log("Marked Active Day", classes);
  }, [classes]);

  return (
    <ScrollView
      contentContainerStyle={EmptyDataViewStyles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {isScheduleClass ? (
        <>
          <Text style={EmptyDataViewStyles.text}>Classes disponibles</Text>
          {classes.map((item: ClassesModel, index) => (
            <TouchableOpacity
              key={index}
              style={EmptyDataViewStyles.buttonClass}
              onPress={() => {
                dispatch(setSelectedClass(item));
                onAddSlot(false);
              }}
            >
              <Text style={EmptyDataViewStyles.buttonText}>
                {item.event_title}
              </Text>
            </TouchableOpacity>
          ))}
        </>
      ) : (
        <>
          {markedActiveDay === 0 ? (
            <>
              <Text style={EmptyDataViewStyles.text}>Este dia esta libre</Text>
              <TouchableOpacity
                style={EmptyDataViewStyles.button}
                onPress={() => onAddSlot(false)}
              >
                <Text style={EmptyDataViewStyles.buttonText}>
                  Agendar cancha
                </Text>
              </TouchableOpacity>
            </>
          ) : markedActiveDay === 1 ? (
            <Text style={EmptyDataViewStyles.text}>
              Esta cancha permanecera cerrada todo el dia
            </Text>
          ) : markedActiveDay === 2 ? (
            <>
              <Text style={EmptyDataViewStyles.text}>
                Esta cancha permanecera cerrada parcialmente en ciertos horarios
              </Text>
              <TouchableOpacity
                style={EmptyDataViewStyles.button}
                onPress={() => onAddSlot(false)}
              >
                <Text style={EmptyDataViewStyles.buttonText}>
                  Agendar cancha
                </Text>
              </TouchableOpacity>
            </>
          ) : markedActiveDay === 3 ? (
            <>
              <Text style={EmptyDataViewStyles.text}>
                Esta cancha tiene eventos especiales programados
              </Text>
              <TouchableOpacity
                style={EmptyDataViewStyles.buttonSpecial}
                onPress={() => onAddSlot(false)}
              >
                <Text style={EmptyDataViewStyles.buttonText}>
                  Agendar cancha
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={EmptyDataViewStyles.buttonSpecial}
                onPress={() => onAddSlot(true)}
              >
                <Text style={EmptyDataViewStyles.buttonText}>
                  Inscripción a evento
                </Text>
              </TouchableOpacity>
              {isScheduleClass && (
                <TouchableOpacity
                  style={EmptyDataViewStyles.buttonSpecial}
                  onPress={() => onAddSlot(true)}
                >
                  <Text style={EmptyDataViewStyles.buttonText}>
                    Inscripción a clase
                  </Text>
                </TouchableOpacity>
              )}
            </>
          ) : null}
        </>
      )}
    </ScrollView>
  );
};

export default EmptyDataView;
