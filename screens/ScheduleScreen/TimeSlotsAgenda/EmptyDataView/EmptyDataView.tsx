import React, { useEffect } from "react";
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
import { setIsDayEmpty, setMarkedActiveDay } from "../../../../store/appSlice";
import { selectMarkedActiveDay } from "../../../../store/selectors";

interface EmptyDataViewProps {
  onAddSlot: () => void;
  onRefresh: () => void;
  refreshing: boolean;
}

const EmptyDataView: React.FC<EmptyDataViewProps> = ({
  onAddSlot,
  onRefresh,
  refreshing,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const markedActiveDay = useSelector(selectMarkedActiveDay);

  useEffect(() => {
    dispatch(setIsDayEmpty(true));

    return () => {
      // Cleanup function to reset the state when the component is unmounted
      dispatch(setIsDayEmpty(false));
      dispatch(setMarkedActiveDay(0));
    };
  }, [dispatch]);

  return (
    <ScrollView
      contentContainerStyle={EmptyDataViewStyles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {markedActiveDay === 0 ? (
        <>
          <Text style={EmptyDataViewStyles.text}>Este dia esta libre</Text>
          <TouchableOpacity
            style={EmptyDataViewStyles.button}
            onPress={onAddSlot}
          >
            <Text style={EmptyDataViewStyles.buttonText}>Agendar cancha</Text>
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
            onPress={onAddSlot}
          >
            <Text style={EmptyDataViewStyles.buttonText}>Agendar cancha</Text>
          </TouchableOpacity>
        </>
      ) : markedActiveDay === 3 ? (
        <>
          <Text style={EmptyDataViewStyles.text}>
            Esta cancha tiene eventos especiales programados
          </Text>
          <TouchableOpacity
            style={EmptyDataViewStyles.buttonSpecial}
            onPress={onAddSlot}
          >
            <Text style={EmptyDataViewStyles.buttonText}>Agendar cancha</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={EmptyDataViewStyles.buttonSpecial}
            onPress={onAddSlot}
          >
            <Text style={EmptyDataViewStyles.buttonText}>Inscripción a evento</Text>
          </TouchableOpacity>
        </>
      ) : null}
    </ScrollView>
  );
};

export default EmptyDataView;
