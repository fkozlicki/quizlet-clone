import { Text, TouchableOpacity, View } from "react-native";

interface FetchErrorProps {
  message: string;
  onPress: () => void;
}

export default function FetchError({ message, onPress }: FetchErrorProps) {
  return (
    <View className="w-full items-center justify-center">
      <Text className="text-xl font-semibold">{message}</Text>
      <TouchableOpacity
        onPress={onPress}
        className="mt-2 rounded-xl bg-primary p-3"
      >
        <Text className="font-medium text-white">Try again</Text>
      </TouchableOpacity>
    </View>
  );
}
