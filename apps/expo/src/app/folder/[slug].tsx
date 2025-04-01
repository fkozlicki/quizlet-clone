import React from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { api } from "~/utils/api";

export default function Folder() {
  const { slug }: { slug: string } = useLocalSearchParams();
  const { data } = api.folder.bySlug.useQuery({ slug });

  return (
    <View>
      <Text>{JSON.stringify(data)}</Text>
    </View>
  );
}
