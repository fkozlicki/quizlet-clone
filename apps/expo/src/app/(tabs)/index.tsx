import React, { useCallback, useRef, useState } from "react";
import { Animated, RefreshControl, ScrollView, View } from "react-native";

import FoldersList from "~/components/folders-list";
import StudySetsList from "~/components/study-sets-list";
import TabsHeader from "~/components/tabs-header";
import { api } from "~/utils/api";
import { useUser } from "~/utils/auth";

const Home = () => {
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const { id: userId } = useUser();

  const utils = api.useUtils();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);

    await Promise.all([
      utils.studySet.allByUser.refetch({ userId }),
      utils.folder.allByUser.refetch({ userId }),
    ]);

    setIsRefreshing(false);
  }, [userId, utils]);

  const headerTranslateY = scrollOffsetY.interpolate({
    inputRange: [0, 41],
    outputRange: [0, -50],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={{
        transform: [{ translateY: headerTranslateY }],
        flex: 1,
      }}
      className="h-full"
    >
      <TabsHeader offset={scrollOffsetY} />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
          { useNativeDriver: false },
        )}
      >
        <View className="gap-5 pt-10">
          <StudySetsList />
          <FoldersList />
        </View>
      </ScrollView>
    </Animated.View>
  );
};

export default Home;
