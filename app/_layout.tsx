import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="screens/auth" />
        <Stack.Screen name="screens/user" />
        <Stack.Screen name="screens/admin" />
      </Stack>
    </QueryClientProvider>
  );
}