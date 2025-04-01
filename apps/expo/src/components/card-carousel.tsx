import React, { useState } from "react";
import { Dimensions, View } from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";

import FlipCard from "./flip-card";

interface CardCarouselProps {
  cards: {
    term: string;
    definition: string;
  }[];
}

const CardCarousel = ({ cards }: CardCarouselProps) => {
  const [activeSlide, setActiveSlide] = useState<number>(0);

  return (
    <View>
      <Carousel
        vertical={false}
        sliderWidth={Dimensions.get("screen").width}
        itemWidth={Dimensions.get("screen").width * 0.85}
        layout="default"
        data={cards}
        renderItem={({ item }) => (
          <FlipCard front={item.term} back={item.definition} />
        )}
        onSnapToItem={(index) => setActiveSlide(index)}
      />
      <Pagination
        dotsLength={cards.length}
        activeDotIndex={activeSlide}
        containerStyle={{
          paddingVertical: 10,
        }}
        dotStyle={{
          backgroundColor: "blue",
        }}
        inactiveDotStyle={{
          backgroundColor: "gray",
        }}
        dotContainerStyle={{
          marginHorizontal: 3,
        }}
      />
    </View>
  );
};

export default CardCarousel;
