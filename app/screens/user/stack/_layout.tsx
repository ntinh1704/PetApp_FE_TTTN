import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function StackLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#5CB15A" />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="CartScreen/Cart" />
        <Stack.Screen name="ServiceDetail/ServiceDetail" />
        <Stack.Screen name="BookingBuilder/BookingBuilder" />
        <Stack.Screen name="ChatScreen/ChatScreen" />
        <Stack.Screen name="PaymentQR/PaymentQR" />
        <Stack.Screen name="UserBookingDetail/BookingDetail" />
      </Stack>
    </>
  );
}
