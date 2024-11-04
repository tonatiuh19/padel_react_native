import React from "react";
import { Text } from "@ui-kitten/components";
import { ReservationCardProps } from "../../../HomeScreen.model";
import {
  ReservationCardHeight,
  ReservationCardStyles,
  ReservationCardWidth,
} from "./ReservationCard.style";
import { View, Image } from "react-native";
import Carousel from "react-native-reanimated-carousel";

const renderItem = ({ item }: { item: { uri: string } }) => (
  <Image
    source={{ uri: item.uri }}
    style={ReservationCardStyles.carouselImage}
  />
);

const ReservationCard: React.FC<ReservationCardProps> = ({
  field,
  time,
  player,
  images,
}) => (
  <View style={[ReservationCardStyles.card, { height: ReservationCardHeight }]}>
    <View style={ReservationCardStyles.carouselContainer}>
      <Carousel
        width={ReservationCardWidth}
        height={ReservationCardHeight * 0.7}
        data={images}
        renderItem={renderItem}
        loop={true}
        autoPlay={true}
        autoPlayInterval={3000}
      />
    </View>
    <View style={ReservationCardStyles.detailsContainer}>
      <Text>{field}</Text>
      <Text>{time}</Text>
      <Text>{player}</Text>
    </View>
  </View>
);

export default ReservationCard;
