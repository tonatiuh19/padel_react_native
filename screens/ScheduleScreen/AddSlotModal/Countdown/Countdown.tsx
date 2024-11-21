import React, { useEffect, useState } from "react";
import { View, Text, ViewStyle, TextStyle } from "react-native";
import { CountdownStyles } from "./Countdown.style";

interface CountdownProps {
  duration: number; // Duration in seconds
  onComplete: () => void;
  reset?: boolean; // Optional prop to reset the timer
  style?: {
    container?: ViewStyle;
    timerText?: TextStyle;
    timerTextRed?: TextStyle;
  };
}

const Countdown: React.FC<CountdownProps> = ({
  duration,
  onComplete,
  reset,
  style,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (reset) {
      setTimeLeft(duration); // Reset the timer to the initial duration
    }
  }, [reset, duration]);

  useEffect(() => {
    if (timeLeft === 0) {
      onComplete();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, onComplete]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds
    }`;
  };

  return (
    <View style={[CountdownStyles.container, style?.container]}>
      <Text
        style={[
          CountdownStyles.timerText,
          style?.timerText,
          timeLeft < 60 && [CountdownStyles.timerTextRed, style?.timerTextRed],
        ]}
      >
        {formatTime(timeLeft)}
      </Text>
    </View>
  );
};

export default Countdown;
