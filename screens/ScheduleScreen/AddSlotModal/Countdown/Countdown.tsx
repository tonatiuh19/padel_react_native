import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { CountdownStyles } from "./Countdown.style";

interface CountdownProps {
  duration: number; // Duration in seconds
  onComplete: () => void;
}

const Countdown: React.FC<CountdownProps> = ({ duration, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

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
    <View style={CountdownStyles.container}>
      <Text
        style={[
          CountdownStyles.timerText,
          timeLeft < 60 && CountdownStyles.timerTextRed,
        ]}
      >
        {formatTime(timeLeft)}
      </Text>
    </View>
  );
};

export default Countdown;
