import { api, getImageUrl } from "@/app/services/api";
import {
  useCreateService,
  useDeleteService,
  useServices,
  useUpdateService,
} from "@/app/utils/hook/useService";
import { Service } from "@/app/utils/models/service";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import React, { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Switch,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { uploadPetImageApi } from "@/app/services/authPet";
import IconPickerModal from "@/app/utils/components/IconPickerModal";
import styles from "./styles";

const toPrice = (value: string) => {
  if (!value.trim()) return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

export default function ServiceManagementScreen() {
  const navigation = useNavigation();
  const { data: services, isLoading } = useServices();
  const { mutateAsync: createService, isPending: isCreating } = useCreateService();
  const { mutateAsync: updateService, isPending: isUpdating } = useUpdateService();
  const { mutateAsync: deleteService, isPending: isDeleting } = useDeleteService();

  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const scrollViewRef = React.useRef<ScrollView>(null);
  const [form, setForm] = useState({
    name: "",
    icon: "",
    description: "",
    price: "",
    duration: "",
    is_quantifiable: false,
    images: [] as string[],
  });
  const [iconModalVisible, setIconModalVisible] = useState(false);

  const pickImage = async () => {
    if (form.images.length >= 5) {
      Alert.alert("Giới hạn", "Chỉ được tải lên tối đa 5 ảnh.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (result.canceled) return;
    const uri = result.assets[0]?.uri;
    if (!uri) return;

    try {
      const { url } = await uploadPetImageApi(uri);
      setForm((prev) => ({ ...prev, images: [...prev.images, url] }));
    } catch (error: any) {
      Alert.alert("Lỗi", "Không thể tải ảnh lên.");
    }
  };

  const removeImage = (index: number) => {
    setForm((prev) => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });
  };

  const serviceList = useMemo(() => {
    const list = Array.isArray(services)
      ? services
      : ((services as unknown as { data?: Service[] })?.data ?? []);

    const keyword = search.trim().toLowerCase();
    if (!keyword) return list;

    return list.filter((s) => {
      const target = `${s.name ?? ""} ${s.description ?? ""} ${s.icon ?? ""}`.toLowerCase();
      return target.includes(keyword);
    });
  }, [services, search]);

  const openForm = (item?: Service) => {
    if (item) {
      setEditingId(Number(item.id));
      setForm({
        name: item.name ?? "",
        icon: item.icon ?? "",
        description: item.description ?? "",
        price: String(item.price ?? ""),
        duration: String(item.duration ?? ""),
        is_quantifiable: !!item.is_quantifiable,
        images: item.images ?? [],
      });
    } else {
      setEditingId(null);
      setForm({ name: "", icon: "", description: "", price: "", duration: "", is_quantifiable: false, images: [] });
    }
    setModalVisible(true);
  };

  const closeForm = () => {
    setModalVisible(false);
    setEditingId(null);
    setForm({ name: "", icon: "", description: "", price: "", duration: "", is_quantifiable: false, images: [] });
  };

  const onSubmit = async () => {
    const errors: string[] = [];
    if (!form.name.trim()) errors.push("Tên dịch vụ");
    if (!form.icon.trim()) errors.push("Icon dịch vụ");
    if (!form.description.trim()) errors.push("Mô tả");
    if (!form.price.trim() || isNaN(Number(form.price)) || Number(form.price) <= 0) {
      errors.push("Giá (phải là số dương)");
    }
    if (!form.duration.trim() || isNaN(Number(form.duration)) || Number(form.duration) <= 0) {
      errors.push("Thời lượng (phải là số dương)");
    }
    if (errors.length > 0) {
      Alert.alert(
        "Thiếu/Sai thông tin",
        "Vui lòng nhập đầy đủ:\n\n" + errors.map(e => `• ${e}`).join("\n")
      );
      return;
    }

    const payload = {
      name: form.name.trim(),
      icon: form.icon.trim() || undefined,
      description: form.description.trim() || undefined,
      price: toPrice(form.price),
      duration: form.duration.trim() ? Number(form.duration) : undefined,
      is_quantifiable: form.is_quantifiable,
      images: form.images.length > 0 ? form.images : undefined,
    };

    try {
      if (editingId) {
        await updateService({ id: editingId, ...payload });
        Alert.alert("Thành công", "Đã cập nhật dịch vụ.");
      } else {
        await createService(payload);
        Alert.alert("Thành công", "Đã thêm dịch vụ mới.");
      }
      closeForm();
    } catch {
      Alert.alert("Lỗi", "Không thể lưu dịch vụ.");
    }
  };


  const onDelete = (id: number) => {
    Alert.alert("Xóa dịch vụ", "Bạn có chắc chắn muốn xóa dịch vụ này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteService(id);
          } catch {
            Alert.alert("Lỗi", "Không thể xóa dịch vụ.");
          }
        },
      },
    ]);
  };

  const isMutating = isCreating || isUpdating || isDeleting;

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
          <Text style={styles.headerTitle}>Quản lý dịch vụ</Text>
        </View>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flexContainer}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.containerNoPadTop}
          keyboardShouldPersistTaps="handled"
        >

        <TextInput
          placeholder="Tìm dịch vụ..."
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />

        <TouchableOpacity style={styles.addBtn} onPress={() => openForm()}>
          <Ionicons name="add-circle-outline" size={24} color="#FFF" />
          <Text style={styles.addBtnText}>Thêm dịch vụ</Text>
        </TouchableOpacity>

        <View style={styles.sectionDivider} />

        {isLoading && <Text style={styles.stateText}>Đang tải dịch vụ...</Text>}

        {!isLoading && serviceList.length === 0 && (
          <Text style={styles.stateText}>Không có dịch vụ nào.</Text>
        )}

        {!isLoading &&
          serviceList.map((item) => (
            <View key={String(item.id)} style={styles.serviceCard}>
              <Text style={styles.serviceName}>{item.name}</Text>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Icon:</Text>
                <Text style={styles.infoValue}>{item.icon || "Không có"}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Mô tả:</Text>
                <Text style={styles.infoValue}>{item.description || "Không có mô tả"}</Text>
              </View>

              {item.duration != null && item.duration > 0 && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Thời lượng:</Text>
                  <Text style={styles.infoValue}>{item.duration} phút</Text>
                </View>
              )}

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Số lượng:</Text>
                <Text style={styles.infoValue}>
                  {item.is_quantifiable ? "Cho phép đặt > 1" : "Cố định (tối đa 1)"}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Giá:</Text>
                <Text style={styles.infoValue}>
                  {(item.price ?? 0).toLocaleString("vi-VN")} đ
                </Text>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.actionButton} onPress={() => openForm(item)}>
                  <Text style={styles.actionButtonText}>Sửa</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(Number(item.id))}>
                  <Ionicons name="trash-outline" size={16} color="#DC2626" />
                  <Text style={styles.deleteBtnText}>Xóa</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
      </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.flexContainer}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContentWrapper}>
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScrollContent}>
                <Text style={styles.modalTitle}>{editingId ? "Sửa dịch vụ" : "Thêm dịch vụ"}</Text>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Tên dịch vụ (*)</Text>
                  <TextInput
                    placeholder="Nhập tên dịch vụ"
                    placeholderTextColor="#9CA3AF"
                    style={styles.input}
                    value={form.name}
                    onChangeText={(t) => setForm((prev) => ({ ...prev, name: t }))}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Icon dịch vụ (*)</Text>
                  <TouchableOpacity
                    style={[styles.input, styles.inputJustifyCenter]}
                    onPress={() => setIconModalVisible(true)}
                  >
                    <View style={styles.iconRow}>
                      {form.icon ? (
                        <Ionicons name={form.icon as any} size={20} color="#111827" style={styles.iconMarginRight} />
                      ) : null}
                      <Text style={form.icon ? styles.iconTextFilled : styles.iconTextPlaceholder}>
                        {form.icon ? form.icon : "Chọn Icon (vd: medkit-outline)"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Mô tả (*)</Text>
                  <TextInput
                    placeholder="Nhập mô tả"
                    placeholderTextColor="#9CA3AF"
                    style={[styles.input, styles.multilineInput]}
                    multiline
                    value={form.description}
                    onChangeText={(t) => setForm((prev) => ({ ...prev, description: t }))}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Giá (VND) (*)</Text>
                  <TextInput
                    placeholder="Ví dụ: 100000"
                    placeholderTextColor="#9CA3AF"
                    style={styles.input}
                    keyboardType="numeric"
                    value={form.price}
                    onChangeText={(t) => setForm((prev) => ({ ...prev, price: t }))}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Thời lượng (phút) (*)</Text>
                  <TextInput
                    placeholder="Ví dụ: 30"
                    placeholderTextColor="#9CA3AF"
                    style={styles.input}
                    keyboardType="numeric"
                    value={form.duration}
                    onChangeText={(t) => setForm((prev) => ({ ...prev, duration: t }))}
                  />
                </View>

                <View style={styles.quantifiableRow}>
                  <View style={styles.quantifiableTextContainer}>
                    <Text style={styles.quantifiableTitle}>Tính theo số lượng</Text>
                    <Text style={styles.quantifiableDesc}>Bật nếu dịch vụ có thể đặt &gt; 1 (ví dụ: Trông giữ theo giờ)</Text>
                  </View>
                  <Switch
                    value={form.is_quantifiable}
                    onValueChange={(v) => setForm(prev => ({ ...prev, is_quantifiable: v }))}
                    trackColor={{ false: "#D1D5DB", true: "#5CB15A" }}
                    thumbColor={Platform.OS === "ios" ? undefined : (form.is_quantifiable ? "#FFF" : "#F4F3F4")}
                  />
                </View>

                <View style={styles.formGroupLarge}>
                  <Text style={styles.label}>
                    Ảnh dịch vụ ({form.images.length}/5)
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {form.images.map((img, idx) => (
                      <View key={idx} style={styles.imageWrapper}>
                        <Image source={{ uri: getImageUrl(img) }} style={styles.imagePreview} />
                        <TouchableOpacity
                          style={styles.imageRemoveBtn}
                          onPress={() => removeImage(idx)}
                        >
                          <Ionicons name="close-circle" size={20} color="#DC2626" />
                        </TouchableOpacity>
                      </View>
                    ))}
                    {form.images.length < 5 && (
                      <TouchableOpacity
                        style={styles.imageAddBtn}
                        onPress={pickImage}
                      >
                        <Ionicons name="add" size={24} color="#6B7280" />
                      </TouchableOpacity>
                    )}
                  </ScrollView>
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={closeForm} disabled={isMutating}>
                    <Text style={styles.cancelBtnText}>Hủy</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.saveBtn, isMutating && styles.disabledBtn]}
                    onPress={onSubmit}
                    disabled={isMutating}
                  >
                    <Text style={styles.saveBtnText}>{editingId ? "Cập nhật" : "Lưu"}</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <IconPickerModal
        visible={iconModalVisible}
        onClose={() => setIconModalVisible(false)}
        onSelect={(icon) => setForm((prev) => ({ ...prev, icon }))}
      />
    </SafeAreaView>
  );
}