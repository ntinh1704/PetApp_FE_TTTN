import { useBookingById, useUpdateBooking } from "@/app/utils/hook/useBooking";
import { Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, Modal, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles";

const toStatusKey = (status?: string | null): "pending" | "confirmed" | "completed" | "cancelled" | "cancel_requested" | "awaiting_payment" | "paid" => {
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
  if (key === "cancel_requested") return "Yêu cầu hủy";
  if (key === "cancelled") return "Đã hủy";
  return "Đang xác nhận";
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

const getStatusStyles = (status: "pending" | "confirmed" | "completed" | "cancelled" | "cancel_requested" | "awaiting_payment" | "paid") => {
  if (status === "awaiting_payment") return { badge: styles.statusPending, color: "#6B7280" };
  if (status === "paid") return { badge: styles.statusConfirmed, color: "#2563EB" };
  if (status === "confirmed") return { badge: styles.statusConfirmed, color: "#2563EB" };
  if (status === "completed") return { badge: styles.statusCompleted, color: "#16A34A" };
  if (status === "cancelled") return { badge: styles.statusCancelled, color: "#DC2626" };
  if (status === "cancel_requested") return { badge: styles.statusCancelRequested, color: "#D97706" };
  return { badge: styles.statusPending, color: "#6B7280" };
};

export default function BookingDetailScreen() {
  const params = useLocalSearchParams<{ bookingId?: string }>();
  const bookingId = Number(params.bookingId ?? 0);
  const { data: booking, isLoading } = useBookingById(bookingId);
  const updateMutation = useUpdateBooking();

  const [isCancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);

  const statusKey = toStatusKey(booking?.status);

  const handleUpdate = async (newStatus: string, reason?: string) => {
    try {
      await updateMutation.mutateAsync({ 
        id: bookingId, 
        status: newStatus,
        cancel_reason: reason 
      });
      Alert.alert("Thành công", "Đã cập nhật trạng thái lịch hẹn.");
      setCancelModalVisible(false);
      setCancelReason("");
      router.replace("/screens/admin/tabs/BookingManagementScreen/BookingManagement");
    } catch {
      Alert.alert("Lỗi", "Không thể cập nhật trạng thái.");
    }
  };

  const openCancelModal = (status: string) => {
    setPendingStatus(status);
    setCancelModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={[styles.header, { marginHorizontal: 12, marginTop: 12 }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={() => router.replace("/screens/admin/tabs/BookingManagementScreen/BookingManagement")}
          >
            <Ionicons name="chevron-back" size={20} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết đặt lịch</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={[styles.container, { paddingTop: 0 }]}>

        {isLoading && <Text style={styles.stateText}>Đang tải chi tiết...</Text>}

        {!isLoading && !booking && <Text style={styles.stateText}>Không tìm thấy lịch hẹn.</Text>}

        {!isLoading && booking && (
          <View style={styles.bookingCard}>
            <Text style={styles.bookingInfo}>Mã lịch: #{booking.id}</Text>
            <Text style={styles.bookingInfo}>Khách hàng: {booking.user_name}</Text>
            <Text style={styles.bookingInfo}>Thú cưng: {booking.pet_name}</Text>
            <Text style={styles.bookingInfo}>Ngày: {formatDateDisplay(booking.booking_date)}</Text>
            <Text style={styles.bookingInfo}>Giờ: {formatTimeDisplay(booking.booking_time)}</Text>
            <View style={styles.statusRow}>
              <Text style={styles.bookingInfo}>Trạng thái:</Text>
              <View style={[styles.statusBadge, getStatusStyles(statusKey).badge]}>
                <Text style={[styles.statusBadgeText, { color: getStatusStyles(statusKey).color }]}>
                  {toStatusVi(booking.status)}
                </Text>
              </View>
            </View>
            <Text style={styles.bookingInfo}>Ghi chú: {booking.note || "Không có"}</Text>
            <Text style={styles.bookingInfo}>Phương thức thanh toán: {booking.payment_method === 'sepay' ? 'Chuyển khoản' : 'Thanh toán tại cửa hàng'}</Text>
            
            <View style={styles.tagsRow}>
              <View style={[styles.tag, { borderColor: "#16A34A", backgroundColor: "#DCFCE7", flex: 1 }]}>
                <Ionicons name="pricetag" size={16} color="#16A34A" />
                <Text style={[styles.tagText, { color: "#16A34A" }]}>
                  Tổng: {(booking.total_price ?? 0).toLocaleString("vi-VN")} đ
                </Text>
              </View>

              {(() => {
                const rawStatus = (booking.status || "").toLowerCase().trim();
                const method = (booking.payment_method || "store").toLowerCase();
                
                let isPaid = false;
                if (method === "sepay") {
                  isPaid = 
                    rawStatus === "đã thanh toán" || 
                    rawStatus === "đã xác nhận" || 
                    rawStatus === "confirmed" || 
                    rawStatus === "hoàn thành" || 
                    rawStatus === "completed" ||
                    rawStatus === "paid";
                } else {
                  isPaid = 
                    rawStatus === "hoàn thành" || 
                    rawStatus === "completed" ||
                    rawStatus === "đã thanh toán" ||
                    rawStatus === "paid";
                }

                const badgeColor = isPaid ? "#16A34A" : "#F59E0B";
                const bgColor = isPaid ? "#DCFCE7" : "#FFF7ED";
                
                return (
                  <View style={[styles.tag, { borderColor: badgeColor, backgroundColor: bgColor, flex: 1 }]}>
                    <Ionicons 
                      name={isPaid ? "checkmark-circle" : "alert-circle"} 
                      size={16} 
                      color={badgeColor} 
                    />
                    <Text style={[styles.tagText, { color: badgeColor }]}>
                      {isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                    </Text>
                  </View>
                );
              })()}
            </View>

            {(statusKey === "cancel_requested" || statusKey === "cancelled") && booking.cancel_reason ? (
              <View style={{ marginTop: 12, padding: 12, backgroundColor: "#FEF2F2", borderRadius: 8, borderWidth: 1, borderColor: "#FCA5A5" }}>
                <Text style={{ color: "#DC2626", fontWeight: "bold", fontSize: 16 }}>
                  {statusKey === "cancel_requested" ? "Lý do khách yêu cầu hủy:" : "Lý do hủy:"}
                </Text>
                <Text style={{ color: "#DC2626", marginTop: 4 }}>{booking.cancel_reason}</Text>
              </View>
            ) : null}
          </View>
        )}
      </ScrollView>

      {!isLoading && booking && (
        <View style={{ padding: 16, backgroundColor: "#FFF", borderTopWidth: 1, borderColor: "#E5E7EB" }}>
          {(statusKey === "pending" || statusKey === "awaiting_payment") && (
            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity 
                style={{ flex: 1, padding: 14, borderRadius: 8, backgroundColor: "#DBEAFE", alignItems: "center" }}
                onPress={() => handleUpdate("confirmed")}
                disabled={updateMutation.isPending}
              >
                <Text style={{ color: "#2563EB", fontWeight: "bold" }}>Xác nhận</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={{ flex: 1, padding: 14, borderRadius: 8, backgroundColor: "#FEE2E2", alignItems: "center" }}
                onPress={() => openCancelModal("cancelled")}
                disabled={updateMutation.isPending}
              >
                <Text style={{ color: "#DC2626", fontWeight: "bold" }}>Từ chối</Text>
              </TouchableOpacity>
            </View>
          )}

          {(statusKey === "confirmed" || statusKey === "paid") && (
            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity 
                style={{ flex: 1, padding: 14, borderRadius: 8, backgroundColor: "#FEE2E2", alignItems: "center" }}
                onPress={() => openCancelModal("cancelled")}
                disabled={updateMutation.isPending}
              >
                <Text style={{ color: "#DC2626", fontWeight: "bold" }}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={{ flex: 1, padding: 14, borderRadius: 8, backgroundColor: "#5CB15A", alignItems: "center" }}
                onPress={() => handleUpdate("completed")}
                disabled={updateMutation.isPending}
              >
                <Text style={{ color: "#FFF", fontWeight: "bold" }}>Hoàn thành</Text>
              </TouchableOpacity>
            </View>
          )}

          {statusKey === "cancel_requested" && (
            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity 
                style={{ flex: 1, padding: 14, borderRadius: 8, backgroundColor: "#DBEAFE", alignItems: "center" }}
                onPress={() => handleUpdate("confirmed")}
                disabled={updateMutation.isPending}
              >
                <Text style={{ color: "#2563EB", fontWeight: "bold" }}>Từ chối</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={{ flex: 1, padding: 14, borderRadius: 8, backgroundColor: "#FEE2E2", alignItems: "center" }}
                onPress={() => openCancelModal("cancelled")}
                disabled={updateMutation.isPending}
              >
                <Text style={{ color: "#DC2626", fontWeight: "bold" }}>Duyệt hủy</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

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
              <Text style={styles.modalTitle}>Lý do hủy lịch</Text>
            </View>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Nhập lý do hủy tại đây..."
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
                  if (pendingStatus) {
                    handleUpdate(pendingStatus, cancelReason);
                  }
                }}
                disabled={updateMutation.isPending}
              >
                <Text style={styles.modalButtonConfirmText}>
                  {updateMutation.isPending ? "Đang xử lý..." : "Xác nhận hủy"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
