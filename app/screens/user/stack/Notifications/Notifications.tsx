import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { api } from "@/app/services/api";
import { useMarkNotificationRead, useNotifications } from "@/app/utils/hook/useNotification";
import { styles } from "./styles";

type RowNotificationItem = {
  id: string;
  title: string;
  body: string;
  bookingId: string;
  type: "confirmed" | "completed" | "other";
  isRead: boolean;
  timeString: string;
};

type CurrentUser = {
  id: number;
  email: string;
};

const toTimestamp = (item: any) => {
  if (item?.created_at) {
    const t = new Date(item.created_at).getTime();
    if (!Number.isNaN(t)) return t;
  }
  return Number(item?.id) || 0;
};

export default function NotificationsScreen() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const cachedEmail = await AsyncStorage.getItem("email");

        const usersRes = await api.get<any>("/users");
        const users = Array.isArray(usersRes.data)
          ? usersRes.data
          : usersRes.data?.records ?? usersRes.data?.data ?? [];

        const found = (users as any[]).find(
          (u) => String(u.email).trim() === String(cachedEmail ?? "").trim(),
        );

        if (found) {
          setCurrentUser({
            id: Number(found.id),
            email: found.email,
          });
          return;
        }

        setCurrentUser(cachedEmail ? { id: 0, email: cachedEmail } : null);
      } catch {
        const cachedEmail = await AsyncStorage.getItem("email");
        setCurrentUser(cachedEmail ? { id: 0, email: cachedEmail } : null);
      }
    };

    loadCurrentUser();
  }, []);

  const queryParams = useMemo(() => {
    if (!currentUser) return null;

    if (currentUser.id > 0) {
      return {
        role: "user" as const,
        user_id: currentUser.id,
      };
    }

    return {
      role: "user" as const,
      email: currentUser.email?.trim().toLowerCase(),
    };
  }, [currentUser]);

  const notificationsQuery = useNotifications(queryParams ?? { role: "user" }, Boolean(queryParams));
  const markReadMutation = useMarkNotificationRead();

  const notifications = notificationsQuery.data ?? [];
  const isLoading = notificationsQuery.isLoading;

  const sortedItems = useMemo<RowNotificationItem[]>(() => {
    const sortedNotifications = [...notifications].sort((a, b) => toTimestamp(b) - toTimestamp(a));

    return sortedNotifications.map((notification) => {
      const rawText = notification.message || "";

      // Regex to parse bookingId for navigation
      const idMatch = rawText.match(/#(\d+)/i) || rawText.match(/mã (\d+)/i);
      const extractedId = idMatch ? idMatch[1] : String(notification.booking_id || "");
      
      const lower = rawText.toLowerCase();
      let type: "confirmed" | "completed" | "other" = "other";
      let title = "Thông báo mới";
      let body = rawText;
      
      // Simple format display texts
      if (lower.includes("xác nhận")) {
        type = "confirmed";
        title = "Lịch hẹn đã được xác nhận!";
      } else if (lower.includes("hoàn thành") || lower.includes("hoàn tất")) {
        type = "completed";
        title = "Dịch vụ đã hoàn tất";
      } else if (lower.includes("từ chối")) {
        type = "other";
        title = "❌ Yêu cầu bị từ chối";
      } else if (lower.includes("chấp nhận")) {
        type = "other";
        title = "✅ Hủy lịch thành công";
      } else if (lower.includes("hủy")) {
        title = "⚠️ Lịch hẹn đã bị hủy";
      }

      let timeString = "";
      if (notification.created_at) {
        const d = new Date(notification.created_at);
        const pad = (n: number) => String(n).padStart(2, '0');
        timeString = `${pad(d.getHours())}:${pad(d.getMinutes())} ${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;
      }

      return {
        id: String(notification.id),
        title,
        body,
        bookingId: extractedId,
        type,
        isRead: Boolean(notification.is_read),
        timeString,
      };
    });
  }, [notifications]);

  const markAsRead = async (item: RowNotificationItem) => {
    try {
      await markReadMutation.mutateAsync(item.id);
    } catch {
      // ignore
    }
    
    if (item.bookingId) {
      router.push({
        pathname: "/screens/user/stack/UserBookingDetail/BookingDetail",
        params: { bookingId: item.bookingId }
      });
    } else {
      router.push("/screens/user/tabs/HistoryScreen/History");
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông báo</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {isLoading && <Text style={styles.stateText}>Đang tải thông báo...</Text>}

        {!isLoading && sortedItems.length === 0 && <Text style={styles.stateText}>Bạn chưa có thông báo nào</Text>}

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

function NotificationRow({
  item,
  onPress,
}: {
  item: RowNotificationItem;
  onPress: () => void;
}) {
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
        style={[styles.row, !item.isRead && styles.rowUnread]} 
        activeOpacity={0.7} 
        onPress={onPress}
      >
        <View style={styles.thumbnailContainer}>
          {item.type === "completed" ? (
             <Ionicons name="gift-outline" size={24} color="#5CB15A" />
          ) : item.type === "confirmed" ? (
             <Ionicons name="checkmark-circle" size={32} color="#5CB15A" />
          ) : (
            <Ionicons name="notifications" size={24} color="#5CB15A" />
          )}
          {!item.isRead && <View style={styles.unreadDot} />}
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.titleText}>{item.title}</Text>
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
