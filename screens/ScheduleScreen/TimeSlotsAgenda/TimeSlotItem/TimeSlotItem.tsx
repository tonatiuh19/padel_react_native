import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { TimeSlotItemStyles } from "./TimeSlotItem.style";

interface TimeSlotItemProps {
  item: {
    active: number;
    name: string;
  };
  handlePress: (item: any) => void;
  formatTimeRange: (timeRange: string) => string;
}

const TimeSlotItem: React.FC<TimeSlotItemProps> = ({
  item,
  handlePress,
  formatTimeRange,
}) => {
  return (
    <TouchableOpacity
      onPress={() => handlePress(item)}
      style={[
        TimeSlotItemStyles.item,
        item.active === 1
          ? TimeSlotItemStyles.activeItem
          : item.active === 2
          ? TimeSlotItemStyles.idleItem
          : TimeSlotItemStyles.emptyItem,
      ]}
    >
      <Text>{formatTimeRange(item.name)}</Text>
    </TouchableOpacity>
  );
};

export default React.memo(TimeSlotItem);
