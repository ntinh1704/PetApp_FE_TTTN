import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useServices } from "../../../../utils/hook/useService";
import CartBadge from "../../../../utils/components/CartBadge";
import { styles } from "./styles";

const formatDuration = (minutes?: number | null) => {
  if (!minutes) return null;
  if (minutes < 60) return `${minutes} phút`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h} giờ ${m} phút` : `${h} giờ`;
};

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

        {/* Cart badge ở headerSide phải */}
        <View style={styles.headerSide}>
          <CartBadge color="#FFF" size={22} containerStyle={styles.notiBtn}/>
        </View>
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
              <TouchableOpacity
                key={String(item.id ?? item.name)}
                style={styles.card}
                activeOpacity={0.7}
                onPress={() =>
                  router.push({
                    pathname: "/screens/user/stack/ServiceDetail/ServiceDetail" as any,
                    params: { serviceId: item.id },
                  })
                }
              >
                <View style={styles.cardHeader}>
                  <Ionicons
                    name={(item.icon || "paw-outline") as any}
                    size={26}
                    color="#5CB15A"
                  />
                  <Text style={styles.cardTitle} numberOfLines={2}>{item.name}</Text>
                </View>

                <Text style={styles.cardDescription} numberOfLines={2}>{item.description}</Text>

                <View style={styles.cardRow}>
                  <Text style={styles.cardLabel}>Giá:</Text>
                  <Text style={styles.cardValue}>{(item.price ?? 0).toLocaleString("vi-VN")} đ</Text>
                </View>

                {formatDuration(item.duration) && (
                  <View style={styles.cardRow}>
                    <Text style={styles.cardLabel}>Thời lượng:</Text>
                    <Text style={styles.cardValue}>{formatDuration(item.duration)}</Text>
                  </View>
                )}

                <View style={styles.cardActions}>
                  <Text style={styles.cardAction}>Xem chi tiết</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
