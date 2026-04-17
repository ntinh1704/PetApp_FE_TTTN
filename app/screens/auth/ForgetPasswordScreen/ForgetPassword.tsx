import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForgotPassword } from "../../../utils/hook/useLogin";
import styles from "./styles";

export default function ForgetPasswordScreen() {
  const [email, setEmail] = useState("");
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const onSendResetLink = () => {
    if (!email.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập địa chỉ email.");
      return;
    }

    forgotPassword(
      { email },
      {
        onSuccess: () => {
          Alert.alert("Thành công", "Mã OTP đã được gửi về email của bạn.");
          router.push({
            pathname: "/screens/auth/OTPVerificationScreen/OTPVerification",
            params: { email }
          });
        },
        onError: (error: any) => {
          Alert.alert(
            "Lỗi",
            error?.response?.data?.detail || "Không thể gửi email. Vui lòng kiểm tra lại."
          );
        },
      }
    );
  };

  const goBackLogin = () => {
    router.back();
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
              <Text style={styles.title}>Quên mật khẩu?</Text>
              <Text style={styles.desc}>
                Nhập email của bạn, chúng tôi sẽ gửi mã xác nhận tạo mật khẩu mới.
              </Text>

              <>
                <TextInput
                  placeholder="Địa chỉ email"
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <TouchableOpacity
                  style={[
                    styles.sendBtn,
                    (!email || isPending) && { opacity: 0.5 },
                  ]}
                  onPress={onSendResetLink}
                  disabled={!email || isPending}
                >
                  <Text style={styles.sendText}>{isPending ? "ĐANG GỬI..." : "GỬI MÃ KHÔI PHỤC"}</Text>
                </TouchableOpacity>
              </>

              <TouchableOpacity onPress={goBackLogin} style={styles.backWrap}>
                <Text style={styles.backText}>← Quay lại đăng nhập</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}