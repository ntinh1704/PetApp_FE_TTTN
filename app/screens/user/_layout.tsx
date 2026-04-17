import { Stack } from "expo-router";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { PetsProvider } from "@/app/utils/contexts/PetsContext";
import { CartProvider } from "@/app/utils/contexts/CartContext";
import { ChatProvider } from "@/app/utils/contexts/ChatContext";

const GREEN = "#5CB15A";

export default function RootLayout() {
  return (
    <ChatProvider>
      <CartProvider>
        <PetsProvider>
          <View style={{ flex: 1, backgroundColor: GREEN }}>
            <StatusBar style="light" backgroundColor={GREEN} />

            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="(stack)" />
            </Stack>
          </View>
        </PetsProvider>
      </CartProvider>
    </ChatProvider>
  );
}
