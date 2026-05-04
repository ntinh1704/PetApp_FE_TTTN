import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const api = axios.create({
  // baseURL: "http://192.168.2.114:8000",
  // baseURL: "http://10.146.41.203:8000",
  // baseURL: "http://10.10.1.63:8000",
  // baseURL: "http:10.1.249.150:8000",
  
  baseURL: "https://edra-causational-shari.ngrok-free.dev",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

// Thêm interceptor để tự động gắn Token vào header của mỗi request
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Hàm hỗ trợ lấy URL đầy đủ của ảnh từ đường dẫn tương đối.
 * Nếu đường dẫn đã là URL tuyệt đối (http...), trả về nguyên bản.
 */
export const getImageUrl = (path: string | null | undefined) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  
  // Lấy baseURL từ instance axios, loại bỏ dấu / ở cuối nếu có
  const baseUrl = (api.defaults.baseURL || "https://edra-causational-shari.ngrok-free.dev").replace(/\/+$/, "");
  return `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
};
