import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const TimeSlotsAgendaStyles = StyleSheet.create({
  agenda: {
    width: width,
    backgroundColor: "#121212",
  },
  contentContainer: {
    marginTop: 1000,
    backgroundColor: "#121212",
  },
  fabContainer: {
    position: "absolute",
    right: 20,
    bottom: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  fab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#e1dd2a",
    borderRadius: 22,
    elevation: 5,
    marginBottom: 10,
  },

  fabText: {
    color: "#000",
    fontSize: 20,
    marginLeft: 10,
    fontFamily: "Kanit-Regular",
  },
  customHeaderContainer: {
    backgroundColor: "#e1dd2a",
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: "center",
    borderRadius: 22,
  },
  customHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});

export const TimeSlotsAgendaCalendarTheme = {
  backgroundColor: "#121212",
  calendarBackground: "#1e1e1e",
  textSectionTitleColor: "#ffffff",
  textSectionTitleDisabledColor: "#666666",
  selectedDayBackgroundColor: "#e1dd2a",
  selectedDayTextColor: "#000",
  todayTextColor: "#e1dd2a",
  dayTextColor: "#ffffff",
  textDisabledColor: "#666666",
  dotColor: "#e1dd2a",
  selectedDotColor: "#000",
  arrowColor: "#e1dd2a",
  disabledArrowColor: "#666666",
  monthTextColor: "#ffffff",
  indicatorColor: "#ffffff",
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
