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
        <Stack.Screen name="BookingScreen/Booking" />
      </Stack>
    </>
  );
}
