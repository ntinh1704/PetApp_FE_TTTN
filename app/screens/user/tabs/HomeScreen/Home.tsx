import { services } from "@/app/utils/data/services";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./styles";


export default function HomeScreen() {
  const email = "sarah@gmail.com";
  const userName = email.split("@")[0];
  const displayName =
    userName.charAt(0).toUpperCase() + userName.slice(1);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() =>
              router.push(
                "/screens/user/tabs/ProfileScreen/Profile"
              )
            }
          >
            <Image
              source={{ uri: "https://i.pravatar.cc/100?img=5" }}
              style={styles.headerAvatar}
            />
          </TouchableOpacity>

          <View>
            <Text style={styles.helloText}>Xin chào,</Text>
            <Text style={styles.headerTitle}>
              {displayName}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.notiBtn}
          onPress={() =>
            router.push(
              "/screens/user/stack/Notifications/Notifications"
            )
          }
        >
          <Ionicons
            name="notifications-outline"
            size={22}
            color="#FFF"
          />
        </TouchableOpacity>
      </View>

      {/* ===== CONTENT ===== */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          paddingBottom: 24,
          minHeight: "100%",
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* ===== MY PETS ===== */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🐾 Thú cưng của tôi</Text>
            <TouchableOpacity
              onPress={() =>
                router.push(
                  "/screens/user/tabs/PetsScreen/Pets"
                )
              }
            >
              <Text style={styles.seeAll}>
                Xem tất cả
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.petList}>
            {[
              {
                name: "Bella",
                img: "https://i.pravatar.cc/100?img=1",
              },
              {
                name: "Roudy",
                img: "https://i.pravatar.cc/100?img=2",
              },
              {
                name: "Furry",
                img: "https://i.pravatar.cc/100?img=3",
              },
            ].map((pet) => (
              <View key={pet.name} style={styles.petItem}>
                <Image
                  source={{ uri: pet.img }}
                  style={styles.petAvatar}
                />
                <Text style={styles.petName}>
                  {pet.name}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ===== SERVICES ===== */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Dịch vụ
            </Text>
            <TouchableOpacity
              onPress={() =>
                router.push(
                  "/screens/user/tabs/ServiceScreen/Service"
                )
              }
            >
              <Text style={styles.seeAll}>
                Xem tất cả
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.serviceList}>
            {services.map((item) => (
              <View
                key={item.label}
                style={styles.serviceItem}
              >
                <View style={styles.serviceIcon}>
                  <Ionicons
                    name={item.icon as any}
                    size={22}
                    color="#5CB15A"
                  />
                </View>
                <Text style={styles.serviceLabel}>
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
