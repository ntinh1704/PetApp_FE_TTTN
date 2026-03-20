import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";


export default function SplashScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/images/logo_coco.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Chào mừng đến với Coco Pet</Text>

      <Text style={styles.subtitle}>
        Trong khi bạn nghỉ ngơi - chúng tôi sẽ{"\n"}chăm sóc thú cưng của bạn
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/screens/auth/RegisterScreen/Register")}
      >
        <Text style={styles.buttonText}>BẮT ĐẦU</Text>
      </TouchableOpacity>

      <View style={styles.loginRow}>
        <Text style={styles.loginText}>Bạn đã có tài khoản? </Text>
        <TouchableOpacity onPress={() => router.push("/screens/auth/LoginScreen/Login")}>
          <Text style={styles.loginLink}>Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}