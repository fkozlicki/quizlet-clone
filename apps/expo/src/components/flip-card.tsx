import React, { useCallback, useRef, useState } from "react";
import { Animated, Easing, Pressable, Text, View } from "react-native";

interface FlipCardProps {
  front: string;
  back: string;
}

const FlipCard = ({ front, back }: FlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [isAnimating, setIsAnimating] = useState(false);

  const flipCard = useCallback(() => {
    if (isAnimating) {
      return;
    }

    setIsAnimating(true);
    setIsFlipped((prev) => !prev);

    Animated.timing(flipAnim, {
      toValue: isFlipped ? 2 : 1,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      if (isFlipped) {
        flipAnim.setValue(0);
      }
      setIsAnimating(false);
    });
  }, [isAnimating, isFlipped, flipAnim]);

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ["0deg", "180deg", "360deg"],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ["180deg", "360deg", "540deg"],
  });

  const frontAnimatedStyle = {
    transform: [{ perspective: 1000 }, { rotateX: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ perspective: 1000 }, { rotateX: backInterpolate }],
  };

  return (
    <Pressable
      onPress={flipCard}
      className="h-[225px] overflow-hidden rounded-lg"
    >
      <Animated.View
        className="absolute h-full w-full"
        style={[
          frontAnimatedStyle,
          {
            backfaceVisibility: "hidden",
          },
        ]}
      >
        <View className="h-full w-full flex-1 items-center justify-center bg-white">
          <Text className="text-3xl font-medium">{front}</Text>
        </View>
      </Animated.View>
      <Animated.View
        className="absolute h-full w-full"
        style={[
          backAnimatedStyle,
          {
            backfaceVisibility: "hidden",
          },
        ]}
      >
        <View className="h-full w-full flex-1 items-center justify-center bg-white">
          <Text className="text-3xl font-medium">{back}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default FlipCard;
