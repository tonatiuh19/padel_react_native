import React, { useEffect, useRef } from "react";
import { View, Animated, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LoadingMaskStyles } from "./LoadingMask.style";

interface LoadingMaskProps {
  isLoading: boolean;
}

const LoadingMask: React.FC<LoadingMaskProps> = ({ isLoading }) => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let rotateAnimation: Animated.CompositeAnimation;
    if (isLoading) {
      rotateAnimation = Animated.loop(
        Animated.timing(rotation, {
          toValue: 1,
          duration: 800, // Decrease duration to increase speed
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      rotateAnimation.start();
    } else {
      rotation.stopAnimation();
    }

    return () => {
      if (rotateAnimation) {
        rotateAnimation.stop();
      }
    };
  }, [isLoading, rotation]);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  if (!isLoading) {
    return null;
  }

  return (
    <View style={LoadingMaskStyles.overlay}>
      <Animated.View style={{ transform: [{ rotate }] }}>
        <Ionicons name="tennisball" size={64} color="#e1dd2a" />
      </Animated.View>
    </View>
  );
};

export default LoadingMask;
