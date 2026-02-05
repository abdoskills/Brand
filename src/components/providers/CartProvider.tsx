"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import type { CartItem, Product } from "@/types";

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  addToCart: (product: Product, size: CartItem["size"], qty?: number) => void;
  updateQuantity: (productId: string, size: CartItem["size"], qty: number) => void;
  removeItem: (productId: string, size: CartItem["size"]) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "streetwear_cart";

function loadInitialState(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    return JSON.parse(raw) as CartItem[];
  } catch (error) {
    console.warn("Failed to parse cart from localStorage", error);
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadInitialState);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((total, item) => total + item.qty, 0);
    const subtotal = items.reduce((total, item) => total + item.qty * item.product.price, 0);

    const addToCart = (product: Product, size: CartItem["size"], qty = 1) => {
      setItems((prev) => {
        const index = prev.findIndex((item) => item.product.id === product.id && item.size === size);
        if (index !== -1) {
          const next = [...prev];
          next[index] = { ...next[index], qty: next[index].qty + qty };
          return next;
        }
        return [...prev, { product, size, qty }];
      });
    };

    const updateQuantity = (productId: string, size: CartItem["size"], qty: number) => {
      setItems((prev) =>
        prev
          .map((item) => {
            if (item.product.id === productId && item.size === size) {
              return { ...item, qty };
            }
            return item;
          })
          .filter((item) => item.qty > 0)
      );
    };

    const removeItem = (productId: string, size: CartItem["size"]) => {
      setItems((prev) => prev.filter((item) => !(item.product.id === productId && item.size === size)));
    };

    const clearCart = () => setItems([]);

    return {
      items,
      count,
      subtotal,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
