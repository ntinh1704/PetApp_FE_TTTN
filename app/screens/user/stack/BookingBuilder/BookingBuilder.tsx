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
import { useCreateBooking, useStaffAvailability } from "../../../../utils/hook/useBooking";
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
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
  const [showStaffOptions, setShowStaffOptions] = useState(false);
  const [bookingDate, setBookingDate] = useState<Date>(new Date());
  const [bookingTime, setBookingTime] = useState<Date>(new Date());
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("store");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ─── slot check ─── */
  const [existingBookings, setExistingBookings] = useState<any[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  /* ─── staff availability (depends on date/time) ─── */
  const dateStrForStaff = useMemo(() => formatDateApi(bookingDate), [bookingDate]);
  const startTimeStrForStaff = useMemo(() => formatTime(bookingTime), [bookingTime]);
  const endTimeStrForStaff = useMemo(
    () => addMinutesToTime(startTimeStrForStaff, bookingTotalDuration > 0 ? bookingTotalDuration : 30),
    [startTimeStrForStaff, bookingTotalDuration],
  );
  const { data: staffAvailData, isLoading: loadingStaff } = useStaffAvailability(
    dateStrForStaff, startTimeStrForStaff, endTimeStrForStaff,
  );

  const staffOptions = useMemo(
    () =>
      Array.isArray(staffAvailData)
        ? staffAvailData
        : ((staffAvailData as any)?.data ?? []),
    [staffAvailData],
  );

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
  const selectedStaff = staffOptions.find((s: any) => s.id === selectedStaffId);

  const startTimeStr = formatTime(bookingTime);
  const effectiveDuration = bookingTotalDuration > 0 ? bookingTotalDuration : 30;

  const endDateTime = useMemo(() => {
    const [hh, mm] = startTimeStr.split(":").map(Number);
    const dt = new Date(bookingDate);
    dt.setHours(hh);
    dt.setMinutes(mm + effectiveDuration);
    return dt;
  }, [bookingDate, startTimeStr, effectiveDuration]);

  const endTimeStr = formatTime(endDateTime);
  const endDateStr = formatDateDisplay(endDateTime);

  // Check slot overlap
  const slotConflict = useMemo(() => {
    if (!bookingItems.length) return null;

    const newStart = timeToMinutes(startTimeStr);
    const newEnd = timeToMinutes(endTimeStr);

    if (selectedStaffId) {
      const staff = staffOptions.find((s: any) => s.id === selectedStaffId);
      if (staff && staff.status === "busy") {
        const fromDateStr = formatDateDisplay(bookingDate);
        let toDateStr = fromDateStr;
        const fromMins = timeToMinutes(staff.busy_from);
        const toMins = timeToMinutes(staff.busy_to);
        if (toMins <= fromMins) {
          const nextDay = new Date(bookingDate);
          nextDay.setDate(nextDay.getDate() + 1);
          toDateStr = formatDateDisplay(nextDay);
        }
        return {
          type: "staff_busy",
          conflictStart: staff.busy_from,
          conflictEnd: staff.busy_to,
          message: `Nhân viên ${staff.name} đã có lịch từ ${staff.busy_from} ${fromDateStr} - ${staff.busy_to} ${toDateStr}`,
        };
      }
    }

    // 2. Check shop capacity
    const overlappingBookings = existingBookings.filter((b) => {
      const st = (b.status || "").toLowerCase();
      if (st === "cancelled" || st === "đã hủy") return false;
      if (!b.booking_time) return false;

      const bStart = timeToMinutes(b.booking_time.substring(0, 5));
      let bEnd = bStart + 30;
      if (b.booking_end_time) {
        bEnd = timeToMinutes(b.booking_end_time.substring(0, 5));
      }

      return bStart < newEnd && bEnd > newStart;
    });

    const totalStaffCount = staffOptions.length;

    if (totalStaffCount > 0 && overlappingBookings.length >= totalStaffCount) {
      return {
        type: "shop_full",
        conflictStart: startTimeStr,
        conflictEnd: endTimeStr,
        message: "Cửa hàng đã kín lịch trong khung giờ này",
      };
    }

    return null;
  }, [existingBookings, startTimeStr, endTimeStr, bookingItems.length, selectedStaffId, staffOptions]);

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
        slotConflict.type === "staff_busy" ? "Nhân viên bận" : "Kín lịch",
        `${slotConflict.message}. Vui lòng chọn ${slotConflict.type === "staff_busy" ? "nhân viên hoặc " : ""}giờ khác.`,
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
      staff_id: selectedStaffId,
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
          <Text style={{ fontSize: 13, color: "#EF4444", marginBottom: 12, fontStyle: "italic" }}>
            *Cửa hàng có thể cập nhật thêm dịch vụ phát sinh nếu cần
          </Text>

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

        {/* ─── 3. Staff Selector ─── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>👨‍💼 Chọn nhân viên</Text>

          <TouchableOpacity
            style={[styles.selectBox, showStaffOptions && styles.selectBoxOpen]}
            activeOpacity={0.8}
            onPress={() => staffOptions.length && setShowStaffOptions((p) => !p)}
          >
            <View style={styles.selectBoxLeft}>
              {selectedStaff ? (
                selectedStaff.avatar ? (
                  <Image source={{ uri: getImageUrl(selectedStaff.avatar) }} style={{ width: 40, height: 40, borderRadius: 20 }} />
                ) : (
                  <Ionicons name="person-circle" size={40} color="#111827" />
                )
              ) : (
                <View style={[styles.petAvatarSmall, { alignItems: "center", justifyContent: "center" }]}>
                  <Ionicons name="storefront" size={24} color="#6B7280" />
                </View>
              )}
              <View>
                <Text style={styles.selectText}>
                  {selectedStaff ? selectedStaff.name : "Để cửa hàng sắp xếp"}
                </Text>
                {selectedStaff?.specialty && (
                  <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
                    Chuyên môn: {selectedStaff.specialty}
                  </Text>
                )}
                {selectedStaff?.status === "busy" && (
                  <Text style={{ fontSize: 11, color: "#DC2626", marginTop: 2 }}>
                    ⚠️ Trùng giờ: {selectedStaff.busy_from} - {selectedStaff.busy_to}
                  </Text>
                )}
                {selectedStaff?.busy_slots?.length > 0 && (
                  <Text style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>
                    📋 Lịch trong ngày: {selectedStaff.busy_slots.map((s: any) => `${s.from}-${s.to}`).join(", ")}
                  </Text>
                )}
              </View>
            </View>
            <Ionicons
              name={showStaffOptions ? "chevron-up" : "chevron-down"}
              size={18}
              color="#5A5A5A"
            />
          </TouchableOpacity>

          {staffOptions.length === 0 && (
            <Text style={styles.emptyText}>Hiện chưa có nhân viên nào</Text>
          )}

          {showStaffOptions && staffOptions.length > 0 && (
            <View style={styles.optionsBox}>
              <TouchableOpacity
                style={styles.optionItem}
                onPress={() => {
                  setSelectedStaffId(null);
                  setShowStaffOptions(false);
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.petAvatarSmall, { alignItems: "center", justifyContent: "center" }]}>
                  <Ionicons name="storefront" size={24} color="#6B7280" />
                </View>
                <Text style={styles.optionText}>Để cửa hàng sắp xếp</Text>
              </TouchableOpacity>

              {staffOptions.map((staff: any) => {
                const isBusy = staff.status === "busy";
                const hasBusySlots = staff.busy_slots?.length > 0;
                return (
                <TouchableOpacity
                  key={staff.id}
                  style={[styles.optionItem, isBusy && { opacity: 0.7, backgroundColor: "#FEF2F2" }]}
                  onPress={() => {
                    if (isBusy) {
                      Alert.alert(
                        "Nhân viên đang bận",
                        `${staff.name} đã có lịch từ ${staff.busy_from} - ${staff.busy_to}. Bạn vẫn muốn chọn?`,
                        [
                          { text: "Hủy", style: "cancel" },
                          { text: "Vẫn chọn", onPress: () => { setSelectedStaffId(staff.id); setShowStaffOptions(false); } },
                        ]
                      );
                    } else {
                      setSelectedStaffId(staff.id);
                      setShowStaffOptions(false);
                    }
                  }}
                  activeOpacity={0.7}
                >
                  {staff.avatar ? (
                    <Image
                      source={{ uri: getImageUrl(staff.avatar) }}
                      style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: isBusy ? "#DC2626" : "#E5E7EB" }}
                    />
                  ) : (
                    <Ionicons name="person-circle" size={40} color={isBusy ? "#DC2626" : "#111827"} />
                  )}
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                      <Text style={[styles.optionText, { flex: 1, marginRight: 8 }]} numberOfLines={1}>{staff.name}</Text>
                      <View style={{ backgroundColor: isBusy ? "#FEE2E2" : "#DCFCE7", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                        <Text style={{ fontSize: 10, fontWeight: "bold", color: isBusy ? "#DC2626" : "#16A34A" }}>
                          {isBusy ? "Bận" : "Rảnh"}
                        </Text>
                      </View>
                    </View>
                    {staff.specialty && (
                      <Text style={{ fontSize: 12, color: "#6B7280" }}>
                        Chuyên môn: {staff.specialty}
                      </Text>
                    )}
                    {isBusy && (() => {
                      const fromDateStr = formatDateDisplay(bookingDate);
                      let toDateStr = fromDateStr;
                      const fromMins = timeToMinutes(staff.busy_from);
                      const toMins = timeToMinutes(staff.busy_to);
                      if (toMins <= fromMins) {
                        const nextDay = new Date(bookingDate);
                        nextDay.setDate(nextDay.getDate() + 1);
                        toDateStr = formatDateDisplay(nextDay);
                      }
                      return (
                        <Text style={{ fontSize: 11, color: "#DC2626", marginTop: 2 }}>
                          ⚠️ Trùng giờ: {staff.busy_from} {fromDateStr} - {staff.busy_to} {toDateStr}
                        </Text>
                      );
                    })()}
                    {hasBusySlots && (
                      <Text style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>
                        📋 Lịch trong ngày: {staff.busy_slots.map((s: any) => {
                          const fromDateStr = formatDateDisplay(bookingDate);
                          let toDateStr = fromDateStr;
                          const fromMins = timeToMinutes(s.from);
                          const toMins = timeToMinutes(s.to);
                          if (toMins <= fromMins) {
                            const nextDay = new Date(bookingDate);
                            nextDay.setDate(nextDay.getDate() + 1);
                            toDateStr = formatDateDisplay(nextDay);
                          }
                          return `${s.from} ${fromDateStr} - ${s.to} ${toDateStr}`;
                        }).join(", ")}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* ─── 4. Date & Time ─── */}
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
                      ? slotConflict.message
                      : `Dự kiến hoàn thành: ${endTimeStr} ${endDateStr}`}
                  </Text>
                </>
              )}
            </View>
          )}
        </View>

        {/* ─── 5. Payment Method ─── */}
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
              <Text style={styles.paymentLabel}>Quét QR</Text>
              <Text style={styles.paymentDesc}>Chuyển khoản qua mã QR</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ─── 6. Notes ─── */}
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
      </ScrollView>

      {/* ─── Bottom Bar ─── */}
      <View style={styles.bottomBar}>
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
      </View>
    </SafeAreaView>
  );
}
