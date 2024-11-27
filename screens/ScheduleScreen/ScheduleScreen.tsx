import React, { useEffect, useState } from "react";
import { View, RefreshControl } from "react-native";
import { ScheduleScreenStyles } from "./ScheduleScreen.style";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/AppNavigator/AppNavigator";
import TimeSlotsAgenda from "./TimeSlotsAgenda/TimeSlotsAgenda";
import {
  selectDisabledSlots,
  selectPlatformsFields,
} from "../../store/selectors";
import { AppDispatch } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlatformsFields } from "../../store/effects";
import { getTodayDate, isEmptyObject } from "../../utils/UtilsFunctions";

type ScheduleScreenRouteProp = RouteProp<RootStackParamList, "Schedule">;

const ScheduleScreen: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const platformsFields = useSelector(selectPlatformsFields);
  const disabledSlots = useSelector(selectDisabledSlots);
  const [refreshing, setRefreshing] = useState(false);

  const route = useRoute<ScheduleScreenRouteProp>();
  const { today, id_platforms_field } = route.params;

  useEffect(() => {
    console.log("Platforms Fields", getTodayDate());
    dispatch(fetchPlatformsFields(id_platforms_field, getTodayDate()));
  }, [dispatch, id_platforms_field]);

  const onRefresh = () => {
    console.log("Refreshing", disabledSlots.today);
    setRefreshing(true);
    dispatch(
      fetchPlatformsFields(id_platforms_field, disabledSlots.today)
    ).finally(() => {
      setRefreshing(false);
    });
  };

  const handleDayPress = (day: string) => {
    setRefreshing(true);
    dispatch(fetchPlatformsFields(id_platforms_field, day)).finally(() => {
      setRefreshing(false);
    });
  };

  return (
    <View style={ScheduleScreenStyles.container}>
      <TimeSlotsAgenda
        items={
          isEmptyObject(platformsFields.slots) ? {} : platformsFields.slots
        }
        markedDates={platformsFields.markedDates}
        today={today}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onRefresh={onRefresh}
        refreshing={refreshing}
        onDayPress={handleDayPress}
      />
    </View>
  );
};

export default ScheduleScreen;
