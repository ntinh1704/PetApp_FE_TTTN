import {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
} from "../utils/models/auth";
import { api } from "./api";

export async function loginApi(payload: LoginPayload) {
  const res = await api.post<LoginResponse>("/users/login", payload);
  return res.data;
}

export async function registerApi(payload: RegisterPayload) {
  const res = await api.post<RegisterResponse>("/users/create", payload);
  return res.data;
}
