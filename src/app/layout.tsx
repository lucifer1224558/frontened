import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/component/Sidebar";
import Header from "@/component/Header";
import styles from "@/component/layout.module.css";

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
    <html lang="en">
      <body>
        <Sidebar />
        <div className={styles.mainContainer}>
          <Header />
          <main className={styles.content}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
