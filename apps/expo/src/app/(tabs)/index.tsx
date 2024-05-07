import React, { useCallback, useRef, useState } from "react";
import { Animated, RefreshControl, ScrollView, Text, View } from "react-native";
import { Link } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";

import HomeHeader from "~/components/home-header";

const sets = [
  {
    id: Math.random().toString(),
    title: "Hiszpanski",
    count: 10,
    author: "John Doe",
  },
  {
    id: Math.random().toString(),
    title: "React Theory",
    count: 22,
    author: "John Doe",
  },
  {
    id: Math.random().toString(),
    title: "Typescript",
    count: 7,
    author: "John Doe",
  },
  { id: Math.random().toString(), title: "PHP", count: 12, author: "John Doe" },
];

const folders = [
  { title: "Modulo 4", sets: 4, author: "John Doe" },
  { title: "Modulo 4", sets: 4, author: "John Doe" },
];

const Home = () => {
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);
  // const { data: popular } = api.studySet.popular.useQuery();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const headerTranslateY = scrollOffsetY.interpolate({
    inputRange: [0, 41],
    outputRange: [0, -50],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollOffsetY.interpolate({
    inputRange: [0, 41],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={{
        transform: [{ translateY: headerTranslateY }],
        flex: 1,
      }}
    >
      {/* HEADER */}
      <HomeHeader opacity={headerOpacity} />
      {/* CONTENT */}
      <ScrollView
        style={{
          flex: 1,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
          { useNativeDriver: false },
        )}
      >
        <View className="mx-4 pt-5">
          <View className="mb-4 flex-row justify-between">
            <Text className="text-base font-bold">Sets</Text>
            <Text className="font-semibold text-blue-600">View all</Text>
          </View>
          <FlashList
            estimatedItemSize={10}
            showsHorizontalScrollIndicator={false}
            data={sets}
            horizontal
            ItemSeparatorComponent={() => <View className="w-4" />}
            renderItem={({ item }) => (
              <Link href={`/study-set:${item.id}`}>
                <View className="w-[300px] rounded-2xl border-2 border-gray-200 bg-white p-4">
                  <Text className="mb-4 font-bold">{item.title}</Text>
                  <View className="mb-10 self-start rounded-full bg-indigo-50 px-2 py-[1px]">
                    <Text className="text-xs font-medium">
                      {item.count} terms
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    {/* <Image
                      source={require("../../assets/images/user.jpg")}
                      className="h-6 w-6 rounded-full"
                    /> */}
                    <Text className="text-xs font-semibold">{item.author}</Text>
                  </View>
                </View>
              </Link>
            )}
          />
        </View>
        <View className="mx-4 pt-5">
          <View className="mb-4 flex-row justify-between">
            <Text className="text-base font-bold">Sets</Text>
            <Text className="font-semibold text-blue-600">View all</Text>
          </View>
          <FlashList
            estimatedItemSize={10}
            showsHorizontalScrollIndicator={false}
            data={sets}
            horizontal
            ItemSeparatorComponent={() => <View className="w-4" />}
            renderItem={({ item }) => (
              <View className="w-[300px] rounded-2xl border-2 border-gray-200 bg-white p-4">
                <Text className="mb-4 font-bold">{item.title}</Text>
                <View className="mb-10 self-start rounded-full bg-indigo-50 px-2 py-[1px]">
                  <Text className="text-xs font-medium">{item.count} sets</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  {/* <Image
                    source={require("../../assets/images/user.jpg")}
                    className="h-6 w-6 rounded-full"
                  /> */}
                  <Text className="text-xs font-semibold">{item.author}</Text>
                </View>
              </View>
            )}
          />
        </View>
        <View className="mx-4 mb-5 pt-5">
          <View className="mb-4 flex-row justify-between">
            <Text className="text-base font-bold">Folders</Text>
            <Text className="font-semibold text-blue-600">View all</Text>
          </View>
          <FlashList
            estimatedItemSize={10}
            data={folders}
            horizontal
            ItemSeparatorComponent={() => <View className="w-4" />}
            renderItem={({ item }) => (
              <View className="w-[300px] rounded-2xl border-2 border-gray-200 bg-white p-4">
                <View className="mb-4 flex-row items-center gap-4">
                  <Feather name="folder" size={24} />
                  <Text className="text-xl font-bold">{item.title}</Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="font-semibold text-gray-600">
                    {item.sets} sets
                  </Text>
                  <View className="mx-3 h-3/4 w-px bg-gray-300"></View>
                  <View className="flex-row items-center gap-2">
                    {/* <Image
                      source={require("../../assets/images/user.jpg")}
                      className="h-6 w-6 rounded-full"
                    /> */}
                    <Text className="text-xs font-semibold">{item.author}</Text>
                  </View>
                </View>
              </View>
            )}
          />
        </View>
      </ScrollView>
    </Animated.View>
  );
};

export default Home;
