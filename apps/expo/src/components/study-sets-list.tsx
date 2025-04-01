import { Image, Text, View } from "react-native";
import { Link } from "expo-router";
import { FlashList } from "@shopify/flash-list";

import { api } from "~/utils/api";
import { useUser } from "~/utils/auth";
import FetchError from "./fetch-error";
import StudySetSkeleton from "./study-set-skeleton";

export default function StudySetsListSection() {
  return (
    <View>
      <View className="mx-4 mb-4 flex-row justify-between">
        <Text className="text-base font-bold">Sets</Text>
        <Text className="font-semibold text-blue-600">View all</Text>
      </View>

      <StudySetsList />
    </View>
  );
}

function StudySetsList() {
  const { id: userId } = useUser();

  const { data, isPending, isError, refetch } = api.studySet.allByUser.useQuery(
    {
      userId,
    },
  );

  if (isPending) {
    return (
      <View className="flex-row gap-4 px-4">
        <StudySetSkeleton />
        <StudySetSkeleton />
      </View>
    );
  }

  if (isError) {
    return (
      <FetchError
        message="Couldn't load study sets"
        onPress={() => refetch()}
      />
    );
  }

  return (
    <FlashList
      data={data}
      horizontal
      estimatedItemSize={135}
      estimatedListSize={{
        width: 400,
        height: 135,
      }}
      showsHorizontalScrollIndicator={false}
      ItemSeparatorComponent={() => <View className="w-4" />}
      className="mr-4 pl-4"
      renderItem={({ item: { title, flashcardCount, user, id } }) => (
        <Link href={`/study-set/${id}`}>
          <View className="w-[300px] rounded-2xl border-2 border-gray-200 bg-white p-4">
            <Text className="mb-4 font-bold">{title}</Text>
            <View className="mb-10 self-start rounded-full bg-indigo-50 px-2 py-[1px]">
              <Text className="text-xs font-medium">
                {flashcardCount} terms
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Image
                source={{
                  uri: "https://reactnative.dev/img/tiny_logo.png",
                }}
                className="size-6 rounded-full"
              />
              <Text className="text-xs font-semibold">{user.name}</Text>
            </View>
          </View>
        </Link>
      )}
    />
  );
}
