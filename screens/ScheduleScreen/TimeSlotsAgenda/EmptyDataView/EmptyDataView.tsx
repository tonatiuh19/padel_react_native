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
import { useDispatch } from "react-redux";
import { setIsDayEmpty } from "../../../../store/appSlice";

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

  useEffect(() => {
    dispatch(setIsDayEmpty(true));

    return () => {
      // Cleanup function to reset the state when the component is unmounted
      dispatch(setIsDayEmpty(false));
    };
  }, [dispatch]);

  return (
    <ScrollView
      contentContainerStyle={EmptyDataViewStyles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={EmptyDataViewStyles.text}>Este dia esta libre</Text>
      <TouchableOpacity style={EmptyDataViewStyles.button} onPress={onAddSlot}>
        <Text style={EmptyDataViewStyles.buttonText}>Agendar cancha</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EmptyDataView;
