import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useResetPassword, useVerifyOtp } from "../../../utils/hook/useLogin";
import styles from "./styles";

export default function OTPVerificationScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate: verifyOtp, isPending: isVerifying } = useVerifyOtp();
  const { mutate: resetPassword, isPending: isResetting } = useResetPassword();

  const onVerifyOtp = () => {
    if (!otp) {
      Alert.alert("Lỗi", "Vui lòng nhập mã OTP.");
      return;
    }

    verifyOtp(
      { email: email || "", otp },
      {
        onSuccess: () => {
          setIsOtpVerified(true);
        },
        onError: (error: any) => {
          Alert.alert(
            "Chưa thành công",
            error?.response?.data?.detail || "Mã OTP không hợp lệ hoặc đã hết hạn."
          );
        },
      }
    );
  };

  const onResetPassword = () => {
    if (!password || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ mật khẩu mới.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    resetPassword(
      { email: email || "", otp, new_password: password },
      {
        onSuccess: () => {
          Alert.alert("Thành công", "Đổi mật khẩu thành công. Vui lòng đăng nhập lại.");
          router.replace("/screens/auth/LoginScreen/Login");
        },
        onError: (error: any) => {
          Alert.alert(
            "Chưa thành công",
            error?.response?.data?.detail || "Đã xảy ra lỗi khi đổi mật khẩu."
          );
        },
      }
    );
  };

  const goBackHome = () => {
    router.replace("/screens/auth/LoginScreen/Login");
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.center}>
        <Image
          source={require("../../../assets/images/logo_coco.png")}
          style={styles.logo}
        />
        <View style={styles.card}>
          <Text style={styles.title}>
            {isOtpVerified ? "Tạo mật khẩu mới" : "Xác nhận OTP"}
          </Text>
          
          {!isOtpVerified ? (
            <Text style={styles.desc}>
              Mã xác nhận đã được gửi đến email{"\n"}
              <Text style={styles.strong}>{email}</Text>
            </Text>
          ) : (
            <Text style={styles.desc}>
              Vui lòng nhập mật khẩu mới cho tài khoản của bạn.
            </Text>
          )}

          {!isOtpVerified && (
            <TextInput
              placeholder="Nhập mã 6 chữ số"
              value={otp}
              onChangeText={setOtp}
              style={[styles.otpInput, otp.length > 0 && { letterSpacing: 8 }]}
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              maxLength={6}
            />
          )}

          {isOtpVerified && (
            <>
              <View style={styles.inputWrapper}>
                <TextInput
                  placeholder="Mật khẩu mới"
                  value={password}
                  onChangeText={setPassword}
                  style={styles.inputField}
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.iconButton}
                  accessibilityRole="button"
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.inputWrapper}>
                <TextInput
                  placeholder="Xác nhận mật khẩu"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  style={styles.inputField}
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.iconButton}
                  accessibilityRole="button"
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
            </>
          )}

          {!isOtpVerified ? (
            <TouchableOpacity
              style={[
                styles.sendBtn,
                (!otp || isVerifying) && { opacity: 0.5 },
              ]}
              onPress={onVerifyOtp}
              disabled={!otp || isVerifying}
            >
              <Text style={styles.sendText}>
                {isVerifying ? "ĐANG KIỂM TRA..." : "XÁC NHẬN MÃ OTP"}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.sendBtn,
                (!password || !confirmPassword || isResetting) && { opacity: 0.5 },
              ]}
              onPress={onResetPassword}
              disabled={!password || !confirmPassword || isResetting}
            >
              <Text style={styles.sendText}>
                {isResetting ? "ĐANG XỬ LÝ..." : "ĐỔI MẬT KHẨU"}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={goBackHome} style={styles.backWrap}>
            <Text style={styles.backText}>← Trở về đăng nhập</Text>
          </TouchableOpacity>
        </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
