import { Image, SafeAreaView, Text, View } from "react-native";

import { useUser } from "~/utils/auth";

const Profile = () => {
  const { name } = useUser();

  return (
    <SafeAreaView>
      <View className="flex-row justify-center">
        <View className="items-center py-10">
          <Image
            source={{
              uri: "https://reactnative.dev/img/tiny_logo.png",
            }}
            className="size-24 rounded-full"
          />
          <Text className="mt-4 text-2xl font-bold">{name}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
