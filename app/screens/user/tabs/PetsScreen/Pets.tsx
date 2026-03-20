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

    if (!result.canceled) {
      setForm({ ...form, image: result.assets[0].uri });
    }
  };

  const handleAddPet = async () => {
    if (!form.name.trim() || isMutating) return;

    const payload: PetCreate = {
      user_id: 1,
      name: form.name.trim(),
      breed: form.breed || undefined,
      gender: form.gender || undefined,
      age: form.age ? Number(form.age) : undefined,
      color: form.color || undefined,
      height: form.height ? Number(form.height) : undefined,
      weight: form.weight ? Number(form.weight) : undefined,
      image: form.image || undefined,
    };

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
        <View style={{ width: 24 }} />
      </View>

      {/* CONTENT */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* DANH SÁCH THÚ CƯNG */}
        <Text style={styles.section}>Thú cưng của tôi</Text>

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

        {!isLoading && !isError &&
          petList.map((pet) => (
            <View key={String(pet.id)} style={styles.petRow}>
              {pet.image ? (
                <Image source={{ uri: pet.image }} style={styles.avatarImg} />
              ) : (
                <View style={styles.avatar} />
              )}

              <Text style={styles.petName}>{pet.name}</Text>

              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname:
                      "/screens/user/stack/PetsScreen/AddPetsDetails/AddPetsDetail",
                    params: { pet: JSON.stringify(pet) },
                  })
                }
              >
                <Text style={styles.view}>Xem</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => confirmDelete(pet.id)}>
                <Ionicons name="trash" size={18} color="red" />
              </TouchableOpacity>
            </View>
          ))}

        {/* FORM THÊM THÚ CƯNG */}
        <Text style={styles.section}>Thêm thú cưng mới</Text>

        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {form.image ? (
            <Image source={{ uri: form.image }} style={styles.preview} />
          ) : (
            <Text style={styles.imageText}>Tải ảnh thú cưng</Text>
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
          placeholder="Giống"
          placeholderTextColor="#777"
          style={styles.input}
          value={form.breed}
          onChangeText={(t) => setForm({ ...form, breed: t })}
        />

        {/* GIỚI TÍNH – TUỔI – MÀU SẮC (3 CỘT) */}
        <View style={styles.row}>
          <TextInput
            placeholder="Giới tính"
            placeholderTextColor="#777"
            style={styles.half}
            value={form.gender}
            onChangeText={(t) => setForm({ ...form, gender: t })}
          />
          <TextInput
            placeholder="Tuổi"
            placeholderTextColor="#777"
            style={styles.half}
            value={form.age}
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

        {/* CHIỀU CAO – CÂN NẶNG (2 CỘT) */}
        <View style={styles.row}>
          <TextInput
            placeholder="Chiều cao"
            placeholderTextColor="#777"
            style={styles.half}
            value={form.height}
            onChangeText={(t) => setForm({ ...form, height: t })}
          />
          <TextInput
            placeholder="Cân nặng"
            placeholderTextColor="#777"
            style={styles.half}
            value={form.weight}
            onChangeText={(t) => setForm({ ...form, weight: t })}
          />
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={handleAddPet}>
          <Text style={styles.addText}>Thêm thú cưng</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
