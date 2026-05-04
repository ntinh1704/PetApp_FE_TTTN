import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { api, getImageUrl } from "@/app/services/api";
import { uploadPetImageApi } from "@/app/services/authPet";
import GenderDropdown from "@/app/utils/components/GenderDropdown";
import { useUpdatePet } from "@/app/utils/hook/usePets";
import { Pet, PetUpdate } from "@/app/utils/models/pet";
import { styles } from "./styles";

export default function AddPetDetail() {
  const { pet } = useLocalSearchParams();
  const parsedPet = JSON.parse(pet as string) as Pet;
  const { mutateAsync: updatePet, isPending } = useUpdatePet();
  const insets = useSafeAreaInsets();

  const [form, setForm] = useState(parsedPet);

  const savePet = async () => {
    if (isPending) return;

    // Validate all fields
    const errors: string[] = [];
    if (!form.image) errors.push("Ảnh thú cưng");
    if (!form.name?.trim()) errors.push("Tên thú cưng");
    if (!form.breed?.trim()) errors.push("Giống loài");
    if (!form.gender) errors.push("Giới tính");
    if (form.age == null || String(form.age).trim() === "" || isNaN(Number(form.age)) || Number(form.age) < 0) {
      errors.push("Tuổi (phải là số và không âm)");
    }
    if (!form.color?.trim()) errors.push("Màu sắc");
    if (form.height == null || String(form.height).trim() === "" || isNaN(Number(form.height)) || Number(form.height) <= 0) {
      errors.push("Chiều cao (phải là số dương)");
    }
    if (form.weight == null || String(form.weight).trim() === "" || isNaN(Number(form.weight)) || Number(form.weight) <= 0) {
      errors.push("Cân nặng (phải là số dương)");
    }
    if (errors.length > 0) {
      Alert.alert(
        "Thiếu/Sai thông tin",
        "Vui lòng cung cấp đầy đủ và chính xác:\n\n" + errors.map(e => `• ${e}`).join("\n")
      );
      return;
    }

    Alert.alert("Lưu thay đổi", "Bạn có muốn lưu thay đổi không?", [
      { text: "Không", style: "cancel" },
      {
        text: "Có",
        onPress: async () => {
          try {
            const payload: PetUpdate = {
              id: form.id,
              name: form.name?.trim() || undefined,
              breed: form.breed || undefined,
              gender: form.gender || undefined,
              age: form.age != null ? Number(form.age) : undefined,
              color: form.color || undefined,
              height: form.height != null ? Number(form.height) : undefined,
              weight: form.weight != null ? Number(form.weight) : undefined,
              image: form.image || undefined,
            };

            await updatePet(payload);
            Alert.alert("Thành công", "Đã lưu thay đổi thú cưng.", [
              {
                text: "OK",
                onPress: () => router.back(),
              },
            ]);
          } catch (error: any) {
            const detail =
              error?.response?.data?.detail ||
              error?.message ||
              "Không thể lưu thay đổi.";
            Alert.alert("Lỗi", String(detail));
          }
        },
      },
    ]);
  };

  const pickPetImage = async () => {
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
      setForm({ ...form, image: url });
    } catch (error: any) {
      const detail =
        error?.response?.data?.detail ||
        error?.message ||
        "Không thể tải ảnh lên.";
      Alert.alert("Lỗi", String(detail));
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Chỉnh sửa thú cưng</Text>
        <View style={{ width: 22 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1}}
      >
        <ScrollView contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* IMAGE */}
          <TouchableOpacity
            style={styles.avatarWrap}
            onPress={pickPetImage}
            activeOpacity={0.85}
          >
            <Image
              source={
                form.image
                  ? { uri: getImageUrl(form.image) }
                  : require("@/app/assets/images/no_image_pet.jpg")
              }
              style={styles.avatar}
            />
            <View style={styles.avatarEditIcon}>
              <Ionicons name="pencil" size={12} color="#FFF" />
            </View>
          </TouchableOpacity>

          {/* TÊN */}
          <TextInput
            placeholder="Tên"
            placeholderTextColor="#777"
            style={styles.input}
            value={form.name ?? ""}
            onChangeText={(t) => setForm({ ...form, name: t })}
          />

          {/* GIỐNG */}
          <TextInput
            placeholder="Giống (ví dụ: Chó Cỏ)"
            placeholderTextColor="#777"
            style={styles.input}
            value={form.breed ?? ""}
            onChangeText={(t) => setForm({ ...form, breed: t })}
          />

          {/* GIỚI TÍNH – TUỔI – MÀU SẮC (3 Ô) */}
          <View style={[styles.row, { zIndex: 10 }]}>
            <GenderDropdown
              value={form.gender ?? ""}
              options={["Đực", "Cái", "Không rõ"]}
              placeholder="Giới tính"
              onSelect={(t) => setForm({ ...form, gender: t })}
              style={{ flex: 1 }}
            />

            <TextInput
              placeholder="Tuổi (Năm)"
              placeholderTextColor="#777"
              style={styles.half}
              value={form.age != null ? String(form.age) : ""}
              keyboardType="numeric"
              onChangeText={(t) =>
                setForm({ ...form, age: t ? Number(t) : null })
              }
            />

            <TextInput
              placeholder="Màu sắc "
              placeholderTextColor="#777"
              style={styles.half}
              value={form.color ?? ""}
              onChangeText={(t) => setForm({ ...form, color: t })}
            />
          </View>

          {/* CHIỀU CAO – CÂN NẶNG (2 Ô) */}
          <View style={styles.row}>
            <TextInput
              placeholder="Chiều cao (cm)"
              placeholderTextColor="#777"
              style={styles.half}
              value={form.height != null ? String(form.height) : ""}
              keyboardType="numeric"
              onChangeText={(t) =>
                setForm({ ...form, height: t ? Number(t) : null })
              }
            />

            <TextInput
              placeholder="Cân nặng (kg)"
              placeholderTextColor="#777"
              style={styles.half}
              value={form.weight != null ? String(form.weight) : ""}
              keyboardType="numeric"
              onChangeText={(t) =>
                setForm({ ...form, weight: t ? Number(t) : null })
              }
            />
          </View>
        </ScrollView>

        {/* FOOTER */}
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <View style={styles.footerButtons}>
            <TouchableOpacity
              style={styles.button}
              onPress={savePet}
              disabled={isPending}
            >
              <Text style={styles.buttonText}>
                {isPending ? "Đang lưu..." : "Lưu thay đổi"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
