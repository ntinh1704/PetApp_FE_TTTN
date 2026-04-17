import { api, getImageUrl } from "@/app/services/api";
import { uploadPetImageApi } from "@/app/services/authPet";
import GenderDropdown from "@/app/utils/components/GenderDropdown";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { styles } from "./styles";

type UserProfile = {
  name: string;
  gender: "Nam" | "Nữ" | "Khác" | "";
  dob: string;
  phone: string;
  email: string;
  address: string;
  avatar: string;
};

type EditableField = keyof Omit<UserProfile, "avatar">;

type UserApi = {
  id: number;
  name?: string | null;
  gender?: string | null;
  dob?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  avatar?: string | null;
};

const EMPTY_TEXT = "Chưa thiết lập";

const UPDATE_TITLES: Record<EditableField, string> = {
  name: "Cập nhật Tên",
  gender: "Cập nhật Giới tính",
  dob: "Cập nhật Ngày sinh",
  phone: "Cập nhật Số điện thoại",
  email: "Cập nhật Email",
  address: "Cập nhật Địa chỉ",
};

const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const parseDob = (value: string) => {
  const [day, month, year] = value.split("/").map(Number);
  if (!day || !month || !year) return new Date();
  return new Date(year, month - 1, day);
};

const resolveDisplayName = (identifier?: string | null) => {
  if (!identifier) return "Người dùng";
  const trimmed = identifier.trim();
  if (!trimmed) return "Người dùng";
  return trimmed.includes("@") ? trimmed.split("@")[0] || "Người dùng" : trimmed;
};

const isEmailIdentifier = (identifier?: string | null) => {
  if (!identifier) return false;
  return identifier.includes("@");
};

