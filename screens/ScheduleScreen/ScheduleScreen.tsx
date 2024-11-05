import React from "react";
import { View, Text } from "react-native";
import { ScheduleScreenStyles } from "./ScheduleScreen.style";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/AppNavigator/AppNavigator";

type ScheduleScreenRouteProp = RouteProp<RootStackParamList, "Schedule">;

const ScheduleScreen: React.FC = () => {
  const route = useRoute<ScheduleScreenRouteProp>();
  const { id_platforms_field } = route.params;

  return (
    <View style={ScheduleScreenStyles.container}>
      <Text style={ScheduleScreenStyles.title}>
        Schedule for {id_platforms_field}
      </Text>
      {/* Add your scheduling or reservation logic here */}
    </View>
  );
};

export default ScheduleScreen;
