import { router } from "expo-router";
import React, { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles";

export default function ForgetPasswordScreen() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const onSendResetLink = () => {
    if (!email) return;

    // TODO: gọi API / Firebase gửi email reset password
    console.log("Gửi link đặt lại mật khẩu tới:", email);

    setSent(true);
  };

  const goBackLogin = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.center}>
        <View style={styles.card}>

          {/* Logo */}
          <Image
            source={require("../../../assets/images/logo_coco.png")}
            style={styles.logo}
          />

          <Text style={styles.title}>Quên mật khẩu?</Text>
          <Text style={styles.desc}>
            Nhập email của bạn, chúng tôi sẽ gửi link tạo mật khẩu mới.
          </Text>

          {!sent ? (
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
                  !email && { opacity: 0.5 },
                ]}
                onPress={onSendResetLink}
                disabled={!email}
              >
                <Text style={styles.sendText}>GỬI LINK KHÔI PHỤC</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.successText}>
              Link tạo mật khẩu mới đã được gửi về email của bạn.
            </Text>
          )}

          <TouchableOpacity onPress={goBackLogin} style={styles.backWrap}>
            <Text style={styles.backText}>← Quay lại đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}