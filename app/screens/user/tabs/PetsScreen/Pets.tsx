import { api, getImageUrl } from "@/app/services/api";
import { uploadPetImageApi } from "@/app/services/authPet";
import CartBadge from "@/app/utils/components/CartBadge";
import GenderDropdown from "@/app/utils/components/GenderDropdown";
import {
  useCreatePet,
  useDeletePet,
  usePets,
} from "@/app/utils/hook/usePets";
import { Pet, PetCreate } from "@/app/utils/models/pet";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./styles";

export default function AddPetScreen() {
  const { data: pets, isLoading, isError, refetch } = usePets();
  const { mutateAsync: createPet, isPending: isCreating } = useCreatePet();
  const { mutateAsync: deletePet, isPending: isDeleting } = useDeletePet();
  const [petList, setPetList] = useState<Pet[]>([]);

  useEffect(() => {
    const nextPets = Array.isArray(pets)
      ? pets
      : ((pets as unknown as { data?: Pet[] })?.data ?? []);
    setPetList(nextPets);
  }, [pets]);

  const [form, setForm] = useState({
    name: "",
    breed: "",
    gender: "",
    age: "",
    color: "",
    height: "",
    weight: "",
    image: null as string | null,
  });

  const isMutating = isCreating || isDeleting;

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
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

  const handleAddPet = async () => {
    if (isMutating) return;

    // Kiểm tra thông tin đầy đủ
    const errors: string[] = [];
    if (!form.image) errors.push("Ảnh thú cưng");
    if (!form.name.trim()) errors.push("Tên thú cưng");
    if (!form.breed.trim()) errors.push("Giống loài");
    if (!form.gender) errors.push("Giới tính");
    
    // Kiểm tra các trường số
    if (!form.age.trim() || isNaN(Number(form.age)) || Number(form.age) < 0) {
      errors.push("Tuổi (phải là số và không âm)");
    }
    if (!form.color.trim()) errors.push("Màu sắc");
    if (!form.height.trim() || isNaN(Number(form.height)) || Number(form.height) <= 0) {
      errors.push("Chiều cao (phải là số dương)");
    }
    if (!form.weight.trim() || isNaN(Number(form.weight)) || Number(form.weight) <= 0) {
      errors.push("Cân nặng (phải là số dương)");
    }

    if (errors.length > 0) {
      Alert.alert(
        "Thiếu/Sai thông tin",
        "Vui lòng cung cấp đầy đủ và chính xác thông tin thú cưng:\n\n" + 
        errors.map(err => `• ${err}`).join("\n")
      );
      return;
    }

    const payload: PetCreate = {
      user_id: 1,
      name: form.name.trim(),
      breed: form.breed.trim(),
      gender: form.gender,
      age: Number(form.age),
      color: form.color.trim(),
      height: Number(form.height),
      weight: Number(form.weight),
      image: form.image,
    };

    try {
      await createPet(payload);
      await refetch();

      setForm({
        name: "",
        breed: "",
        gender: "",
        age: "",
        color: "",
        height: "",
        weight: "",
        image: null,
      });

      Alert.alert("Thành công", "Thêm thú cưng thành công.");
    } catch (error: any) {
      Alert.alert("Lỗi", "Không thể thêm thú cưng. Vui lòng thử lại.");
    }
  };

  const confirmDelete = (id: number) => {
    if (isMutating) return;

    Alert.alert(
      "Xóa thú cưng",
      "Bạn có chắc chắn muốn xóa thú cưng này không?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            await deletePet(id);
            await refetch();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#FFF" />
        </TouchableOpacity>

        <Text style={styles.title}>Thú cưng</Text>
        <CartBadge color="#FFF" size={22} containerStyle={styles.notiBtn}/>
      </View>

      {/* CONTENT */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* DANH SÁCH THÚ CƯNG */}
          <Text style={styles.section}>🐾 Thú cưng của tôi</Text>

          {(isLoading || isMutating) && (
            <View style={styles.stateWrapper}>
              <ActivityIndicator size="small" color="#5CB15A" />
              <Text style={styles.stateText}>Đang xử lý thú cưng...</Text>
            </View>
          )}

          {isError && !isLoading && !isMutating && (
            <View style={styles.stateWrapper}>
              <Text style={styles.stateText}>Không tải được thú cưng.</Text>
            </View>
          )}

          {!isLoading && !isError && !isMutating && petList.length === 0 && (
            <View style={styles.stateWrapper}>
              <Text style={styles.stateText}>Bạn chưa có thú cưng nào</Text>
            </View>
          )}

          {!isLoading && !isError &&
            petList.map((pet) => (
              <View key={String(pet.id)} style={styles.petRow}>
                {pet.image ? (
                  <Image source={{ uri: getImageUrl(pet.image) }} style={styles.avatarImg} />
                ) : (
                  <Image source={require("@/app/assets/images/no_pet_image.jpg")} style={styles.avatarImg} />
                )}

                <Text style={styles.petName}>{pet.name}</Text>

                <TouchableOpacity
                  style={styles.viewBtn}
                  onPress={() =>
                    router.push({
                      pathname:
                        "/screens/user/stack/PetsScreen/AddPetsDetails/AddPetsDetail",
                      params: { pet: JSON.stringify(pet) },
                    })
                  }
                >
                  <Text style={styles.viewText}>Xem</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.deleteBtn} onPress={() => confirmDelete(pet.id)}>
                  <Text style={styles.deleteText}>Xóa</Text>
                </TouchableOpacity>
              </View>
            ))}

          {/* FORM THÊM THÚ CƯNG */}
          <Text style={styles.section}>Thêm thú cưng mới</Text>

          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {form.image ? (
              <Image source={{ uri: getImageUrl(form.image) }} style={styles.preview} />
            ) : (
              <Text style={styles.imageText}>Bấm vào đây để tải ảnh thú cưng</Text>
            )}
          </TouchableOpacity>

          {/* TÊN */}
          <TextInput
            placeholder="Tên"
            placeholderTextColor="#777"
            style={styles.input}
            value={form.name}
            onChangeText={(t) => setForm({ ...form, name: t })}
          />

          {/* GIỐNG */}
          <TextInput 
            placeholder="Giống (ví dụ: Chó Cỏ)"
            placeholderTextColor="#777"
            style={styles.input}
            value={form.breed}
            onChangeText={(t) => setForm({ ...form, breed: t })}
          />

          {/* GIỚI TÍNH – TUỔI – MÀU SẮC  */}
          <View style={[styles.row, { zIndex: 10 }]}>
            <GenderDropdown
              value={form.gender}
              options={["Đực", "Cái", "Không rõ"]}
              placeholder="Giới tính"
              onSelect={(t) => setForm({ ...form, gender: t })}
              style={{ flex: 1 }}
            />
            <TextInput
              placeholder="Tuổi (Năm)"
              placeholderTextColor="#777"
              style={styles.half}
              value={form.age}
              keyboardType="numeric"
              onChangeText={(t) => setForm({ ...form, age: t })}
            />
            <TextInput
              placeholder="Màu sắc"
              placeholderTextColor="#777"
              style={styles.half}
              value={form.color}
              onChangeText={(t) => setForm({ ...form, color: t })}
            />
          </View>

          {/* CHIỀU CAO – CÂN NẶNG  */}
          <View style={styles.row}>
            <TextInput
              placeholder="Chiều cao (cm)"
              placeholderTextColor="#777"
              style={styles.half}
              value={form.height}
              keyboardType="numeric"
              onChangeText={(t) => setForm({ ...form, height: t })}
            />
            <TextInput
              placeholder="Cân nặng (kg)"
              placeholderTextColor="#777"
              style={styles.half}
              value={form.weight}
              keyboardType="numeric"
              onChangeText={(t) => setForm({ ...form, weight: t })}
            />
          </View>

          <TouchableOpacity style={styles.addBtn} onPress={handleAddPet}>
            <Text style={styles.addText}>Thêm thú cưng</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
