import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, RefreshControl } from "react-native";
import { Agenda, LocaleConfig, AgendaList } from "react-native-calendars";
import {
  TimeSlotsAgendaCalendarTheme,
  TimeSlotsAgendaStyles,
} from "./TimeSlotsAgenda.styles";
import { KnobButton } from "./KnobButton/KnobButton";
import TimeSlotItem from "./TimeSlotItem/TimeSlotItem";
import EmptyDataView from "./EmptyDataView/EmptyDataView";
import { FontAwesome6 } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { selectIsDayEmpty } from "../../../store/selectors";
import { MarkedDate } from "../../HomeScreen/HomeScreen.model";

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
}

const TimeSlotsAgenda: React.FC<TimeSlotsAgendaProps> = ({
  items,
  markedDates,
  today,
  refreshControl,
  onRefresh,
  refreshing,
}) => {
  const isDayEmpty = useSelector(selectIsDayEmpty);

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

  const handleAddSlot = () => {
    console.log("Add new slot");
  };

  const now = new Date(today);
  const minDate = now.toISOString().split("T")[0];
  const maxDate = new Date(now.setDate(now.getDate() + 30))
    .toISOString()
    .split("T")[0];

  useEffect(() => {
    console.log("Today", today);
    console.log("Now", now);
  }, []);

  return (
    <View style={{ flex: 1 }}>
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
        agendaKnobColor="black"
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
        futureScrollRange={1}
        onDayPress={(day: any) => {
          console.log("Day pressed", day);
          onRefresh();
        }}
        markedDates={markedDates}
      />
      {!isDayEmpty && (
        <TouchableOpacity
          style={TimeSlotsAgendaStyles.fab}
          onPress={handleAddSlot}
        >
          <FontAwesome6 name="plus" size={16} color="#000" />
          <Text style={TimeSlotsAgendaStyles.fabText}>Agendar cancha</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default TimeSlotsAgenda;
