import React, { useEffect, useState } from "react";
import { RefreshControl, ScrollView, View, Text } from "react-native";
import { HomeScreenStyles, HomeScreenWidth } from "./HomeScreen.style";
import ReservationCard from "./shared/components/ReservationCard/ReservationCard";
import { Layout } from "@ui-kitten/components";
import { selectPlatformFields } from "../../store/selectors";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlatformFields, getUserInfoById } from "../../store/effects";
import { AppDispatch } from "../../store";
import Carousel from "react-native-reanimated-carousel";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const dispatch: AppDispatch = useDispatch();
  const platformFields = useSelector(selectPlatformFields);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchPlatformFields(1));
  }, [dispatch]);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("id_platforms_user");
        if (storedUserId) {
          dispatch(getUserInfoById(Number(storedUserId)));
        }
      } catch (error) {
        console.error("Failed to load user session", error);
      }
    };

    getUserInfo();
  }, [dispatch]);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(fetchPlatformFields(1)).finally(() => {
      setRefreshing(false);
    });
  };

  const renderCarouselItem = ({ item }: { item: any }) => (
    <View
      style={{
        flex: 1,
        borderRadius: 22,
        justifyContent: "center",
      }}
    >
      <ReservationCard
        key={item.id_platforms_field}
        id_platforms_field={item.id_platforms_field}
        title={item.title}
        field={item}
        time="10:00 AM - 11:00 AM" // Example time, replace with actual data if available
        player="John Doe" // Example player, replace with actual data if available
        images={item.carrouselImages.map((image: any) => ({ uri: image.path }))}
      />
    </View>
  );

  return (
    <Layout style={HomeScreenStyles.container}>
      <ScrollView
        contentContainerStyle={HomeScreenStyles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ flex: 1 }}>
          <Carousel
            loop
            width={HomeScreenWidth}
            height={HomeScreenWidth / 2}
            autoPlay={true}
            data={platformFields}
            scrollAnimationDuration={1800}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 0.9,
              parallaxScrollingOffset: 50,
            }}
            renderItem={renderCarouselItem}
          />
        </View>
      </ScrollView>
    </Layout>
  );
}
