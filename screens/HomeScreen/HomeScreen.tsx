import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { HomeScreenStyles } from "./HomeScreen.style";
import ReservationCard from "./shared/components/ReservationCard/ReservationCard";
import { Layout } from "@ui-kitten/components";

export default function HomeScreen() {
  const reservations = [
    {
      id: 1,
      field: "Field 1",
      time: "10:00 AM - 11:00 AM",
      player: "John Doe",
      images: [
        { uri: "https://garbrix.com/padel/assets/images/padel_example.jpg" },
        { uri: "https://garbrix.com/padel/assets/images/padel_example_1.jpg" },
        { uri: "https://garbrix.com/padel/assets/images/padel_example_2.jpg" },
      ],
    },
    {
      id: 2,
      field: "Field 2",
      time: "11:00 AM - 12:00 PM",
      player: "Jane Smith",
      images: [
        { uri: "https://garbrix.com/padel/assets/images/padel_example.jpg" },
        { uri: "https://garbrix.com/padel/assets/images/padel_example_1.jpg" },
        { uri: "https://garbrix.com/padel/assets/images/padel_example_2.jpg" },
      ],
    },
    {
      id: 3,
      field: "Field 3",
      time: "12:00 PM - 01:00 PM",
      player: "Alice Johnson",
      images: [
        { uri: "https://garbrix.com/padel/assets/images/padel_example.jpg" },
        { uri: "https://garbrix.com/padel/assets/images/padel_example_1.jpg" },
        { uri: "https://garbrix.com/padel/assets/images/padel_example_2.jpg" },
      ],
    },
    // Add more reservations as needed
  ];

  return (
    <Layout style={HomeScreenStyles.container}>
      <ScrollView contentContainerStyle={HomeScreenStyles.scrollView}>
        {reservations.map((reservation) => (
          <ReservationCard
            key={reservation.id}
            field={reservation.field}
            time={reservation.time}
            player={reservation.player}
            images={reservation.images}
          />
        ))}
      </ScrollView>
    </Layout>
  );
}
