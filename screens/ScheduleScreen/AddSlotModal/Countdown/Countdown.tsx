import React, { useEffect, useState } from "react";
import { View, Text, ViewStyle, TextStyle } from "react-native";
import { CountdownLoginStyles, CountdownStyles } from "./Countdown.style";

interface CountdownProps {
  duration: number; // Duration in seconds
  onComplete: () => void;
  reset?: boolean; // Optional prop to reset the timer
  style?: {
    container?: ViewStyle;
    timerText?: TextStyle;
    timerTextRed?: TextStyle;
  };
  isCheckout?: boolean;
  isEvent?: boolean;
  isLogin?: boolean; // Optional prop for login screen
}

const Countdown: React.FC<CountdownProps> = ({
  duration,
  onComplete,
  reset,
  style,
  isCheckout = false,
  isEvent = false,
  isLogin = false,
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

  const styles = isLogin ? CountdownLoginStyles : CountdownStyles;

  return (
    <View style={[styles.container, style?.container]}>
      {isCheckout && (
        <Text style={[styles.timerTextTitle]}>
          {isEvent
            ? "Tienes el siguiente tiempo para completar tu registro:"
            : "Tiempo restante para reservar:"}
        </Text>
      )}
      <Text
        style={[
          styles.timerText,
          style?.timerText,
          timeLeft < 60 && [styles.timerTextRed, style?.timerTextRed],
        ]}
      >
        {formatTime(timeLeft)}
      </Text>
    </View>
  );
};

export default Countdown;
