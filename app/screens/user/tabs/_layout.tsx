import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import ChatBubble from "@/app/utils/components/ChatBubble";


const GREEN = "#5CB15A";

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,

          tabBarStyle: {
            backgroundColor: GREEN,
            borderTopWidth: 0,
            elevation: 0,
            height: 60,
          },

          tabBarBackground: () => (
            <View style={{ flex: 1, backgroundColor: GREEN }} />
          ),

          tabBarActiveTintColor: "#FFF",
          tabBarInactiveTintColor: "rgba(255,255,255,0.6)",
        }}
      >
        <Tabs.Screen
          name="HomeScreen/Home"
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="PetsScreen/Pets"
          options={{
            tabBarLabel: "Thú cưng",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="paw-outline" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="ServiceScreen/Service"
          options={{
            tabBarLabel: "Dịch vụ",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar-outline" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="HistoryScreen/History"
          options={{
            tabBarLabel: "Lịch sử",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="time-outline" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="ProfileScreen/Profile"
          options={{
            tabBarLabel: "Tôi",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen name="HomeScreen" options={{ href: null }} />
        <Tabs.Screen name="PetsScreen" options={{ href: null }} />
        <Tabs.Screen name="ServiceScreen" options={{ href: null }} />
        <Tabs.Screen name="HistoryScreen" options={{ href: null }} />
        <Tabs.Screen name="ProfileScreen" options={{ href: null }} />

        {/* Ẩn các file styles.ts khỏi tab bar */}
        <Tabs.Screen name="HomeScreen/styles" options={{ href: null }} />
        <Tabs.Screen name="PetsScreen/styles" options={{ href: null }} />
        <Tabs.Screen name="ServiceScreen/styles" options={{ href: null }} />
        <Tabs.Screen name="HistoryScreen/styles" options={{ href: null }} />
        <Tabs.Screen name="ProfileScreen/styles" options={{ href: null }} />
      </Tabs>
      <ChatBubble />
    </View>
  );
}
