import {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  ForgotPasswordPayload,
  VerifyOtpPayload,
  ResetPasswordPayload,
} from "../utils/models/auth";
import { api } from "./api";

export type UserResponse = {
  id: number;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  role?: string | null;
  is_active?: boolean;
  created_at?: string | null;
};

export async function loginApi(payload: LoginPayload) {
  const res = await api.post<LoginResponse>("/users/login", payload);
  return res.data;
}

export async function registerApi(payload: RegisterPayload) {
  const res = await api.post<RegisterResponse>("/users/create", payload);
  return res.data;
}

export async function getUsersApi() {
  const res = await api.get<UserResponse[]>("/users", {
    params: { all: true },
  });
  return res.data;
}

export async function deleteUserApi(id: number) {
  const res = await api.delete("/users/", {
    params: { user_id: id },
  });
  return res.data;
}

export async function updateUserApi(payload: Partial<UserResponse> & { id: number }) {
  const res = await api.put<UserResponse>("/users/", payload);
  return res.data;
}

export async function forgotPasswordApi(payload: ForgotPasswordPayload) {
  const res = await api.post<{message: string}>("/users/forgot-password", payload);
  return res.data;
}

export async function verifyOtpApi(payload: VerifyOtpPayload) {
  const res = await api.post<{message: string}>("/users/verify-otp", payload);
  return res.data;
}

export async function resetPasswordApi(payload: ResetPasswordPayload) {
  const res = await api.post<{message: string}>("/users/reset-password", payload);
  return res.data;
}
