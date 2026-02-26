"use client";

import { CartProvider } from "@/context/CartContext";
import { MenuProvider } from "@/context/MenuContext";
import { AuthProvider } from "@/context/AuthContext";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <CartProvider>
        <MenuProvider>{children}</MenuProvider>
      </CartProvider>
    </AuthProvider>
  );
}