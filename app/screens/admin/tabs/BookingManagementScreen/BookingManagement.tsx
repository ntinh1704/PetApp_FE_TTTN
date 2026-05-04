import { useBookings, useUpdateBooking } from "@/app/utils/hook/useBooking";
import { Booking } from "@/app/utils/models/booking";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import { Modal, TextInput, Alert, ScrollView, Text, TouchableOpacity, View, KeyboardAvoidingView, Platform } from "react-native";
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
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
            <Ionicons name="menu" size={20} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Quản lý đặt lịch</Text>
        </View>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.containerNoPadTop}>


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
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Mã lịch:</Text>
                  <Text style={[styles.infoValue, { fontWeight: "bold", fontSize: 16 }]}>#{item.id}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Khách:</Text>
                  <Text style={styles.infoValue}>{item.user_name || `#${item.user_id}`}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Thú cưng:</Text>
                  <Text style={styles.infoValue}>{item.pet_name || `#${item.pet_id}`}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Dịch vụ:</Text>
                  <Text style={styles.infoValue}>
                    {item.service_names?.join(", ") || item.service_name || "Chưa rõ"}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Nhân viên:</Text>
                  <Text style={styles.infoValue}>{item.staff_name || "Cửa hàng sắp xếp"}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Ngày:</Text>
                  <Text style={styles.infoValue}>{formatDateDisplay(item.booking_date)}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Giờ:</Text>
                  <Text style={styles.infoValue}>{formatTimeDisplay(item.booking_time)}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Trạng thái:</Text>
                  <View style={styles.statusBadgeContainer}>
                    <View style={[styles.statusBadge, getStatusStyles(statusKey).badge]}>
                      <Text style={[styles.statusBadgeText, { color: getStatusStyles(statusKey).color }]}>
                        {statusVi}
                      </Text>
                    </View>
                  </View>
                </View>

                {(statusKey === "cancel_requested" || statusKey === "cancelled") && item.cancel_reason ? (
                  <View style={styles.cancelReasonContainer}>
                    <Text style={styles.cancelReasonTitle}>
                      {statusKey === "cancel_requested" ? "🚨 Lý do khách yêu cầu hủy:" : "Lý do hủy:"}
                    </Text>
                    <Text style={styles.cancelReasonText}>{item.cancel_reason}</Text>
                  </View>
                ) : null}

                <View style={styles.actionRow}>
                  {(statusKey === "pending" || statusKey === "awaiting_payment") && (
                    <>
                      <TouchableOpacity
                        style={[styles.actionButtonWrap, styles.confirmBtn]}
                        onPress={() => {
                          Alert.alert(
                            "Xác nhận lịch hẹn",
                            "Bạn có chắc chắn muốn xác nhận lịch hẹn này?",
                            [
                              { text: "Hủy", style: "cancel" },
                              { text: "Xác nhận", onPress: () => {
                                  if (!item.staff_name) {
                                    Alert.alert(
                                      "Chưa phân công",
                                      "Lịch hẹn chưa có nhân viên. Bạn sẽ được chuyển sang trang chi tiết để phân công.",
                                      [
                                        {
                                          text: "Đồng ý",
                                          onPress: () => {
                                            router.push({
                                              pathname: "/screens/admin/BookingDetail/BookingDetail",
                                              params: { bookingId: String(item.id) },
                                            });
                                          }
                                        }
                                      ]
                                    );
                                  } else {
                                    updateStatus(item.id, "confirmed");
                                  }
                                }
                              }
                            ]
                          );
                        }}
                        disabled={isUpdating}
                      >
                        <Text style={[styles.actionButtonText, styles.actionTextBlue]}>Xác nhận</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButtonWrap, styles.cancelBtn]}
                        onPress={() => openCancelModal(item.id, "cancelled")}
                        disabled={isUpdating}
                      >
                        <Text style={[styles.actionButtonText, styles.actionTextRed]}>Từ chối</Text>
                      </TouchableOpacity>
                    </>
                  )}

                  {(statusKey === "confirmed" || statusKey === "paid") && (
                    <>
                      <TouchableOpacity
                        style={[styles.actionButtonWrap, styles.completeBtn]}
                        onPress={() => {
                          Alert.alert(
                            "Xác nhận",
                            "Bạn có chắc chắn muốn hoàn thành lịch hẹn này?",
                            [
                              { text: "Quay lại", style: "cancel" },
                              { text: "Hoàn thành", onPress: () => updateStatus(item.id, "completed") }
                            ]
                          );
                        }}
                        disabled={isUpdating}
                      >
                        <Text style={[styles.actionButtonText, styles.actionTextGreen]}>Hoàn thành</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButtonWrap, styles.cancelBtn]}
                        onPress={() => openCancelModal(item.id, "cancelled")}
                        disabled={isUpdating}
                      >
                        <Text style={[styles.actionButtonText, styles.actionTextRed]}>Hủy</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionButtonWrap}
                        onPress={() =>
                          router.push({
                            pathname: "/screens/admin/BookingDetail/BookingDetail",
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
                        onPress={() => {
                          Alert.alert(
                            "Xác nhận duyệt hủy",
                            "Bạn có chắc chắn muốn duyệt yêu cầu hủy lịch này?",
                            [
                              { text: "Quay lại", style: "cancel" },
                              { text: "Duyệt hủy", style: "destructive", onPress: () => updateStatus(item.id, "cancelled") }
                            ]
                          );
                        }}
                        disabled={isUpdating}
                      >
                        <Text style={[styles.actionButtonText, styles.actionTextRed]}>Duyệt hủy</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButtonWrap, styles.confirmBtn]}
                        onPress={() => openCancelModal(item.id, "confirmed")}
                        disabled={isUpdating}
                      >
                        <Text style={[styles.actionButtonText, styles.actionTextBlue]}>Từ chối</Text>
                      </TouchableOpacity>
                    </>
                  )}

                  {(statusKey === "completed" || statusKey === "cancelled") && (
                    <TouchableOpacity
                      style={styles.actionButtonWrap}
                      onPress={() =>
                        router.push({
                          pathname: "/screens/admin/BookingDetail/BookingDetail",
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
      </KeyboardAvoidingView>

      <Modal
        visible={isCancelModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setCancelModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="alert-circle" size={24} color="#DC2626" />
              <Text style={styles.modalTitle}>
                {pendingCancelStatus === "confirmed" ? "Lý do từ chối hủy lịch" : "Lý do từ chối / hủy lịch"}
              </Text>
            </View>
            
            <TextInput
              style={styles.modalInput}
              placeholder={pendingCancelStatus === "confirmed" ? "Nhập lý do từ chối hủy tại đây..." : "Nhập lý do hủy tại đây..."}
              multiline
              numberOfLines={4}
              value={cancelReason}
              onChangeText={setCancelReason}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  setCancelModalVisible(false);
                  setCancelReason("");
                  setPendingCancelId(null);
                  setPendingCancelStatus(null);
                }}
              >
                <Text style={styles.modalButtonCancelText}>Quay lại</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonConfirm]}
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
                <Text style={styles.modalButtonConfirmText}>
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
