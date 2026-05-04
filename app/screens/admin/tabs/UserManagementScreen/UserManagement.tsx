import { UserResponse } from "@/app/services/authLogin";
import { useUpdateUser, useUsers } from "@/app/utils/hook/useLogin";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import React, { useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles";

export default function UserManagementScreen() {
  const navigation = useNavigation();
  const { data: users, isLoading } = useUsers();
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser();
  const [search, setSearch] = useState("");

  const userList = useMemo(() => {
    const list = Array.isArray(users)
      ? users
      : ((users as unknown as { data?: UserResponse[] })?.data ?? []);

    const keyword = search.trim().toLowerCase();
    if (!keyword) return list;

    return list.filter((u) => {
      const target = `${u.email ?? ""} ${u.name ?? ""} ${u.phone ?? ""}`.toLowerCase();
      return target.includes(keyword);
    });
  }, [users, search]);

  const onToggleActive = (u: UserResponse) => {
    const isCurrentlyActive = u.is_active !== false;
    const actionText = isCurrentlyActive ? "khóa" : "kích hoạt";

    Alert.alert(`Xác nhận ${actionText}`, `Bạn có chắc chắn muốn ${actionText} tài khoản này?`, [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xác nhận",
        style: isCurrentlyActive ? "destructive" : "default",
        onPress: async () => {
          try {
            await updateUser({ id: u.id, is_active: !isCurrentlyActive });
          } catch {
            Alert.alert("Lỗi", `Không thể ${actionText} tài khoản.`);
          }
        },
      },
    ]);
  };

  const onToggleRole = (u: UserResponse) => {
    const currentRole = u.role || "user";
    const newRole = currentRole === "admin" ? "user" : "admin";
    const actionText = currentRole === "admin" ? "đổi thành User" : "đổi thành Admin";
    
    Alert.alert("Thay đổi quyền", `Bạn có chắc chắn muốn ${actionText} cho tài khoản ${u.email}?`, [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xác nhận",
        onPress: async () => {
          try {
            await updateUser({ id: u.id, role: newRole });
            Alert.alert("Thành công", "Đã cập nhật quyền.");
          } catch {
            Alert.alert("Lỗi", "Không thể cập nhật quyền.");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
            <Ionicons name="menu" size={20} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Quản lý người dùng</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.containerNoPadTop}>

        <TextInput
          placeholder="Tìm người dùng..."
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />

        <View style={styles.sectionDivider} />

        {isLoading && <Text style={styles.stateText}>Đang tải người dùng...</Text>}

        {!isLoading && userList.length === 0 && (
          <Text style={styles.stateText}>Không có người dùng nào.</Text>
        )}

        {!isLoading &&
          userList.map((u) => (
            <View key={u.id} style={styles.userCard}>
              <View style={styles.userHeader}>
                <View style={styles.userNameRow}>
                  <Ionicons name="person" size={18} color="#111827" />
                  <Text style={styles.userName}>{u.name || (u.email ? u.email.split("@")[0] : "Người dùng")}</Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  u.is_active !== false ? styles.statusBadgeActive : styles.statusBadgeInactive
                ]}>
                  <Text style={[
                    styles.statusBadgeText,
                    u.is_active !== false ? styles.statusTextActive : styles.statusTextInactive
                  ]}>
                    {u.is_active !== false ? "Đang hoạt động" : "Đã bị khóa"}
                  </Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email:</Text>
                <Text style={styles.infoValue}>{u.email}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Số điện thoại:</Text>
                <Text style={styles.infoValue}>{u.phone || "Chưa có"}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Vai trò:</Text>
                <Text style={styles.infoValue}>{u.role || "user"}</Text>
              </View>

              <View style={styles.actionRow}>
                <View style={styles.roleToggleContainer}>
                  <TouchableOpacity
                    style={[styles.rolePill, u.role === "admin" && styles.rolePillActiveAdmin]}
                    onPress={() => u.role !== "admin" && onToggleRole(u)}
                    disabled={isUpdating}
                  >
                    <Text style={[styles.rolePillText, u.role === "admin" && styles.rolePillTextActive]}>Admin</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.rolePill, u.role !== "admin" && styles.rolePillActiveUser]}
                    onPress={() => u.role === "admin" && onToggleRole(u)}
                    disabled={isUpdating}
                  >
                    <Text style={[styles.rolePillText, u.role !== "admin" && styles.rolePillTextActive]}>User</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[styles.deleteBtn, isUpdating && styles.disabledOpacity, u.is_active === false && styles.deleteBtnRestore]}
                  onPress={() => onToggleActive(u)}
                  disabled={isUpdating}
                >
                  <Ionicons name={u.is_active !== false ? "lock-closed-outline" : "lock-open-outline"} size={16} color={u.is_active !== false ? "#DC2626" : "#FFFFFF"} />
                  <Text style={[styles.deleteBtnText, u.is_active === false && styles.deleteBtnTextRestore]}>
                    {u.is_active !== false ? "Khóa tài khoản" : "Kích hoạt"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}
