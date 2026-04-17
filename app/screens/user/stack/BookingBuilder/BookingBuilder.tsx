import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";

import { useCart } from "../../../../utils/contexts/CartContext";
import { usePets } from "../../../../utils/hook/usePets";
import { useCreateBooking } from "../../../../utils/hook/useBooking";
import { getBookingsByDateApi } from "../../../../services/authBooking";
import { getImageUrl } from "../../../../services/api";
import { BookingCreate } from "../../../../utils/models/booking";
import { styles } from "./styles";

/* ─── helpers ─── */
const formatDateDisplay = (d: Date) => {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
};

const formatDateApi = (d: Date) => {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
};

const formatTime = (d: Date) => {
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mi}`;
};

const formatDuration = (mins: number) => {
  if (mins < 60) return `${mins} phút`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h} giờ ${m} phút` : `${h} giờ`;
};

const formatPrice = (price: number) =>
  price.toLocaleString("vi-VN") + " đ";

const addMinutesToTime = (time: string, minutes: number) => {
  const [hh, mm] = time.split(":").map(Number);
  const total = hh * 60 + mm + minutes;
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

const timeToMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

type PaymentMethod = "store" | "sepay";

/* ─────────────────────────── Component ─────────────────────────── */
export default function BookingBuilderScreen() {
  const { items, removeItem, clearCart } = useCart();
  const { data: pets } = usePets();
  const { mutateAsync: createBooking } = useCreateBooking();

  // Get selected services from Cart navigation
  const { selectedServiceIds: selectedServiceIdsParam } = useLocalSearchParams<{ selectedServiceIds?: string }>();
  const selectedServiceIds = useMemo(() => {
    try {
      return selectedServiceIdsParam ? JSON.parse(selectedServiceIdsParam) as number[] : null;
    } catch {
      return null;
    }
  }, [selectedServiceIdsParam]);

  const bookingItems = useMemo(() => {
    if (!selectedServiceIds) return items;
    return items.filter(item => selectedServiceIds.includes(item.service.id));
  }, [items, selectedServiceIds]);

  const bookingTotalPrice = useMemo(() => {
    return bookingItems.reduce((sum, i) => sum + (Number(i.service.price) || 0) * i.quantity, 0);
  }, [bookingItems]);

  const bookingTotalDuration = useMemo(() => {
    return bookingItems.reduce((sum, i) => sum + (i.service.duration || 0) * i.quantity, 0);
  }, [bookingItems]);

  const petOptions = useMemo(
    () =>
      Array.isArray(pets)
        ? pets
        : ((pets as unknown as { data?: typeof pets })?.data ?? []),
    [pets],
  );

  /* ─── state ─── */
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [showPetOptions, setShowPetOptions] = useState(false);
  const [bookingDate, setBookingDate] = useState<Date>(new Date());
  const [bookingTime, setBookingTime] = useState<Date>(new Date());
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("store");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ─── slot check ─── */
  const [existingBookings, setExistingBookings] = useState<any[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Auto-select first pet
  useEffect(() => {
    if (!petOptions.length) {
      setSelectedPetId(null);
      return;
    }
    setSelectedPetId((prev) => {
      if (prev && petOptions.some((p: any) => p.id === prev)) return prev;
      return petOptions[0].id;
    });
  }, [petOptions]);

  // Fetch bookings for selected date
  const fetchBookingsForDate = useCallback(async (date: Date) => {
    const dateStr = formatDateApi(date);
    try {
      setLoadingSlots(true);
      const data = await getBookingsByDateApi(dateStr);
      setExistingBookings(data);
    } catch {
      setExistingBookings([]);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    fetchBookingsForDate(bookingDate);
  }, [bookingDate, fetchBookingsForDate]);

  /* ─── derived ─── */
  const selectedPet = petOptions.find((p: any) => p.id === selectedPetId);

  const startTimeStr = formatTime(bookingTime);
  const effectiveDuration = bookingTotalDuration > 0 ? bookingTotalDuration : 30;

  const endTimeStr = useMemo(
    () => addMinutesToTime(startTimeStr, effectiveDuration),
    [startTimeStr, effectiveDuration],
  );

  // Check slot overlap
  const slotConflict = useMemo(() => {
    if (!bookingItems.length) return null;

    const newStart = timeToMinutes(startTimeStr);
    const newEnd = timeToMinutes(endTimeStr);

    for (const b of existingBookings) {
      // Skip cancelled bookings
      const st = (b.status || "").toLowerCase();
      if (st === "cancelled" || st === "đã hủy") continue;

      if (!b.booking_time) continue;
      const bStart = timeToMinutes(b.booking_time.substring(0, 5));
      let bEnd = bStart + 30; // default 30 min if no end_time
      if (b.booking_end_time) {
        bEnd = timeToMinutes(b.booking_end_time.substring(0, 5));
      }

      // Overlap check: existingStart < newEnd && existingEnd > newStart
      if (bStart < newEnd && bEnd > newStart) {
        return {
          conflictStart: b.booking_time.substring(0, 5),
          conflictEnd: b.booking_end_time
            ? b.booking_end_time.substring(0, 5)
            : addMinutesToTime(b.booking_time.substring(0, 5), 30),
        };
      }
    }
    return null;
  }, [existingBookings, startTimeStr, endTimeStr, bookingItems.length]);

  /* ─── pickers ─── */
  const openDatePicker = () => {
    DateTimePickerAndroid.open({
      value: bookingDate,
      mode: "date",
      minimumDate: new Date(),
      onChange: (_e: DateTimePickerEvent, selected?: Date) => {
        if (selected) setBookingDate(selected);
      },
    });
  };

  const openTimePicker = () => {
    DateTimePickerAndroid.open({
      value: bookingTime,
      mode: "time",
      is24Hour: true,
      onChange: (_e: DateTimePickerEvent, selected?: Date) => {
        if (selected) {
          const now = new Date();
          const isToday = bookingDate.toDateString() === now.toDateString();
          const selectedHour = selected.getHours();
          const selectedMinutes = selected.getMinutes();

          if (selectedHour < 6 || selectedHour >= 22) {
            Alert.alert("Giờ không hợp lệ", "Cửa hàng chỉ mở cửa từ 06:00 đến 22:00.");
            return;
          }

          if (isToday) {
            const currentHour = now.getHours();
            const currentMinutes = now.getMinutes();
            if (
              selectedHour < currentHour ||
              (selectedHour === currentHour && selectedMinutes < currentMinutes)
            ) {
              Alert.alert(
                "Giờ không hợp lệ",
                "Không thể chọn giờ trong quá khứ."
              );
              return;
            }
          }

          setBookingTime(selected);
        }
      },
    });
  };

  /* ─── submit ─── */
  const onSubmit = async () => {
    if (!selectedPetId) {
      Alert.alert("Thiếu thông tin", "Vui lòng chọn thú cưng.");
      return;
    }
    if (!bookingItems.length) {
      Alert.alert("Dịch vụ trống", "Vui lòng thêm dịch vụ.");
      return;
    }
    if (slotConflict) {
      Alert.alert(
        "Trùng lịch",
        `Khung giờ ${startTimeStr} - ${endTimeStr} bị trùng với lịch hẹn ${slotConflict.conflictStart} - ${slotConflict.conflictEnd}. Vui lòng chọn giờ khác.`,
      );
      return;
    }
    if (isSubmitting) return;

    const startMins = timeToMinutes(startTimeStr);
    if (startMins < 6 * 60 || startMins >= 22 * 60) {
      Alert.alert("Giờ không hợp lệ", "Cửa hàng chỉ mở cửa từ 06:00 đến 22:00.");
      return;
    }

    const now = new Date();
    if (bookingDate.toDateString() === now.toDateString()) {
      const currentMins = now.getHours() * 60 + now.getMinutes();
      if (startMins < currentMins) {
        Alert.alert("Giờ không hợp lệ", "Không thể đặt lịch trong quá khứ.");
        return;
      }
    }

    // Build service_ids (repeat for quantity)
    const serviceIds: number[] = [];
    for (const item of bookingItems) {
      for (let i = 0; i < item.quantity; i++) {
        serviceIds.push(item.service.id);
      }
    }

    const payload: BookingCreate = {
      pet_id: selectedPetId,
      service_ids: serviceIds,
      booking_date: formatDateApi(bookingDate),
      booking_time: startTimeStr,
      booking_end_time: endTimeStr,
      status: paymentMethod === "sepay" ? "Chờ thanh toán" : "Đang xác nhận",
      note: notes.trim() || null,
      total_price: bookingTotalPrice,
      payment_method: paymentMethod,
    };

    try {
      setIsSubmitting(true);
      const res = await createBooking(payload);
      
      // Remove only booked items from cart
      if (selectedServiceIds) {
        for (const id of selectedServiceIds) {
          await removeItem(id);
        }
      } else {
        clearCart();
      }
      
      if (paymentMethod === "sepay") {
        router.replace({
          pathname: "/screens/user/stack/PaymentQR/PaymentQR",
          params: { bookingId: res.id, amount: bookingTotalPrice }
        });
      } else {
        Alert.alert("Thành công", "Đặt lịch thành công!", [
          { text: "OK", onPress: () => router.replace("/screens/user/tabs/HistoryScreen/History") },
        ]);
      }
    } catch {
      Alert.alert("Lỗi", "Không thể đặt lịch. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ────────────────────────── Render ────────────────────────── */
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đặt lịch hẹn</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── 1. Pet Selector ─── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🐾 Chọn thú cưng</Text>

          <TouchableOpacity
            style={[styles.selectBox, showPetOptions && styles.selectBoxOpen]}
            activeOpacity={0.8}
            onPress={() => petOptions.length && setShowPetOptions((p) => !p)}
          >
            <View style={styles.selectBoxLeft}>
              {selectedPet && (
                <Image
                  source={
                    (selectedPet as any).image
                      ? { uri: getImageUrl((selectedPet as any).image) }
                      : require("@/app/assets/images/no_image_pet.jpg")
                  }
                  style={styles.petAvatarSmall}
                />
              )}
              <Text style={styles.selectText}>
                {selectedPet ? (selectedPet as any).name : "Chọn thú cưng"}
              </Text>
            </View>
            <Ionicons
              name={showPetOptions ? "chevron-up" : "chevron-down"}
              size={18}
              color="#5A5A5A"
            />
          </TouchableOpacity>

          {petOptions.length === 0 && (
            <Text style={styles.emptyText}>Bạn chưa có thú cưng nào</Text>
          )}

          {showPetOptions && petOptions.length > 0 && (
            <View style={styles.optionsBox}>
              {petOptions.map((pet: any) => (
                <TouchableOpacity
                  key={pet.id}
                  style={styles.optionItem}
                  onPress={() => {
                    setSelectedPetId(pet.id);
                    setShowPetOptions(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Image
                    source={
                      pet.image
                        ? { uri: getImageUrl(pet.image) }
                        : require("@/app/assets/images/no_image_pet.jpg")
                    }
                    style={styles.petAvatarSmall}
                  />
                  <Text style={styles.optionText}>{pet.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* ─── 2. Services from Cart ─── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>📋 Dịch vụ đã chọn</Text>

          {bookingItems.length === 0 ? (
            <Text style={styles.emptyText}>Chưa có dịch vụ nào trong giỏ hàng</Text>
          ) : (
            <>
              {bookingItems.map((item, idx) => (
                <View
                  key={item.service.id}
                  style={[
                    styles.serviceItem,
                    idx === bookingItems.length - 1 && styles.serviceItemLast,
                  ]}
                >
                  <View style={styles.serviceIcon}>
                    <Ionicons
                      name={(item.service.icon as any) || "medkit-outline"}
                      size={20}
                      color="#5CB15A"
                    />
                  </View>
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName} numberOfLines={1}>
                      {item.service.name}
                    </Text>
                    <Text style={styles.serviceMeta}>
                      {formatPrice(item.service.price || 0)}
                      {item.service.duration
                        ? ` · ${formatDuration(item.service.duration)}`
                        : ""}
                    </Text>
                  </View>
                  <Text style={styles.serviceQty}>x{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => removeItem(item.service.id)}
                  >
                    <Ionicons name="close-circle" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}

              {/* Summary */}
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tổng thời gian:</Text>
                <Text style={styles.summaryValue}>{formatDuration(bookingTotalDuration)}</Text>
              </View>
              <View style={[styles.summaryRow, { borderTopWidth: 0, marginTop: 4, paddingTop: 0 }]}>
                <Text style={styles.summaryLabel}>Tổng tiền:</Text>
                <Text style={styles.totalPriceValue}>{formatPrice(bookingTotalPrice)}</Text>
              </View>
            </>
          )}
        </View>

        {/* ─── 3. Date & Time ─── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>📅 Chọn ngày & giờ</Text>
          <Text style={{ fontSize: 13, color: "#6B7280", marginBottom: 12 }}>
            Giờ hoạt động: 06:00 - 22:00
          </Text>

          <View style={styles.pickerRow}>
            <View style={styles.pickerCol}>
              <Text style={styles.fieldLabel}>Ngày</Text>
              <TouchableOpacity
                style={styles.pickerBox}
                activeOpacity={0.8}
                onPress={openDatePicker}
              >
                <Ionicons name="calendar-outline" size={18} color="#6B7280" />
                <Text style={styles.pickerText}>{formatDateDisplay(bookingDate)}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.pickerCol}>
              <Text style={styles.fieldLabel}>Giờ bắt đầu</Text>
              <TouchableOpacity
                style={styles.pickerBox}
                activeOpacity={0.8}
                onPress={openTimePicker}
              >
                <Ionicons name="time-outline" size={18} color="#6B7280" />
                <Text style={styles.pickerText}>{startTimeStr}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Slot display */}
          {bookingItems.length > 0 && (
            <View
              style={[
                styles.slotDisplay,
                slotConflict ? styles.slotConflict : styles.slotOk,
              ]}
            >
              {loadingSlots ? (
                <ActivityIndicator size="small" color="#6B7280" />
              ) : (
                <>
                  <Ionicons
                    name={slotConflict ? "warning" : "checkmark-circle"}
                    size={20}
                    color={slotConflict ? "#DC2626" : "#059669"}
                  />
                  <Text
                    style={[
                      styles.slotText,
                      slotConflict ? styles.slotTextConflict : styles.slotTextOk,
                    ]}
                  >
                    {slotConflict
                      ? `Trùng lịch: ${slotConflict.conflictStart} - ${slotConflict.conflictEnd}`
                      : `Khung giờ: ${startTimeStr} - ${endTimeStr}`}
                  </Text>
                </>
              )}
            </View>
          )}
        </View>

        {/* ─── 4. Payment Method ─── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>💳 Phương thức thanh toán</Text>

          {/* Store payment */}
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === "store" && styles.paymentOptionSelected,
            ]}
            activeOpacity={0.8}
            onPress={() => setPaymentMethod("store")}
          >
            <View
              style={[
                styles.paymentRadio,
                paymentMethod === "store" && styles.paymentRadioSelected,
              ]}
            >
              {paymentMethod === "store" && <View style={styles.paymentRadioDot} />}
            </View>
            <Ionicons
              name="storefront-outline"
              size={22}
              color={paymentMethod === "store" ? "#059669" : "#6B7280"}
              style={styles.paymentIcon}
            />
            <View>
              <Text style={styles.paymentLabel}>Thanh toán tại cửa hàng</Text>
              <Text style={styles.paymentDesc}>Thanh toán khi đến sử dụng dịch vụ</Text>
            </View>
          </TouchableOpacity>

          {/* SePay QR */}
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === "sepay" && styles.paymentOptionSelected,
            ]}
            activeOpacity={0.8}
            onPress={() => setPaymentMethod("sepay")}
          >
            <View
              style={[
                styles.paymentRadio,
                paymentMethod === "sepay" && styles.paymentRadioSelected,
              ]}
            >
              {paymentMethod === "sepay" && <View style={styles.paymentRadioDot} />}
            </View>
            <Ionicons
              name="qr-code-outline"
              size={22}
              color={paymentMethod === "sepay" ? "#059669" : "#6B7280"}
              style={styles.paymentIcon}
            />
            <View>
              <Text style={styles.paymentLabel}>Quét QR (SePay)</Text>
              <Text style={styles.paymentDesc}>Chuyển khoản qua mã QR</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ─── 5. Notes ─── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>📝 Ghi chú</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Nhập ghi chú cho lịch hẹn (tùy chọn)"
            placeholderTextColor="#9CA3AF"
            style={styles.notesInput}
            multiline
          />
        </View>

        {/* ─── Submit ─── */}
        <TouchableOpacity
          style={[
            styles.submitBtn,
            (isSubmitting || !bookingItems.length) && styles.submitBtnDisabled,
          ]}
          onPress={onSubmit}
          activeOpacity={0.8}
          disabled={isSubmitting || !bookingItems.length}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Ionicons name="checkmark-circle" size={22} color="#FFF" />
          )}
          <Text style={styles.submitBtnText}>
            {isSubmitting ? "Đang xử lý..." : "Xác nhận đặt lịch"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
