import { useBookings, useUpdateBooking } from "@/app/utils/hook/useBooking";
import { Booking } from "@/app/utils/models/booking";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import { Modal, TextInput, Alert, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import React, { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles";

type FilterKey = "all" | "pending" | "confirmed" | "completed" | "cancelled" | "cancel_requested" | "awaiting_payment" | "paid";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Đang xác nhận" },
  { key: "confirmed", label: "Đã xác nhận" },
  { key: "cancel_requested", label: "Yêu cầu hủy" },
  { key: "completed", label: "Hoàn thành" },
  { key: "cancelled", label: "Đã hủy" },
];

const toStatusKey = (status?: string | null): Exclude<FilterKey, "all"> => {
  const raw = (status ?? "").trim().toLowerCase();
  if (raw === "chờ thanh toán" || raw === "awaiting_payment") return "pending";
  if (raw === "đã thanh toán" || raw === "paid") return "confirmed";
  if (raw === "confirmed" || raw === "đã xác nhận") return "confirmed";
  if (raw === "completed" || raw === "hoàn thành") return "completed";
  if (raw === "cancel_requested" || raw === "đang xin hủy") return "cancel_requested";
  if (raw === "cancelled" || raw === "canceled" || raw === "đã hủy") return "cancelled";
  return "pending";
};

const toStatusVi = (status?: string | null) => {
  const key = toStatusKey(status);
  if (key === "awaiting_payment") return "Chờ thanh toán";
  if (key === "paid") return "Đã thanh toán";
  if (key === "confirmed") return "Đã xác nhận";
  if (key === "completed") return "Hoàn thành";
  if (key === "cancel_requested") return "Đang xin hủy";
  if (key === "cancelled") return "Đã hủy";
  return "Đang xác nhận";
};

const getStatusStyles = (status: Exclude<FilterKey, "all">) => {
  if (status === "awaiting_payment") return { badge: styles.statusPending, color: "#6B7280" };
  if (status === "paid") return { badge: styles.statusConfirmed, color: "#2563EB" };
  if (status === "confirmed") return { badge: styles.statusConfirmed, color: "#2563EB" };
  if (status === "completed") return { badge: styles.statusCompleted, color: "#16A34A" };
  if (status === "cancelled") return { badge: styles.statusCancelled, color: "#DC2626" };
  if (status === "cancel_requested") return { badge: styles.statusCancelRequested, color: "#D97706" };
  return { badge: styles.statusPending, color: "#6B7280" };
};

const formatDateDisplay = (value?: string | null) => {
  if (!value) return "";
  const raw = String(value);
  const datePart = raw.includes("T") ? raw.split("T")[0] : raw;
  const parts = datePart.split("-");
  if (parts.length !== 3) return raw;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
};

const formatTimeDisplay = (value?: string | null) => {
  if (!value) return "";
  const raw = String(value);
  const timePart = raw.includes("T") ? raw.split("T")[1] : raw;
  const clean = timePart.split(".")[0];
  const [hour, minute] = clean.split(":");
  if (!hour || !minute) return raw;
  return `${hour}:${minute}`;
};

const toTimestamp = (item: Booking) => {
  if (item.created_at) {
    const t = new Date(item.created_at).getTime();
    if (!Number.isNaN(t)) return t;
  }
  return Number(item.id) || 0;
};

export default function BookingManagementScreen() {
  const navigation = useNavigation();
  const { data: bookings, isLoading, refetch } = useBookings();
  const { mutateAsync: updateBooking, isPending: isUpdating } = useUpdateBooking();

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const [isCancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [pendingCancelId, setPendingCancelId] = useState<number | null>(null);
  const [pendingCancelStatus, setPendingCancelStatus] = useState<string | null>(null);


  const bookingList = useMemo(() => {
    const rawList = Array.isArray(bookings)
      ? bookings
      : ((bookings as unknown as { data?: Booking[] })?.data ?? []);

    const sorted = [...rawList].sort((a, b) => toTimestamp(b) - toTimestamp(a));

    const keyword = search.trim().toLowerCase();
    return sorted.filter((item) => {
      const statusKey = toStatusKey(item.status);
      const matchFilter = activeFilter === "all" || statusKey === activeFilter;
      if (!matchFilter) return false;

      if (!keyword) return true;
      const target = [
        item.user_name,
        item.pet_name,
        item.service_name,
        item.service_names?.join(" "),
        item.note,
        item.status,
        item.booking_date,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return target.includes(keyword);
    });
  }, [bookings, search, activeFilter]);

  const updateStatus = async (bookingId: number, status: "confirmed" | "completed" | "cancelled", reason?: string) => {
    try {
      await updateBooking({ id: bookingId, status, cancel_reason: reason });
      await refetch();
      Alert.alert("Thành công", "Đã cập nhật trạng thái lịch đặt.");
    } catch {
      Alert.alert("Lỗi", "Không thể cập nhật trạng thái lịch đặt.");
    }
  };

  const openCancelModal = (bookingId: number, status: string) => {
    setPendingCancelId(bookingId);
    setPendingCancelStatus(status);
    setCancelReason("");
    setCancelModalVisible(true);
  };
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={[styles.header, { marginHorizontal: 12, marginTop: 12 }]}>
        <View style={styles.headerLeft}>
          <Pressable
            style={styles.iconButton}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
            <Ionicons name="menu" size={20} color="#FFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Quản lý đặt lịch</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={[styles.container, { paddingTop: 0 }]}>

        <TextInput
          placeholder="Tìm lịch đặt..."
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {FILTERS.map((f) => {
            const active = activeFilter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                style={[styles.filterChip, active && styles.filterChipActive]}
                onPress={() => setActiveFilter(f.key)}
              >
                <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.sectionDivider} />

        {isLoading && <Text style={styles.stateText}>Đang tải lịch đặt...</Text>}

        {!isLoading && bookingList.length === 0 && (
          <Text style={styles.stateText}>Không có lịch hẹn nào.</Text>
        )}

        {!isLoading &&
          bookingList.map((item) => {
            const statusKey = toStatusKey(item.status);
            const statusVi = toStatusVi(item.status);

            return (
              <View key={item.id} style={styles.bookingCard}>
                <Text style={styles.bookingInfo}>Khách: {item.user_name || `#${item.user_id}`}</Text>
                <Text style={styles.bookingInfo}>Thú cưng: {item.pet_name || `#${item.pet_id}`}</Text>
                <Text style={styles.bookingInfo}>
                  Dịch vụ: {item.service_names?.join(", ") || item.service_name || "Chưa rõ"}
                </Text>
                <Text style={styles.bookingInfo}>Ngày: {formatDateDisplay(item.booking_date)}</Text>
                <Text style={styles.bookingInfo}>Giờ: {formatTimeDisplay(item.booking_time)}</Text>
                <View style={styles.statusRow}>
                  <Text style={styles.bookingInfo}>Trạng thái:</Text>
                  <View style={[styles.statusBadge, getStatusStyles(statusKey).badge]}>
                    <Text style={[styles.statusBadgeText, { color: getStatusStyles(statusKey).color }]}>
                      {statusVi}
                    </Text>
                  </View>
                </View>

                {(statusKey === "cancel_requested" || statusKey === "cancelled") && item.cancel_reason ? (
                  <View style={{ marginTop: 8, padding: 8, backgroundColor: "#FEF2F2", borderRadius: 8 }}>
                    <Text style={{ color: "#DC2626", fontWeight: "bold" }}>
                      {statusKey === "cancel_requested" ? "🚨 Lý do khách yêu cầu hủy:" : "Lý do hủy:"}
                    </Text>
                    <Text style={{ color: "#DC2626" }}>{item.cancel_reason}</Text>
                  </View>
                ) : null}

                <View style={styles.actionRow}>
                  {(statusKey === "pending" || statusKey === "awaiting_payment") && (
                    <>
                      <TouchableOpacity
                        style={[styles.actionButtonWrap, styles.confirmBtn]}
                        onPress={() => updateStatus(item.id, "confirmed")}
                        disabled={isUpdating}
                      >
                        <Text style={[styles.actionButtonText, { color: "#2563EB" }]}>Xác nhận</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButtonWrap, styles.cancelBtn]}
                        onPress={() => openCancelModal(item.id, "cancelled")}
                        disabled={isUpdating}
                      >
                        <Text style={[styles.actionButtonText, { color: "#DC2626" }]}>Từ chối</Text>
                      </TouchableOpacity>
                    </>
                  )}

                  {(statusKey === "confirmed" || statusKey === "paid") && (
                    <>
                      <TouchableOpacity
                        style={[styles.actionButtonWrap, styles.completeBtn]}
                        onPress={() => updateStatus(item.id, "completed")}
                        disabled={isUpdating}
                      >
                        <Text style={[styles.actionButtonText, { color: "#16A34A" }]}>Hoàn thành</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButtonWrap, styles.cancelBtn]}
                        onPress={() => openCancelModal(item.id, "cancelled")}
                        disabled={isUpdating}
                      >
                        <Text style={[styles.actionButtonText, { color: "#DC2626" }]}>Hủy</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionButtonWrap}
                        onPress={() =>
                          router.push({
                            pathname: "/screens/admin/tabs/BookingManagementScreen/BookingDetail",
                            params: { bookingId: String(item.id) },
                          })
                        }
                      >
                        <Text style={styles.actionButtonText}>Xem chi tiết</Text>
                      </TouchableOpacity>
                    </>
                  )}

                  {statusKey === "cancel_requested" && (
                    <>
                      <TouchableOpacity
                        style={[styles.actionButtonWrap, styles.cancelBtn]}
                        onPress={() => openCancelModal(item.id, "cancelled")}
                        disabled={isUpdating}
                      >
                        <Text style={[styles.actionButtonText, { color: "#DC2626" }]}>Duyệt hủy</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButtonWrap, styles.confirmBtn]}
                        onPress={() => updateStatus(item.id, "confirmed")}
                        disabled={isUpdating}
                      >
                        <Text style={[styles.actionButtonText, { color: "#2563EB" }]}>Từ chối</Text>
                      </TouchableOpacity>
                    </>
                  )}

                  {(statusKey === "completed" || statusKey === "cancelled") && (
                    <TouchableOpacity
                      style={styles.actionButtonWrap}
                      onPress={() =>
                        router.push({
                          pathname: "/screens/admin/tabs/BookingManagementScreen/BookingDetail",
                          params: { bookingId: String(item.id) },
                        })
                      }
                    >
                      <Text style={styles.actionButtonText}>Xem chi tiết</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
      </ScrollView>

      <Modal
        visible={isCancelModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setCancelModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}>
          <View style={{ width: "85%", backgroundColor: "#FFF", borderRadius: 12, padding: 20, elevation: 5, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
              <Ionicons name="alert-circle" size={24} color="#DC2626" />
              <Text style={{ fontSize: 18, fontWeight: "bold", color: "#1F2937", marginLeft: 8 }}>
                Lý do từ chối / hủy lịch
              </Text>
            </View>
            
            <TextInput
              style={{ padding: 12, borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 8, fontSize: 14, color: "#1F2937", backgroundColor: "#F9FAFB", minHeight: 80, textAlignVertical: "top" }}
              placeholder="Nhập lý do hủy tại đây..."
              multiline
              numberOfLines={4}
              value={cancelReason}
              onChangeText={setCancelReason}
            />

            <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 20, gap: 12 }}>
              <TouchableOpacity 
                style={{ paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, backgroundColor: "#E5E7EB" }}
                onPress={() => {
                  setCancelModalVisible(false);
                  setCancelReason("");
                  setPendingCancelId(null);
                  setPendingCancelStatus(null);
                }}
              >
                <Text style={{ color: "#4B5563", fontWeight: "600" }}>Quay lại</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={{ paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, backgroundColor: "#DC2626" }}
                onPress={() => {
                  if (!cancelReason.trim()) {
                    Alert.alert("Thông báo", "Vui lòng nhập lý do hủy.");
                    return;
                  }
                  if (pendingCancelId && pendingCancelStatus) {
                    updateStatus(pendingCancelId, pendingCancelStatus as any, cancelReason);
                    setCancelModalVisible(false);
                    setCancelReason("");
                    setPendingCancelId(null);
                    setPendingCancelStatus(null);
                  }
                }}
                disabled={isUpdating}
              >
                <Text style={{ color: "#FFF", fontWeight: "bold" }}>
                  {isUpdating ? "Đang xử lý..." : "Xác nhận hủy"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
