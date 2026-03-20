import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useServices } from "../../../../utils/hook/useService";
import { styles } from "./styles";

export default function ServiceScreen() {
  const { data: services, isLoading, isError } = useServices();
  const serviceList = Array.isArray(services)
    ? services
    : ((services as unknown as { data?: typeof services })?.data ?? []);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <View style={styles.headerSide}>  
          <Ionicons
            name="chevron-back"
            size={22}
            color="#FFF"
            onPress={() => router.back()}
          />
        </View>

        <Text style={styles.headerTitle}>Dịch vụ</Text>

        {/* giữ title ở giữa */}
        <View style={styles.headerSide} />
      </View>

      {/* ===== CONTENT ===== */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {isLoading && (
          <View style={styles.stateWrapper}>
            <ActivityIndicator size="small" color="#5CB15A" />
            <Text style={styles.stateText}>Đang tải dịch vụ...</Text>
          </View>
        )}

        {isError && !isLoading && (
          <View style={styles.stateWrapper}>
            <Text style={styles.stateText}>Không tải được dịch vụ.</Text>
          </View>
        )}

        {!isLoading && !isError && (
          <View style={styles.list}>
            {serviceList.map((item: any) => (
              <View key={String(item.id ?? item.name)} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons
                    name={(item.icon || "paw-outline") as any}
                    size={26}
                    color="#5CB15A"
                  />
                  <Text style={styles.cardTitle}>{item.name}</Text>
                </View>

                <Text style={styles.cardDescription}>{item.description}</Text>

                <View style={styles.cardRow}>
                  <Text style={styles.cardLabel}>Giá:</Text>
                  <Text style={styles.cardValue}>{item.price} VND</Text>
                </View>

                {/* <View style={styles.cardRow}>
                  <Text style={styles.cardLabel}>Thời lượng:</Text>
                  <Text style={styles.cardValue}>{item.duration} phút</Text>
                </View> */}

                <View style={styles.cardActions}>
                  <Text
                    style={styles.cardAction}
                    onPress={() =>
                      router.push({
                        pathname: "/screens/user/stack/BookingScreen/Booking",
                        params: { service: item.name },
                      })
                    }
                  >
                    Đặt lịch
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
