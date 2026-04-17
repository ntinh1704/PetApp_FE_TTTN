import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ICONS = [
  "medkit-outline", "paw-outline", "cut-outline", "water-outline", "heart-outline",
  "fitness-outline", "eyedrop-outline", "thermometer-outline", "bandage-outline", "pulse-outline",
  "medical-outline", "nutrition-outline", "rose-outline", "bug-outline", "fish-outline",
  "sparkles-outline", "bag-check-outline", "cart-outline", "cash-outline", "car-outline",
  "bed-outline", "home-outline", "cafe-outline", "happy-outline", "shield-checkmark-outline"
];

interface IconPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (iconName: string) => void;
}

export default function IconPickerModal({ visible, onClose, onSelect }: IconPickerModalProps) {
  const [search, setSearch] = useState("");

  const filteredIcons = ICONS.filter((i) => i.includes(search.toLowerCase()));

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Chọn Icon Dịch Vụ</Text>

          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm icon..."
            value={search}
            onChangeText={setSearch}
          />

          <ScrollView contentContainerStyle={styles.grid}>
            {filteredIcons.map((icon) => (
              <TouchableOpacity
                key={icon}
                style={styles.iconBox}
                onPress={() => {
                  onSelect(icon);
                  onClose();
                }}
              >
                <Ionicons name={icon as any} size={28} color="#111827" />
                <Text style={styles.iconName} numberOfLines={1}>{icon.replace("-outline", "")}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: Dimensions.get("window").height * 0.7,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  searchInput: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  iconBox: {
    width: "23%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 4,
  },
  iconName: {
    fontSize: 10,
    color: "#4B5563",
    marginTop: 4,
    textAlign: "center",
  },
  closeBtn: {
    marginTop: 16,
    backgroundColor: "#5CB15A",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  closeBtnText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});
