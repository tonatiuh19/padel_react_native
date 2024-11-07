import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const TimeSlotsAgendaStyles = StyleSheet.create({
  agenda: {
    width: width,
  },
  contentContainer: {
    marginTop: 1000,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#e1dd2a",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  fabText: {
    color: "#000",
    fontSize: 16,
    marginLeft: 10,
  },
});

export const TimeSlotsAgendaCalendarTheme = {
  backgroundColor: "#ffffff",
  calendarBackground: "#ffffff",
  textSectionTitleColor: "#b6c1cd",
  textSectionTitleDisabledColor: "#d9e1e8",
  selectedDayBackgroundColor: "#00adf5",
  selectedDayTextColor: "#ffffff",
  todayTextColor: "#00adf5",
  dayTextColor: "#2d4150",
  textDisabledColor: "#d9e1e8",
  dotColor: "#00adf5",
  selectedDotColor: "#ffffff",
  arrowColor: "orange",
  disabledArrowColor: "#d9e1e8",
  monthTextColor: "blue",
  indicatorColor: "blue",
  textDayFontFamily: "monospace",
  textMonthFontFamily: "monospace",
  textDayHeaderFontFamily: "monospace",
  textDayFontWeight: "300",
  textMonthFontWeight: "bold",
  textDayHeaderFontWeight: "300",
  textDayFontSize: 16,
  textMonthFontSize: 16,
  textDayHeaderFontSize: 16,
};
