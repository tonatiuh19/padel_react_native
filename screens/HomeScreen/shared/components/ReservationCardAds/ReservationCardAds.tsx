import React, { useEffect, useState } from "react";
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
import AdImageModal from "./AdImageModal/AdImageModal";

const ReservationCardAds: React.FC<ReservationCardAdsProps> = ({
  id_platforms_ad,
  platforms_ad_title,
  platforms_ad_image,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <View>
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

      <AdImageModal
        visible={modalVisible}
        onClose={handleCloseModal}
        imageUrl={platforms_ad_image}
      />
    </View>
  );
};

export default ReservationCardAds;
