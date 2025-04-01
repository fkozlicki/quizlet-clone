import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect } from "expo-router";

import { api } from "~/utils/api";
import { useSignIn } from "~/utils/auth";

export default function Index() {
  const { data: session } = api.auth.getSession.useQuery();
  const signIn = useSignIn();

  if (session) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-primary">
      <View className="items-center">
        <Text className="text-center text-5xl font-semibold text-white">
          Quizlet
        </Text>

        {session === null && (
          <TouchableOpacity
            onPress={signIn}
            className="mt-5 rounded-full bg-white"
          >
            <Text className="px-8 py-2 text-center text-xl font-medium">
              Sign In
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
