import { View } from "react-native";

export default function StudySetSkeleton() {
  return (
    <View className="h-[135px] w-[300px] rounded-2xl border-2 border-gray-200 bg-background p-4">
      <View className="h-6 w-48 animate-pulse rounded-md bg-gray-200" />
      <View className="mt-2 h-4 w-16 animate-pulse rounded-md bg-gray-200" />
      <View className="mt-auto flex-row items-center gap-2">
        <View className="size-6 animate-pulse rounded-full bg-gray-200" />
        <View className="h-5 w-24 animate-pulse rounded-md bg-gray-200" />
      </View>
    </View>
  );
}
