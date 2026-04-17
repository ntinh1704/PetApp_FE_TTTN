import { api } from "./api";
import { Service } from "../utils/models/service";

export type CartItemResponse = {
  id: number;
  service: Service;
  quantity: number;
  created_at: string;
};

export type CartResponse = {
  id: number;
  user_id: number;
  items: CartItemResponse[];
  created_at: string;
};

export const fetchCartApi = async (): Promise<CartResponse> => {
  const res = await api.get<CartResponse>("/cart");
  return res.data;
};

export const addToCartApi = async (serviceId: number, quantity: number = 1): Promise<CartResponse> => {
  const res = await api.post<CartResponse>("/cart/add", {
    service_id: serviceId,
    quantity: quantity,
  });
  return res.data;
};

export const updateCartItemApi = async (serviceId: number, quantity: number): Promise<CartResponse> => {
  const res = await api.put<CartResponse>("/cart/update", {
    service_id: serviceId,
    quantity: quantity,
  });
  return res.data;
};

export const removeFromCartApi = async (serviceId: number): Promise<CartResponse> => {
  const res = await api.delete<CartResponse>("/cart/item", {
    params: { service_id: serviceId },
  });
  return res.data;
};

export const clearCartApi = async (): Promise<CartResponse> => {
  const res = await api.delete<CartResponse>("/cart/clear");
  return res.data;
};
