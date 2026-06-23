import { createContext, useContext, useState, ReactNode } from "react";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  category: string;
  icon: string;
  description: string;
}

interface StoreContextType {
  userPoints: number;
  cartItems: CartItem[];
  addToCart: (item: CartItem) => boolean;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  checkout: () => boolean;
  totalCartPrice: number;
  isInCart: (id: number) => boolean;
  addPoints: (amount: number) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [userPoints, setUserPoints] = useState(10000);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const isInCart = (id: number) => cartItems.some((i) => i.id === id);

  const addToCart = (item: CartItem): boolean => {
    if (isInCart(item.id)) return false;
    setCartItems((prev) => [...prev, item]);
    return true;
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => setCartItems([]);

  const totalCartPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  const checkout = (): boolean => {
    if (totalCartPrice > userPoints) return false;
    setUserPoints((prev) => prev - totalCartPrice);
    setCartItems([]);
    return true;
  };

  const addPoints = (amount: number) => {
    setUserPoints((prev) => prev + amount);
  };

  return (
    <StoreContext.Provider
      value={{
        userPoints,
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        checkout,
        totalCartPrice,
        isInCart,
        addPoints,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}