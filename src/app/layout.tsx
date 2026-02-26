import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Providers from "@/app/providers";
import DashboardWrapper from "./DashboardWrapper";

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
    <html lang="en" suppressHydrationWarning>
      <body className={outfit.className}>
        <Providers>
          <DashboardWrapper>
            {children}
          </DashboardWrapper>
        </Providers>
      </body>
    </html>
  );
}