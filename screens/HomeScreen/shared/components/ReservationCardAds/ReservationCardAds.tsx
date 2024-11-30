import React, { useEffect } from "react";
import { Text } from "@ui-kitten/components";
import { ReservationCardAdsProps } from "../../../HomeScreen.model";
import { View, Image, TouchableOpacity } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../../../navigation/AppNavigator/AppNavigator";
import {
  ReservationCardAdsHeight,
  ReservationCardAdsStyles,
  ReservationCardAdsWidth,
} from "./ReservationCardAds.style";

const ReservationCardAds: React.FC<ReservationCardAdsProps> = ({
  id_platforms_ad,
  platforms_ad_title,
  platforms_ad_image,
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handlePress = () => {
    //navigation.navigate("Schedule", field);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        ReservationCardAdsStyles.card,
        { height: ReservationCardAdsHeight },
      ]}
    >
      <Image
        source={{
          uri: platforms_ad_image,
        }}
        style={ReservationCardAdsStyles.carouselImage}
      />
    </TouchableOpacity>
  );
};

export default ReservationCardAds;
