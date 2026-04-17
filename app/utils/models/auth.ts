export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  role: "admin" | "user";
};

export type RegisterPayload = {
  email: string;
  password: string;
  name?: string;
  role: "user" | "admin";
};

export type RegisterResponse = {
  message: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type VerifyOtpPayload = {
  email: string;
  otp: string;
};

export type ResetPasswordPayload = {
  email: string;
  otp: string;
  new_password: string;
};