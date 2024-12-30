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
    bottom: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#e1dd2a",
    borderRadius: 22,
    elevation: 5,
  },
  fabText: {
    color: "#000",
    fontSize: 20,
    marginLeft: 10,
    fontFamily: "Kanit-Regular",
  },
  customHeaderContainer: {
    backgroundColor: '#e1dd2a',
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
    borderRadius: 22,
  },
  customHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});

export const TimeSlotsAgendaCalendarTheme = {
  backgroundColor: "#ffffff",
  calendarBackground: "#ffffff",
  textSectionTitleColor: "#000",
  textSectionTitleDisabledColor: "#e5e8d9",
  selectedDayBackgroundColor: "#e1dd2a",
  selectedDayTextColor: "#000",
  todayTextColor: "#e1dd2a",
  dayTextColor: "#2d4150",
  textDisabledColor: "#e5e8d9",
  dotColor: "#e1dd2a",
  selectedDotColor: "#000",
  arrowColor: "orange",
  disabledArrowColor: "#e5e8d9",
  monthTextColor: "#000",
  indicatorColor: "#000",
  textDayFontFamily: "Kanit-Regular",
  textMonthFontFamily: "Kanit-Regular",
  textDayHeaderFontFamily: "Kanit-Regular",
  textDayFontWeight: "300",
  textMonthFontWeight: "bold",
  textDayHeaderFontWeight: "300",
  textDayFontSize: 16,
  textMonthFontSize: 16,
  textDayHeaderFontSize: 16,
};
