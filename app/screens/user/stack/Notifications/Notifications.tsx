import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { styles } from "./styles";

/* ===== TYPES ===== */
type NotificationItem = {
  id: string;
  text: string;
  isRead: boolean;
};

type SectionData = {
  title: string;
  items: NotificationItem[];
};

export default function NotificationsScreen() {
  const [sections, setSections] = useState<SectionData[]>([
    {
      title: "Hôm nay",
      items: [
        {
          id: "1",
          text: "Thanh toán của bạn đã thành công, đơn hàng đang được giao",
          isRead: false,
        },
        {
          id: "2",
          text: "Yêu cầu đặt lịch đã được chấp nhận",
          isRead: true,
        },
      ],
    },
    {
      title: "25/09",
      items: [
        {
          id: "3",
          text: "Thanh toán của bạn đã thành công, đơn hàng đang được giao",
          isRead: true,
        },
        {
          id: "4",
          text: "Yêu cầu đặt lịch đã được chấp nhận",
          isRead: true,
        },
        {
          id: "5",
          text: "Đừng quên tiêm phòng đúng lịch cho thú cưng",
          isRead: false,
        },
      ],
    },
  ]);

  const markAsRead = (sectionIndex: number, itemId: string) => {
    setSections((prev) =>
      prev.map((section, sIndex) =>
        sIndex !== sectionIndex
          ? section
          : {
              ...section,
              items: section.items.map((item) =>
                item.id === itemId
                  ? { ...item, isRead: true }
                  : item
              ),
            }
      )
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#FFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Thông báo</Text>

        <View style={{ width: 22 }} />
      </View>

      {/* ===== CONTENT ===== */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {sections.map((section, index) => (
          <Section
            key={section.title}
            sectionIndex={index}
            title={section.title}
            items={section.items}
            onRead={markAsRead}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ===== SECTION ===== */
function Section({
  title,
  items,
  sectionIndex,
  onRead,
}: {
  title: string;
  items: NotificationItem[];
  sectionIndex: number;
  onRead: (sectionIndex: number, itemId: string) => void;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>

      <View style={styles.card}>
        {items.map((item) => (
          <NotificationRow
            key={item.id}
            item={item}
            onPress={() => onRead(sectionIndex, item.id)}
          />
        ))}
      </View>
    </View>
  );
}

/* ===== ROW WITH ANIMATION ===== */
function NotificationRow({
  item,
  onPress,
}: {
  item: NotificationItem;
  onPress: () => void;
}) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

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
        style={styles.row}
        activeOpacity={0.8}
        onPress={onPress}
      >
        <View style={styles.iconBox}>
          <Ionicons
            name={getIcon(item.text)}
            size={18}
            color="#5CB15A"
          />
          {!item.isRead && <View style={styles.unreadDot} />}
        </View>

        <Text
          style={[
            styles.rowText,
            !item.isRead && styles.unreadText,
          ]}
        >
          {item.text}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

/* ===== ICON LOGIC ===== */
function getIcon(text: string) {
  if (text.includes("Thanh toán")) return "bag-handle-outline";
  if (text.includes("đặt lịch")) return "checkmark-outline";
  return "heart-outline";
}
