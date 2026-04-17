import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useBookingById, useUpdateBooking } from "@/app/utils/hook/useBooking";
import { useQueryClient } from "@tanstack/react-query";
import { styles } from "./styles";

const formatDateDisplay = (value?: string | null) => {
  if (!value) return "";
  const raw = String(value);
  const datePart = raw.includes("T") ? raw.split("T")[0] : raw;
  const parts = datePart.split("-");
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}-${month}-${year}`;
  }
  return raw;
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

const mapStatusToText = (status: string) => {
  const map: Record<string, string> = {
    pending: "Đang xác nhận",
    confirmed: "Đã xác nhận",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
    canceled: "Đã hủy",
    cancel_requested: "Đang xin hủy",
    "chờ thanh toán": "Đang xác nhận",
    "đã thanh toán": "Đã xác nhận",
  };
  return map[status?.toLowerCase()] || status || "Không rõ";
};

export default function BookingDetailUserScreen() {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams();
  const idValue = Number(bookingId);

  const { data: bookingRaw, isLoading } = useBookingById(idValue);
  const updateMutation = useUpdateBooking();
  const queryClient = useQueryClient();

  const [modalVisible, setModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fallback for tanstack query wrapper
  const booking = bookingRaw && "data" in bookingRaw ? (bookingRaw as any).data : bookingRaw;

  const handleCancelClick = () => {
    setCancelReason("");
    setModalVisible(true);
  };

  const submitCancel = async () => {
    if (!cancelReason.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập lý do hủy lịch");
      return;
    }

    try {
      setIsSubmitting(true);
      const isPending = (booking?.status || "").toLowerCase() === "pending" || (booking?.status || "").toLowerCase() === "đang xác nhận";
      
      const newStatus = isPending ? "cancelled" : "cancel_requested";

      await updateMutation.mutateAsync({
        id: idValue,
        status: newStatus,
        cancel_reason: cancelReason,
      });

      setModalVisible(false);
      Alert.alert("Thành công", isPending ? "Đã hủy lịch thao tác." : "Đã gửi yêu cầu hủy lịch tới cửa hàng.");
      queryClient.invalidateQueries({ queryKey: ["bookings", idValue] });
    } catch (e: any) {
      const errorMsg = e.response?.data?.detail || e.message || "Lịch hẹn đã được cập nhật, vui lòng thử lại.";
      Alert.alert("Lỗi thao tác", errorMsg, [
        {
          text: "OK",
          onPress: () => {
            setModalVisible(false);
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
            queryClient.invalidateQueries({ queryKey: ["bookings", idValue] });
          }
        }
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#5CB15A" />
        </View>
      </SafeAreaView>
    );
  }

  if (!booking) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết lịch hẹn</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.centerContainer}>
          <Text style={{ fontSize: 16, color: "#666" }}>Không tìm thấy thông tin lịch hẹn</Text>
        </View>
      </SafeAreaView>
    );
  }

  const rawStatus = (booking.status || "").toLowerCase().trim();
  const isPending = rawStatus === "pending" || rawStatus === "đang xác nhận" || rawStatus === "chờ thanh toán" || rawStatus === "đã thanh toán";
  const isConfirmed = rawStatus === "confirmed" || rawStatus === "đã xác nhận";
  const canCancel = isPending || isConfirmed;
  const method = (booking.payment_method || "store").toLowerCase();
  let isPaid = false;
  if (method === "sepay") {
    // Chuyển khoản: xác nhận hoặc hoàn thành đều coi là đã thanh toán
    isPaid = 
      rawStatus === "đã thanh toán" || 
      rawStatus === "đã xác nhận" || 
      rawStatus === "confirmed" || 
      rawStatus === "hoàn thành" || 
      rawStatus === "completed" ||
      rawStatus === "paid";
  } else {
    // Tiền mặt: chỉ khi hoàn thành mới coi là đã thanh toán
    isPaid = 
      rawStatus === "hoàn thành" || 
      rawStatus === "completed" ||
      rawStatus === "đã thanh toán" ||
      rawStatus === "paid";
  }
  const btnText = isPending ? "Hủy lịch hẹn" : "Yêu cầu hủy lịch";

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mã đơn #{booking.id}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Thông tin dịch vụ</Text>
          
          <View style={styles.row}>
            <Text style={styles.label}>Dịch vụ:</Text>
            <Text style={styles.value}>{booking.service_names?.join(", ") || booking.service_name}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Thú cưng:</Text>
            <Text style={styles.value}>{booking.pet_name}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Thời gian:</Text>
            <Text style={styles.value}>
              {formatTimeDisplay(booking.booking_time)} - {formatDateDisplay(booking.booking_date)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Tổng tiền:</Text>
            <Text style={[styles.value, { color: "#16A34A", fontWeight: "bold" }]}>
              {booking.total_price?.toLocaleString("vi-VN")} đ
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Phương thức TT:</Text>
            <Text style={styles.value}>
              {(booking.payment_method || "").toLowerCase() === "sepay" 
                ? "Chuyển khoản" 
                : "Thanh toán tại cửa hàng"}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Thanh toán:</Text>
            <Text style={[styles.value, { color: isPaid ? "#16A34A" : "#D97706", fontWeight: "600" }]}>
              {isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Trạng thái:</Text>
            <StatusBadge status={mapStatusToText(booking.status)} />
          </View>
        </View>

        {booking.note ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Ghi chú</Text>
            <Text style={{ fontSize: 14, color: "#4B5563", marginTop: 4 }}>{booking.note}</Text>
          </View>
        ) : null}

        {booking.cancel_reason ? (
          <View style={[styles.card, { borderColor: "#FCA5A5", borderWidth: 1, backgroundColor: "#FEF2F2" }]}>
            <Text style={[styles.sectionTitle, { color: "#DC2626" }]}>Lý do hủy</Text>
            <Text style={{ fontSize: 14, color: "#DC2626", marginTop: 4 }}>{booking.cancel_reason}</Text>
          </View>
        ) : null}

      </ScrollView>

      {/* FOOTER */}
      {(canCancel || (!isPaid && canCancel)) && (
        <View style={styles.footer}>
          <View style={styles.footerButtons}>
            {canCancel && (
              <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelClick}>
                <Text style={styles.cancelBtnText}>{btnText}</Text>
              </TouchableOpacity>
            )}
            
            {!isPaid && canCancel && (
              <TouchableOpacity 
                style={styles.payBtn} 
                onPress={() => router.push({
                  pathname: "/screens/user/stack/PaymentQR/PaymentQR",
                  params: {
                    bookingId: booking.id,
                    amount: booking.total_price
                  }
                })}
              >
                <Text style={styles.payBtnText}>Thanh toán ngay</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* MODAL REASON */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{btnText}</Text>
            <Text style={styles.modalSubtitle}>
              {isPending 
                ? "Lịch hẹn sẽ bị hủy trực tiếp vì cửa hàng chưa xác nhận." 
                : "Cửa hàng đã xác nhận, bạn cần nêu rõ lý do để cửa hàng phản hồi lại."}
            </Text>
            
            <TextInput
              style={styles.textInput}
              placeholder="Nhập lý do..."
              value={cancelReason}
              onChangeText={setCancelReason}
              multiline
              autoFocus
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnSecondary]}
                onPress={() => setModalVisible(false)}
                disabled={isSubmitting}
              >
                <Text style={styles.modalBtnSecondaryText}>Quay lại</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnPrimary]}
                onPress={submitCancel}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.modalBtnText}>Xác nhận</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { color: string; bg: string }> = {
    "Hoàn thành": { color: "#16A34A", bg: "#DCFCE7" },
    "Đang xác nhận": { color: "#6B7280", bg: "#E5E7EB" },
    "Đã xác nhận": { color: "#2563EB", bg: "#DBEAFE" },
    "Đang xin hủy": { color: "#D97706", bg: "#FEF3C7" },
    "Đã hủy": { color: "#DC2626", bg: "#FEE2E2" },
    "Chờ thanh toán": { color: "#6B7280", bg: "#E5E7EB" },
    "Đã thanh toán": { color: "#2563EB", bg: "#DBEAFE" },
  };

  const config = map[status] || map["Đang xác nhận"];

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.badgeText, { color: config.color }]}>{status}</Text>
    </View>
  );
}
