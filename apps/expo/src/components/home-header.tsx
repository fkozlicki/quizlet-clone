import React, { useRef } from "react";
import {
  Animated,
  SafeAreaView,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  Feather,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";

interface HomeHeaderProps {
  opacity: Animated.AnimatedInterpolation<string | number>;
}

const HomeHeader = ({ opacity }: HomeHeaderProps) => {
  const header = useRef(null);

  return (
    <View className="bg-blue-600">
      <SafeAreaView>
        <Animated.View
          ref={header}
          style={{
            opacity,
          }}
        >
          <View className="flex-row items-center justify-between px-6">
            <Text className="text-3xl font-bold text-white">Quizlet</Text>
            <View className="flex-row items-center gap-4">
              <TouchableHighlight
                underlayColor="#fde047"
                className="rounded-full bg-yellow-400 px-4 py-3"
                onPress={() => console.log("hello")}
              >
                <Text className="font-semibold">Upgrade</Text>
              </TouchableHighlight>
              <TouchableWithoutFeedback>
                <MaterialCommunityIcons
                  name="bell-outline"
                  size={24}
                  color="white"
                />
              </TouchableWithoutFeedback>
            </View>
          </View>
        </Animated.View>
        <View className="mb-12 mt-4">
          <TouchableWithoutFeedback>
            <View className="mx-4 flex-row justify-between rounded-full bg-white p-4">
              <View className="flex-row items-center gap-2">
                <SimpleLineIcons name="magnifier" color="black" size={18} />
                <Text className="text font-semibold text-gray-400">
                  Sets, textbooks, questions
                </Text>
              </View>
              <Feather name="camera" size={20} color="" />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default HomeHeader;
