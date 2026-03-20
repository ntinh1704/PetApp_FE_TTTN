import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import styles from "./styles";

export default function DashboardScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Pressable
              style={styles.iconButton}
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            >
              <Ionicons name="menu" size={20} color="#FFF" />
            </Pressable>
            <Text style={styles.headerTitle}>Tổng quan</Text>
          </View>
          <View style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={20} color="#FFF" />
          </View>
        </View>

        <View style={styles.statGrid}>
          <View style={styles.statCard}>
            <View style={styles.statLabel}>
              <Ionicons name="people" size={16} color="#111827" />
              <Text style={styles.statText}>Tổng người dùng</Text>
            </View>
            <Text style={styles.statValue}>120</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statLabel}>
              <Ionicons name="paw" size={16} color="#111827" />
              <Text style={styles.statText}>Tổng thú cưng</Text>
            </View>
            <Text style={styles.statValue}>78</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statLabel}>
              <Ionicons name="calendar" size={16} color="#111827" />
              <Text style={styles.statText}>Tổng lịch đặt</Text>
            </View>
            <Text style={styles.statValue}>45</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statLabel}>
              <Ionicons name="cash" size={16} color="#111827" />
              <Text style={styles.statText}>Doanh thu</Text>
            </View>
            <Text style={styles.statValue}>$2,340</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lịch đặt trong tuần</Text>
          <View style={styles.chartPlaceholder}>
            <Ionicons name="stats-chart" size={20} color="#6B7280" />
            <Text style={styles.chartText}>Biểu đồ đường</Text>
          </View>
          <Text style={styles.chartAxis}>T2  T3  T4  T5  T6  T7  CN</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lịch đặt gần đây</Text>
          <View style={styles.recentItem}>
            <Text style={styles.recentText}>Nguyễn A - Cắt tỉa</Text>
          </View>
          <View style={styles.recentItem}>
            <Text style={styles.recentText}>Trần B - Tiêm phòng</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
