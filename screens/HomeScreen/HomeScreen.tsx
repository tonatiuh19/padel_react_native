import React, { useEffect, useState, useCallback } from "react";
import {
  RefreshControl,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import {
  HomeScreenHeight,
  HomeScreenStyles,
  HomeScreenWidth,
} from "./HomeScreen.style";
import ReservationCard from "./shared/components/ReservationCard/ReservationCard";
import { Layout } from "@ui-kitten/components";
import {
  selectAds,
  selectHomeClasses,
  selectLastClass,
  selectLastReservation,
  selectPlatformFields,
  selectPlatformsFields,
  selectSections,
  selectSubscription,
} from "../../store/selectors";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPlatformFields,
  getAdsById,
  getPlatformSectionsById,
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
import CustomPaginationDots from "./shared/components/CustomPaginationDots/CustomPaginationDots";
import ActionCard from "./shared/components/ActionCard/ActionCard";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch: AppDispatch = useDispatch();
  const platformFields = useSelector(selectPlatformFields);
  const lastReservation = useSelector(selectLastReservation);
  const lastClass = useSelector(selectLastClass);
  const homeClasses = useSelector(selectHomeClasses);
  const ads = useSelector(selectAds);
  const subscription = useSelector(selectSubscription);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const fetchUserInfo = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("id_platforms_user");
      if (storedUserId) {
        setUserId(Number(storedUserId));
        dispatch(getUserInfoById(Number(storedUserId)));
        dispatch(fetchPlatformFields(1, Number(storedUserId)));
        dispatch(getPlatformSectionsById(1));
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

  const renderCarouselItem = ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }) => {
    return (
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
          images={item.carrouselImages.map((image: any) => ({
            uri: image.path,
          }))}
        />
      </View>
    );
  };

  const cardsData = [
    ...(lastReservation
      ? [
          {
            id: 1,
            icon: "calendar" as keyof typeof Ionicons.glyphMap,
            title: "Tu próxima reserva",
            subtitle: lastReservation.title,
            reservation: lastReservation,
            isTicketModal: true,
          },
        ]
      : []),
    ...(lastClass
      ? [
          {
            id: 2,
            icon: "school" as keyof typeof Ionicons.glyphMap,
            title: "Tu próxima clase",
            subtitle: lastClass.title,
            reservation: lastClass,
            isTicketModal: true,
          },
        ]
      : []),
    {
      id: 3,
      icon: "tennisball" as keyof typeof Ionicons.glyphMap,
      title: "Explorar Canchas",
    },
    ...(!subscription
      ? []
      : [
          {
            id: 5,
            icon: "card" as keyof typeof Ionicons.glyphMap,
            title: "Membresía activa",
            subtitle: "Padel Room plus",
            subscription: subscription, // <-- FIXED
            isTicketModal: true,
          },
        ]),
  ];

  const handleCardButtonPress = (id: number) => {
    if (id === 3) {
      navigation.navigate("Reservations");
    }
    // ...other navigation logic...
    console.log(`Floating button pressed for card ${id}`);
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
            loop={false}
            width={HomeScreenWidth}
            height={250}
            pagingEnabled={true}
            data={platformFields}
            scrollAnimationDuration={1800}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 0.9,
              parallaxScrollingOffset: 50,
            }}
            onProgressChange={(_, absoluteProgress) => {
              const newIndex = Math.round(absoluteProgress);
              setActiveIndex(newIndex);
            }}
            renderItem={renderCarouselItem}
          />
          <CustomPaginationDots
            activeIndex={activeIndex}
            totalItems={platformFields.length}
          />
        </View>
        <View style={{ flex: 1 }}>
          <View style={HomeScreenStyles.cardsGrid}>
            {cardsData.map((item) => (
              <ActionCard
                key={item.id}
                icon={item.icon}
                title={item.title}
                subtitle={item.subtitle}
                reservation={item.reservation ?? undefined}
                subscription={item.subscription ?? undefined} // <-- Pass subscription info
                isTicketModal={item.isTicketModal}
                onPressButton={() => handleCardButtonPress(item.id)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
}
