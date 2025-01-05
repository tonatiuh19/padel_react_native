import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  Platform,
} from "react-native";
import { Agenda, LocaleConfig, AgendaList } from "react-native-calendars";
import {
  TimeSlotsAgendaCalendarTheme,
  TimeSlotsAgendaStyles,
} from "./TimeSlotsAgenda.styles";
import { KnobButton } from "./KnobButton/KnobButton";
import TimeSlotItem from "./TimeSlotItem/TimeSlotItem";
import EmptyDataView from "./EmptyDataView/EmptyDataView";
import { FontAwesome6 } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  selectDisabledSlots,
  selectEventPrice,
  selectIsDayEmpty,
  selectPlatformsFields,
} from "../../../store/selectors";
import { MarkedDate } from "../../HomeScreen/HomeScreen.model";
import { AppDispatch } from "../../../store";
import { setMarkedActiveDay, setSelectedDay } from "../../../store/appSlice";
import AddSlotModal from "../AddSlotModal/AddSlotModal";
import { getDisabledSlots } from "../../../utils/UtilsFunctions";
import { getEventPricebyDateAndIdPlatform } from "../../../store/effects";

LocaleConfig.locales["es"] = {
  monthNames: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],
  monthNamesShort: [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ],
  dayNames: [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ],
  dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
  today: "Hoy",
};
LocaleConfig.defaultLocale = "es";

interface TimeSlotsAgendaProps {
  items: Record<string, { active: number; height: number; name: string }[]>;
  markedDates: { [key: string]: MarkedDate };
  today: string;
  refreshControl?: React.ReactNode;
  onRefresh: () => void;
  refreshing: boolean;
  onDayPress: (day: string) => void;
}

const TimeSlotsAgenda: React.FC<TimeSlotsAgendaProps> = ({
  items,
  markedDates,
  today,
  refreshControl,
  onRefresh,
  refreshing,
  onDayPress,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const platformsFields = useSelector(selectPlatformsFields);
  const isDayEmpty = useSelector(selectIsDayEmpty);
  const disabledSlots = useSelector(selectDisabledSlots);
  const eventPrice = useSelector(selectEventPrice);
  const [modalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState(today);
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);
  const [isEvent, setIsEvent] = useState(false);

  const formatTimeRange = (timeRange: string): string => {
    const [start, end] = timeRange
      .split(" - ")
      .map((dateStr) => new Date(dateStr));
    const formatTime = (date: Date) => {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? "pm" : "am";
      const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      return `${formattedHours}:${formattedMinutes} ${ampm}`;
    };
    return `${formatTime(start)} - ${formatTime(end)}`;
  };

  const handlePress = (item: any) => {
    console.log("handlePress", item);
  };

  const now = new Date(today);
  const minDate = now.toISOString().split("T")[0];
  const maxDate = new Date(now.setDate(now.getDate() + 30))
    .toISOString()
    .split("T")[0];

  const handleAddSlot = (isSpecialEvent: boolean) => {
    if (isSpecialEvent) {
      dispatch(
        getEventPricebyDateAndIdPlatform(
          platformsFields.id_platforms_field,
          disabledSlots.today
        )
      );
    }
    setIsEvent(isSpecialEvent);
    setModalVisible(true);
  };

  const getActiveStatus = (
    markedDates: { [key: string]: MarkedDate },
    date: {
      dateString: string;
      day: number;
      month: number;
      timestamp: number;
      year: number;
    }
  ) => {
    if (markedDates[date.dateString]) {
      dispatch(setMarkedActiveDay(markedDates[date.dateString].active));
    } else {
      dispatch(setMarkedActiveDay(0));
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    if (today === date) {
      dispatch(setSelectedDay(today));
      getActiveStatus(platformsFields.markedDates, {
        dateString: today,
        day: 0,
        month: 0,
        timestamp: 0,
        year: 0,
      });
    }
  }, [platformsFields]);

  useEffect(() => {
    const hasActive3 = Object.keys(markedDates).some((key) => {
      return markedDates[key].active === 3 && key === date;
    });
    if (hasActive3) {
      console.log(
        "There is an active day with value 3 and matching start_date_time"
      );
      setIsEvent(true);
    } else {
      setIsEvent(false);
    }
  }, [markedDates, date]);

  const CustomHeader = (date: any) => {
    return (
      <View style={TimeSlotsAgendaStyles.customHeaderContainer}>
        <Text style={TimeSlotsAgendaStyles.customHeaderText}>
          {date.date.toString("MMMM yyyy")}
        </Text>
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        paddingBottom: Platform.OS === "ios" ? 20 : 0,
        backgroundColor: "#fff",
      }}
    >
      <Agenda
        items={items}
        renderItem={(item: any) => (
          <TimeSlotItem
            item={item}
            handlePress={handlePress}
            formatTimeRange={formatTimeRange}
          />
        )}
        style={TimeSlotsAgendaStyles.agenda}
        renderHeader={(date: any) => <CustomHeader date={date} />}
        renderEmptyDate={() => (
          <View>
            <Text>renderEmptyDate</Text>
          </View>
        )}
        renderKnob={() => <KnobButton />}
        renderEmptyData={() => (
          <EmptyDataView
            onAddSlot={handleAddSlot}
            onRefresh={onRefresh}
            refreshing={refreshing}
          />
        )}
        selected={today}
        minDate={minDate}
        maxDate={maxDate}
        refreshControl={refreshControl}
        showClosingKnob={true}
        theme={{
          ...TimeSlotsAgendaCalendarTheme,
        }}
        pastScrollRange={1}
        futureScrollRange={2}
        onDayPress={(day: any) => {
          //console.log("onDayPress", day);
          setDate(day.dateString);
          dispatch(setSelectedDay(day.dateString));
          getActiveStatus(markedDates, day);
          onDayPress(day.dateString);
        }}
        markedDates={markedDates}
        onCalendarToggled={(calendarOpened: boolean) => {
          setIsCalendarExpanded(calendarOpened);
        }}
      />
      {!isDayEmpty && !isCalendarExpanded && (
        <View style={TimeSlotsAgendaStyles.fabContainer}>
          <TouchableOpacity
            style={TimeSlotsAgendaStyles.fab}
            onPress={() => handleAddSlot(false)}
          >
            <FontAwesome6 name="plus" size={16} color="#000" />
            <Text style={TimeSlotsAgendaStyles.fabText}>Agendar cancha</Text>
          </TouchableOpacity>
          {isEvent && (
            <TouchableOpacity
              style={TimeSlotsAgendaStyles.fab}
              onPress={() => handleAddSlot(true)}
            >
              <FontAwesome6 name="calendar" size={16} color="#000" />
              <Text style={TimeSlotsAgendaStyles.fabText}>
                Registro a evento
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      <AddSlotModal
        visible={modalVisible}
        onClose={handleCloseModal}
        isEvent={isEvent}
      />
    </View>
  );
};

export default TimeSlotsAgenda;
