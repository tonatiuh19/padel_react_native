import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ReservationsScreen() {
  return (
    <View style={styles.container}>
      <Text>Reservations Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});