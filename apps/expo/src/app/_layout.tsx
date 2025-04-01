import "@bacons/text-decoder/install";

import { StatusBar } from "react-native";

import { TRPCProvider } from "~/utils/api";

import "../styles.css";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <TRPCProvider>
      <GestureHandlerRootView>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="study-set/[id]"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="folder/[id]"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
        <StatusBar />
      </GestureHandlerRootView>
    </TRPCProvider>
  );
}
