import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { histories, type HistoryStatus } from "@/app/utils/data/histories";
import { GREEN, styles } from "./styles";

const filters = [
  "Tất cả",
  "Đang xác nhận",
  "Đã xác nhận",
  "Hoàn thành",
  "Đã hủy",
];

export default function HistoryScreen() {
  const [activeFilter, setActiveFilter] = useState("Tất cả");

  const filteredData =
    activeFilter === "Tất cả"
      ? histories
      : histories.filter((item) => item.status === activeFilter);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Lịch sử dịch vụ</Text>

        {/* giữ title ở giữa */}
        <View style={{ width: 24 }} />
      </View>

      {/* ===== FILTER BAR ===== */}
      <View style={styles.filterBar}>
        {filters.map((item) => {
          const isActive = activeFilter === item;
          return (
            <TouchableOpacity
              key={item}
              onPress={() => setActiveFilter(item)}
              style={[styles.filterItem, isActive && styles.filterItemActive]}
            >
              <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ===== LIST ===== */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
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
          </View>
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
    "Đã hủy": {
      color: "#DC2626",
      bg: "#FEE2E2",
    },
  };

  const config = map[status];

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.badgeText, { color: config.color }]}>{status}</Text>
    </View>
  );
}
