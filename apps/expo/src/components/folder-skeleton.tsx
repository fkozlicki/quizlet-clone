import { View } from "react-native";

export default function FolderSkeleton() {
  return (
    <View className="h-[100px] w-[300px] rounded-2xl border-2 border-gray-200 bg-background p-4">
      <View className="h-8 w-48 animate-pulse rounded-md bg-gray-200" />
      <View className="mt-auto h-4 w-32 animate-pulse rounded-md bg-gray-200" />
    </View>
  );
}
