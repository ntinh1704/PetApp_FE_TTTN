import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useUpdatePet } from "@/app/utils/hook/usePets";
import { Pet, PetUpdate } from "@/app/utils/models/pet";
import { styles } from "./styles";

export default function AddPetDetail() {
  const { pet } = useLocalSearchParams();
  const parsedPet = JSON.parse(pet as string) as Pet;
  const { mutateAsync: updatePet, isPending } = useUpdatePet();

  const [form, setForm] = useState(parsedPet);

  const savePet = async () => {
    if (isPending) return;

    const payload: PetUpdate = {
      id: form.id,
      name: form.name?.trim() || undefined,
      breed: form.breed || undefined,
      gender: form.gender || undefined,
      age: form.age ? Number(form.age) : undefined,
      color: form.color || undefined,
      height: form.height ? Number(form.height) : undefined,
      weight: form.weight ? Number(form.weight) : undefined,
      image: form.image || undefined,
    };

    await updatePet(payload);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Chỉnh sửa thú cưng</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* IMAGE */}
        {form.image && (
          <Image source={{ uri: form.image }} style={styles.image} />
        )}

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
          placeholder="Giống"
          placeholderTextColor="#777"
          style={styles.input}
          value={form.breed ?? ""}
          onChangeText={(t) => setForm({ ...form, breed: t })}
        />

        {/* GIỚI TÍNH – TUỔI – MÀU SẮC (3 Ô) */}
        <View style={styles.row}>
          <TextInput
            placeholder="Giới tính"
            placeholderTextColor="#777"
            style={styles.half}
            value={form.gender ?? ""}
            onChangeText={(t) => setForm({ ...form, gender: t })}
          />

          <TextInput
            placeholder="Tuổi"
            placeholderTextColor="#777"
            style={styles.half}
            value={form.age != null ? String(form.age) : ""}
            onChangeText={(t) =>
              setForm({ ...form, age: t ? Number(t) : null })
            }
          />

          <TextInput
            placeholder="Màu sắc"
            placeholderTextColor="#777"
            style={styles.half}
            value={form.color ?? ""}
            onChangeText={(t) => setForm({ ...form, color: t })}
          />
        </View>

        {/* CHIỀU CAO – CÂN NẶNG (2 Ô) */}
        <View style={styles.row}>
          <TextInput
            placeholder="Chiều cao"
            placeholderTextColor="#777"
            style={styles.half}
            value={form.height != null ? String(form.height) : ""}
            onChangeText={(t) =>
              setForm({ ...form, height: t ? Number(t) : null })
            }
          />

          <TextInput
            placeholder="Cân nặng"
            placeholderTextColor="#777"
            style={styles.half}
            value={form.weight != null ? String(form.weight) : ""}
            onChangeText={(t) =>
              setForm({ ...form, weight: t ? Number(t) : null })
            }
          />
        </View>

        {/* BUTTON */}
        <TouchableOpacity
          style={styles.button}
          onPress={savePet}
          disabled={isPending}
        >
          <Text style={styles.buttonText}>
            {isPending ? "Đang lưu..." : "Lưu thay đổi"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
