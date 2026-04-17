import React, { useEffect, useCallback, useState, useRef } from "react";
import { View, Text, Image, TouchableOpacity, Alert, ScrollView, BackHandler, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { styles } from "./styles";
import { useBookingById } from "@/app/utils/hook/useBooking";

export default function PaymentQRScreen() {
  const { bookingId, amount } = useLocalSearchParams<{ bookingId: string; amount: string }>();

  // VA Number specific for SePay integration provided by User
  const BANK_ID = "BIDV";
  const ACCOUNT_NO = "96247TNT171004";
  const ACCOUNT_NAME = "TRAN NHAT TINH";
  
  // Format content strictly to match Webhook expectation (KLTN + id)
  const content = `BK${bookingId}`;
  
  // Sử dụng SePay's official QR code generator để đảm bảo nội dung chuyển khoản được điền sẵn:
  const qrUrl = `https://qr.sepay.vn/img?acc=${ACCOUNT_NO}&bank=${BANK_ID}&amount=${amount}&des=${content}`;

  // Countdown 15 minutes (900 seconds)
  const COUNTDOWN_SECONDS = 15 * 60;
  const { data: bookingData, isLoading } = useBookingById(Number(bookingId));
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const booking = bookingData && "data" in bookingData ? (bookingData as any).data : bookingData;
  const isSepay = (booking?.payment_method || "").toLowerCase() === "sepay";

  // Tính remaining time dựa trên created_at từ backend
  const calcRemaining = useCallback(() => {
    if (!booking?.created_at) return COUNTDOWN_SECONDS;
    const createdAt = new Date(booking.created_at).getTime();
    const deadline = createdAt + COUNTDOWN_SECONDS * 1000;
    const remaining = Math.floor((deadline - Date.now()) / 1000);
    return remaining > 0 ? remaining : 0;
  }, [bookingData]);

  const [timeLeft, setTimeLeft] = useState(COUNTDOWN_SECONDS);

  // Khi bookingData load xong → set timeLeft chính xác
  useEffect(() => {
    if (!isLoading && bookingData) {
      setTimeLeft(calcRemaining());
    }
  }, [isLoading, bookingData, calcRemaining]);

  // Interval đếm ngược mỗi giây, tính lại từ created_at
  useEffect(() => {
    if (isLoading || !booking || !isSepay) return;
    timerRef.current = setInterval(() => {
      const remaining = calcRemaining();
      setTimeLeft(remaining);
      if (remaining <= 0 && timerRef.current) {
        clearInterval(timerRef.current);
      }
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isLoading, bookingData, calcRemaining]);

  // Khi hết thời gian, thông báo và chuyển đến Lịch sử
  useEffect(() => {
    if (timeLeft === 0 && isSepay) {
      Alert.alert(
        "Hết thời gian thanh toán",
        "Đơn hàng của bạn đã bị hủy do quá thời hạn thanh toán 15 phút.",
        [
          {
            text: "Đã hiểu",
            onPress: () => router.replace("/screens/user/tabs/HistoryScreen/History"),
          },
        ],
        { cancelable: false }
      );
    }
  }, [timeLeft, isSepay]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const onExit = useCallback(() => {
    Alert.alert(
      "Xác nhận thoát",
      isSepay 
        ? "Bạn chưa hoàn tất thanh toán. Đơn hàng của bạn sẽ bị hủy sau 15 phút. Bạn có muốn thoát không?"
        : "Bạn có muốn thoát khỏi màn hình QR không?",
      [
        { text: "Ở lại", style: "cancel" },
        {
          text: "Thoát",
          style: "destructive",
          onPress: () => router.replace("/screens/user/tabs/HistoryScreen/History"),
        },
      ]
    );
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      onExit();
      return true;
    });
    return () => backHandler.remove();
  }, [onExit]);

  const formatPrice = (price: string | number) => {
    return Number(price).toLocaleString("vi-VN") + " đ";
  };

  const onComplete = () => {
    Alert.alert(
      "Xác nhận thanh toán",
      "Vui lòng đảm bảo bạn đã chuyển khoản thành công. Hệ thống sẽ tự kiểm tra và cập nhật trạng thái.",
      [
        { text: "Chưa thanh toán", style: "cancel" },
        { 
          text: "Đã thanh toán", 
          onPress: () => router.replace("/screens/user/tabs/HistoryScreen/History") 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onExit} activeOpacity={0.7}>
          <Ionicons name="close" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán QR</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.instruction}>
          Quét mã QR qua ứng dụng Ngân hàng/Ví điện tử để thanh toán
        </Text>

        {/* Countdown Timer */}
        {isSepay && (
          <View style={styles.countdownContainer}>
            <Ionicons name="time-outline" size={20} color={timeLeft <= 60 ? "#DC2626" : "#F59E0B"} />
            <Text style={[
              styles.countdownText,
              timeLeft <= 60 && styles.countdownDanger
            ]}>
              Thời gian còn lại: {formatTime(timeLeft)}
            </Text>
          </View>
        )}

        <View style={styles.qrContainer}>
          <Image 
            source={{ uri: qrUrl }} 
            style={styles.qrImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ngân hàng:</Text>
            <Text style={styles.infoContent}>{BANK_ID}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Số tài khoản:</Text>
            <Text style={styles.infoContent}>{ACCOUNT_NO}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Chủ tài khoản:</Text>
            <Text style={styles.infoContent}>{ACCOUNT_NAME}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Số tiền:</Text>
            <Text style={styles.infoAmount}>{formatPrice(amount || 0)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nội dung chuyển khoản:</Text>
            <Text style={styles.infoContent}>{content}</Text>
          </View>
          <Text style={styles.warningText}>
            Lưu ý: Vui lòng chuyển khoản ĐÚNG SỐ TIỀN và MÃ NỘI DUNG để hệ thống tự động xác nhận.
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.completeBtn} 
          activeOpacity={0.8}
          onPress={onComplete}
        >
          <Text style={styles.completeBtnText}>Tôi đã chuyển khoản hoàn tất</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
