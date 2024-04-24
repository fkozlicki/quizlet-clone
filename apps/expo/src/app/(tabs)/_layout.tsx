import { Text, useColorScheme, View } from "react-native";
import { Redirect, Tabs } from "expo-router";
import {
  AntDesign,
  Feather,
  Ionicons,
  SimpleLineIcons,
} from "@expo/vector-icons";

import Colors from "~/constants/Colors";
import { useAuthContext } from "~/contexts/AuthContext";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { session } = useAuthContext();

  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <SimpleLineIcons name="magnifier" color={color} size={24} />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="solutions"
        options={{
          title: "Solutions",
          tabBarIcon: ({ color }) => (
            <Feather name="book" color={color} size={24} />
          ),
        }}
      /> */}
      {/* <Button title="Add" /> */}
      {/* <Tabs.Screen
        name="library"
        options={{
          title: "Library",
          tabBarIcon: ({ color }) => (
            <AntDesign name="folderopen" color={color} size={24} />
          ),
          headerShown: true,
          headerRight: () => (
            <View>
              <Text>Plus</Text>
            </View>
          ),
          headerShadowVisible: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-circle-outline" color={color} size={24} />
          ),
          headerShown: true,
        }}
      /> */}
    </Tabs>
  );
}
