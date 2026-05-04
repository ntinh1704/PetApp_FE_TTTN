import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { Service } from "../models/service";
import { 
  fetchCartApi, 
  addToCartApi, 
  updateCartItemApi, 
  removeFromCartApi, 
  clearCartApi 
} from "../../services/cart_service";

export type CartItem = {
  service: Service;
  quantity: number;
};

export type CartContextType = {
  items: CartItem[];
  addItem: (service: Service) => Promise<void>;
  removeItem: (serviceId: number) => Promise<void>;
  updateQuantity: (serviceId: number, qty: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  totalDuration: number;
  isLoading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from Database on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCartApi();
        // Convert CartItemResponse[] to CartItem[]
        const cartItems: CartItem[] = data.items.map(item => ({
          service: item.service,
          quantity: item.quantity
        }));
        setItems(cartItems);
      } catch (error) {
        console.error("Failed to load cart from database:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCart();
  }, []);

  const addItem = useCallback(async (service: Service) => {
    // Optimistic Update
    setItems((prev) => {
      const existing = prev.find((i) => i.service.id === service.id);
      if (existing) {
        if (!service.is_quantifiable) return prev;
        return prev.map((i) =>
          i.service.id === service.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { service, quantity: 1 }];
    });

    try {
      await addToCartApi(service.id, 1);
    } catch (error) {
      console.error("Failed to add to cart on server:", error);
      // Re-fetch to sync with server if failed
      const data = await fetchCartApi();
      setItems(data.items.map(i => ({ service: i.service, quantity: i.quantity })));
    }
  }, []);

  const removeItem = useCallback(async (serviceId: number) => {
    // Optimistic Update
    setItems((prev) => prev.filter((i) => i.service.id !== serviceId));

    try {
      await removeFromCartApi(serviceId);
    } catch (error) {
      console.error("Failed to remove from cart on server:", error);
      const data = await fetchCartApi();
      setItems(data.items.map(i => ({ service: i.service, quantity: i.quantity })));
    }
  }, []);

  const updateQuantity = useCallback(async (serviceId: number, qty: number) => {
    if (qty <= 0) {
      await removeItem(serviceId);
      return;
    }

    // Optimistic Update
    setItems((prev) =>
      prev.map((i) => (i.service.id === serviceId ? { ...i, quantity: qty } : i))
    );

    try {
      await updateCartItemApi(serviceId, qty);
    } catch (error) {
      console.error("Failed to update quantity on server:", error);
      const data = await fetchCartApi();
      setItems(data.items.map(i => ({ service: i.service, quantity: i.quantity })));
    }
  }, [removeItem]);

  const clearCart = useCallback(async () => {
    setItems([]);
    try {
      await clearCartApi();
    } catch (error) {
      console.error("Failed to clear cart on server:", error);
      const data = await fetchCartApi();
      setItems(data.items.map(i => ({ service: i.service, quantity: i.quantity })));
    }
  }, []);

  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, i) => sum + (Number(i.service.price) || 0) * i.quantity, 0),
    [items]
  );

  const totalDuration = useMemo(
    () => items.reduce((sum, i) => sum + (i.service.duration || 0) * i.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      totalDuration,
      isLoading,
    }),
    [items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, totalDuration, isLoading]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
