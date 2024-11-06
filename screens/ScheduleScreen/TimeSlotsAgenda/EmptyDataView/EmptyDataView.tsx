import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { EmptyDataViewStyles } from "./EmptyDataView.style";

interface EmptyDataViewProps {
  onAddSlot: () => void;
}

const EmptyDataView: React.FC<EmptyDataViewProps> = ({ onAddSlot }) => {
  return (
    <View style={EmptyDataViewStyles.container}>
      <Text style={EmptyDataViewStyles.text}>Este dia esta libre</Text>
      <TouchableOpacity style={EmptyDataViewStyles.button} onPress={onAddSlot}>
        <Text style={EmptyDataViewStyles.buttonText}>Agendar cancha</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EmptyDataView;
