import { Ionicons } from "@expo/vector-icons";
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
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
};

type EditableField = keyof UserProfile;

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

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "Nguyễn Văn A",
    gender: "",
    dob: "",
    phone: "0758519048",
    email: "nguyenvana@gmail.com",
    address: "",
  });

  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [draftValue, setDraftValue] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const updateField = (field: EditableField, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const openDobPicker = () => {
    if (Platform.OS !== "android") {
      Alert.alert("Thông báo", "Date picker hiện được bật cho Android.");
      return;
    }

    DateTimePickerAndroid.open({
      value: parseDob(profile.dob),
      mode: "date",
      onChange: (_event: DateTimePickerEvent, selectedDate?: Date) => {
        if (selectedDate) {
          updateField("dob", formatDate(selectedDate));
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

  const saveTextField = () => {
    if (!editingField) return;
    updateField(editingField, draftValue.trim());
    setEditingField(null);
    Alert.alert("Thành công", "Đã cập nhật thông tin.");
  };

  const openChangePassword = () => {
    setShowChangePassword(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const cancelChangePassword = () => {
    setShowChangePassword(false);
  };

  const saveNewPassword = () => {
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

    setShowChangePassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    Alert.alert("Thành công", "Đổi mật khẩu thành công.");
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
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
          }}
          style={styles.cover}
        />

        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Text style={styles.name}>{profile.name || "Người dùng"}</Text>

            <TouchableOpacity
              style={styles.signOut}
              activeOpacity={0.7}
              onPress={() => router.replace("/screens/auth/LoginScreen/Login")}
            >
              <Ionicons name="log-out-outline" size={16} color="#EF4444" />
              <Text style={styles.signOutText}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>

          {renderInfoRow("name", "person-outline", "Tên", profile.name)}
          {renderInfoRow("gender", "male-female-outline", "Giới tính", profile.gender)}
          {renderInfoRow("dob", "calendar-outline", "Ngày sinh", profile.dob)}
          {renderInfoRow("phone", "call-outline", "Số điện thoại", profile.phone)}
          {renderInfoRow("email", "mail-outline", "Email", profile.email)}
          {renderInfoRow("address", "location-outline", "Địa chỉ", profile.address)}
        </View>

        <View style={styles.securityCard}>
          <Text style={styles.securityTitle}>Bảo mật</Text>
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

        {editingField && editingField !== "gender" && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>{UPDATE_TITLES[editingField]}</Text>
            <TextInput
              style={styles.input}
              value={draftValue}
              onChangeText={setDraftValue}
              placeholder={EMPTY_TEXT}
              placeholderTextColor="#9CA3AF"
              keyboardType={editingField === "phone" ? "phone-pad" : editingField === "email" ? "email-address" : "default"}
              autoCapitalize={editingField === "email" ? "none" : "sentences"}
            />

            <View style={styles.formActions}>
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
        )}

        {editingField === "gender" && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Chọn giới tính</Text>
            <View style={styles.genderOptions}>
              {(["Nam", "Nữ", "Khác"] as const).map((option) => {
                const active = profile.gender === option;
                return (
                  <TouchableOpacity
                    key={option}
                    style={[styles.genderOption, active && styles.genderOptionActive]}
                    onPress={() => {
                      updateField("gender", option);
                      setEditingField(null);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.genderOptionText, active && styles.genderOptionTextActive]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {showChangePassword && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Đổi mật khẩu</Text>
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

            <View style={styles.formActions}>
              <TouchableOpacity
                style={[styles.formBtn, styles.cancelBtn]}
                onPress={cancelChangePassword}
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
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
