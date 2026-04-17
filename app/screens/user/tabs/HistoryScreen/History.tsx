import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CartBadge from "@/app/utils/components/CartBadge";
import { HistoryStatus } from "@/app/utils/data/histories";
import { useBookings } from "@/app/utils/hook/useBooking";
import { GREEN, styles } from "./styles";

const filters = [
  "Tất cả",
  "Đang xác nhận",
  "Đã xác nhận",
  "Hoàn thành",
  "Đã hủy",
];

const formatDateDisplay = (value?: string | null) => {
  if (!value) return "";

  const raw = String(value);
  const datePart = raw.includes("T") ? raw.split("T")[0] : raw;
  const parts = datePart.split("-");

  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}-${month}-${year}`;
  }

  return raw;
};

const formatTimeDisplay = (value?: string | null) => {
  if (!value) return "";

  const raw = String(value);
  const timePart = raw.includes("T") ? raw.split("T")[1] : raw;
  const clean = timePart.split(".")[0];
  const [hour, minute] = clean.split(":");

  if (!hour || !minute) return raw;
  return `${hour}:${minute}`;
};

const toTimestamp = (item: any) => {
  if (item.created_at) {
    const t = new Date(item.created_at).getTime();
    if (!Number.isNaN(t)) return t;
  }
  return Number(item.id) || 0;
};

export default function HistoryScreen() {
  const [activeFilter, setActiveFilter] = useState("Tất cả");
  const { data: bookings, isLoading } = useBookings();

  const historyItems = useMemo(() => {
    const list: any[] = Array.isArray(bookings)
      ? bookings
      : ((bookings as unknown as { data?: typeof bookings })?.data ?? []);

    const sortedList = [...list].sort((a, b) => toTimestamp(b) - toTimestamp(a));

    return sortedList.map((item) => {
      const rawStatus = (item.status ?? "").toString().trim().toLowerCase();
      const statusMap: Record<string, HistoryStatus> = {
        pending: "Đang xác nhận",
        confirmed: "Đã xác nhận",
        cancel_requested: "Đang xin hủy",
        completed: "Hoàn thành",
        cancelled: "Đã hủy",
        canceled: "Đã hủy",
        "chờ thanh toán": "Đang xác nhận",
        "đã thanh toán": "Đã xác nhận",
      };

      const status = statusMap[rawStatus] ?? "Đang xác nhận";

      return {
        id: String(item.id),
        title: item.service_name || "Dịch vụ",
        subtitle: `Thú cưng: ${item.pet_name || `#${item.pet_id}`}`,
        date: formatDateDisplay(item.booking_date),
        time: formatTimeDisplay(item.booking_time),
        status,
        icon: item.service_icon || "calendar-outline",
      };
    });
  }, [bookings]);

  const filteredData =
    activeFilter === "Tất cả"
      ? historyItems
      : historyItems.filter((item) => item.status === activeFilter);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Lịch sử dịch vụ</Text>

        {/* giỏ hàng */}
        <CartBadge color="#FFF" size={22} containerStyle={styles.notiBtn}/>
      </View>

      {/* ===== FILTER BAR ===== */}
      <View style={styles.filterRow}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {filters.map((item) => {
          const isActive = activeFilter === item;
          return (
            <TouchableOpacity
              key={item}
              onPress={() => setActiveFilter(item)}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
            >
              <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
        </ScrollView>
      </View>

      {/* ===== LIST ===== */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {isLoading ? "Đang tải lịch sử..." : "Chưa có lịch sử đặt lịch"}
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card} 
            activeOpacity={0.7}
            onPress={() => router.push({
              pathname: "/screens/user/stack/UserBookingDetail/BookingDetail",
              params: { bookingId: item.id }
            })}
          >
            <View style={styles.cardLeft}>
              <View style={styles.iconBox}>
                <Ionicons name={item.icon as any} size={22} color={GREEN} />
              </View>

              <View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                <Text style={styles.cardDate}>
                  {item.time ? `${item.date} • ${item.time}` : item.date}
                </Text>
              </View>
            </View>

            <StatusBadge status={item.status} />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

/* ===== STATUS BADGE ===== */
function StatusBadge({ status }: { status: HistoryStatus }) {
  const map: Record<HistoryStatus, { color: string; bg: string }> = {
    "Hoàn thành": {
      color: "#16A34A",
      bg: "#DCFCE7",
    },
    "Đang xác nhận": {
      color: "#6B7280",
      bg: "#E5E7EB",
    },
    "Đã xác nhận": {
      color: "#2563EB",
      bg: "#DBEAFE",
    },
    "Đang xin hủy": {
      color: "#D97706",
      bg: "#FEF3C7",
    },
    "Đã hủy": {
      color: "#DC2626",
      bg: "#FEE2E2",
    },
    "Chờ thanh toán": {
      color: "#6B7280",
      bg: "#E5E7EB",
    },
    "Đã thanh toán": {
      color: "#2563EB",
      bg: "#DBEAFE",
    },
  };

  const config = map[status];

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.badgeText, { color: config.color }]}>{status}</Text>
    </View>
  );
}
