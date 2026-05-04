import { api } from "@/app/services/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";
import styles from "./styles";

type UserApi = {
  id: number;
  email: string;
  name?: string | null;
};

export default function SidebarScreen(props: DrawerContentComponentProps) {
  const { navigation } = props;
  const [profileEmail, setProfileEmail] = useState("admin");
  const [profileName, setProfileName] = useState("Admin");

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const cachedEmail = (await AsyncStorage.getItem("email")) ?? "";

        const usersRes = await api.get<any>("/users");
        const users = Array.isArray(usersRes.data)
          ? usersRes.data
          : usersRes.data?.records ?? usersRes.data?.data ?? [];

        const found = (users as UserApi[]).find(
          (u) => String(u.email).trim() === cachedEmail.trim(),
        );

        if (found) {
          setProfileName(found.name || found.email);
          setProfileEmail(found.email);
        } else {
          setProfileName(cachedEmail || "Admin");
          setProfileEmail(cachedEmail || "admin");
        }
      } catch (err) {
        console.error("Error loading current user:", err);
        const fallbackEmail = (await AsyncStorage.getItem("email")) ?? "admin";
        setProfileName(fallbackEmail);
        setProfileEmail(fallbackEmail);
      }
    };

    loadCurrentUser();
  }, []);

  return (
    <View style={styles.safe}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.container}
      >
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <Ionicons name="person" size={18} color="#111827" />
            <Text style={styles.profileName}>{profileName}</Text>
          </View>
          <Text style={styles.profileEmail}>{profileEmail}</Text>
        </View>

        <View style={styles.menuCard}>
          <DrawerItem
            label="Dashboard"
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
            label="Quản lý nhân viên"
            labelStyle={styles.menuText}
            onPress={() =>
              navigation.navigate("StaffManagementScreen/StaffManagement")
            }
            icon={({ size, color }: { size: number; color: string }) => (
              <Ionicons name="id-card" size={size} color={color} />
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
