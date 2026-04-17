import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCart } from "../contexts/CartContext";

interface CartBadgeProps {
  color?: string;
  size?: number;
  containerStyle?: ViewStyle;
}

export default function CartBadge({ color = "#333", size = 26, containerStyle }: CartBadgeProps) {
  const { totalItems } = useCart();
  const router = useRouter();

  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={() =>
        router.push("/screens/user/stack/CartScreen/Cart" as any)
      }
      accessibilityRole="button"
      accessibilityLabel={`Giỏ hàng, ${totalItems} sản phẩm`}
    >
      <Ionicons name="cart-outline" size={size} color={color} />
      {totalItems > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {totalItems > 99 ? "99+" : totalItems}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 4,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -4,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
});
