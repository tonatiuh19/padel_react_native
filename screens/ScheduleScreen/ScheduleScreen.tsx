import React, { useEffect, useState } from "react";
import { View, RefreshControl } from "react-native";
import { ScheduleScreenStyles } from "./ScheduleScreen.style";
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/AppNavigator/AppNavigator";
import TimeSlotsAgenda from "./TimeSlotsAgenda/TimeSlotsAgenda";
import {
  selectDisabledSlots,
  selectIsScheduleClass,
  selectPlatformsFields,
} from "../../store/selectors";
import { AppDispatch } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlatformsFields, getClassesByIdField } from "../../store/effects";
import { getTodayDate, isEmptyObject } from "../../utils/UtilsFunctions";
import { setisScheduleClass } from "../../store/appSlice";

type ScheduleScreenRouteProp = RouteProp<RootStackParamList, "Schedule">;

const ScheduleScreen: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const platformsFields = useSelector(selectPlatformsFields);
  const disabledSlots = useSelector(selectDisabledSlots);
  const isScheduleClass = useSelector(selectIsScheduleClass);
  const [refreshing, setRefreshing] = useState(false);

  const route = useRoute<ScheduleScreenRouteProp>();
  const { today, id_platforms_field } = route.params;

  useEffect(() => {
    dispatch(fetchPlatformsFields(id_platforms_field, getTodayDate()));
    if (!!isScheduleClass) {
      dispatch(getClassesByIdField(id_platforms_field));
    }
  }, [dispatch, id_platforms_field]);

  const onRefresh = () => {
    setRefreshing(true);

    if (!!isScheduleClass) {
      dispatch(getClassesByIdField(id_platforms_field));
    }

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
          isScheduleClass
            ? isEmptyObject(platformsFields.classes)
              ? {}
              : platformsFields.classes
            : isEmptyObject(platformsFields.slots)
            ? {}
            : platformsFields.slots
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
