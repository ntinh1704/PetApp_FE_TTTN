import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import styles from "./styles";

export default function BookingManagementScreen() {
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
            <Text style={styles.headerTitle}>Quản lý đặt lịch</Text>
          </View>
        </View>

        <TextInput
          placeholder="Tìm lịch đặt..."
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
        />

        <View style={styles.sectionDivider} />

        <View style={styles.bookingCard}>
          <Text style={styles.bookingInfo}>Khách: Nguyễn Văn A</Text>
          <Text style={styles.bookingInfo}>Thú cưng: Husky</Text>
          <Text style={styles.bookingInfo}>Dịch vụ: Cắt tỉa</Text>
          <Text style={styles.bookingInfo}>Ngày: 20/03</Text>
          <View style={styles.actionRow}>
            <Text style={styles.actionButton}>Xác nhận</Text>
            <Text style={styles.actionButton}>Hủy</Text>
          </View>
        </View>

        <View style={styles.sectionDivider} />

        <View style={styles.bookingCard}>
          <Text style={styles.bookingInfo}>Khách: Trần B</Text>
          <Text style={styles.bookingInfo}>Thú cưng: Poodle</Text>
          <Text style={styles.bookingInfo}>Dịch vụ: Tiêm phòng</Text>
          <View style={styles.actionRow}>
            <Text style={styles.actionButton}>Xem chi tiết</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
