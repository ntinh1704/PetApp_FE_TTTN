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
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
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
  const [editingId, setEditingId] = useState<number | null>(null);
  const scrollViewRef = React.useRef<ScrollView>(null);
  const [form, setForm] = useState({
    name: "",
    icon: "",
    description: "",
    price: "",
    duration: "",
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

  const resetForm = () => {
    setForm({ name: "", icon: "", description: "", price: "", duration: "", images: [] });
    setEditingId(null);
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
      resetForm();
    } catch {
      Alert.alert("Lỗi", "Không thể lưu dịch vụ.");
    }
  };

  const onEdit = (item: Service) => {
    setEditingId(Number(item.id));
    setForm({
      name: item.name ?? "",
      icon: item.icon ?? "",
      description: item.description ?? "",
      price: String(item.price ?? ""),
      duration: String(item.duration ?? ""),
      images: item.images ?? [],
    });
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
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
      <View style={[styles.header, { marginHorizontal: 12, marginTop: 12 }]}>
        <View style={styles.headerLeft}>  
          <Pressable
            style={styles.iconButton}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
            <Ionicons name="menu" size={20} color="#FFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Quản lý dịch vụ</Text>
        </View>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={[styles.container, { paddingTop: 0 }]}
          keyboardShouldPersistTaps="handled"
        >

        <TextInput
          placeholder="Tìm dịch vụ..."
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>{editingId ? "Sửa dịch vụ" : "Thêm dịch vụ"}</Text>

          <TextInput
            placeholder="Tên dịch vụ"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            value={form.name}
            onChangeText={(t) => setForm((prev) => ({ ...prev, name: t }))}
          />

          <TouchableOpacity
            style={[styles.input, { justifyContent: "center" }]}
            onPress={() => setIconModalVisible(true)}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {form.icon ? (
                <Ionicons name={form.icon as any} size={20} color="#111827" style={{ marginRight: 8 }} />
              ) : null}
              <Text style={{ color: form.icon ? "#111827" : "#9CA3AF" }}>
                {form.icon ? form.icon : "Chọn Icon (vd: medkit-outline)"}
              </Text>
            </View>
          </TouchableOpacity>

          <TextInput
            placeholder="Mô tả"
            placeholderTextColor="#9CA3AF"
            style={[styles.input, styles.multilineInput]}
            multiline
            value={form.description}
            onChangeText={(t) => setForm((prev) => ({ ...prev, description: t }))}
          />

            <TextInput
            placeholder="Giá (VND)"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            keyboardType="numeric"
            value={form.price}
            onChangeText={(t) => setForm((prev) => ({ ...prev, price: t }))}
          />

          <TextInput
            placeholder="Thời lượng (phút)"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            keyboardType="numeric"
            value={form.duration}
            onChangeText={(t) => setForm((prev) => ({ ...prev, duration: t }))}
          />

          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 13, fontWeight: "600", color: "#374151", marginBottom: 8 }}>
              Ảnh dịch vụ ({form.images.length}/5)
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {form.images.map((img, idx) => (
                <View key={idx} style={{ marginRight: 12, position: "relative" }}>
                  <Image source={{ uri: getImageUrl(img) }} style={{ width: 70, height: 70, borderRadius: 8, backgroundColor: "#E5E7EB" }} />
                  <TouchableOpacity
                    style={{ position: "absolute", top: -5, right: -5, backgroundColor: "#FFF", borderRadius: 10 }}
                    onPress={() => removeImage(idx)}
                  >
                    <Ionicons name="close-circle" size={20} color="#DC2626" />
                  </TouchableOpacity>
                </View>
              ))}
              {form.images.length < 5 && (
                <TouchableOpacity
                  style={{ width: 70, height: 70, borderRadius: 8, backgroundColor: "#F3F4F6", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#D1D5DB", borderStyle: "dashed" }}
                  onPress={pickImage}
                >
                  <Ionicons name="add" size={24} color="#6B7280" />
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>

          <View style={styles.formActions}>
            {editingId && (
              <TouchableOpacity style={styles.secondaryBtn} onPress={resetForm}>
                <Text style={styles.secondaryBtnText}>Hủy</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={[styles.primaryBtn, isMutating && styles.disabledBtn]}
              onPress={onSubmit}
              disabled={isMutating}
            >
              <Text style={styles.primaryBtnText}>{editingId ? "Cập nhật" : "Thêm dịch vụ"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionDivider} />

        {isLoading && <Text style={styles.stateText}>Đang tải dịch vụ...</Text>}

        {!isLoading && serviceList.length === 0 && (
          <Text style={styles.stateText}>Không có dịch vụ nào.</Text>
        )}

        {!isLoading &&
          serviceList.map((item) => (
            <View key={String(item.id)} style={styles.serviceCard}>
              <Text style={styles.serviceName}>{item.name}</Text>
              <Text style={styles.serviceDesc}>Icon: {item.icon || "Không có"}</Text>
              <Text style={styles.serviceDesc}>{item.description || "Không có mô tả"}</Text>
              {item.duration != null && item.duration > 0 && (
                <Text style={styles.serviceDesc}>Thời lượng: {item.duration} phút</Text>
              )}
              <Text style={styles.servicePrice}>Giá: {(item.price ?? 0).toLocaleString("vi-VN")} đ</Text>

              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.actionButton} onPress={() => onEdit(item)}>
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
      <IconPickerModal
        visible={iconModalVisible}
        onClose={() => setIconModalVisible(false)}
        onSelect={(icon) => setForm((prev) => ({ ...prev, icon }))}
      />
    </SafeAreaView>
  );
}