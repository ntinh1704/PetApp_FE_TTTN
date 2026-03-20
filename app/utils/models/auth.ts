export type LoginPayload = {
  username: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  role: "admin" | "user";
};

export type RegisterPayload = {
  username: string;
  password: string;
  role: "user" | "admin";
};

export type RegisterResponse = {
  message: string;
};