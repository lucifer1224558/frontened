import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Sidebar from "../component/sidebar";
import Header from "../component/header";
import { CartProvider } from "@/context/CartContext";
import { MenuProvider } from "@/context/MenuContext";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "POS Pro - Premium Restaurant Management",
  description: "Next-generation POS system for modern restaurants",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={outfit.className} suppressHydrationWarning>
        <CartProvider>
          <MenuProvider>
            <div className="flex flex-col h-screen overflow-hidden bg-[#F4F7F9] p-3 gap-4">
              <Sidebar />
              <main className="flex-1 overflow-y-auto bg-white rounded-[2rem] shadow-sm border border-black/5 p-6 min-w-0">
                {children}
              </main>
            </div>
          </MenuProvider>
        </CartProvider>
      </body>
    </html>
  );
}
