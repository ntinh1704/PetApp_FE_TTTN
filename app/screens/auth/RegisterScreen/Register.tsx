import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRegister } from "../../../utils/hook/useLogin";
import { styles } from "./styles";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isPasswordMismatch = useMemo(() => {
    if (!password || !confirmPassword) return false;
    return password !== confirmPassword;
  }, [password, confirmPassword]);

  const isEmailInvalid = useMemo(() => {
    if (!email) return false;
    return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, [email]);

  const { mutate, isPending } = useRegister();

  const onRegister = () => {
    mutate(
      { username: email, password, role: "user" },
      {
        onSuccess: () => {
          Alert.alert(
            "Đăng ký thành công",
            "Tài khoản đã được tạo.",
            [
              {
                text: "Đồng ý",
                onPress: () =>
                  router.replace("/screens/auth/LoginScreen/Login"),
              },
            ]
          );
        },
        onError: () => {
          Alert.alert("Đăng ký thất bại", "Vui lòng thử lại.");
        },
      }
    );
  };

  const onLoginGoogle = () => {
    console.log("Đăng nhập với Google");
    // TODO: gắn expo-auth-session sau
  };

  const goToLogin = () => {
    router.replace("/screens/auth/LoginScreen/Login");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <View style={styles.card}>
          <Image
            source={require("../../../assets/images/logo_coco.png")}
            style={styles.logo}
          />

          {/* Inputs */}
          <View
            style={[styles.inputWrapper, isEmailInvalid && styles.inputError]}
          >
            <TextInput
              placeholder="Địa chỉ email"
              value={email}
              onChangeText={setEmail}
              style={styles.inputField}
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          {isEmailInvalid && (
            <Text style={styles.errorText}>Email không đúng định dạng</Text>
          )}

          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={styles.inputField}
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity
              onPress={() => setShowPassword((prev) => !prev)}
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

          <View
            style={[
              styles.inputWrapper,
              isPasswordMismatch && styles.inputError,
            ]}
          >
            <TextInput
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              style={styles.inputField}
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword((prev) => !prev)}
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
          {isPasswordMismatch && (
            <Text style={styles.errorText}>Mật khẩu không khớp</Text>
          )}

          {/* Register button */}
          <TouchableOpacity
            style={styles.registerBtn}
            onPress={onRegister}
            disabled={isPending || isPasswordMismatch || isEmailInvalid}
          >
            <Text style={styles.registerText}>
              {isPending ? "Đang tạo..." : "TẠO TÀI KHOẢN"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.orText}>hoặc</Text>

          <TouchableOpacity
            style={[styles.socialBtn, styles.google]}
            onPress={onLoginGoogle}
          >
            <Image
              source={require("../../../assets/images/google.png")}
              style={styles.socialIcon}
            />
            <Text style={styles.socialText}>Đăng nhập với Google</Text>
          </TouchableOpacity>

          {/* Login link */}
          <View style={styles.bottomRow}>
            <Text style={styles.bottomText}>Bạn đã có tài khoản? </Text>
            <TouchableOpacity onPress={goToLogin}>
              <Text style={styles.bottomLink}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