export default function ProfileScreen() {
  const [userId, setUserId] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    gender: "",
    dob: "",
    phone: "",
    email: "",
    address: "",
    avatar: "",
  });

  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [draftValue, setDraftValue] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const displayName = useMemo(() => {
    return resolveDisplayName(email);
  }, [profile.name, email]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const cachedEmail = (await AsyncStorage.getItem("email")) ?? "";
        setEmail(cachedEmail);

        const usersRes = await api.get<any>("/users");
        const users = Array.isArray(usersRes.data)
          ? usersRes.data
          : usersRes.data?.records ?? usersRes.data?.data ?? [];

        const found = (users as UserApi[]).find(
          (u) => String(u.email).trim() === cachedEmail.trim(),
        );

        if (!found) {
          setProfile((prev) => ({
            ...prev,
            name: resolveDisplayName(cachedEmail),
            email: cachedEmail,
          }));
          return;
        }

        setUserId(Number(found.id));
        setProfile({
          name: (found.name ?? "").trim() || resolveDisplayName(found.email),
          gender: ((found.gender as UserProfile["gender"]) ?? "") || "",
          dob: found.dob ?? "",
          phone: found.phone ?? "",
          email: found.email ?? "",
          address: found.address ?? "",
          avatar: found.avatar ?? "",
        });
      } catch {
        const fallbackEmail = (await AsyncStorage.getItem("email")) ?? "";
        setEmail(fallbackEmail);
        setProfile((prev) => ({
          ...prev,
          name: resolveDisplayName(fallbackEmail),
          email: fallbackEmail,
        }));
      }
    };

    loadProfile();
  }, []);

  const saveProfile = async (nextProfile: UserProfile, successText?: string) => {
    if (!userId) {
      Alert.alert("Lỗi", "Không xác định được người dùng hiện tại.");
      return false;
    }

    try {
      await api.put("/users/", {
        id: userId,
        name: nextProfile.name.trim() || null,
        gender: nextProfile.gender || null,
        dob: nextProfile.dob.trim() || null,
        phone: nextProfile.phone.trim() || null,
        email: nextProfile.email.trim() || null,
        address: nextProfile.address.trim() || null,
        avatar: nextProfile.avatar || null,
      });

      setProfile(nextProfile);
      if (successText) Alert.alert("Thành công", successText);
      return true;
    } catch {
      Alert.alert("Lỗi", "Không thể cập nhật thông tin. Vui lòng thử lại.");
      return false;
    }
  };

  const openDobPicker = () => {
    if (Platform.OS !== "android") {
      Alert.alert("Thông báo", "Date picker hiện được bật cho Android.");
      return;
    }

    DateTimePickerAndroid.open({
      value: parseDob(profile.dob),
      mode: "date",
      onChange: async (_event: DateTimePickerEvent, selectedDate?: Date) => {
        if (selectedDate) {
          const nextProfile = { ...profile, dob: formatDate(selectedDate) };
          await saveProfile(nextProfile, "Đã cập nhật ngày sinh.");
        }
      },
    });
  };

  const onPressField = (field: EditableField) => {
    if (field === "dob") {
      openDobPicker();
      return;
    }

    setEditingField(field);
    setDraftValue(profile[field]);
  };

  const saveTextField = async () => {
    if (!editingField) return;
    if (!draftValue.trim()) {
      Alert.alert("Thiếu thông tin", "Trường này không được để trống.");
      return;
    }
    const nextProfile = { ...profile, [editingField]: draftValue.trim() } as UserProfile;
    const ok = await saveProfile(nextProfile, "Đã cập nhật thông tin.");
    if (ok) setEditingField(null);
  };

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return;
    const uri = result.assets[0]?.uri;
    if (!uri) return;

    try {
      const { url } = await uploadPetImageApi(uri);
      const nextProfile = { ...profile, avatar: url };
      await saveProfile(nextProfile, "Đã cập nhật ảnh đại diện.");
    } catch (error: any) {
      const detail =
        error?.response?.data?.detail ||
        error?.message ||
        "Không thể tải ảnh lên.";
      Alert.alert("Lỗi", String(detail));
    }
  };

  const openChangePassword = () => {
    setShowChangePassword(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const saveNewPassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ mật khẩu.");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Mật khẩu yếu", "Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Không khớp", "Mật khẩu xác nhận không khớp.");
      return;
    }

    if (!userId) {
      Alert.alert("Lỗi", "Không xác định được người dùng hiện tại.");
      return;
    }

    try {
      await api.put("/users/", { id: userId, password: newPassword });
      setShowChangePassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      Alert.alert("Thành công", "Đổi mật khẩu thành công.");
    } catch {
      Alert.alert("Lỗi", "Không thể đổi mật khẩu.");
    }
  };

  const renderInfoRow = (
    field: EditableField,
    icon: keyof typeof Ionicons.glyphMap,
    label: string,
    value: string,
  ) => {
    const isMissing = !value;

    return (
      <TouchableOpacity
        style={styles.profileRow}
        activeOpacity={0.8}
        onPress={() => onPressField(field)}
      >
        <View style={styles.profileRowLeft}>
          <Ionicons name={icon} size={16} color="#4B5563" />
          <Text style={styles.profileLabel}>{label}</Text>
        </View>

        <View style={styles.profileRowRight}>
          <Text style={[styles.profileValue, isMissing && styles.profileValueMissing]}>
            {isMissing ? "Thiết lập ngay" : value}
          </Text>
          <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
        </View>
      </TouchableOpacity>
    );
  };

  const handleSignOut = async () => {
    await AsyncStorage.multiRemove(["accessToken", "email", "cart_items"]);
    router.replace("/screens/auth/LoginScreen/Login");
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={22} color="#FFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Tôi</Text>

        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <TouchableOpacity style={styles.avatarWrap} onPress={pickAvatar} activeOpacity={0.85}>
              <Image
                source={
                  profile.avatar
                    ? { uri: getImageUrl(profile.avatar) }
                    : require("@/app/assets/images/no_avt.jpg")
                }
                style={styles.avatar}
              />
              <View style={styles.avatarEditIcon}>
                <Ionicons name="pencil" size={12} color="#FFF" />
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.signOut}
            activeOpacity={0.7}
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={16} color="#EF4444" />
            <Text style={styles.signOutText}>Đăng xuất</Text>
          </TouchableOpacity>

          {renderInfoRow("name", "person-outline", "Tên", profile.name)}

          {/* Giới tính - Dropdown inline */}
          <View style={[styles.profileRow, { zIndex: 10 }]}>
            <View style={styles.profileRowLeft}>
              <Ionicons name="male-female-outline" size={16} color="#4B5563" />
              <Text style={styles.profileLabel}>Giới tính</Text>
            </View>
            <GenderDropdown
              value={profile.gender}
              options={["Nam", "Nữ", "Khác"]}
              placeholder="Chọn"
              onSelect={async (v) => {
                const nextProfile = { ...profile, gender: v as any };
                await saveProfile(nextProfile, "Đã cập nhật giới tính.");
              }}
              style={{ minWidth: 120 }}
            />
          </View>

          {renderInfoRow("dob", "calendar-outline", "Ngày sinh", profile.dob)}
          {renderInfoRow("phone", "call-outline", "Số điện thoại", profile.phone)}
          {renderInfoRow("email", "mail-outline", "Email", profile.email)}
          {renderInfoRow("address", "location-outline", "Địa chỉ", profile.address)}
        </View>

        <View style={styles.securityCard}>
          <Text style={styles.securityTitle}>Tiện ích</Text>

          {/* Chat với AI */}
          {/* <TouchableOpacity
            style={styles.securityRow}
            activeOpacity={0.8}
            onPress={() => router.push("/screens/user/stack/ChatScreen/ChatScreen")}
          >
            <View style={styles.securityLeft}>
              <Ionicons name="chatbubble-outline" size={16} color="#4B5563" />
              <Text style={styles.securityLabel}>Chat với AI</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
          </TouchableOpacity> */}

          {/* Đổi mật khẩu */}
          <TouchableOpacity
            style={styles.securityRow}
            activeOpacity={0.8}
            onPress={openChangePassword}
          >
            <View style={styles.securityLeft}>
              <Ionicons name="lock-closed-outline" size={16} color="#4B5563" />
              <Text style={styles.securityLabel}>Đổi mật khẩu</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ===== MODAL: Edit text field ===== */}
      <Modal
        animationType="fade"
        transparent
        visible={!!editingField && editingField !== "gender"}
        onRequestClose={() => setEditingField(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingField ? UPDATE_TITLES[editingField] : ""}
            </Text>
            <TextInput
              style={styles.input}
              value={draftValue}
              onChangeText={setDraftValue}
              placeholder={EMPTY_TEXT}
              placeholderTextColor="#9CA3AF"
              keyboardType={editingField === "phone" ? "phone-pad" : editingField === "email" ? "email-address" : "default"}
              autoCapitalize={editingField === "email" ? "none" : "sentences"}
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.formBtn, styles.cancelBtn]}
                onPress={() => setEditingField(null)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.formBtn, styles.saveBtn]}
                onPress={saveTextField}
                activeOpacity={0.8}
              >
                <Text style={styles.saveBtnText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>



      {/* ===== MODAL: Change password ===== */}
      <Modal
        animationType="fade"
        transparent
        visible={showChangePassword}
        onRequestClose={() => setShowChangePassword(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Đổi mật khẩu</Text>
            <TextInput
              style={styles.input}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Mật khẩu hiện tại"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
            />
            <TextInput
              style={[styles.input, styles.passwordInput]}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Mật khẩu mới"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
            />
            <TextInput
              style={[styles.input, styles.passwordInput]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Xác nhận mật khẩu mới"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.formBtn, styles.cancelBtn]}
                onPress={() => setShowChangePassword(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.formBtn, styles.saveBtn]}
                onPress={saveNewPassword}
                activeOpacity={0.8}
              >
                <Text style={styles.saveBtnText}>Cập nhật</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
