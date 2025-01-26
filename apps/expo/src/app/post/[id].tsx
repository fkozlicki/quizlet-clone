import { SafeAreaView } from "react-native";
import { useGlobalSearchParams } from "expo-router";

export default function Post() {
  const { id } = useGlobalSearchParams();
  if (!id || typeof id !== "string") throw new Error("unreachable");

  return <SafeAreaView className="bg-background"></SafeAreaView>;
}
