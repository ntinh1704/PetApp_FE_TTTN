import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLogin } from "../../../utils/hook/useLogin";
import styles from "./styles";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isEmailInvalid = useMemo(() => {
    if (!email) return false;
    return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, [email]);

  const { mutate, isPending } = useLogin();

  const handleLogin = () => {
    if (!email.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập email.");
      return;
    }
    if (!password) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập mật khẩu.");
      return;
    }
    if (isEmailInvalid) {
      return;
    }

    mutate(
      { email, password },
      {
        onSuccess: async (data) => {
          const role = data.role;
          const token = data.access_token;

          if (token) {
            await AsyncStorage.setItem("accessToken", token);
            await AsyncStorage.setItem("email", email.trim());
          }

          if (role === "admin") {
            router.replace("/screens/admin/tabs/DashboardScreen/Dashboard");
          } else {
            router.replace("/screens/user/tabs/HomeScreen/Home");
          }
        },
        onError: () => {
          Alert.alert("Đăng nhập thất bại", "Email hoặc mật khẩu không đúng.");
        },
      }
    );
  };

  const onLoginGoogle = () => {
    // Để trống theo yêu cầu huỷ bỏ
  };

  const goToRegister = () => {
    router.push("/screens/auth/RegisterScreen/Register");
  };

  const forgetPassword = () => {
    router.push("/screens/auth/ForgetPasswordScreen/ForgetPassword");
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
            <View style={styles.card}>
              <Image
                source={require("../../../assets/images/logo_coco.png")}
                style={styles.logo}
              />

              <View style={[styles.inputWrapper, isEmailInvalid && styles.inputError]}>
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

              <TouchableOpacity style={styles.forgotWrap} onPress={forgetPassword}>
                <Text style={styles.forgot}>Quên mật khẩu?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.loginBtn}
                onPress={handleLogin}
                disabled={isPending || isEmailInvalid}
              >
                <Text style={styles.loginText}>
                  {isPending ? "Đang đăng nhập..." : "ĐĂNG NHẬP"}
                </Text>
              </TouchableOpacity>

              {/* <Text style={styles.orText}>hoặc</Text>

              <TouchableOpacity
                style={[styles.socialBtn, styles.google]}
                onPress={onLoginGoogle}
              >
                <Image
                  source={require("../../../assets/images/google.png")}
                  style={styles.socialIcon}
                />
                <Text style={styles.socialText}>Đăng nhập với Google</Text>
              </TouchableOpacity> */}

              <View style={styles.registerRow}>
                <Text style={styles.registerText}>Bạn chưa có tài khoản? </Text>
                <TouchableOpacity onPress={goToRegister}>
                  <Text style={styles.registerLink}>Đăng ký</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
