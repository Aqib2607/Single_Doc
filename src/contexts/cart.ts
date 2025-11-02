import { createContext } from "react";

export interface CartItem {
  id: string;
  name: string;
  type: "medicine" | "test";
  price: number;
  quantity: number;
  description?: string;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);