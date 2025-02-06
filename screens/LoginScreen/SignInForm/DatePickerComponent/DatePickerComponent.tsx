import React, { useState, useEffect } from "react";
import { LoginScreenStyles } from "../../LoginScreen.style";
import { View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";

interface DatePickerComponentProps {
  value: string;
  onChange: (date: string) => void;
  error: string | undefined;
  touched: boolean | undefined;
}

const DatePickerComponent: React.FC<DatePickerComponentProps> = ({
  value,
  onChange,
  error,
  touched,
}) => {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const years = Array.from({ length: 100 }, (_, i) =>
    (new Date().getFullYear() - i).toString()
  );

  useEffect(() => {
    if (day && month && year) {
      const selectedDate = new Date(`${year}-${month}-${day}`);
      onChange(selectedDate.toISOString().split("T")[0]);
    }
  }, [day, month, year]);

  return (
    <>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Picker
          selectedValue={day}
          style={{ height: 50, width: 100 }}
          onValueChange={(itemValue) => setDay(itemValue)}
        >
          <Picker.Item label="Day" value="" />
          {days.map((d) => (
            <Picker.Item key={d} label={d} value={d} />
          ))}
        </Picker>
        <Picker
          selectedValue={month}
          style={{ height: 50, width: 100 }}
          onValueChange={(itemValue) => setMonth(itemValue)}
        >
          <Picker.Item label="Month" value="" />
          {months.map((m) => (
            <Picker.Item key={m} label={m} value={m} />
          ))}
        </Picker>
        <Picker
          selectedValue={year}
          style={{ height: 50, width: 100 }}
          onValueChange={(itemValue) => setYear(itemValue)}
        >
          <Picker.Item label="Year" value="" />
          {years.map((y) => (
            <Picker.Item key={y} label={y} value={y} />
          ))}
        </Picker>
      </View>
      {error && touched && <Text style={LoginScreenStyles.error}>{error}</Text>}
    </>
  );
};

export default DatePickerComponent;
