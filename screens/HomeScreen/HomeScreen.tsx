import React, { useEffect, useState, useCallback } from "react";
import {
  RefreshControl,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { HomeScreenStyles, HomeScreenWidth } from "./HomeScreen.style";
import ReservationCard from "./shared/components/ReservationCard/ReservationCard";
import { Layout } from "@ui-kitten/components";
import {
  selectAds,
  selectLastReservation,
  selectPlatformFields,
  selectPlatformsFields,
} from "../../store/selectors";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPlatformFields,
  getAdsById,
  getUserInfoById,
} from "../../store/effects";
import { AppDispatch } from "../../store";
import Carousel from "react-native-reanimated-carousel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ReservationCardAds from "./shared/components/ReservationCardAds/ReservationCardAds";
import ReservationCardList from "../ReservationsScreen/ReservationCard/ReservationCard";
import {
  NavigationProp,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/AppNavigator/AppNavigator";
import { PlatformsField } from "./HomeScreen.model";

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch: AppDispatch = useDispatch();
  const platformFields = useSelector(selectPlatformFields);
  const lastReservation = useSelector(selectLastReservation);
  const ads = useSelector(selectAds);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState(0);

  const fetchUserInfo = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("id_platforms_user");
      if (storedUserId) {
        setUserId(Number(storedUserId));
        dispatch(getUserInfoById(Number(storedUserId)));
        dispatch(fetchPlatformFields(1, Number(storedUserId)));
      }
    } catch (error) {
      console.error("Failed to load user session", error);
    }
  };

  useEffect(() => {
    dispatch(getAdsById(1));
  }, [dispatch]);

  useEffect(() => {
    fetchUserInfo();
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      fetchUserInfo();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(fetchPlatformFields(1, userId)).finally(() => {
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

  const renderCarouselItemAd = ({ item }: { item: any }) => (
    <View
      style={{
        flex: 1,
        borderRadius: 22,
        justifyContent: "center",
      }}
    >
      <ReservationCardAds
        key={item.id_platforms_ad}
        id_platforms_ad={item.id_platforms_ad}
        platforms_ad_title={item.platforms_ad_title}
        platforms_ad_image={item.platforms_ad_image}
      />
    </View>
  );

  const handlePress = (field: PlatformsField) => {
    navigation.navigate("Schedule", field);
  };

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
            pagingEnabled={true}
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
        <View style={{ flex: 1 }}>
          <Carousel
            loop
            width={HomeScreenWidth}
            height={HomeScreenWidth / 2}
            autoPlay={true}
            data={ads}
            scrollAnimationDuration={2500}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 0.9,
              parallaxScrollingOffset: 50,
            }}
            renderItem={renderCarouselItemAd}
          />
        </View>
        <View style={{ flex: 1 }}>
          <View style={HomeScreenStyles.cardReservations}>
            {lastReservation ? (
              <>
                <Text style={HomeScreenStyles.cardReservationText}>
                  Tu próxima reserva:
                </Text>
                <ReservationCardList reservation={lastReservation} />
              </>
            ) : (
              <View style={HomeScreenStyles.cardReservationEmpty}>
                <Text style={HomeScreenStyles.cardReservationText}>
                  Aún no tienes reservas
                </Text>
                <Text style={HomeScreenStyles.cardNoReservationText}>
                  Selecciona una cancha para reservar en la sección de arriba
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
}
