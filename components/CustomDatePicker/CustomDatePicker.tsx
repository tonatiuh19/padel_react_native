import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

interface CustomDatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  onClose: () => void;
}

const { height } = Dimensions.get("window");

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  onClose,
}) => {
  const [selectedDate, setSelectedDate] = useState(value);
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 100;
  const endYear = currentYear - 13; // Minimum age 13

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

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  ).reverse();
  const days = Array.from(
    {
      length: getDaysInMonth(
        selectedDate.getMonth(),
        selectedDate.getFullYear()
      ),
    },
    (_, i) => i + 1
  );

  const handleConfirm = () => {
    onChange(selectedDate);
    onClose();
  };

  const updateDate = (type: "day" | "month" | "year", value: number) => {
    const newDate = new Date(selectedDate);

    if (type === "day") {
      newDate.setDate(value);
    } else if (type === "month") {
      newDate.setMonth(value);
      // Adjust day if it exceeds the days in the new month
      const maxDays = getDaysInMonth(value, newDate.getFullYear());
      if (newDate.getDate() > maxDays) {
        newDate.setDate(maxDays);
      }
    } else if (type === "year") {
      newDate.setFullYear(value);
    }

    setSelectedDate(newDate);
  };

  const PickerColumn = ({
    data,
    selectedValue,
    onValueChange,
    label,
  }: {
    data: (string | number)[];
    selectedValue: string | number;
    onValueChange: (value: any) => void;
    label?: string;
  }) => {
    const scrollViewRef = React.useRef<ScrollView>(null);
    const [contentHeight, setContentHeight] = useState(0);

    React.useEffect(() => {
      // Scroll to selected item after layout
      if (contentHeight > 0) {
        const selectedIndex = data.findIndex((item) => item === selectedValue);
        if (selectedIndex !== -1 && scrollViewRef.current) {
          scrollViewRef.current.scrollTo({
            y: selectedIndex * 50,
            animated: true,
          });
        }
      }
    }, [selectedValue, contentHeight]);

    return (
      <View style={styles.pickerColumn}>
        {label && <Text style={styles.columnLabel}>{label}</Text>}
        <View style={styles.pickerWrapper}>
          <View style={styles.selectedOverlay}>
            <LinearGradient
              colors={["rgba(225, 221, 42, 0.1)", "rgba(225, 221, 42, 0.2)"]}
              style={styles.selectedGradient}
            />
          </View>
          <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            snapToInterval={50}
            decelerationRate="fast"
            onContentSizeChange={(_, height) => setContentHeight(height)}
          >
            <View style={styles.scrollPadding} />
            {data.map((item, index) => {
              const isSelected = item === selectedValue;
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.pickerItem}
                  onPress={() => onValueChange(item)}
                >
                  <Animated.Text
                    style={[
                      styles.pickerText,
                      isSelected && styles.pickerTextSelected,
                    ]}
                  >
                    {item}
                  </Animated.Text>
                </TouchableOpacity>
              );
            })}
            <View style={styles.scrollPadding} />
          </ScrollView>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      />
      <View style={styles.pickerContainer}>
        <LinearGradient colors={["#1a1a1a", "#000000"]} style={styles.gradient}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color="#e1dd2a" />
            </TouchableOpacity>
            <Text style={styles.title}>Fecha de Nacimiento</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Date Display */}
          <View style={styles.dateDisplay}>
            <Feather name="calendar" size={32} color="#e1dd2a" />
            <Text style={styles.dateText}>
              {selectedDate.getDate()} de {months[selectedDate.getMonth()]} de{" "}
              {selectedDate.getFullYear()}
            </Text>
          </View>

          {/* Pickers */}
          <View style={styles.pickersContainer}>
            <PickerColumn
              label="Día"
              data={days}
              selectedValue={selectedDate.getDate()}
              onValueChange={(value) => updateDate("day", value)}
            />
            <PickerColumn
              label="Mes"
              data={months}
              selectedValue={months[selectedDate.getMonth()]}
              onValueChange={(value) =>
                updateDate("month", months.indexOf(value))
              }
            />
            <PickerColumn
              label="Año"
              data={years}
              selectedValue={selectedDate.getFullYear()}
              onValueChange={(value) => updateDate("year", value)}
            />
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
              <Text style={styles.secondaryButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
            >
              <LinearGradient
                colors={["#e1dd2a", "#c7c321"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    zIndex: 1000,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  pickerContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    shadowColor: "#e1dd2a",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 20,
  },
  gradient: {
    paddingTop: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e1dd2a",
    letterSpacing: 0.5,
  },
  placeholder: {
    width: 40,
  },
  dateDisplay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 24,
    gap: 12,
  },
  dateText: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "600",
  },
  pickersContainer: {
    flexDirection: "row",
    height: 200,
    paddingHorizontal: 12,
    marginVertical: 16,
  },
  pickerColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  columnLabel: {
    fontSize: 12,
    color: "#e1dd2a",
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  pickerWrapper: {
    height: 200,
    position: "relative",
  },
  selectedOverlay: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    height: 50,
    marginTop: -25,
    zIndex: 1,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(225, 221, 42, 0.3)",
  },
  selectedGradient: {
    flex: 1,
    borderRadius: 10,
  },
  scrollPadding: {
    height: 75,
  },
  pickerItem: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  pickerText: {
    fontSize: 16,
    color: "#666666",
    fontWeight: "500",
  },
  pickerTextSelected: {
    fontSize: 20,
    color: "#e1dd2a",
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 8,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#333333",
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#e1dd2a",
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButton: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});

export default CustomDatePicker;
