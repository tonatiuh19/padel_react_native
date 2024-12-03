import React, { useEffect, useRef } from "react";
import { View, Animated, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LoadingSmallStyles } from "./LoadingSmall.style";

interface LoadingSmallProps {
  isLoading: boolean;
  color?: string; // Add color prop
}

const LoadingSmall: React.FC<LoadingSmallProps> = ({
  isLoading,
  color = "#e1dd2a",
}) => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isLoading) {
      rotation.setValue(0); // Reset the animation value
      const rotateAnimation = Animated.loop(
        Animated.timing(rotation, {
          toValue: 1,
          duration: 800, // Decrease duration to increase speed
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      rotateAnimation.start();
    } else {
      rotation.stopAnimation(); // Stop the animation
    }
  }, [isLoading, rotation]);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  if (!isLoading) {
    return null;
  }

  return (
    <Animated.View style={{ transform: [{ rotate }] }}>
      <Ionicons name="tennisball" size={34} color={color} />
    </Animated.View>
  );
};

export default LoadingSmall;