import React from "react";
import { View, StyleSheet } from "react-native";
import { CustomPaginationDotsStyles } from "./CustomPaginationDots.style";

interface CustomPaginationDotsProps {
  activeIndex: number;
  totalItems: number;
}

const CustomPaginationDots: React.FC<CustomPaginationDotsProps> = ({
  activeIndex,
  totalItems,
}) => {
  return (
    <View style={CustomPaginationDotsStyles.container}>
      {Array.from({ length: totalItems }).map((_, index) => (
        <View
          key={index}
          style={[
            CustomPaginationDotsStyles.dot,
            activeIndex === index
              ? CustomPaginationDotsStyles.activeDot
              : CustomPaginationDotsStyles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );
};

export default CustomPaginationDots;
