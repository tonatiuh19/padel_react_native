import React, { useEffect, useState } from "react";
import { View, RefreshControl } from "react-native";
import { ScheduleScreenStyles } from "./ScheduleScreen.style";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/AppNavigator/AppNavigator";
import TimeSlotsAgenda from "./TimeSlotsAgenda/TimeSlotsAgenda";
import { selectPlatformsFields } from "../../store/selectors";
import { AppDispatch } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlatformsFields } from "../../store/effects";

type ScheduleScreenRouteProp = RouteProp<RootStackParamList, "Schedule">;

const ScheduleScreen: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const platformsFields = useSelector(selectPlatformsFields);
  const [refreshing, setRefreshing] = useState(false);

  const route = useRoute<ScheduleScreenRouteProp>();
  const { today, id_platforms_field } = route.params;

  useEffect(() => {
    dispatch(fetchPlatformsFields(id_platforms_field));
  }, [dispatch, id_platforms_field]);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(fetchPlatformsFields(id_platforms_field)).finally(() => {
      setRefreshing(false);
    });
  };

  return (
    <View style={ScheduleScreenStyles.container}>
      <TimeSlotsAgenda
        items={platformsFields.slots}
        markedDates={platformsFields.markedDates}
        today={today}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onRefresh={onRefresh}
        refreshing={refreshing}
      />
    </View>
  );
};

export default ScheduleScreen;
