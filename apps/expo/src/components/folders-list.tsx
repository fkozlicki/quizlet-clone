import { Text, View } from "react-native";
import { Link } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { FolderIcon } from "lucide-react-native";

import { api } from "~/utils/api";
import { useUser } from "~/utils/auth";
import FetchError from "./fetch-error";
import FolderSkeleton from "./folder-skeleton";

export default function FoldersListSection() {
  return (
    <View>
      <View className="mx-4 mb-4 flex-row justify-between">
        <Text className="text-base font-bold">Folders</Text>
        <Text className="font-semibold text-blue-600">View all</Text>
      </View>

      <FoldersList />
    </View>
  );
}

function FoldersList() {
  const { id: userId } = useUser();

  const { data, isPending, isError, refetch } = api.folder.allByUser.useQuery({
    userId,
  });

  if (isPending) {
    return (
      <View className="flex-row gap-4 px-4">
        <FolderSkeleton />
        <FolderSkeleton />
      </View>
    );
  }

  if (isError) {
    return (
      <FetchError message="Couldn't load folders" onPress={() => refetch()} />
    );
  }

  return (
    <FlashList
      data={data}
      horizontal
      estimatedItemSize={100}
      estimatedListSize={{
        width: 400,
        height: 100,
      }}
      showsHorizontalScrollIndicator={false}
      ItemSeparatorComponent={() => <View className="w-4" />}
      className="mr-4 pl-4"
      renderItem={({ item: { name, studySetsCount, slug } }) => (
        <Link href={`/folder/${slug}`}>
          <View className="w-[300px] rounded-2xl border-2 border-gray-200 bg-white p-4">
            <View className="mb-4 flex-row items-center gap-4">
              <FolderIcon className="size-6" />
              <Text className="text-xl font-bold">{name}</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="font-semibold text-gray-600">
                {studySetsCount} sets
              </Text>
            </View>
          </View>
        </Link>
      )}
    />
  );
}
