import { Ionicons } from "@expo/vector-icons";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { router } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import styles from "./styles";

export default function SidebarScreen(props: DrawerContentComponentProps) {
  const { navigation } = props;

  return (
    <View style={styles.safe}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.container}
      >
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <Ionicons name="person" size={18} color="#111827" />
            <Text style={styles.profileName}>Admin</Text>
          </View>
          <Text style={styles.profileEmail}>admin@gmail.com</Text>
        </View>

        <View style={styles.menuCard}>
          <DrawerItem
            label="Tổng quan"
            labelStyle={styles.menuText}
            onPress={() => navigation.navigate("DashboardScreen/Dashboard")}
            icon={({ size, color }: { size: number; color: string }) => (
              <Ionicons name="grid" size={size} color={color} />
            )}
            style={styles.menuItem}
            inactiveTintColor="#111827"
          />
          <DrawerItem
            label="Quản lý đặt lịch"
            labelStyle={styles.menuText}
            onPress={() =>
              navigation.navigate("BookingManagementScreen/BookingManagement")
            }
            icon={({ size, color }: { size: number; color: string }) => (
              <Ionicons name="calendar" size={size} color={color} />
            )}
            style={styles.menuItem}
            inactiveTintColor="#111827"
          />
          <DrawerItem
            label="Quản lý dịch vụ"
            labelStyle={styles.menuText}
            onPress={() =>
              navigation.navigate("ServiceManagementScreen/ServiceManagement")
            }
            icon={({ size, color }: { size: number; color: string }) => (
              <Ionicons name="briefcase" size={size} color={color} />
            )}
            style={styles.menuItem}
            inactiveTintColor="#111827"
          />
          <DrawerItem
            label="Quản lý người dùng"
            labelStyle={styles.menuText}
            onPress={() =>
              navigation.navigate("UserManagementScreen/UserManagement")
            }
            icon={({ size, color }: { size: number; color: string }) => (
              <Ionicons name="people" size={size} color={color} />
            )}
            style={styles.menuItem}
            inactiveTintColor="#111827"
          />
          <View style={styles.menuDivider} />
          <DrawerItem
            label="Đăng xuất"
            labelStyle={styles.menuText}
            onPress={() => router.replace("/screens/auth/LoginScreen/Login")}
            icon={({ size, color }: { size: number; color: string }) => (
              <Ionicons name="log-out" size={size} color={color} />
            )}
            style={styles.menuItem}
            inactiveTintColor="#111827"
          />
        </View>
      </DrawerContentScrollView>
    </View>
  );
}
