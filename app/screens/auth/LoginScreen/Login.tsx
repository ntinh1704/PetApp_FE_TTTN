import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
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

  const { mutate, isPending } = useLogin();

  const handleLogin = () => {
    mutate(
      { username: email, password },
      {
        onSuccess: async (data) => {
          const role = data.role;
          const token = data.access_token;

          if (token) {
            await AsyncStorage.setItem("accessToken", token);
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
    console.log("Đăng nhập với Google");
    // TODO: gắn expo-auth-session sau
  };

  const goToRegister = () => {
    router.push("/screens/auth/RegisterScreen/Register");
  };

  const forgetPassword = () => {
    router.push("/screens/auth/ForgetPasswordScreen/ForgetPassword");
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.center}>
        <View style={styles.card}>
          <Image
            source={require("../../../assets/images/logo_coco.png")}
            style={styles.logo}
          />

          <TextInput
            placeholder="Địa chỉ email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholderTextColor="#9CA3AF"
          />

          <TextInput
            placeholder="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#9CA3AF"
          />

          <TouchableOpacity style={styles.forgotWrap} onPress={forgetPassword}>
            <Text style={styles.forgot}>Quên mật khẩu?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={handleLogin}
            disabled={isPending}
          >
            <Text style={styles.loginText}>
              {isPending ? "Đang đăng nhập..." : "ĐĂNG NHẬP"}
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

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Bạn chưa có tài khoản? </Text>
            <TouchableOpacity onPress={goToRegister}>
              <Text style={styles.registerLink}>Đăng ký</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
