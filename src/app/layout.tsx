import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Sidebar from "@/component/sidebar";
import Providers from "@/app/providers";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "POS Pro - Premium Restaurant Management",
  description: "Next-generation POS system for modern restaurants",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <Providers>
          <div className="flex flex-col h-screen overflow-hidden bg-[#F4F7F9] p-3 gap-4">
            <Sidebar />
            <main className="flex-1 overflow-y-auto bg-white rounded-[2rem] shadow-sm border border-black/5 p-6 min-w-0">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}