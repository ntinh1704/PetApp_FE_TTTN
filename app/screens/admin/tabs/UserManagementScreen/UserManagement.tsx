import { UserResponse } from "@/app/services/authLogin";
import { useUpdateUser, useUsers } from "@/app/utils/hook/useLogin";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
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
      <View style={[styles.header, { marginHorizontal: 12, marginTop: 12 }]}>
        <View style={styles.headerLeft}>
          <Pressable
            style={styles.iconButton}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
            <Ionicons name="menu" size={20} color="#FFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Quản lý người dùng</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={[styles.container, { paddingTop: 0 }]}>

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
                <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                  <Ionicons name="person" size={18} color="#111827" />
                  <Text style={styles.userName}>{u.name || (u.email ? u.email.split("@")[0] : "Người dùng")}</Text>
                </View>
                <View style={[
                  { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
                  u.is_active !== false ? { backgroundColor: "#D1FAE5" } : { backgroundColor: "#FEE2E2" }
                ]}>
                  <Text style={[
                    { fontSize: 11, fontWeight: "600" },
                    u.is_active !== false ? { color: "#065F46" } : { color: "#991B1B" }
                  ]}>
                    {u.is_active !== false ? "Đang hoạt động" : "Đã bị khóa"}
                  </Text>
                </View>
              </View>
              <Text style={styles.userInfo}>Email: {u.email}</Text>
              <Text style={styles.userInfo}>Phone: {u.phone || "Chưa có"}</Text>
              <Text style={styles.userInfo}>Role: {u.role || "user"}</Text>

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
                  style={[styles.deleteBtn, isUpdating && { opacity: 0.5 }, u.is_active === false && { backgroundColor: "#5CB15A" }]}
                  onPress={() => onToggleActive(u)}
                  disabled={isUpdating}
                >
                  <Ionicons name={u.is_active !== false ? "lock-closed-outline" : "lock-open-outline"} size={16} color={u.is_active !== false ? "#DC2626" : "#FFFFFF"} />
                  <Text style={[styles.deleteBtnText, { color: u.is_active !== false ? "#DC2626" : "#FFFFFF", marginLeft: 4 }]}>
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
