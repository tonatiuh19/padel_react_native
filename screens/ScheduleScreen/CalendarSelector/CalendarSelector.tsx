import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CalendarSelectorProps {
  currentMonth: Date;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export default function CalendarSelector({
  currentMonth,
  selectedDate,
  onDateSelect,
  onPreviousMonth,
  onNextMonth,
}: CalendarSelectorProps) {
  const formatMonthYear = (date: Date): string => {
    const months = [
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
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const startOfDay = (date: Date): Date => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };

  const generateCalendarDays = (): Date[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days: Date[] = [];

    // Add empty slots for days before month starts (adjust for Monday start)
    const adjustedStart = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;
    for (let i = 0; i < adjustedStart; i++) {
      days.push(new Date(year, month, -adjustedStart + i + 1));
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    // Add days from next month to complete the grid (6 rows)
    const remainingSlots = 42 - days.length;
    for (let i = 1; i <= remainingSlots; i++) {
      days.push(new Date(year, month + 1, i));
    }

    return days;
  };

  const weekDays = ["L", "M", "M", "J", "V", "S", "D"];

  return (
    <View style={styles.container}>
      {/* Month Navigation */}
      <View style={styles.header}>
        <Text style={styles.monthYear}>{formatMonthYear(currentMonth)}</Text>
        <View style={styles.navigation}>
          <TouchableOpacity style={styles.navButton} onPress={onPreviousMonth}>
            <Ionicons name="chevron-back" size={24} color="#8c8a1a" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={onNextMonth}>
            <Ionicons name="chevron-forward" size={24} color="#8c8a1a" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Weekday Headers */}
      <View style={styles.weekDaysContainer}>
        {weekDays.map((day, index) => (
          <View key={index} style={styles.weekDay}>
            <Text style={styles.weekDayText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar Grid */}
      <View style={styles.calendarGrid}>
        {generateCalendarDays().map((date, index) => {
          const isSelected = isSameDay(date, selectedDate);
          const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
          const isPast =
            date < startOfDay(new Date()) && !isSameDay(date, new Date());
          const isToday = isSameDay(date, new Date());

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayButton,
                isSelected && styles.dayButtonSelected,
                isToday && !isSelected && styles.dayButtonToday,
                (isPast || !isCurrentMonth) && styles.dayButtonDisabled,
              ]}
              onPress={() => !isPast && isCurrentMonth && onDateSelect(date)}
              disabled={isPast || !isCurrentMonth}
            >
              <Text
                style={[
                  styles.dayText,
                  isSelected && styles.dayTextSelected,
                  (isPast || !isCurrentMonth) && styles.dayTextDisabled,
                ]}
              >
                {date.getDate()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#374151",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  monthYear: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
  },
  navigation: {
    flexDirection: "row",
    gap: 8,
  },
  navButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#374151",
    borderRadius: 8,
  },
  weekDaysContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  weekDay: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9ca3af",
    textTransform: "uppercase",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayButton: {
    width: "14.28%", // 100% / 7 days
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginVertical: 2,
  },
  dayButtonSelected: {
    backgroundColor: "#8c8a1a",
  },
  dayButtonToday: {
    borderWidth: 2,
    borderColor: "#8c8a1a",
  },
  dayButtonDisabled: {
    opacity: 0.3,
  },
  dayText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#ffffff",
  },
  dayTextSelected: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  dayTextDisabled: {
    color: "#6b7280",
  },
});
