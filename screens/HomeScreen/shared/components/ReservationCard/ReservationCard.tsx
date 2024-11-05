import React from "react";
import { Text } from "@ui-kitten/components";
import { ReservationCardProps } from "../../../HomeScreen.model";
import {
  ReservationCardHeight,
  ReservationCardStyles,
  ReservationCardWidth,
} from "./ReservationCard.style";
import { View, Image, TouchableOpacity } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../../../navigation/AppNavigator/AppNavigator";

const renderItem = ({ item }: { item: { path: string } }) => (
  <Image
    source={{ uri: item.path }}
    style={ReservationCardStyles.carouselImage}
  />
);

const ReservationCard: React.FC<ReservationCardProps> = ({
  id_platforms_field,
  field,
  time,
  player,
  images,
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handlePress = () => {
    navigation.navigate("Schedule", { id_platforms_field });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[ReservationCardStyles.card, { height: ReservationCardHeight }]}
    >
      <View style={ReservationCardStyles.carouselContainer}>
        <Carousel
          width={ReservationCardWidth}
          height={ReservationCardHeight * 0.7}
          data={images.map((image) => ({ path: image.uri }))}
          renderItem={renderItem}
          loop={true}
          autoPlay={true}
          autoPlayInterval={3000}
        />
      </View>
      <View style={ReservationCardStyles.detailsContainer}>
        <View style={ReservationCardStyles.columnLeftDetailsContainer}>
          <Text style={ReservationCardStyles.columnLeftDetailsText}>
            {field}
          </Text>
        </View>
        <View style={ReservationCardStyles.columnRightDetailsContainer}>
          <Text>{player}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ReservationCard;
