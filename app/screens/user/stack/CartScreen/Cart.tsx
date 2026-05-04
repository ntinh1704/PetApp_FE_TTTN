import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCart, CartItem } from "../../../../utils/contexts/CartContext";
import { styles } from "./styles";


export default function CartScreen() {
  const router = useRouter();
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Initialize selectedIds with all items when cart changes (only for items not already in the list)
  useEffect(() => {
    if (items.length > 0 && selectedIds.length === 0) {
      setSelectedIds(items.map((i) => i.service.id));
    }
  }, [items]);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectedItems = useMemo(
    () => items.filter((item) => selectedIds.includes(item.service.id)),
    [items, selectedIds]
  );

  const displayTotalItems = useMemo(
    () => selectedItems.reduce((sum, i) => sum + i.quantity, 0),
    [selectedItems]
  );

  const displayTotalPrice = useMemo(
    () =>
      selectedItems.reduce(
        (sum, i) => sum + (Number(i.service.price) || 0) * i.quantity,
        0
      ),
    [selectedItems]
  );

  const displayTotalDuration = useMemo(
    () =>
      selectedItems.reduce(
        (sum, i) => sum + (i.service.duration || 0) * i.quantity,
        0
      ),
    [selectedItems]
  );

  const handleBooking = () => {
    if (items.length === 0) {
      Alert.alert("Giỏ hàng trống", "Vui lòng thêm dịch vụ trước khi đặt lịch.");
      return;
    }
    if (selectedIds.length === 0) {
      Alert.alert("Chưa chọn dịch vụ", "Vui lòng chọn ít nhất một dịch vụ để đặt lịch.");
      return;
    }
    router.push({
      pathname: "/screens/user/stack/BookingBuilder/BookingBuilder" as any,
      params: { selectedServiceIds: JSON.stringify(selectedIds) }
    });
  };

  const handleClearCart = () => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa toàn bộ dịch vụ trong giỏ hàng không?",
      [
        { text: "Hủy", style: "cancel" },
        { 
          text: "Xóa tất cả", 
          style: "destructive", 
          onPress: () => clearCart() 
        },
      ]
    );
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + " đ";
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} phút`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h} giờ ${m} phút` : `${h} giờ`;
  };

  const renderItem = ({ item }: { item: CartItem }) => {
    const isSelected = selectedIds.includes(item.service.id);
    return (
      <View style={styles.itemCard}>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => toggleSelect(item.service.id)}
        >
          <Ionicons
            name={isSelected ? "checkbox" : "square-outline"}
            size={24}
            color={isSelected ? "#5CB15A" : "#D1D5DB"}
          />
        </TouchableOpacity>

        <View style={styles.itemIconContainer}>
          {item.service.icon ? (
            <Ionicons
              name={(item.service.icon as any) || "medkit-outline"}
              size={26}
              color="#5CB15A"
            />
          ) : (
            <Ionicons name="medkit-outline" size={26} color="#5CB15A" />
          )}
        </View>

        <View style={styles.itemInfo}>
          <Text style={styles.itemName} numberOfLines={1}>
            {item.service.name}
          </Text>
          <Text style={styles.itemPrice}>
            {formatPrice(item.service.price || 0)}
          </Text>
          {item.service.duration && (
            <Text style={styles.itemDuration}>
              ⏱ {formatDuration(item.service.duration)}
            </Text>
          )}
        </View>

        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => updateQuantity(item.service.id, item.quantity - 1)}
          >
            <Ionicons name="remove" size={16} color="#333" />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.quantity}</Text>
          <TouchableOpacity
            style={[
              styles.qtyBtn,
              !item.service.is_quantifiable && item.quantity >= 1 ? { opacity: 0.3 } : null
            ]}
            onPress={() => updateQuantity(item.service.id, item.quantity + 1)}
            disabled={!item.service.is_quantifiable && item.quantity >= 1}
          >
            <Ionicons name="add" size={16} color="#333" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => removeItem(item.service.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Giỏ hàng ({items.length})</Text>
        {items.length > 0 && (
          <TouchableOpacity onPress={handleClearCart}>
            <Text style={styles.clearText}>Xóa tất cả</Text>
          </TouchableOpacity>
        )}
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>Giỏ hàng trống</Text>
          <Text style={styles.emptySubtitle}>
            Hãy thêm dịch vụ từ danh sách dịch vụ
          </Text>
          <TouchableOpacity
            style={styles.browseBtn}
            onPress={() => router.push("/screens/user/tabs/ServiceScreen/Service")}
          >
            <Text style={styles.browseBtnText}>Xem dịch vụ</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => String(item.service.id)}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          {/* Summary Footer */}
          <View style={styles.footer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tổng dịch vụ:</Text>
              <Text style={styles.summaryValue}>{displayTotalItems}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Thời gian dự kiến:</Text>
              <Text style={styles.summaryValue}>
                {formatDuration(displayTotalDuration)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tổng tiền:</Text>
              <Text style={styles.totalPrice}>{formatPrice(displayTotalPrice)}</Text>
            </View>

            <TouchableOpacity style={styles.bookingBtn} onPress={handleBooking}>
              <Ionicons name="calendar-outline" size={20} color="#fff" />
              <Text style={styles.bookingBtnText}>Đặt lịch</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
