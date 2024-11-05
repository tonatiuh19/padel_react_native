import React, { useEffect, useState } from "react";
import { RefreshControl, ScrollView } from "react-native";
import { HomeScreenStyles } from "./HomeScreen.style";
import ReservationCard from "./shared/components/ReservationCard/ReservationCard";
import { Layout } from "@ui-kitten/components";
import { selectPlatformFields } from "../../store/selectors";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlatformFields } from "../../store/effects";
import { AppDispatch } from "../../store";

export default function HomeScreen() {
  const dispatch: AppDispatch = useDispatch();
  const platformFields = useSelector(selectPlatformFields);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchPlatformFields(1));
  }, [dispatch]);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(fetchPlatformFields(1)).finally(() => {
      setRefreshing(false);
    });
  };

  return (
    <Layout style={HomeScreenStyles.container}>
      <ScrollView
        contentContainerStyle={HomeScreenStyles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {platformFields.map((field) => (
          <ReservationCard
            key={field.id_platforms_field}
            id_platforms_field={field.id_platforms_field}
            field={field.title}
            time="10:00 AM - 11:00 AM" // Example time, replace with actual data if available
            player="John Doe" // Example player, replace with actual data if available
            images={field.carrouselImages.map((image) => ({ uri: image.path }))}
          />
        ))}
      </ScrollView>
    </Layout>
  );
}
