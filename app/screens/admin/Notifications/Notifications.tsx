import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef } from "react";
import { Animated, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useMarkNotificationRead, useNotifications } from "@/app/utils/hook/useNotification";
import { styles } from "./styles";

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  bookingId: string;
  isRead: boolean;
  timeString: string;
  type: "normal" | "cancel";
};

const toTimestamp = (item: any) => {
  if (item?.created_at) {
    const t = new Date(item.created_at).getTime();
    if (!Number.isNaN(t)) return t;
  }
  return Number(item?.id) || 0;
};

export default function AdminNotificationsScreen() {
  const notificationsQuery = useNotifications({ role: "admin" }, true);
  const markReadMutation = useMarkNotificationRead();

  const notifications = notificationsQuery.data ?? [];
  const isLoading = notificationsQuery.isLoading;

  const sortedItems = useMemo<NotificationItem[]>(() => {
    const pendingNotifications = [...notifications].sort((a, b) => toTimestamp(b) - toTimestamp(a));

    return pendingNotifications.map((notification) => {
      const rawText = notification.message || "Bạn có thông báo mới";

      // Regex to parse information for routing
      const idMatch = rawText.match(/#BK(\d+)/i) || rawText.match(/mã (\d+)/i);
      const extractedId = idMatch ? idMatch[1] : String(notification.booking_id || "");
      
      let title = notification.title || "Yêu cầu đặt lịch mới!";
      let type: "normal" | "cancel" = "normal";

      if (rawText.toLowerCase().includes("hủy") || title.toLowerCase().includes("hủy")) {
        type = "cancel";
        if (title === "Yêu cầu đặt lịch mới!" || title === "Lịch hẹn mới") {
          title = rawText.toLowerCase().includes("tự thay đổi và hủy") ? "Khách hàng hủy lịch hẹn" : "Yêu cầu hủy lịch hẹn";
        }
      }

      // Time formatting for the bottom text
      let timeString = "";
      if (notification.created_at) {
        const d = new Date(notification.created_at);
        const pad = (n: number) => String(n).padStart(2, '0');
        timeString = `${pad(d.getHours())}:${pad(d.getMinutes())} ${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;
      }

      return {
        id: String(notification.id),
        title,
        body: rawText,
        bookingId: extractedId,
        isRead: Boolean(notification.is_read),
        timeString,
        type,
      };
    });
  }, [notifications]);

  const markAsRead = async (item: NotificationItem) => {
    try {
      await markReadMutation.mutateAsync(item.id);
    } catch {
      // ignore
    }
    
    if (item.bookingId) {
      router.push({
        pathname: "/screens/admin/tabs/BookingManagementScreen/BookingDetail",
        params: { bookingId: item.bookingId }
      });
    } else {
      router.push("/screens/admin/tabs/BookingManagementScreen/BookingManagement");
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={[styles.header, { marginHorizontal: 12, marginTop: 12 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#FFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Thông báo</Text>

        <View style={{ width: 40 }} />
      </View>
      <ScrollView contentContainerStyle={[styles.container, { paddingTop: 0 }]}>

        {isLoading && <Text style={styles.stateText}>Đang tải thông báo...</Text>}

        {!isLoading && sortedItems.length === 0 && <Text style={styles.stateText}>Chưa có thông báo nào.</Text>}

        {!isLoading && sortedItems.length > 0 && (
          <View style={[styles.card, { marginTop: 12 }]}>
            {sortedItems.map((item) => (
              <NotificationRow key={item.id} item={item} onPress={() => markAsRead(item)} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function NotificationRow({ item, onPress }: { item: NotificationItem; onPress: () => void }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [anim]);

  return (
    <Animated.View
      style={{
        opacity: anim,
        transform: [
          {
            translateY: anim.interpolate({
              inputRange: [0, 1],
              outputRange: [8, 0],
            }),
          },
        ],
      }}
    >
      <TouchableOpacity 
        style={[
          styles.row, 
          !item.isRead && item.type !== "cancel" && styles.rowUnread,
          !item.isRead && item.type === "cancel" && { backgroundColor: "#FEF2F2" }
        ]} 
        activeOpacity={0.7} 
        onPress={onPress}
      >
        <View style={[styles.thumbnailContainer, item.type === "cancel" && { backgroundColor: "#FEE2E2" }]}>
          <Ionicons 
            name={item.type === "cancel" ? "warning" : "calendar-outline"} 
            size={26} 
            color={item.type === "cancel" ? "#DC2626" : "#5CB15A"} 
          />
          {!item.isRead && <View style={styles.unreadDot} />}
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.titleText, item.type === "cancel" && !item.isRead && { color: "#B91C1C" }]}>{item.title}</Text>
          <Text style={styles.bodyText}>{item.body}</Text>
          {item.timeString ? <Text style={styles.timeText}>{item.timeString}</Text> : null}
        </View>

        <View style={styles.chevronContainer}>
          <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
