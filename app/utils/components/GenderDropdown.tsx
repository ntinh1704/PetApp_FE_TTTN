import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const GREEN = "#5CB15A";

type Props = {
  value: string;
  options: string[];
  placeholder?: string;
  onSelect: (value: string) => void;
  style?: object;
};

export default function GenderDropdown({
  value,
  options,
  placeholder = "Chọn giới tính",
  onSelect,
  style,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <View style={[ddStyles.wrapper, style]}>
      <TouchableOpacity
        style={ddStyles.trigger}
        activeOpacity={0.7}
        onPress={() => setOpen((prev) => !prev)}
      >
        <Text style={[ddStyles.triggerText, !value && ddStyles.placeholder]}>
          {value || placeholder}
        </Text>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={16}
          color="#6B7280"
        />
      </TouchableOpacity>

      {open && (
        <View style={ddStyles.menu}>
          {options.map((opt) => {
            const active = value === opt;
            return (
              <TouchableOpacity
                key={opt}
                style={[ddStyles.item, active && ddStyles.itemActive]}
                onPress={() => {
                  onSelect(opt);
                  setOpen(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={[ddStyles.itemText, active && ddStyles.itemTextActive]}>
                  {opt}
                </Text>
                {active && <Ionicons name="checkmark" size={16} color={GREEN} />}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

const ddStyles = StyleSheet.create({
  wrapper: {
    position: "relative",
    zIndex: 10,
  },
  trigger: {
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  triggerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  placeholder: {
    color: "#777",
  },
  menu: {
    position: "absolute",
    top: 44,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 20,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  itemActive: {
    backgroundColor: "#ECFDF5",
  },
  itemText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  itemTextActive: {
    color: GREEN,
    fontWeight: "700",
  },
});
