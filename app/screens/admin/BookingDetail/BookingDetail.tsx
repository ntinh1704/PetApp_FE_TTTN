import { useBookingById, useUpdateBooking, useAddServiceToBooking, useStaffAvailability } from "@/app/utils/hook/useBooking";
import { useServices } from "@/app/utils/hook/useService";
import { Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState, useMemo } from "react";
import { ScrollView, Text, TouchableOpacity, View, Modal, TextInput, FlatList } from "react-native";
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
  const addServiceMutation = useAddServiceToBooking();
  const { data: servicesData } = useServices();

  const [isCancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);

  const [isStaffModalVisible, setStaffModalVisible] = useState(false);
  const [selectedStaffIdToAssign, setSelectedStaffIdToAssign] = useState<number | null>(null);

  const [isAddServiceModalVisible, setAddServiceModalVisible] = useState(false);
  const [selectedAddonServices, setSelectedAddonServices] = useState<{ [id: number]: number }>({});
  const [serviceSearchQuery, setServiceSearchQuery] = useState("");

  const statusKey = toStatusKey(booking?.status);

  // Staff availability based on booking's date/time
  const staffAvailDate = useMemo(() => {
    if (!booking?.booking_date) return "";
    const raw = String(booking.booking_date);
    return raw.includes("T") ? raw.split("T")[0] : raw;
  }, [booking?.booking_date]);
  const staffAvailTime = useMemo(() => formatTimeDisplay(booking?.booking_time) || "", [booking?.booking_time]);
  const staffAvailEndTime = useMemo(() => formatTimeDisplay(booking?.booking_end_time) || "", [booking?.booking_end_time]);

  const { data: staffAvailData } = useStaffAvailability(staffAvailDate, staffAvailTime, staffAvailEndTime);

  const activeStaffList = useMemo(() => Array.isArray(staffAvailData) ? staffAvailData : (staffAvailData as any)?.data ?? [], [staffAvailData]);
  const activeServicesList = useMemo(() => Array.isArray(servicesData) ? servicesData : (servicesData as any)?.data ?? [], [servicesData]);

  const handleUpdate = async (newStatus: string, reason?: string, staffId?: number, skipNavigate?: boolean) => {
    try {
      await updateMutation.mutateAsync({ 
        id: bookingId, 
        status: newStatus,
        cancel_reason: reason,
        staff_id: staffId !== undefined ? staffId : booking?.staff_id
      });
      Alert.alert("Thành công", "Đã cập nhật trạng thái lịch hẹn.");
      setCancelModalVisible(false);
      setCancelReason("");
      setSelectedStaffIdToAssign(null);
      
      if (!skipNavigate) {
        router.replace("/screens/admin/tabs/BookingManagementScreen/BookingManagement");
      }
    } catch {
      Alert.alert("Lỗi", "Không thể cập nhật trạng thái.");
    }
  };

  const openCancelModal = (status: string) => {
    setPendingStatus(status);
    setCancelModalVisible(true);
  };

  const onConfirmBooking = () => {
    Alert.alert(
      "Xác nhận lịch hẹn",
      "Bạn có chắc chắn muốn xác nhận lịch hẹn này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xác nhận",
          onPress: () => {
            if (!booking?.staff_id) {
              setStaffModalVisible(true);
            } else {
              handleUpdate("confirmed");
            }
          },
        },
      ]
    );
  };

  const onAssignStaff = () => {
    if (!selectedStaffIdToAssign && !booking?.staff_id) {
      Alert.alert("Lỗi", "Vui lòng chọn nhân viên.");
      return;
    }
    // Check if selected staff is busy and warn admin
    const selectedStaffInfo = activeStaffList.find((s: any) => s.id === selectedStaffIdToAssign);
    if (selectedStaffInfo?.status === "busy") {
      Alert.alert(
        "Cảnh báo trùng lịch",
        `${selectedStaffInfo.name} đang bận từ ${selectedStaffInfo.busy_from} - ${selectedStaffInfo.busy_to}. Bạn vẫn muốn phân công?`,
        [
          { text: "Hủy", style: "cancel" },
          { text: "Vẫn phân công", style: "destructive", onPress: () => {
              const targetStatus = statusKey === "pending" || statusKey === "awaiting_payment" ? "confirmed" : (booking?.status || "confirmed");
              handleUpdate(targetStatus, undefined, selectedStaffIdToAssign || undefined, true);
              setStaffModalVisible(false);
            }
          },
        ]
      );
      return;
    }
    const targetStatus = statusKey === "pending" || statusKey === "awaiting_payment" ? "confirmed" : (booking?.status || "confirmed");
    handleUpdate(targetStatus, undefined, selectedStaffIdToAssign || undefined, true);
    setStaffModalVisible(false);
  };

  const onAddService = async () => {
    const selectedIds = Object.keys(selectedAddonServices).map(Number);
    if (selectedIds.length === 0) {
      Alert.alert("Lỗi", "Vui lòng chọn ít nhất một dịch vụ.");
      return;
    }
    
    // Check quantity of add-ons
    const currentAddonsCount = (booking?.services_detail || [])
      .filter((s) => s.is_addon)
      .reduce((sum, s) => sum + s.quantity, 0);

    const newAddonsCount = Object.values(selectedAddonServices).reduce((sum, q) => sum + q, 0);
    const totalAfterAdding = currentAddonsCount + newAddonsCount;

    if (totalAfterAdding > 3) {
      Alert.alert(
        "Cảnh báo",
        `Bạn đã có ${currentAddonsCount} dịch vụ phát sinh. Thêm lần này sẽ vượt quá 3 dịch vụ. Bạn có chắc chắn tiếp tục?`,
        [
          { text: "Hủy", style: "cancel" },
          { text: "Tiếp tục", style: "destructive", onPress: performAddService },
        ]
      );
    } else {
      performAddService();
    }
  };

  const performAddService = async () => {
    try {
      const selectedIds = Object.keys(selectedAddonServices).map(Number);
      if (selectedIds.length === 0) return;

      for (const serviceId of selectedIds) {
        await addServiceMutation.mutateAsync({
          bookingId,
          serviceId,
          quantity: selectedAddonServices[serviceId],
        });
      }

      Alert.alert("Thành công", "Đã thêm dịch vụ phát sinh.");
      setAddServiceModalVisible(false);
      setSelectedAddonServices({});
      setServiceSearchQuery("");
    } catch {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi thêm dịch vụ phát sinh.");
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
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
      <ScrollView contentContainerStyle={styles.container}>

        {isLoading && <Text style={styles.stateText}>Đang tải chi tiết...</Text>}

        {!isLoading && !booking && <Text style={styles.stateText}>Không tìm thấy lịch hẹn.</Text>}

        {!isLoading && booking && (
          <View style={styles.bookingCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mã lịch:</Text>
              <Text style={styles.infoValue}>#{booking.id}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Khách hàng:</Text>
              <Text style={styles.infoValue}>{booking.user_name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Thú cưng:</Text>
              <Text style={styles.infoValue}>{booking.pet_name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ngày:</Text>
              <Text style={styles.infoValue}>{formatDateDisplay(booking.booking_date)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Giờ:</Text>
              <Text style={styles.infoValue}>{formatTimeDisplay(booking.booking_time)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Trạng thái:</Text>
              <View style={styles.statusBadgeContainer}>
                <View style={[styles.statusBadge, getStatusStyles(statusKey).badge]}>
                  <Text style={[styles.statusBadgeText, { color: getStatusStyles(statusKey).color }]}>
                    {toStatusVi(booking.status)}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ghi chú:</Text>
              <Text style={styles.infoValue}>{booking.note || "Không có"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Thanh toán:</Text>
              <Text style={styles.infoValue}>{booking.payment_method === 'sepay' ? 'Chuyển khoản' : 'Tại cửa hàng'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nhân viên:</Text>
              <View style={styles.staffRow}>
                <Text style={styles.staffName}>
                  {booking.staff_name || "Chưa phân công"}
                </Text>
                {(statusKey === "pending" || statusKey === "confirmed" || statusKey === "awaiting_payment") && (
                  <TouchableOpacity 
                    onPress={() => setStaffModalVisible(true)} 
                    style={styles.assignBtn}
                  >
                    <Text style={styles.assignBtnText}>Đổi / Phân công</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Chi tiết dịch vụ:</Text>
            {booking.services_detail?.map((svc, idx) => (
              <View key={idx} style={styles.serviceItem}>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{svc.service_name} (x{svc.quantity})</Text>
                  {svc.is_addon && (
                    <View style={styles.addonBadge}>
                      <Text style={styles.addonBadgeText}>Dịch vụ phát sinh</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.serviceSubtotal}>{svc.subtotal.toLocaleString("vi-VN")} đ</Text>
              </View>
            ))}

            {(statusKey === "confirmed" || statusKey === "paid") && (
              <TouchableOpacity 
                style={styles.addServiceBtn}
                onPress={() => setAddServiceModalVisible(true)}
              >
                <Text style={styles.addServiceBtnText}>+ Thêm dịch vụ phát sinh</Text>
              </TouchableOpacity>
            )}

            <View style={styles.divider} />
            
            <View style={styles.tagsRow}>
              <View style={styles.totalPriceTag}>
                <Ionicons name="pricetag" size={16} color="#16A34A" />
                <Text style={styles.totalPriceText}>
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
              <View style={styles.cancelReasonContainer}>
                <Text style={styles.cancelReasonTitle}>
                  {statusKey === "cancel_requested" ? "Lý do khách yêu cầu hủy:" : "Lý do hủy:"}
                </Text>
                <Text style={styles.cancelReasonText}>{booking.cancel_reason}</Text>
              </View>
            ) : null}
          </View>
        )}
      </ScrollView>

      {!isLoading && booking && (
        <View style={styles.bottomBar}>
          {(statusKey === "pending" || statusKey === "awaiting_payment") && (
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.confirmActionBtn]}
                onPress={onConfirmBooking}
                disabled={updateMutation.isPending}
              >
                <Text style={styles.confirmActionText}>Xác nhận</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.cancelActionBtn]}
                onPress={() => openCancelModal("cancelled")}
                disabled={updateMutation.isPending}
              >
                <Text style={styles.cancelActionText}>Từ chối</Text>
              </TouchableOpacity>
            </View>
          )}

          {(statusKey === "confirmed" || statusKey === "paid") && (
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.cancelActionBtn]}
                onPress={() => openCancelModal("cancelled")}
                disabled={updateMutation.isPending}
              >
                <Text style={styles.cancelActionText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.completeActionBtn]}
                onPress={() => {
                  Alert.alert(
                    "Xác nhận",
                    "Bạn có chắc chắn muốn hoàn thành lịch hẹn này?",
                    [
                      { text: "Quay lại", style: "cancel" },
                      { text: "Hoàn thành", onPress: () => handleUpdate("completed") }
                    ]
                  );
                }}
                disabled={updateMutation.isPending}
              >
                <Text style={styles.completeActionText}>Hoàn thành</Text>
              </TouchableOpacity>
            </View>
          )}

          {statusKey === "cancel_requested" && (
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.confirmActionBtn]}
                onPress={() => openCancelModal("confirmed")}
                disabled={updateMutation.isPending}
              >
                <Text style={styles.confirmActionText}>Từ chối</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.cancelActionBtn]}
                onPress={() => {
                  Alert.alert(
                    "Xác nhận duyệt hủy",
                    "Bạn có chắc chắn muốn duyệt yêu cầu hủy lịch này?",
                    [
                      { text: "Quay lại", style: "cancel" },
                      { text: "Duyệt hủy", style: "destructive", onPress: () => handleUpdate("cancelled") }
                    ]
                  );
                }}
                disabled={updateMutation.isPending}
              >
                <Text style={styles.cancelActionText}>Duyệt hủy</Text>
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
              <Text style={styles.modalTitle}>
                {pendingStatus === "confirmed" ? "Lý do từ chối hủy lịch" : "Lý do hủy lịch"}
              </Text>
            </View>
            
            <TextInput
              style={styles.modalInput}
              placeholder={pendingStatus === "confirmed" ? "Nhập lý do từ chối hủy tại đây..." : "Nhập lý do hủy tại đây..."}
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

      {/* Staff Assignment Modal */}
      <Modal visible={isStaffModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitleMb12}>Phân công nhân viên</Text>
            <Text style={styles.stateText}>
              Lịch hẹn: {formatTimeDisplay(booking?.booking_time)} - {formatDateDisplay(booking?.booking_date)}
            </Text>

            <ScrollView style={styles.staffListScroll}>
              {activeStaffList.length === 0 && (
                <Text style={styles.stateText}>Không có nhân viên nào đang hoạt động</Text>
              )}
              {activeStaffList.map((staff: any) => {
                const isBusy = staff.status === "busy";
                const isSelected = selectedStaffIdToAssign === staff.id;
                const hasBusySlots = staff.busy_slots?.length > 0;
                return (
                <TouchableOpacity
                  key={staff.id}
                  style={[
                    styles.staffItem,
                    isSelected && styles.staffItemSelected,
                    isBusy && !isSelected && styles.staffItemBusy,
                  ]}
                  onPress={() => setSelectedStaffIdToAssign(staff.id)}
                >
                  <View style={styles.staffHeader}>
                    <Text style={styles.staffNameText}>{staff.name}</Text>
                    <View style={isBusy ? styles.busyBadge : styles.freeBadge}>
                      <Text style={isBusy ? styles.busyBadgeText : styles.freeBadgeText}>
                        {isBusy ? "Đang bận" : "Rảnh"}
                      </Text>
                    </View>
                  </View>
                  {staff.specialty && <Text style={styles.staffSubtext}>Chuyên môn: {staff.specialty}</Text>}
                  {isBusy && (
                    <Text style={styles.busyText}>
                      ⚠️ Trùng giờ: {staff.busy_from} - {staff.busy_to}
                    </Text>
                  )}
                  {hasBusySlots && (
                    <Text style={styles.scheduleText}>
                      📋 Lịch trong ngày: {staff.busy_slots.map((s: any) => `${s.from}-${s.to}`).join(", ")}
                    </Text>
                  )}
                </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setStaffModalVisible(false)}
              >
                <Text style={styles.modalButtonCancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonGreen]}
                onPress={onAssignStaff}
              >
                <Text style={styles.modalButtonWhiteText}>Lưu phân công</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Service Modal */}
      <Modal visible={isAddServiceModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitleMb12}>Thêm dịch vụ phát sinh</Text>
            <Text style={styles.modalSectionLabel}>Tìm kiếm dịch vụ:</Text>
            <View style={styles.searchBarContainer}>
              <Ionicons name="search" size={20} color="#9CA3AF" />
              <TextInput
                style={styles.searchBarInput}
                placeholder="Nhập tên dịch vụ..."
                value={serviceSearchQuery}
                onChangeText={setServiceSearchQuery}
              />
            </View>

            <Text style={styles.modalSectionLabel}>Chọn dịch vụ và số lượng:</Text>
            <ScrollView style={styles.serviceListScroll}>
              {activeServicesList
                .filter((svc: any) => svc.name.toLowerCase().includes(serviceSearchQuery.toLowerCase()))
                .map((svc: any) => {
                const isSelected = !!selectedAddonServices[svc.id];
                const quantity = selectedAddonServices[svc.id] || 0;

                return (
                  <View key={svc.id} style={styles.serviceItemMargin}>
                    <TouchableOpacity
                      style={[
                        styles.serviceSelectRow,
                        isSelected && styles.serviceSelectRowSelected
                      ]}
                      onPress={() => {
                        setSelectedAddonServices(prev => {
                          const next = { ...prev };
                          if (next[svc.id]) {
                            delete next[svc.id];
                          } else {
                            next[svc.id] = 1;
                          }
                          return next;
                        });
                      }}
                    >
                      <View style={styles.serviceInfo}>
                        <Text style={styles.serviceNameText}>{svc.name}</Text>
                        <Text style={styles.addServiceBtnText}>{svc.price.toLocaleString("vi-VN")} đ</Text>
                      </View>
                      
                      {isSelected && (
                        <View style={styles.quantitySelector}>
                          <TouchableOpacity 
                            onPress={(e) => {
                              e.stopPropagation();
                              setSelectedAddonServices(prev => {
                                const next = { ...prev };
                                if (next[svc.id] > 1) {
                                  next[svc.id] -= 1;
                                } else {
                                  delete next[svc.id];
                                }
                                return next;
                              });
                            }} 
                            style={styles.quantityBtn}
                          >
                            <Ionicons name="remove" size={16} color="#374151" />
                          </TouchableOpacity>
                          <Text style={styles.quantityText}>{quantity}</Text>
                          <TouchableOpacity 
                            onPress={(e) => {
                              e.stopPropagation();
                              setSelectedAddonServices(prev => ({ ...prev, [svc.id]: (prev[svc.id] || 0) + 1 }));
                            }} 
                            style={styles.quantityBtn}
                          >
                            <Ionicons name="add" size={16} color="#374151" />
                          </TouchableOpacity>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  setAddServiceModalVisible(false);
                  setSelectedAddonServices({});
                  setServiceSearchQuery("");
                }}
              >
                <Text style={styles.modalButtonCancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonGreen]}
                onPress={onAddService}
                disabled={addServiceMutation.isPending || Object.keys(selectedAddonServices).length === 0}
              >
                <Text style={styles.modalButtonWhiteText}>
                  {addServiceMutation.isPending ? "Đang lưu..." : "Thêm dịch vụ"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
