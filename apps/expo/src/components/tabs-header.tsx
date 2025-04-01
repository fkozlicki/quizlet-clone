import { useRef } from "react";
import {
  Animated,
  SafeAreaView,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import {
  Feather,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";

interface TabsHeaderProps {
  offset: Animated.Value;
}

export default function TabsHeader({ offset }: TabsHeaderProps) {
  const header = useRef(null);

  const headerOpacity = offset.interpolate({
    inputRange: [0, 41],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  return (
    <View className="rounded-b-[60px] bg-blue-600">
      <SafeAreaView>
        <Animated.View
          ref={header}
          className="mx-4 flex-row items-center justify-between"
          style={{
            opacity: headerOpacity,
          }}
        >
          <Text className="text-3xl font-bold text-white">Quizlet</Text>
          <View className="flex-row items-center">
            <TouchableHighlight
              underlayColor="#fde047"
              className="mr-4 rounded-full bg-yellow-400 px-4 py-3"
            >
              <Text className="font-semibold">Upgrade</Text>
            </TouchableHighlight>
            <TouchableWithoutFeedback className="mx-4">
              <MaterialCommunityIcons
                name="bell-outline"
                size={24}
                color="white"
              />
            </TouchableWithoutFeedback>
          </View>
        </Animated.View>

        <View className="px-4 pb-12 pt-4">
          <TouchableWithoutFeedback>
            <View className="flex-row justify-between rounded-full bg-white p-4">
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
}
