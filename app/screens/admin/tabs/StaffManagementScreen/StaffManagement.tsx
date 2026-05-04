import {
  useStaff,
  useCreateStaff,
  useUpdateStaff,
  useDeleteStaff,
} from "@/app/utils/hook/useStaff";
import { Staff } from "@/app/utils/models/staff";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { uploadPetImageApi } from "@/app/services/authPet";
import { getImageUrl } from "@/app/services/api";
import styles from "./styles";

export default function StaffManagementScreen() {
  const navigation = useNavigation();
  const { data: staffData, isLoading } = useStaff();
  const { mutateAsync: createStaff, isPending: isCreating } = useCreateStaff();
  const { mutateAsync: updateStaff, isPending: isUpdating } = useUpdateStaff();
  const { mutateAsync: deleteStaff, isPending: isDeleting } = useDeleteStaff();

  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [formData, setFormData] = useState({ name: "", phone: "", specialty: "", avatar: "" });

  const staffList = useMemo(() => {
    const list = Array.isArray(staffData) ? staffData : (staffData as any)?.data ?? [];
    if (!search.trim()) return list;

    const keyword = search.trim().toLowerCase();
    return list.filter((s: Staff) => {
      const target = `${s.name ?? ""} ${s.phone ?? ""} ${s.specialty ?? ""}`.toLowerCase();
      return target.includes(keyword);
    });
  }, [staffData, search]);

  const openForm = (staff?: Staff) => {
    if (staff) {
      setEditingStaff(staff);
      setFormData({
        name: staff.name,
        phone: staff.phone || "",
        specialty: staff.specialty || "",
        avatar: staff.avatar || "",
      });
    } else {
      setEditingStaff(null);
      setFormData({ name: "", phone: "", specialty: "", avatar: "" });
    }
    setModalVisible(true);
  };

  const closeForm = () => {
    setModalVisible(false);
    setEditingStaff(null);
    setFormData({ name: "", phone: "", specialty: "", avatar: "" });
  };

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      try {
        const { url } = await uploadPetImageApi(uri);
        setFormData((prev) => ({ ...prev, avatar: url }));
      } catch (error) {
        Alert.alert("Lỗi", "Không thể tải ảnh lên. Vui lòng thử lại.");
      }
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.phone.trim() || !formData.specialty.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ các thông tin bắt buộc (*)");
      return;
    }

    try {
      if (editingStaff) {
        await updateStaff({
          id: editingStaff.id,
          name: formData.name,
          phone: formData.phone,
          specialty: formData.specialty,
          avatar: formData.avatar,
        });
        Alert.alert("Thành công", "Đã cập nhật thông tin nhân viên");
      } else {
        await createStaff({
          name: formData.name,
          phone: formData.phone,
          specialty: formData.specialty,
          avatar: formData.avatar,
        });
        Alert.alert("Thành công", "Đã thêm nhân viên mới");
      }
      closeForm();
    } catch {
      Alert.alert("Lỗi", "Không thể lưu thông tin nhân viên");
    }
  };

  const onToggleActive = (s: Staff) => {
    const isCurrentlyActive = s.is_active !== false;
    const actionText = isCurrentlyActive ? "cho nghỉ việc" : "kích hoạt lại";

    Alert.alert(`Xác nhận`, `Bạn có chắc chắn muốn ${actionText} nhân viên này?`, [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xác nhận",
        style: isCurrentlyActive ? "destructive" : "default",
        onPress: async () => {
          try {
            if (isCurrentlyActive) {
              await deleteStaff(s.id);
            } else {
              await updateStaff({ id: s.id, is_active: true });
            }
          } catch {
            Alert.alert("Lỗi", `Không thể cập nhật trạng thái nhân viên.`);
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
          <Text style={styles.headerTitle}>Quản lý nhân viên</Text>
        </View>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.containerNoPadTop}>

        <TextInput
          placeholder="Tìm nhân viên..."
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />

        <TouchableOpacity style={styles.addBtn} onPress={() => openForm()}>
          <Ionicons name="add-circle-outline" size={24} color="#FFF" />
          <Text style={styles.addBtnText}>Thêm nhân viên</Text>
        </TouchableOpacity>

        <View style={styles.sectionDivider} />

        {isLoading && <Text style={styles.stateText}>Đang tải danh sách...</Text>}

        {!isLoading && staffList.length === 0 && (
          <Text style={styles.stateText}>Không tìm thấy nhân viên nào.</Text>
        )}

        {!isLoading &&
          staffList.map((s: Staff) => (
            <View key={s.id} style={styles.staffCard}>
              <View style={styles.staffHeader}>
                <View style={styles.staffAvatarRow}>
                  <Image
                    source={
                      s.avatar
                        ? { uri: getImageUrl(s.avatar) }
                        : require("@/app/assets/images/no_avt.jpg")
                    }
                    style={styles.staffAvatar}
                  />
                  <Text style={styles.staffName}>{s.name}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    s.is_active !== false ? styles.statusBadgeActive : styles.statusBadgeInactive,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      s.is_active !== false ? styles.statusTextActive : styles.statusTextInactive,
                    ]}
                  >
                    {s.is_active !== false ? "Đang làm việc" : "Đã nghỉ"}
                  </Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Số điện thoại:</Text>
                <Text style={styles.infoValue}>{s.phone || "Chưa có"}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Chuyên môn:</Text>
                <Text style={styles.infoValue}>{s.specialty || "Chưa có"}</Text>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => openForm(s)}
                  disabled={isDeleting || isUpdating}
                >
                  <Text style={styles.editBtnText}>Sửa</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.deleteBtn,
                    s.is_active === false && { backgroundColor: "#D1FAE5" },
                  ]}
                  onPress={() => onToggleActive(s)}
                  disabled={isDeleting || isUpdating}
                >
                  <Ionicons 
                    name={s.is_active !== false ? "lock-closed-outline" : "lock-open-outline"} 
                    size={16} 
                    color={s.is_active !== false ? "#DC2626" : "#5CB15A"} 
                  />
                  <Text
                    style={[
                      styles.deleteBtnText,
                      s.is_active === false && { color: "#5CB15A" },
                    ]}
                  >
                    {s.is_active !== false ? "Cho nghỉ" : "Khôi phục"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal Form */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingStaff ? "Sửa nhân viên" : "Thêm nhân viên"}
            </Text>

            <TouchableOpacity style={styles.avatarWrap} onPress={pickAvatar}>
              <Image
                source={
                  formData.avatar
                    ? { uri: getImageUrl(formData.avatar) }
                    : require("@/app/assets/images/no_avt.jpg")
                }
                style={styles.avatar}
              />
              <View style={styles.avatarEditIcon}>
                <Ionicons name="pencil" size={12} color="#111827" />
              </View>
            </TouchableOpacity>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tên nhân viên (*)</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Nhập tên..."
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Số điện thoại (*)</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                placeholder="Nhập số điện thoại..."
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Chuyên môn (*)</Text>
              <TextInput
                style={styles.input}
                value={formData.specialty}
                onChangeText={(text) => setFormData({ ...formData, specialty: text })}
                placeholder="VD: Cắt tỉa, Tắm spa..."
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={closeForm}
                disabled={isCreating || isUpdating}
              >
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSave}
                disabled={isCreating || isUpdating}
              >
                <Text style={styles.saveBtnText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
